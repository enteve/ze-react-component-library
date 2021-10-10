// Generated with util/create-component.js
import React from "react";
import ZELogicform from "../ZELogicform";
import { LogicFormVisualizer } from "../LogicFormVisualizer";

// prepare server
import prepareServerForStories from "../../../util/prepareServerForStories";
import { List, message } from "antd";
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

export const VisualizerDisplay = () => (
  <LogicFormVisualizer
    logicform={{
      schema: "productsale",
      groupby: "渠道",
      preds: [{ name: "sum", operator: "$sum", pred: "销售额" }],
      query: { a: "b" },
    }}
    display={{
      schema: false,
    }}
  />
);

export const VisualizerWithFilter = () => (
  <LogicFormVisualizer
    logicform={{
      schemaName: "销售流水",
      schema: "productsale",
      operator: "$sum",
      pred: "销售额",
      name: "总销售额",
      query: {
        日期: {
          $gte: { $offset: { month: 0 }, day: 1 },
          $lte: { $offset: { day: 0 } },
        },
        商品_分类: "单品",
      },
    }}
    display={{
      schema: false,
    }}
    filters={{
      商品_分类: ["全部", "单品", "组合", "耗材"],
    }}
    onQueryChange={(query) => {
      message.info(JSON.stringify(query));
    }}
  />
);
