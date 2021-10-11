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