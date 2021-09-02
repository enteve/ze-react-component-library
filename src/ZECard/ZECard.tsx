/**
 * 这个控件通过接受Logicform，展示复杂结果
 */
import { useRequest } from "@umijs/hooks";
import { Card, Statistic, Table } from "antd";
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

const getDefaultRepresentation = (
  logicform: LogicformType,
  result?: LogicformAPIResultType
) => {
  if (!result) return null;

  if (result.returnType === "value" || typeof result.result !== "object")
    return "value";

  if (logicform.groupby) {
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
  representation: repr,
  getResult,
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
      onSuccess: (res) => getResult?.(res),
    }
  );
  const [representation, setRepresentation] = useState<string>(repr);

  console.log(data);

  const defaultRepresentation = getDefaultRepresentation(logicform, data);
  const finalRepresentation = representation || defaultRepresentation;

  let component: any;
  if (isSimpleQuery(logicform)) {
    component = <ZETable logicform={logicform} />;
  } else if (finalRepresentation === "value") {
    component = <Statistic value={data.result} />;
  } else if (finalRepresentation === "bar") {
    component = (
      <ZEChart
        type="column"
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

      component = (
        <Table rowKey="_id" dataSource={datasource} columns={columns} />
      );
    } else {
      component = <div />;
    }
  } else {
    component = <ZETable logicform={logicform} />;
  }

  return (
    <Card title={title} loading={loading} extra={extra}>
      <div style={{ marginBottom: 30 }}>
        <LogicFormVisualizer logicform={logicform} />
      </div>
      {component}
    </Card>
  );
};

export default ZECard;
