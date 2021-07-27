// Generated with util/create-component.js
import React from "react";
import ZEChart from "./ZEChart";

// prepare server
import prepareServerForStories from "../../util/prepareServerForStories";
prepareServerForStories();

export default {
  title: "ZEChart",
};

export const BasicUsage = () => (
  <ZEChart
    type="pie"
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
