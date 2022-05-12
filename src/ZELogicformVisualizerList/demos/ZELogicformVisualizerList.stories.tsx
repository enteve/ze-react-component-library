// Generated with util/create-component.js
import React from "react";
import ZELogicformVisualizerList from "../ZELogicformVisualizerList";
import { message } from "antd";

// prepare server
import prepareServerForStories from "../../../util/prepareServerForStories";
prepareServerForStories();

export default {
  title: "ZELogicformVisualizerList",
};

export const Basic = () => (
  <ZELogicformVisualizerList
    logicforms={[
      {
        schema: "销售明细表",
        query: { 日期: { year: 2022 } },
        preds: [
          [{ operator: "$sum", pred: "销售额" }],
          [{ operator: "$sum", pred: "销量" }],
        ],
      },
      {
        schema: "流量明细表",
        query: { 日期: { year: 2022 } },
        preds: [[{ operator: "$sum", pred: "销售额" }]],
      },
    ]}
    onClick={() => message.info("选择了其中一项")}
  />
);
