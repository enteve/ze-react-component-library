// Generated with util/create-component.js
import React from "react";
import ZELogicform from "../ZELogicform";
import { LogicFormVisualizer } from "../LogicFormVisualizer";

// prepare server
import prepareServerForStories from "../../../util/prepareServerForStories";
import { List } from "antd";
prepareServerForStories();

export default {
  title: "ZELogicform",
};

export const Basic = () => (
  <ZELogicform
    logicform={{
      schema: "productsale",
      groupby: "渠道",
      preds: [{ name: "sum", operator: "$sum", pred: "销售额" }],
    }}
    dataKey="dataSource"
    loadingKey="loading"
  >
    <List
      renderItem={(item: any) => (
        <List.Item>
          {item.渠道}:{item.sum}
        </List.Item>
      )}
    />
  </ZELogicform>
);

export const Visualizer = () => (
  <LogicFormVisualizer
    logicform={{
      schema: "productsale",
      groupby: "渠道",
      preds: [{ name: "sum", operator: "$sum", pred: "销售额" }],
      query: { a: "b" },
    }}
  />
);
