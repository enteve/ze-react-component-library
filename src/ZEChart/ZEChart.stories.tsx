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
