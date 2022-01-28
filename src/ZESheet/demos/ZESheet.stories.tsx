// Generated with util/create-component.js
import React, { useState } from "react";
import ZESheet from "../index";
import "./index.less";

// prepare server
import prepareServerForStories from "../../../util/prepareServerForStories";
import { LogicformType } from "zeroetp-api-sdk";
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
      sortParams: [{ sortFieldId: "日期(year)", sortMethod: "asc" }],
    }}
  />
);

export const MultiZESheet = () => (
  <>
    <ZESheet
      logicform={{
        schema: "sales",
        groupby: ["渠道"],
        preds: [{ name: "总销量", operator: "$sum", pred: "销售量" }],
      }}
      s2DataConfig={{
        fields: {
          rows: ["渠道"],
          values: ["总销量"],
        },
      }}
    />
    <ZESheet
      logicform={{
        schema: "sales",
        groupby: ["渠道"],
        preds: [{ name: "毛利率", operator: "毛利率" }],
      }}
      s2DataConfig={{
        fields: {
          rows: ["渠道"],
          values: ["毛利率"],
        },
      }}
    />
  </>
);

export const ZESheetWithFormatter = () => {
  const [lf, setLF] = useState<LogicformType>({
    schema: "sales",
    groupby: ["渠道", "$year"],
    preds: [
      { name: "总销量", operator: "$sum", pred: "销售量" },
      { name: "毛利率", operator: "毛利率" },
    ],
  });
  const [s2DataConfig, setS2DataConfig] = useState<any>({
    fields: {
      rows: ["渠道"],
      columns: ["日期(year)"],
      values: ["总销量", "毛利率"],
    },
    meta: [
      {
        field: "总销量",
        // formatter: (v) => `${v}元`,
      },
    ],
  });
  const [s2Options, setS2Options] = useState<any>({});

  return (
    <ZESheet
      logicform={lf}
      s2DataConfig={s2DataConfig}
      s2Options={s2Options}
      onSave={(values) => {
        values.logicform && setLF(values.logicform);
        values.s2DataConfig && setS2DataConfig(values.s2DataConfig);
        values.s2Options && setS2Options(values.s2Options);
      }}
    />
  );
};
