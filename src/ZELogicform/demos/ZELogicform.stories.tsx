// Generated with util/create-component.js
import React, { useState } from "react";
import ZELogicform from "../ZELogicform";
import { LogicFormVisualizer } from "../LogicFormVisualizer";

// prepare server
import prepareServerForStories from "../../../util/prepareServerForStories";
import { List, message } from "antd";
import { LogicformType } from "zeroetp-api-sdk";
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

// 展示如果无中生有显示filter
export const VisualizerWithFilter = () => {
  const [logicform, setLogicform] = useState<LogicformType>({
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
      商品_分类: "组合",
      平台: "天猫",
    },
  });

  return (
    <LogicFormVisualizer
      logicform={logicform}
      display={{
        schema: false,
      }}
      filters={{
        商品_分类: {
          support_all: true,
          distincts: ["单品", "组合", "耗材"],
        },
        平台: {
          show: false, //不显示某一个字段
        },
      }}
      onQueryChange={(query) => {
        setLogicform({
          ...logicform,
          query,
        });
      }}
      badgeColor="black"
    />
  );
};
