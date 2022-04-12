// Generated with util/create-component.js
import React, { useState } from "react";
import ZELogicformVisualizer from "../ZELogicformVisualizer";

// prepare server
import prepareServerForStories from "../../../util/prepareServerForStories";
import { LogicformType } from "zeroetp-api-sdk";
prepareServerForStories();

export default {
  title: "ZELogicformVisualizer",
};

export const Visualizer = () => (
  <ZELogicformVisualizer
    logicform={{
      schema: "productsale",
      groupby: "渠道",
      preds: [{ name: "sum", operator: "$sum", pred: "销售额" }],
      query: {
        a: "b",
        日期: { $gte: "2022-03-01 00:00:00", $lte: "2022-03-01 23:59:59" },
        c: { $gte: 2, $lte: 3 },
      },
    }}
  />
);

export const VisualizerDisplay = () => (
  <ZELogicformVisualizer
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

// 展示如何无中生有显示filter
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
    <ZELogicformVisualizer
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

export const FilterInPreds = () => {
  const [logicform, setLogicform] = useState<LogicformType>({
    schemaName: "销售流水",
    schema: "productsale",
    preds: [
      {
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
      },
    ],
    groupby: "平台",
  });

  return <ZELogicformVisualizer logicform={logicform} />;
};

export const EntityInQuery = () => {
  return (
    <ZELogicformVisualizer
      logicform={{
        preds: [
          [
            {
              pred: "应收电费",
              operator: "$sum",
              name: "总应收电费",
            },
          ],
          [
            {
              operator: "$yoy",
              pred: "应收电费",
              name: "应收电费同比",
            },
          ],
        ],
        query: {
          日期: {
            $gte: "2020-12-31T16:00:00.000Z",
            $lte: "2021-12-31T15:59:59.999Z",
          },
          用电类别: {
            schema: "ec_cate",
            preds: [
              [
                {
                  operator: "$ent",
                  field: "名称",
                  name: "商业用电",
                },
              ],
            ],
            query: {},
          },
          区县公司: "昆山市供电公司",
          地理位置: {
            schema: "geo",
            preds: [
              [
                {
                  operator: "$ent",
                  field: "name",
                  name: "昆山市",
                  code: "0864320583",
                },
              ],
            ],
            query: {},
          },
        },
        schema: "sales",
        groupby: [
          {
            _id: "区县公司",
            name: "区县公司",
          },
          {
            _id: "日期",
            level: "month",
            name: "日期(month)",
          },
        ],
        schemaName: "销售表",
        _role: "viewer",
        sort: {
          区县公司: 1,
          "日期(month)": 1,
        },
      }}
    />
  );
};
