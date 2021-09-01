/**
 * 这个控件通过接受Logicform，展示复杂结果
 */
import { useRequest } from "@umijs/hooks";
import { Card, Statistic } from "antd";
import React from "react";
import { isSimpleQuery, LogicformAPIResultType } from "zeroetp-api-sdk";
import { requestLogicform } from "../request";
import { LogicFormVisualizer } from "../ZELogicform";
import ZETable from "../ZETable";
import ZEValue from "../ZEValue";
import { ZECardProps } from "./ZECard.types";

const ZECard: React.FC<ZECardProps> = ({ logicform, title }) => {
  const tableOperator = ["$distribution", "$distinct"];
  const isTable = tableOperator.includes(logicform.operator);

  const isSingleValue = logicform.operator && !isTable;
  const isStats = logicform.groupby;

  return (
    <Card title={title}>
      <LogicFormVisualizer logicform={logicform} />
      {(isSimpleQuery(logicform) || isStats || isTable) && (
        <ZETable logicform={logicform} />
      )}
      {isSingleValue && <Statistic value={ZEValue(logicform)} />}
    </Card>
  );
};

export default ZECard;
