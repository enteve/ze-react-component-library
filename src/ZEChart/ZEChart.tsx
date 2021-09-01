// Generated with util/create-component.js
import React from "react";
import {
  Line,
  Pie,
  Area,
  Column,
  Bar,
  DualAxes,
  Bullet,
  Scatter,
} from "@ant-design/charts";
import { ZEChartProps } from "./ZEChart.types";

import "./ZEChart.less";
import { useRequest } from "@umijs/hooks";
import { LogicformAPIResultType } from "zeroetp-api-sdk";
import { requestLogicform } from "../request";

const ZEChart: React.FC<ZEChartProps> = ({
  type,
  config = {},
  logicform,
  result,
}) => {
  const { data } = useRequest<LogicformAPIResultType>(() => {
    if (result) {
      return new Promise((resolve) => resolve(result));
    }

    return requestLogicform(logicform);
  });

  if (data) {
    config.data = data.result;
  } else {
    config.data = [];
  }
  // console.log(config.data);

  // 设定正确的chart
  let chartDom: React.ReactNode;
  if (type === "line") {
    const lineDefaultConfig: any = {
      padding: "auto",
      xField: "_id",
      yField: logicform.preds[0].name,
    };

    chartDom = <Line {...{ ...lineDefaultConfig, ...config }} />;
  } else if (type === "pie") {
    // 设定默认config
    const pieDefaultConfig: any = {
      appendPadding: 10,
      data,
      angleField: logicform.preds[0].name,
      colorField: "_id",
      radius: 1,
      innerRadius: 0.64,
      interactions: [
        { type: "element-selected" },
        { type: "element-active" },
        { type: "pie-statistic-active" },
      ],
    };

    chartDom = <Pie {...{ ...pieDefaultConfig, ...config }} />;
  } else if (type === "area") {
    chartDom = <Area {...config} />;
  } else if (type === "column") {
    chartDom = <Column {...config} />;
  } else if (type === "bar") {
    chartDom = <Bar {...config} />;
  } else if (type === "area") {
    chartDom = <Area {...config} />;
  } else if (type === "dualAxes") {
    chartDom = <DualAxes {...config} />;
  } else if (type === "bullet") {
    chartDom = <Bullet {...config} />;
  } else if (type === "scatter") {
    chartDom = <Scatter {...config} />;
  } else {
    chartDom = <div>暂未支持</div>;
  }
  return <div data-testid="ZEChart">{chartDom}</div>;
};

export default ZEChart;
