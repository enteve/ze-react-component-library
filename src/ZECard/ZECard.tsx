/**
 * 这个控件通过接受Logicform，展示复杂结果
 */
import { useRequest } from "@umijs/hooks";
import { Card, Statistic } from "antd";
import React from "react";
import { useState } from "react";
import {
  isSimpleQuery,
  LogicformAPIResultType,
  LogicformType,
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

  console.log(result);

  if (result.returnType === "value" || typeof result.result !== "object")
    return "value";

  if (logicform.groupby) {
    return "bar";
  }

  if (logicform.operator === "$ent") {
    return "entity";
  }
};

const ZECard: React.FC<ZECardProps> = ({ logicform, title, extra }) => {
  const { data, loading } = useRequest<LogicformAPIResultType>(() => {
    if (isSimpleQuery(logicform)) {
      // simplequery让ZETable自己处理，因为要翻页
      return new Promise((resolve) => resolve(undefined));
    }

    return requestLogicform(logicform);
  });
  const [representation, setRepresentation] = useState<string>(null);

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
