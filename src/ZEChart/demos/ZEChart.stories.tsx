// Generated with util/create-component.js
import React, { useState } from "react";
import ZEChart from "../ZEChart";

// prepare server
import prepareServerForStories from "../../../util/prepareServerForStories";
import { LogicformType } from "zeroetp-api-sdk";

prepareServerForStories();

export default {
  title: "ZEChart",
};

export const Pie = () => (
  <ZEChart
    type="pie"
    logicform={{
      schema: "sales",
      groupby: "产品_品类",
      preds: [{ name: "amount", operator: "$sum", pred: "销售额" }],
    }}
  />
);

export const Bar = () => (
  <ZEChart
    type="bar"
    logicform={{
      schema: "sales",
      groupby: "产品_品类",
      preds: [
        { name: "流水数量", operator: "$count" },
        { name: "amount", operator: "$sum", pred: "销售额" },
      ],
    }}
  />
);

export const Column = () => (
  <ZEChart
    type="column"
    logicform={{
      schema: "sales",
      groupby: "产品_品类",
      query: { 日期: { $offset: { year: 0, month: -1 } } },
      preds: [
        { name: "总销售额", operator: "$sum", pred: "销售额" },
        { name: "销售额2", operator: "$sum", pred: "销售额" },
        { name: "销售额同比", operator: "$yoy", pred: "销售额" },
        { name: "销售额环比", operator: "$mom", pred: "销售额" },
      ],
    }}
  />
);

export const ColumnWithSupplemanryPreds = () => (
  <ZEChart
    type="column"
    logicform={{
      schema: "sales",
      groupby: "产品_品类",
      query: { 日期: { $offset: { year: 0 } } },
      preds: [
        { name: "流水数量", operator: "$count" },
        { name: "销售额", operator: "$sum", pred: "销售额" },
        { name: "销售额同比", operator: "$yoy", pred: "销售额" },
      ],
    }}
    isOtherPredsSupplementary
  />
);

export const Line = () => (
  <ZEChart
    type="line"
    logicform={{
      schema: "productsale",
      groupby: "$day",
      preds: [{ name: "amount", operator: "$sum", pred: "销售额" }],
    }}
  />
);

export const Map = () => {
  const [logicform, setLogicform] = useState<LogicformType>({
    query: {},
    preds: [{ pred: "销售量", operator: "$sum", name: "总销售量" }],
    schema: "sales",
    groupby: { _id: "店铺_地址", level: "省市" },
    schemaName: "销售",
  });

  return (
    <ZEChart
      type="map"
      logicform={logicform}
      onChangeLogicform={setLogicform}
    />
  );
};
