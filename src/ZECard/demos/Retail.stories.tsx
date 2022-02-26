// Generated with util/create-component.js
import React from "react";
import ZECard from "../ZECard";
import "antd/dist/antd.css";

import prepareServerForStories from "../../../util/prepareServerForStories";
prepareServerForStories();

export default {
  title: "Retail",
};

/*
 * TODO: 这个得去掉
 */
export const TableControlsSync = () => {
  return (
    <ZECard
      representation="table"
      title="搜索控件状态（TO BE REMOVED）"
      logicform={{
        schema: "sales",
        query: {
          // 日期选择器
          日期: { $offset: { year: 0 } },

          // 筛选器
          // 渠道: "拼多多",
          渠道: { $in: ["天猫", "京东"] },

          // 搜索器
          // 产品: { $contains: "女" },
        },
        // 排序器
        sort: { 销售量: -1, 原价: 1 },
      }}
    />
  );
};
