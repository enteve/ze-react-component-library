/**
 * 这个控件通过接受Logicform，展示复杂结果
 */
import { useRequest, useHistoryTravel } from "@umijs/hooks";
import { Empty, Card, Divider, Result, Typography, Button } from "antd";

import React from "react";
import _ from "underscore";
import { useState } from "react";
import {
  findPropByName,
  isSimpleQuery,
  LogicformAPIResultType,
  LogicformType,
  PropertyType,
} from "zeroetp-api-sdk";
import { requestLogicform, requestRecommend } from "../request";
import ZEChart, { useDrillDownDbClick } from "../ZEChart";
import ZEDescription from "../ZEDescription/ZEDescription";
import { LogicFormVisualizer } from "../ZELogicform";
import ZETable from "../ZETable";
import { ZECardProps } from "./ZECard.types";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import ValueDisplayer from "./ValueDisplayer";
import RepresentationChanger from "./RepresentationChanger";
import "./ZECard.less";
import LogicFormTraveler from "./LogicFormTraveler";

const { Paragraph, Title } = Typography;

const getDefaultRepresentation = (
  logicform: LogicformType,
  result?: LogicformAPIResultType
) => {
  if (!result) return null;

  if (result.returnType === "value" || typeof result.result !== "object")
    return "value";

  if (logicform.groupby) {
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
      groupbyProp?.stats?.distincts?.length <= 5
    ) {
      return "pie";
    }

    // 如果是timestamp，用line
    if (groupbyProp?.type === "timestamp") {
      return "line";
    }

    return "bar";
  }

  if (logicform.operator === "$ent") {
    return "entity";
  }
};

const ZECard: React.FC<ZECardProps> = ({
  logicform: initialLogicform,
  title,
  warning,
  mainContent,
  extra,
  footer,
  bodyStyle = {},
  headStyle = {},
  representation: repr,
  getResult,
  exportToExcel,
  xlsx,
  showRecommender = true,
  askMore,
  showMainContentOnly,
  tableProps = {},
  visualizerProps = {},
  chartProps = {},
  coloringMap,
  compact = false,
  horizontalBarChart = false,
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
  const { data, loading } = useRequest<LogicformAPIResultType>(
    () => {
      if (!logicform) {
        throw new Error("no logicform");
      }

      if (isSimpleQuery(logicform)) {
        // simplequery让ZETable自己处理，因为要翻页
        return new Promise((resolve) => resolve(undefined));
      }

      return requestLogicform(logicform);
    },
    {
      refreshDeps: [logicform],
      onSuccess: (res) => getResult?.(res),
    }
  );
  const { data: recommends } = useRequest(
    () => {
      if (!initialLogicform) {
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

  const { onDbClick } = useDrillDownDbClick({
    logicform,
    onChangeLogicform: setLogicform,
    data,
  });

  const onRow = (record) => {
    return {
      onClick: (e) => {
        onDbClick(record);
      },
    };
  };

  if (!logicform) return <Result status="error" title="出现错误" />;
  // console.log(data);

  const defaultRepresentation = getDefaultRepresentation(logicform, data);
  const finalRepresentation = representation || defaultRepresentation;

  let component: any;
  if (mainContent) {
    component = mainContent(logicform);
  } else if (isSimpleQuery(logicform)) {
    component = (
      <ZETable
        logicform={logicform}
        xlsx={xlsx}
        exportToExcel={exportToExcel}
        onRow={onRow}
        {...tableProps}
      />
    );
  } else if (finalRepresentation === "value") {
    component = <ValueDisplayer logicform={logicform} data={data} />;
  } else {
    if (data?.result?.length === 0) {
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
          coloringMap={coloringMap}
          {...chartProps}
        />
      );
    } else if (finalRepresentation === "entity" && data.result?.length === 1) {
      component = (
        <ZEDescription
          schema={data.schema}
          columnProperties={data.columnProperties}
          item={data.result[0]}
        />
      );
    } else {
      component = (
        <ZETable
          logicform={logicform}
          xlsx={xlsx}
          exportToExcel={exportToExcel}
          onRow={onRow}
          {...tableProps}
        />
      );
    }
  }

  // extra
  // 暂时只有带groupby的是支持RepresentationChanger的
  if (!extra && logicform.groupby) {
    extra = (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        {backLength > 0 && (
          <div
            style={{
              marginRight: 10,
            }}
          >
            <LogicFormTraveler
              go={go}
              back={back}
              forward={forward}
              backLength={backLength}
              forwardLength={forwardLength}
            />
          </div>
        )}
        {/* 有mainContent的话，没有RepresentationChanger */}
        {!mainContent && (
          <RepresentationChanger
            representationType={finalRepresentation}
            onChange={setRepresentation}
          />
        )}
      </div>
    );
  }

  if (showMainContentOnly) return component;

  // Recommends
  let recommendComponent: React.ReactNode | undefined;
  if (showRecommender && recommends?.length > 0) {
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

  return (
    <Card
      title={title}
      loading={loading}
      extra={extra}
      bodyStyle={bodyStyle}
      headStyle={headStyle}
    >
      <div>
        <LogicFormVisualizer
          {...visualizerProps}
          logicform={
            data?.logicform
              ? { ...data.logicform, schemaName: data.schema.name }
              : logicform
          }
          onQueryChange={(query) => {
            setLogicform({
              ...logicform,
              query,
            });
          }}
        />
      </div>
      {warning?.length > 0 && (
        <div style={{ marginTop: compact ? 5 : 10 }}>
          <ExclamationCircleOutlined className="warningIcon" />
          <span style={{ marginLeft: 5, color: "#525252" }}>{warning}</span>
        </div>
      )}
      <div style={{ marginTop: compact ? 5 : 20 }}>{component}</div>
      {(footer || recommendComponent) && (
        <>
          <Divider style={{ margin: compact ? 5 : 10 }} />
          {typeof footer !== "function" && footer}
          {typeof footer === "function" && footer(logicform)}
          {recommendComponent}
        </>
      )}
    </Card>
  );
};

export default ZECard;
