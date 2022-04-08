// Generated with util/create-component.js
import React, { useState } from "react";
import ZELogicformVisualizerList from "../ZELogicformVisualizerList";
import { message } from "antd";

// prepare server
import prepareServerForStories from "../../../util/prepareServerForStories";
import StoryBookUseCaseDescription from "../../StoryBookUseCaseDescription";
import { LogicformType } from "zeroetp-api-sdk";
prepareServerForStories();

export default {
  title: "ZELogicformVisualizerList",
};

export const Basic = () => (
  <StoryBookUseCaseDescription info="您的问题有多种解释，请从下方选择一项符合您要求的">
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
      onClick={(logicform) => message.info("选择了其中一项")}
    />
  </StoryBookUseCaseDescription>
);
