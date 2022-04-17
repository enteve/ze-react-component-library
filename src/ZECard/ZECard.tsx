/**
 * 这个控件通过接受Logicform，展示复杂结果
 */
import { useRequest, useHistoryTravel } from "@umijs/hooks";
import {
  Empty,
  Card,
  Divider,
  Result,
  Typography,
  Button,
  Space,
  Spin,
  Tooltip,
} from "antd";
import { ErrorBoundary } from "react-error-boundary";
import React, { useState, useMemo, useEffect } from "react";
import _ from "underscore";
import {
  findPropByName,
  isSimpleQuery,
  LogicformAPIResultType,
  LogicformType,
  PropertyType,
} from "zeroetp-api-sdk";
import {
  requestLogicform,
  requestRecommend,
  requestPinToDashboard,
  requestUnPinToDashboard,
} from "../request";
import ZEChart, { useDrillDownDbClick } from "../ZEChart";
import ZEDescription from "../ZEDescription";
import ZELogicformVisualizer from "../ZELogicformVisualizer";
import ZEValueDisplayer from "../ZEValueDisplayer";
import Table from "./Table";
import { ZECardProps } from "./ZECard.types";
import { CloseOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import RepresentationChanger from "./RepresentationChanger";
import "./ZECard.less";
import LogicFormTraveler from "./LogicFormTraveler";
import { ErrorFallBack } from "../util";
import PinHandler from "./PinHandler";
import GroupByMenu from "../components/GroupByMenu";
import ErrorDisplayer from "./ErrorDisplayer";
import ZESheet from "../ZESheet";
const { Paragraph, Title } = Typography;

const getDefaultRepresentation = (
  logicform: LogicformType,
  result?: LogicformAPIResultType,
  pieThreshold: number = 5
) => {
  if (!result) return null;
  if (result.result == null) return null;

  if (result.returnType === "value" || typeof result.result !== "object")
    return "value";

  if (logicform.groupby) {
    // 如果有多个指标，暂时优先返回table
    if (logicform.preds.length >= 2) {
      return "table";
    }

    // 如果是多维分组，直接用table
    if (Array.isArray(logicform.groupby) && logicform.groupby.length >= 2) {
      return "table";
    }

    // 👇是一维分组的逻辑
    let groupbyItem: any = logicform.groupby;

    if (Array.isArray(logicform.groupby)) {
      groupbyItem = logicform.groupby[0];
    }

    let groupbyProp: PropertyType;
    if (typeof groupbyItem === "object" && "_id" in groupbyItem) {
      groupbyProp = findPropByName(result.schema, groupbyItem._id);
    } else if (typeof groupbyItem === "string") {
      groupbyProp = findPropByName(result.schema, groupbyItem);
    }

    // Schema指定的presentation
    if (groupbyProp.ui?.presentation) {
      return groupbyProp.ui?.presentation;
    }

    // 如果是geo，那么用地图
    if (groupbyProp?.ref === "geo") {
      return "map";
    }

    // 如果是categorical的，并且，用pie
    if (
      groupbyProp?.is_categorical &&
      Array.isArray(result.result) &&
      result.result.length <= pieThreshold &&
      result.logicform.groupby.length === 1 && // 只需允许有一个维度
      result.columnProperties.length === 2 && // 只需允许有一个pred
      !result.columnProperties[1].is_speedish // 不是百分比类型的，而是绝对值类型的
    ) {
      return "pie";
    }

    // 如果是timestamp，用line
    if (groupbyProp?.type === "timestamp") {
      return "line";
    }

    return "bar";
  } else if (!isSimpleQuery(logicform)) {
    // 数值计算
    // 20220411: 数值计算也改造成了array of objects格式
    if (
      Array.isArray(result.result) &&
      result.result.length === 1 &&
      result.columnProperties.length === 1
    ) {
      return "value";
    }
  }

  if (logicform.operator === "$ent") {
    return "entity";
  }
};

const CardCloseHandler: React.FC<Pick<ZECardProps, "close">> = ({ close }) =>
  close ? (
    <Tooltip title="关闭此卡片">
      <Button icon={<CloseOutlined />} onClick={() => close()} />
    </Tooltip>
  ) : null;

const ZECard: React.FC<ZECardProps> = ({
  logicform: initialLogicform,
  formatResult,
  title,
  titleRender,
  warning,
  mainContent,
  extra,
  footer,
  bodyStyle = {},
  headStyle = {},
  size = "default",
  representation: repr,
  getResult,
  exportToExcel,
  xlsx,
  showRecommender = false,
  showRepresentationChanger = true,
  askMore,
  showMainContentOnly,
  tableProps = {},
  showVisualizer = true,
  visualizerProps = {},
  chartProps = {},
  compact = false,
  horizontalBarChart = false,
  pieThreshold,
  valueDisplayerProps = {},
  pinable,
  close,
  dashboardID,
  enableGroupByMenu,
  onChange,
  askError,
  askErrorHelperLink,
  useSheet,
}) => {
  const {
    value: logicform,
    setValue: setLogicform,
    backLength,
    forwardLength,
    go,
    back,
    forward,
  } = useHistoryTravel<LogicformType>(initialLogicform);
  const [logicFormWithSkipAndSort, setLogicFormWithSkipAndSort] =
    useState<LogicformType>();

  const {
    data,
    loading,
    run: fetchData,
  } = useRequest<LogicformAPIResultType>(
    () => {
      if (logicform) {
        return requestLogicform(logicFormWithSkipAndSort || logicform);
      }
    },
    {
      refreshDeps: [logicform, logicFormWithSkipAndSort],
      onSuccess: (res) => getResult?.(res),
      formatResult: (res) => {
        let resData = res;
        if (formatResult) {
          resData = formatResult(res);
        }
        return resData;
      },
    }
  );

  const { data: recommends } = useRequest(
    () => {
      if (!initialLogicform || !showRecommender) {
        return new Promise((resolve) => resolve({ recommends: [] }));
      }

      return requestRecommend(initialLogicform);
    },
    {
      initialData: [],
      formatResult: (res: any) => res.recommends,
    }
  );
  const [representation, setRepresentation] = useState<string>(repr);
  const [selectedItem, setSelectedItem] = useState<any>();

  const finalRepresentation = useMemo(() => {
    let finalRep = representation;
    if (data) {
      const defaultRepresentation = getDefaultRepresentation(
        logicform,
        data,
        pieThreshold
      );
      // 从value类型下钻到其它图表类型比如pie,然后点击切换图表类型为line,
      // 这个时候representation为line，之后再点回退，此时defaultRepresentation为value，
      // 而representation为line，如果直接按照下面的逻辑，finalRep就不对了，组件会报错
      // finalRep = representation || defaultRepresentation;
      // 所以要加以下逻辑
      if (defaultRepresentation === "value") {
        finalRep = "value";
      } else {
        finalRep = representation || defaultRepresentation;
      }
    }
    return finalRep;
  }, [data, representation]);

  const { onDbClick } = useDrillDownDbClick({
    logicform,
    onChangeLogicform: setLogicform,
    back,
  });

  const onRow = (record) => {
    return {
      onClick: (e) => {
        onDbClick(record, data);
      },
    };
  };

  const tableContent = (
    <Table
      logicform={logicform}
      setLogicform={(val, valWithSkipAndSorter) => {
        if (val) {
          setLogicform(val);
        }
        setLogicFormWithSkipAndSort(valWithSkipAndSorter);
      }}
      xlsx={xlsx}
      exportToExcel={exportToExcel}
      onRow={onRow}
      result={data}
      reload={fetchData}
      {...tableProps}
    />
  );

  let component: any;
  // 自定义Content
  if (mainContent && data?.logicform) {
    component = mainContent(data.logicform, data, setLogicform);
  }

  // 如果没有自定义Content，则自动判断
  if (!component) {
    if (askError) {
      component = (
        <ErrorDisplayer error={askError} helperLink={askErrorHelperLink} />
      );
    } else if (!logicform) {
      component = (
        <Result status="error" title="此Component需要传入logicform字段" />
      );
    } else if (isSimpleQuery(logicform)) {
      component = tableContent;
    } else if (finalRepresentation === "value") {
      component = (
        <ZEValueDisplayer
          data={data}
          onChangeLogicform={setLogicform}
          {...valueDisplayerProps}
        />
      );
    } else {
      if (data && (!data.result || data.result?.length === 0)) {
        component = <Empty description="没有数据" />;
      } else if (
        finalRepresentation === "bar" ||
        finalRepresentation === "pie" ||
        finalRepresentation === "line" ||
        finalRepresentation === "map"
      ) {
        let chartType = "column";
        switch (finalRepresentation) {
          case "pie":
            chartType = "pie";
            break;

          case "line":
            chartType = "line";
            break;
          case "map":
            chartType = "map";
            break;

          default:
            break;
        }

        // chartType有两种形式，column和bar。
        if (
          finalRepresentation === "bar" &&
          (logicform.sort || horizontalBarChart)
        ) {
          chartType = "bar";
        }

        component = (
          <ZEChart
            type={chartType}
            logicform={logicform}
            result={data}
            onChangeLogicform={setLogicform}
            onDbClick={onDbClick}
            onItemSelect={enableGroupByMenu ? setSelectedItem : undefined}
            {...chartProps}
          />
        );
      } else if (
        finalRepresentation === "entity" &&
        data.result?.length === 1
      ) {
        component = (
          <ZEDescription
            schema={data.schema}
            columnProperties={data.columnProperties}
            item={data.result[0]}
          />
        );
      } else if (data && useSheet) {
        component = <ZESheet logicform={data.logicform} result={data} />;
      } else {
        component = tableContent;
      }
    }
  }

  // extra
  if (!extra) {
    extra = (
      <Space>
        {(finalRepresentation === "value" || selectedItem) &&
          enableGroupByMenu && (
            <GroupByMenu
              logicform={logicform}
              result={data}
              onChangeLogicform={(newLF) => {
                setLogicform(newLF);
                setSelectedItem(undefined);
              }}
              selectedItem={selectedItem}
            />
          )}
        {backLength > 0 && (
          <div>
            <LogicFormTraveler
              go={(step) => {
                go(step);
                setSelectedItem(undefined);
              }}
              back={() => {
                back();
                setSelectedItem(undefined);
              }}
              forward={() => {
                forward();
                setSelectedItem(undefined);
              }}
              backLength={backLength}
              forwardLength={forwardLength}
            />
          </div>
        )}
        {/* 暂时只有带groupby的是支持RepresentationChanger的 */}
        {showRepresentationChanger && logicform?.groupby && (
          <RepresentationChanger
            representationType={finalRepresentation}
            onChange={(v) => {
              setRepresentation(v);
              setSelectedItem(undefined);
            }}
          />
        )}
        {pinable && (
          <PinHandler
            dashboardID={dashboardID}
            logicform={logicform}
            representationType={finalRepresentation}
            title={title}
            onPin={requestPinToDashboard}
            onUnPin={requestUnPinToDashboard}
          />
        )}
        <CardCloseHandler close={close} />
      </Space>
    );
  }

  // Recommends
  let recommendComponent: React.ReactNode | undefined;
  if (recommends?.length > 0) {
    recommendComponent = (
      <Typography>
        <Title level={5}>您还可以这样问：</Title>
        <Paragraph>
          <ul>
            {recommends.map((r: any) => {
              return (
                <li key={r.question}>
                  <Button
                    type="link"
                    style={{ padding: 0 }}
                    onClick={() => {
                      askMore?.(r.question);
                    }}
                  >
                    {r.question}
                  </Button>
                </li>
              );
            })}
          </ul>
        </Paragraph>
      </Typography>
    );
  }

  if (showMainContentOnly) return <Spin spinning={loading}>{component}</Spin>;

  useEffect(() => {
    onChange && onChange({ logicform, representation: finalRepresentation });
  }, [logicform, finalRepresentation]);

  return (
    <Spin spinning={loading}>
      <Card
        size={size}
        title={titleRender ? titleRender(title) : title}
        extra={extra}
        bodyStyle={bodyStyle}
        headStyle={headStyle}
      >
        {showVisualizer && data && (
          <ZELogicformVisualizer
            {...visualizerProps}
            logicform={{ ...data.logicform, schemaName: data.schema.name }}
            onQueryChange={(query) => {
              setLogicform({
                ...logicform,
                query,
              });
            }}
          />
        )}
        {warning?.length > 0 && (
          <div style={{ margin: compact ? 5 : 10 }}>
            <ExclamationCircleOutlined className="warningIcon" />
            <span style={{ marginLeft: 5, color: "#525252" }}>{warning}</span>
          </div>
        )}
        <div className="ze-card-main-content">{component}</div>
        {(footer || recommendComponent) && (
          <>
            <Divider style={{ margin: compact ? 5 : 10 }} />
            {typeof footer !== "function" && footer}
            {typeof footer === "function" && footer(logicform)}
            {recommendComponent}
          </>
        )}
      </Card>
    </Spin>
  );
};

const ZECardWrapper: React.FC<ZECardProps> = (props) => {
  return (
    <ErrorBoundary
      fallbackRender={(errorProps) => (
        <ErrorFallBack
          {...errorProps}
          cardProps={{ extra: <CardCloseHandler close={props.close} /> }}
        />
      )}
    >
      <ZECard {...props} />
    </ErrorBoundary>
  );
};

export default ZECardWrapper;
