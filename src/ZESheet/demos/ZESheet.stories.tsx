// Generated with util/create-component.js
import React, { useState } from "react";
import ZESheet from "../index";
import "./index.less";
import numeral from "numeral";
import * as xlsx from "xlsx";

// prepare server
import prepareServerForStories from "../../../util/prepareServerForStories";
import { LogicformType } from "zeroetp-api-sdk";
import { Node } from "@antv/s2";
prepareServerForStories();

export default {
  title: "ZESheet",
};

export const Basic = () => (
  <ZESheet
    logicform={{
      schema: "sales",
      groupby: ["渠道"],
      preds: [
        { name: "总销量", operator: "$sum", pred: "销售量" },
        { name: "毛利率", operator: "毛利率" },
        { name: "转化率", operator: "转化率" },
      ],
    }}
  />
);

export const MultiGroupByAndPreds = () => (
  <ZESheet
    logicform={{
      schema: "sales",
      groupby: ["店铺", "$year"],
      preds: [
        { name: "总销量", operator: "$sum", pred: "销售量" },
        { name: "数量", operator: "$count" },
      ],
    }}
  />
);

export const MultiGroupByAndPreds2 = () => (
  <ZESheet
    logicform={{
      query: { 日期: { $offset: { quarter: -1 } } },
      preds: [
        { pred: "销售量", operator: "$sum", name: "总销售量" },
        { pred: "销售额", operator: "$sum", name: "总销售额" },
        { operator: "$yoy", pred: "销售额", name: "销售额同比" },
      ],
      schema: "sales",
      groupby: ["产品_品类", "产品"],
      schemaName: "销售",
    }}
  />
);

export const Complex = () => (
  <ZESheet
    logicform={{
      query: { 日期: { $offset: { quarter: -1 } } },
      preds: [
        { pred: "销售量", operator: "$sum", name: "总销售量" },
        { pred: "销售额", operator: "$sum", name: "总销售额" },
        { operator: "$yoy", pred: "销售额", name: "销售额同比" },
      ],
      schema: "sales",
      groupby: ["产品_品类", "产品"],
      schemaName: "销售",
    }}
  />
);

export const Custom = () => (
  <ZESheet
    xlsx={xlsx}
    logicform={{
      schema: "sales",
      groupby: ["店铺", "$year"],
      preds: [
        { name: "总销量", operator: "$sum", pred: "销售量" },
        { name: "折扣率", operator: "折扣率" },
      ],
    }}
    s2DataConfig={{
      meta: [
        {
          field: "日期(year)",
          name: "年份",
        },
        {
          field: "总销量",
          name: "销售量",
          formatter: (v) => (v === null ? "-" : `${v}个`),
        },
        {
          field: "折扣率",
          formatter: (v) => (v === null ? "-" : numeral(v).format("0%")),
        },
        {
          field: "店铺.名称",
          name: "店铺名",
        },
      ],
    }}
  />
);

export const AdditionalRows = () => {
  // 新行标签
  const extraLabel = "销售指标";

  const options: any = {
    layoutHierarchy: (s2, node) => {
      const { field, label } = node;
      // console.log(field, label);
      // 找到总计行头节点，并在下方push插入一个节点
      if (field === "渠道" && label === "总计") {
        const extraNode = new Node({
          ...node,
          ...node.config,
          id: `${node.parent.id}&${extraLabel}`,
          label: extraLabel,
          value: extraLabel,
          query: { ...node.query, [node.key]: extraLabel },
        });

        return {
          push: [extraNode],
          unshift: [],
          delete: false,
        };
      }
      return {};
    },
    layoutCoordinate: (s2, rowNode, colNode) => {
      const { field, label } = rowNode || {};
      // 找到插入的新节点，让他宽度等于行头宽度
      if (label === extraLabel) {
        rowNode.width = rowNode.hierarchy.width;
      }
    },
    layoutDataPosition: (s2, getCellData) => {
      const getCellMeta = (rowIndex?: number, colIndex?: number) => {
        const viewMeta = getCellData(rowIndex, colIndex);
        console.log("viewMeta", viewMeta);
        const { rowId, valueField } = viewMeta;
        // 劫持新行的数据返回
        if (rowId === "root&销售指标") {
          const result = 10;
          return {
            ...viewMeta,
            fieldValue: result,
            data: {
              [valueField]: result,
              // [EXTRA_FIELD]: valueField, // 这个字段如何获取？ $$extra$$
              // [VALUE_FIELD]: result, // 这个字段如何获取？ $$value$$
            },
          };
        }
        return viewMeta;
      };
      return getCellMeta;
    },
  };

  return (
    <ZESheet
      logicform={{
        schema: "sales",
        groupby: ["渠道"],
        preds: [
          { name: "总销量", operator: "$sum", pred: "销售量" },
          { name: "毛利率", operator: "毛利率" },
        ],
      }}
      s2Options={options}
    />
  );
};

export const TMP = () => {
  const [lf, setLF] = useState<LogicformType>({
    schema: "ddi_sales",
    groupby: ["产品", "市场分类", "终端类型"],
    query: { 日期: "MTD" },
    preds: [{ name: "总销量", operator: "$sum", pred: "数量" }],
  });
  const [s2DataConfig, setS2DataConfig] = useState<any>({
    fields: {
      rows: ["市场分类", "终端类型"],
      columns: ["产品.名称"],
      values: ["总销量"],
      valueInCols: true,
    },
    meta: [
      {
        field: "总销量",
        formatter: (v) => numeral(v / 1000).format("0,0.0"),
      },
      {
        field: "市场分类",
        formatter: (v) => {
          if (v === "Others") return "其他";
          return v;
        },
      },
    ],
    sortParams: [
      {
        sortFieldId: "市场分类",
        sortBy: ["核心市场", "CSO市场", "多渠道", "Others"],
      },
      {
        sortFieldId: "终端类型",
        sortBy: ["医院进药", "药店", "电商", "互联网医院"],
      },
    ],
  });
  const [s2Options, setS2Options] = useState<any>({
    hierarchyType: "tree",
    hierarchyCollapse: true,
    totals: {
      row: {
        showGrandTotals: true,
        reverseLayout: true,
        showSubTotals: true,
        reverseSubLayout: true,
        subTotalsDimensions: ["市场分类"],
        calcTotals: {
          aggregation: "SUM",
        },
        calcSubTotals: {
          aggregation: "SUM",
        },
      },
    },
    style: {
      colCfg: {
        hideMeasureColumn: true,
      },
    },
  });

  return (
    <ZESheet
      logicform={lf}
      s2DataConfig={s2DataConfig}
      s2Options={s2Options}
      // sheetType="gridAnalysis"
    />
  );
};
