// Generated with util/create-component.js
import React from "react";
import ZECard from "../ZECard";
import "antd/dist/antd.css";

import prepareServerForStories from "../../../util/prepareServerForStories";
prepareServerForStories();

export default {
  title: "Retail",
};

export const MapCard = () => {
  return (
    <ZECard
      title="今年各省市销量"
      logicform={{
        schema: "sales",
        preds: [
          {
            operator: "$sum",
            pred: "销售量",
            name: "总销量",
          },
        ],
        query: {
          日期: { $offset: { year: 0 } },
        },
        groupby: { _id: "店铺_地址", level: "省市" },
      }}
    />
  );
};

export const BarCard = () => {
  return (
    <ZECard
      title="今年各品类销量"
      logicform={{
        schema: "sales",
        preds: [
          {
            operator: "$sum",
            pred: "销售量",
            name: "总销量",
          },
        ],
        query: {
          日期: { $offset: { year: 0 } },
        },
        groupby: { _id: "产品_品类" },
        sort: { 总销量: -1 },
      }}
    />
  );
};

export const SingleBar = () => {
  return (
    <ZECard
      title="今年各产品销量"
      logicform={{
        schema: "sales",
        preds: [
          {
            operator: "$sum",
            pred: "销售量",
            name: "总销量",
          },
        ],
        query: {
          日期: { $offset: { year: 0 } },
          产品: {
            operator: "$ent",
            schema: "product",
            field: "名称",
            name: "美丽无敌女长袖",
          },
        },
        groupby: { _id: "产品" },
      }}
    />
  );
};
