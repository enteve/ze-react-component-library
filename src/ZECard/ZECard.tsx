/**
 * 这个控件通过接受Logicform，展示复杂结果
 */
import { useRequest, useHistoryTravel } from "@umijs/hooks";
import { Button, Empty, Card, Divider, Tooltip, Result } from "antd";

import React from "react";
import _ from "underscore";
import { useState } from "react";
import {
  findPropByName,
  getNameProperty,
  isSimpleQuery,
  LogicformAPIResultType,
  LogicformType,
  PropertyType,
} from "zeroetp-api-sdk";
import { requestLogicform } from "../request";
import ZEChart, { useDrillDownDbClick } from "../ZEChart";
import ZEDescription from "../ZEDescription/ZEDescription";
import { LogicFormVisualizer } from "../ZELogicform";
import ZETable from "../ZETable";
import { ZECardProps } from "./ZECard.types";
import ProTable from "@ant-design/pro-table";
import { DownloadOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import excelExporter from "../ZETable/excelExporter";
import ValueDisplayer from "./ValueDisplayer";
import RepresentationChanger from "./RepresentationChanger";
import "./ZECard.less";
import LogicFormTraveler from "./LogicFormTraveler";

const getDefaultRepresentation = (
  logicform: LogicformType,
  result?: LogicformAPIResultType
) => {
  if (!result) return null;

  if (result.returnType === "value" || typeof result.result !== "object")
    return "value";

  if (logicform.groupby) {
    // 如果是2维分组，并且只有一个pred。那么变成交叉表
    if (
      Array.isArray(logicform.groupby) &&
      logicform.groupby.length === 2 &&
      logicform.preds?.length === 1
    ) {
      return "cross-table";
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

    // 如果是geo，那么用地图
    if (groupbyProp?.ref === "geo") {
      return "map";
    }

    // 如果是categorical的，用pie
    if (groupbyProp?.is_categorical) {
      return "pie";
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
  representation: repr,
  getResult,
  exportToExcel,
  xlsx,
  showRecommender = false,
  showMainContentOnly,
  tableProps = {},
  visualizerProps = {},
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
    component = (
      <ValueDisplayer
        logicform={logicform}
        data={data}
        showRecommender={showRecommender}
      />
    );
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
      if (finalRepresentation === "bar" && logicform.sort) {
        chartType = "bar";
      }

      component = (
        <ZEChart
          type={chartType}
          logicform={logicform}
          result={data}
          onChangeLogicform={setLogicform}
          onDbClick={onDbClick}
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
    } else if (finalRepresentation === "cross-table") {
      if (data?.result) {
        const idProp0 = data.columnProperties[0];
        const idProp1 = data.columnProperties[1];
        const measurementName = data.columnProperties[2].name;

        const getIDKey = (prop: PropertyType, item: any) => {
          if (!prop.schema) {
            return item[prop.name];
          }

          const nameProp = getNameProperty(prop.schema);
          return item[prop.name][nameProp.name];
        };

        const colWidth = tableProps.defaultColWidth || 150;
        const datasource: any[] = [];
        const columns: any[] = [
          {
            title: idProp0.name,
            dataIndex: idProp0.name,
            fixed: "left",
            width: colWidth,
          },
        ];

        data.result.forEach((item) => {
          if (
            datasource.length === 0 ||
            datasource[datasource.length - 1]._id !== item[idProp0.name]
          ) {
            datasource.push({
              _id: item[idProp0.name],
              [idProp0.name]: item[idProp0.name],
            });
          }

          const idKey = getIDKey(idProp1, item);

          datasource[datasource.length - 1][idKey] = item[measurementName];

          if (!columns.find((c) => c.title === idKey)) {
            columns.push({
              title: idKey,
              dataIndex: idKey,
              valueType: "digit",
            });
          }
        });

        // Export
        const toolBarRender: React.ReactNode[] = [];
        let exportFileName = "数据导出";

        if (exportToExcel) {
          if (typeof exportToExcel === "string") {
            exportFileName = exportToExcel;
          }

          toolBarRender.push(
            <Tooltip title="导出Excel">
              <Button
                type="text"
                icon={<DownloadOutlined />}
                onClick={() =>
                  excelExporter(
                    {
                      result: datasource,
                      schema: data.schema,
                      columnProperties: data.columnProperties,
                    },
                    exportFileName,
                    xlsx
                  )
                }
              />
            </Tooltip>
          );
        }

        component = (
          <ProTable
            tableClassName={exportFileName}
            toolBarRender={() => toolBarRender}
            options={false}
            rowKey="_id"
            search={false}
            pagination={false}
            dataSource={datasource}
            columns={columns}
            scroll={{ x: colWidth * columns.length }}
            cardProps={{
              bodyStyle: { padding: 0 },
            }}
          />
        );
      } else {
        component = <div />;
      }
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

  return (
    <Card title={title} loading={loading} extra={extra} bodyStyle={bodyStyle}>
      <div>
        <LogicFormVisualizer
          {...visualizerProps}
          logicform={logicform}
          onQueryChange={(query) => {
            setLogicform({
              ...logicform,
              query,
            });
          }}
        />
      </div>
      {warning?.length > 0 && (
        <div style={{ marginTop: 10 }}>
          <ExclamationCircleOutlined className="warningIcon" />
          <span style={{ marginLeft: 5, color: "#525252" }}>{warning}</span>
        </div>
      )}
      <div style={{ marginTop: 20 }}>{component}</div>
      {footer && (
        <>
          <Divider />
          {footer}
        </>
      )}
    </Card>
  );
};

export default ZECard;
