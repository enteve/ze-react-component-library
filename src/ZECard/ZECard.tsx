/**
 * 这个控件通过接受Logicform，展示复杂结果
 */
import { useRequest } from "@umijs/hooks";
import { Button, Card, Statistic, Table, Tooltip } from "antd";
import React from "react";
import _ from "underscore";
import { useState } from "react";
import {
  getNameProperty,
  isSimpleQuery,
  LogicformAPIResultType,
  LogicformType,
  PropertyType,
} from "zeroetp-api-sdk";
import { requestLogicform } from "../request";
import ZEChart from "../ZEChart";
import ZEDescription from "../ZEDescription/ZEDescription";
import { LogicFormVisualizer } from "../ZELogicform";
import ZETable from "../ZETable";
import { ZECardProps } from "./ZECard.types";
import ProTable from "@ant-design/pro-table";
import { DownloadOutlined } from "@ant-design/icons";
import excelExporter from "../ZETable/excelExporter";

const getDefaultRepresentation = (
  logicform: LogicformType,
  result?: LogicformAPIResultType
) => {
  if (!result) return null;

  if (result.returnType === "value" || typeof result.result !== "object")
    return "value";

  if (logicform.groupby) {
    // 如果是多维分组，并且只有一个pred。那么变成交叉表
    if (
      Array.isArray(logicform.groupby) &&
      logicform.groupby.length === 2 &&
      logicform.preds?.length === 1
    ) {
      return "cross-table";
    }

    return "bar";
  }

  if (logicform.operator === "$ent") {
    return "entity";
  }
};

const ZECard: React.FC<ZECardProps> = ({
  logicform,
  title,
  extra,
  bodyStyle = {},
  representation: repr,
  getResult,
  exportToExcel,
  xlsx,
}) => {
  const { data, loading } = useRequest<LogicformAPIResultType>(
    () => {
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

  console.log(data);

  const defaultRepresentation = getDefaultRepresentation(logicform, data);
  const finalRepresentation = representation || defaultRepresentation;

  let component: any;
  if (isSimpleQuery(logicform)) {
    component = (
      <ZETable
        logicform={logicform}
        xlsx={xlsx}
        exportToExcel={exportToExcel}
      />
    );
  } else if (finalRepresentation === "value") {
    component = <Statistic value={data.result} />;
  } else if (finalRepresentation === "bar" || finalRepresentation === "pie") {
    component = (
      <ZEChart
        type={finalRepresentation === "pie" ? "pie" : "column"}
        logicform={logicform}
        result={data}
        config={{
          xField: "_id",
          yField: logicform.preds[0].name,
        }}
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

      const datasource: any[] = [];
      const columns: any[] = [
        {
          title: idProp0.name,
          dataIndex: idProp0.name,
          fixed: "left",
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
          scroll={{ x: 150 * columns.length }}
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
      />
    );
  }

  return (
    <Card title={title} loading={loading} extra={extra} bodyStyle={bodyStyle}>
      <div style={{ marginBottom: 30 }}>
        <LogicFormVisualizer logicform={logicform} />
      </div>
      {component}
    </Card>
  );
};

export default ZECard;
