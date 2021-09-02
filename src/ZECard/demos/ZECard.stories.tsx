// Generated with util/create-component.js
import React from "react";
import moment from "moment";
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
  />
);

export const Value = () => (
  <ZECard
    title="Dealer销售额"
    logicform={{
      schemaName: "经销商",
      schema: "dealer",
      operator: "$count",
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

export const StatsDefaultBar = () => (
  <ZECard
    title="各商品销量"
    logicform={{
      schema: "productsale",
      preds: [{ name: "销量", operator: "$sum", pred: "销量" }],
      groupby: ["商品"],
    }}
  />
);