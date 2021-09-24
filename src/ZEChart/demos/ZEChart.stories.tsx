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
      schema: "productsale",
      groupby: "经销商",
      preds: [{ name: "amount", operator: "$sum", pred: "销售额" }],
    }}
  />
);

export const Bar = () => {
  const [logicform, setLogicform] = useState<LogicformType>({
    schema: "productsale",
    groupby: "经销商",
    preds: [
      { name: "流水数量", operator: "$count" },
      { name: "订单数量", operator: "$uniq", pred: "订单编号" },
    ],
  });

  return (
    <ZEChart
      type="bar"
      logicform={logicform}
      onChangeLogicform={setLogicform}
    />
  );
};

export const Column = () => {
  const [logicform, setLogicform] = useState<LogicformType>({
    schema: "productsale",
    groupby: "商品_分类",
    preds: [{ name: "amount", operator: "$sum", pred: "销售额" }],
  });

  return (
    <ZEChart
      type="column"
      logicform={logicform}
      onChangeLogicform={setLogicform}
    />
  );
};

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
    schema: "productsale",
    groupby: [{ _id: "地理位置", level: "省市" }],
    preds: [{ name: "amount", operator: "$sum", pred: "销售额" }],
  });

  return (
    <ZEChart
      type="map"
      logicform={logicform}
      onChangeLogicform={setLogicform}
    />
  );
};
