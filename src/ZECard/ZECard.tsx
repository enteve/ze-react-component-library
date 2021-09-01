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
import { LogicFormVisualizer } from "../ZELogicform";
import ZETable from "../ZETable";
import ZEValue from "../ZEValue";
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
};

const ZECard: React.FC<ZECardProps> = ({ logicform, title }) => {
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

  return (
    <Card title={title} loading={loading}>
      <div style={{ marginBottom: 30 }}>
        <LogicFormVisualizer logicform={logicform} />
      </div>
      {isSimpleQuery(logicform) && <ZETable logicform={logicform} />}
      {finalRepresentation === "value" && <Statistic value={data.result} />}
      {finalRepresentation === "bar" && (
        <ZEChart
          type="column"
          logicform={logicform}
          result={data}
          config={{
            xField: "_id",
            yField: logicform.preds[0].name,
          }}
        />
      )}
      {/* Default */}
      {finalRepresentation !== "value" && finalRepresentation !== "bar" && (
        <ZETable logicform={logicform} />
      )}
    </Card>
  );
};

export default ZECard;
