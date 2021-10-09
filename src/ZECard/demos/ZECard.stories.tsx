// Generated with util/create-component.js
import React from "react";
import moment from "moment";
import xlsx from "xlsx";
import ZECard from "../ZECard";
import "antd/dist/antd.css";

// prepare server
import prepareServerForStories from "../../../util/prepareServerForStories";
prepareServerForStories();

export default {
  title: "ZECard",
};

export const Table = () => (
  <ZECard
    title="所有Dealer"
    logicform={{
      schemaName: "经销商",
      schema: "dealer",
      limit: 10,
    }}
    tableProps={{
      defaultColWidth: 100,
    }}
  />
);

export const Value = () => (
  <ZECard
    title="MTD销售额"
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
      },
    }}
    showRecommender={true}
    footer={<div>footer</div>}
  />
);

export const PercentageValue = () => (
  <ZECard
    title="MTD销售额环比"
    logicform={{
      schemaName: "销售流水",
      schema: "productsale",
      operator: "$mom",
      pred: "销售额",
      name: "总销售额",
      query: {
        日期: {
          $gte: { $offset: { month: 0 }, day: 1 },
          $lte: { $offset: { day: 0 } },
        },
      },
    }}
  />
);

export const Entity = () => (
  <ZECard
    title="Dealer销售额"
    logicform={{
      schemaName: "经销商",
      schema: "dealer",
      operator: "$ent",
      field: "名称",
      name: "上海展晓实业有限公司",
    }}
  />
);

export const EntityPreds = () => (
  <ZECard
    title="Dealer销售额"
    logicform={{
      schemaName: "经销商",
      schema: "dealer",
      operator: "$ent",
      field: "名称",
      name: "上海展晓实业有限公司",
      preds: ["联系人电话"],
    }}
  />
);

export const Stats = () => (
  <ZECard
    title="Dealer数量 by 区域"
    logicform={{
      schema: "dealer",
      schemaName: "经销商",
      groupby: { _id: "所在省市", level: "区域" },
      preds: [{ name: "数量", operator: "$count" }],
    }}
  />
);

export const StatsDefaultColumn = () => (
  <ZECard
    title="各商品销量"
    logicform={{
      schema: "productsale",
      preds: [{ name: "销量", operator: "$sum", pred: "销量" }],
      groupby: ["商品"],
    }}
  />
);

export const StatsDefaultBar = () => (
  <ZECard
    title="商品销量从大到小排序"
    logicform={{
      schema: "productsale",
      preds: [{ name: "销量", operator: "$sum", pred: "销量" }],
      groupby: ["商品"],
      sort: { 销量: -1 },
    }}
  />
);

export const StatsDefaultMap = () => (
  <ZECard
    title="地图"
    logicform={{
      schema: "productsale",
      preds: [{ name: "销量", operator: "$sum", pred: "销量" }],
      groupby: [{ _id: "地理位置", level: "省市" }],
      sort: { 销量: -1 },
    }}
  />
);

export const StatsPie = () => (
  <ZECard
    title="各商品销量"
    logicform={{
      schema: "productsale",
      preds: [{ name: "销量", operator: "$sum", pred: "销量" }],
      groupby: ["商品"],
    }}
    representation="pie"
  />
);

export const StatsDefaultRepresentation = () => (
  <ZECard
    title="各商品销量"
    logicform={{
      schema: "productsale",
      preds: [{ name: "销量", operator: "$sum", pred: "销量" }],
      groupby: ["商品"],
    }}
    representation="table"
  />
);

export const StatsCrossTable = () => (
  <ZECard
    title="各商品销量"
    logicform={{
      schema: "productsale",
      preds: [{ name: "销量", operator: "$sum", pred: "销量" }],
      query: { 日期: { $offset: { year: 0 } } },
      groupby: ["$month", "商品"],
    }}
    bodyStyle={{ padding: 0 }}
    xlsx={xlsx}
    exportToExcel="交叉表"
  />
);
