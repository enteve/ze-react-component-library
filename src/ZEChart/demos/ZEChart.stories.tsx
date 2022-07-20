// Generated with util/create-component.js
import React, { useState } from "react";
import ZEChart from "../ZEChart";

// prepare server
import prepareServerForStories from "../../../util/prepareServerForStories";
import { LogicformType } from "zeroetp-api-sdk";

prepareServerForStories();

export default {
  title: "ZEChart",
};

export const Pie = () => (
  <ZEChart
    type="pie"
    logicform={{
      schema: "sales",
      groupby: "产品_品类",
      preds: [{ name: "amount", operator: "$sum", pred: "销售额" }],
    }}
    userChartOptionStr={`option = {
      tooltip: {
        confine: true,
        formatter: function formatter(params) {
          var formatDisplayValue = function formatDisplayValue(p, v) {
            var formatterStr = getFormatterString(p);
            return formatterStr ? numeral(v).format(formatterStr) : v;
          };
          
          return chartTooltipFormatter(params, dataForChart.columnProperties.slice(dataForChart.logicform.groupby.length), formatDisplayValue);
        },
        trigger: 'item'
      },
      legend: {
        type: 'scroll',
        orient: 'vertical',
        right: 10,
        top: 20,
        bottom: 20,
        padding: [
          0,
          50
        ]
      },
      series: [
        {
          type: 'pie',
          label: {
            position: 'inside',
            show: true,
            formatter: function formatter(p) {
              return p.name + newlineCharacter + p.percent + '%';
            }
          },
          radius: [
            '20%',
            '95%'
          ],
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          emphasis: {
            label: {
              show: true,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          }
        }
      ],
      visualMap: false,
      grid: {
        containLabel: true,
        top: 12,
        bottom: 35,
        left: 0,
        right: 30
      }
    }`}
  />
);

export const Bar = () => (
  <ZEChart
    type="bar"
    logicform={{
      schema: "sales",
      groupby: "产品_品类",
      preds: [
        { name: "流水数量", operator: "$count" },
        { name: "amount", operator: "$sum", pred: "销售额" },
      ],
    }}
  />
);

export const Column = () => (
  <ZEChart
    type="column"
    logicform={{
      schema: "sales",
      groupby: "产品_品类",
      query: { 日期: { $offset: { year: 0, month: -1 } } },
      preds: [
        { name: "总销售额", operator: "$sum", pred: "销售额" },
        { name: "销售额2", operator: "$sum", pred: "销售额" },
        { name: "销售额同比", operator: "$yoy", pred: "销售额" },
        { name: "销售额环比", operator: "$mom", pred: "销售额" },
      ],
    }}
  />
);

export const ColumnWithSupplemanryPreds = () => (
  <ZEChart
    type="column"
    logicform={{
      schema: "sales",
      groupby: "产品_品类",
      query: { 日期: { $offset: { year: 0 } } },
      preds: [
        { name: "流水数量", operator: "$count" },
        { name: "销售额", operator: "$sum", pred: "销售额" },
        { name: "销售额同比", operator: "$yoy", pred: "销售额" },
      ],
    }}
    isOtherPredsSupplementary
  />
);

export const Line = () => (
  <ZEChart
    type="line"
    logicform={{
      schema: "productsale",
      groupby: "$day",
      preds: [{ name: "amount", operator: "$sum", pred: "销售额" }],
    }}
  />
);

export const Map = () => {
  const [logicform, setLogicform] = useState<LogicformType>({
    query: {},
    preds: [{ pred: "销售量", operator: "$sum", name: "总销售量" }],
    schema: "sales",
    groupby: { _id: "店铺_地址", level: "省市" },
    schemaName: "销售",
  });

  return (
    <ZEChart
      type="map"
      logicform={logicform}
      onChangeLogicform={setLogicform}
    />
  );
};

export const TwoDimensionLine = () => (
  <ZEChart
    type="line"
    logicform={{
      schema: "sales",
      groupby: ["$year", "产品_品类"],
      preds: [{ name: "销售额", operator: "$sum", pred: "销售额" }],
    }}
  />
);

export const TwoDimensionColumn = () => (
  <ZEChart
    type="column"
    logicform={{
      schema: "sales",
      groupby: ["$year", "产品_品类"],
      preds: [{ name: "销售额", operator: "$sum", pred: "销售额" }],
    }}
  />
);
