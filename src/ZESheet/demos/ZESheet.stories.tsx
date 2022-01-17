// Generated with util/create-component.js
import React from "react";
import ZESheet from "../index";

// prepare server
import prepareServerForStories from "../../../util/prepareServerForStories";
prepareServerForStories();

export default {
  title: "ZESheet",
};

export const Basic = () => (
  <ZESheet
    logicform={{
      schema: "sales",
      groupby: ["店铺", "$year"],
      preds: [{ name: "总销量", operator: "$sum", pred: "销售量" }],
    }}
    s2DataConfig={{
      fields: {
        rows: ["店铺.名称"],
        columns: ["日期(year)"],
        values: ["总销量"],
      },
      meta: [
        {
          field: "店铺.名称",
          // 修改展示名称
          name: "店铺名称",
        },
      ],
    }}
  />
);

export const ZESheetWithFormatter = () => (
  <ZESheet
    logicform={{
      schema: "sales",
      groupby: ["渠道", "$year"],
      preds: [{ name: "总销量", operator: "$sum", pred: "销售量" }],
    }}
    s2DataConfig={{
      fields: {
        rows: ["渠道"],
        columns: ["日期(year)"],
        values: ["总销量"],
      },
      meta: [
        {
          field: "总销量",
          // formatter: (v) => `${v}元`,
        },
      ],
    }}
  />
);
