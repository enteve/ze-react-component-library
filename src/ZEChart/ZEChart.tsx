// Generated with util/create-component.js
import React from "react";
import _ from "underscore";
import { ZEChartProps } from "./ZEChart.types";
import Map from "./map";

import "./ZEChart.less";
import { useRequest } from "@umijs/hooks";
import { LogicformAPIResultType } from "zeroetp-api-sdk";
import { requestLogicform } from "../request";
import EChart from "./EChart";
import getPieOption from "./EChart/options/pie";
import getLineOption from "./EChart/options/line";
import getBarOption from "./EChart/options/bar";
import getColumnOption from "./EChart/options/column";
import { getNameKeyForChart } from "./util";

const ZEChart: React.FC<ZEChartProps> = ({ type, logicform, result }) => {
  const { data } = useRequest<LogicformAPIResultType>(() => {
    if (result) {
      return new Promise((resolve) => resolve(result));
    }

    return requestLogicform(logicform);
  });

  // 设定正确的chart
  let chartDom: React.ReactNode;
  if (type === "line") {
    const option: any = getLineOption();

    // 灌入Data
    if (data) {
      const nameProp = getNameKeyForChart(logicform, data);

      option.series = logicform.preds.map((predItem) => ({
        name: predItem.name,
        type: "line",
        data: data.result.map((r) => r[predItem.name]),
        animationDuration: 500,
      }));
      option.xAxis.data = data.result.map((r) => _.get(r, nameProp));
    }

    chartDom = <EChart option={option} />;
  } else if (type === "pie") {
    const option: any = getPieOption();

    // 灌入Data
    if (data) {
      const nameProp = getNameKeyForChart(logicform, data);

      option.series[0].data = data.result.map((r) => ({
        _id: r._id,
        value: r[logicform.preds[0].name],
        name: _.get(r, nameProp),
      }));
    }

    chartDom = <EChart option={option} />;
  } else if (type === "column") {
    const option: any = getColumnOption();

    // 灌入Data
    if (data) {
      const nameProp = getNameKeyForChart(logicform, data);

      option.series = logicform.preds.map((predItem) => ({
        name: predItem.name,
        type: "bar",
        data: data.result.map((r) => r[predItem.name]),
        animationDuration: 500,
      }));
      option.xAxis.data = data.result.map((r) => _.get(r, nameProp));
    }

    chartDom = <EChart option={option} />;
  } else if (type === "bar") {
    const option: any = getBarOption();

    // 灌入Data
    if (data) {
      const nameProp = getNameKeyForChart(logicform, data);

      option.series = logicform.preds.map((predItem) => ({
        name: predItem.name,
        type: "bar",
        data: data.result.map((r) => r[predItem.name]),
        animationDuration: 500,
      }));
      option.yAxis.data = data.result.map((r) => _.get(r, nameProp));

      console.log(option);
    }

    chartDom = <EChart option={option} />;
  } else if (type === "map") {
    chartDom = <Map data={data} logicform={logicform} />;
  } else {
    chartDom = <div>暂未支持</div>;
  }
  return <div data-testid="ZEChart">{chartDom}</div>;
};

export default ZEChart;
