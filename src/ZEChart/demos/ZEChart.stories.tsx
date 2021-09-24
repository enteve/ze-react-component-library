// Generated with util/create-component.js
import React from "react";
import ZEChart from "../ZEChart";

// prepare server
import prepareServerForStories from "../../../util/prepareServerForStories";
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

export const Bar = () => (
  <ZEChart
    type="bar"
    logicform={{
      schema: "productsale",
      groupby: "经销商",
      preds: [
        { name: "流水数量", operator: "$count" },
        { name: "订单数量", operator: "$uniq", pred: "订单编号" },
      ],
    }}
  />
);

export const Column = () => (
  <ZEChart
    type="column"
    logicform={{
      schema: "productsale",
      groupby: "经销商",
      preds: [{ name: "amount", operator: "$sum", pred: "销售额" }],
    }}
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
    config={{
      annotations: [
        {
          type: "regionFilter",
          start: ["min", "median"],
          end: ["max", "0"],
          color: "#F4664A",
        },
        {
          type: "text",
          position: ["min", "median"],
          content: "中位数",
          offsetY: -4,
          style: { textBaseline: "bottom" },
        },
        {
          type: "line",
          start: ["min", "median"],
          end: ["max", "median"],
          style: {
            stroke: "#F4664A",
            lineDash: [2, 2],
          },
        },
      ],
    }}
  />
);

export const Map = () => (
  <ZEChart
    type="map"
    logicform={{
      schema: "productsale",
      groupby: [{ _id: "地理位置", level: "省市" }],
      preds: [{ name: "amount", operator: "$sum", pred: "销售额" }],
    }}
  />
);
