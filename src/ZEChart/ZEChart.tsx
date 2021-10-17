// Generated with util/create-component.js
import React from "react";
import _ from "underscore";
import { ZEChartProps } from "./ZEChart.types";
import Map from "./map";

import "./ZEChart.less";
import { useRequest } from "@umijs/hooks";
import { LogicformAPIResultType } from "zeroetp-api-sdk";
import { SizeMe } from "react-sizeme";
import { requestLogicform } from "../request";
import EChart from "./EChart";
import getPieOption from "./EChart/options/pie";
import getLineOption from "./EChart/options/line";
import getBarOption from "./EChart/options/bar";
import getColumnOption from "./EChart/options/column";
import { getNameKeyForChart, formatBarData, chartTooltipFormatter } from "./util";

const ZEChart: React.FC<ZEChartProps> = ({
  type,
  logicform,
  result,
  width,
  onDbClick,
  coloringMap,
}) => {
  const { data } = useRequest<LogicformAPIResultType>(
    () => {
      if (result) {
        return new Promise((resolve) => resolve(result));
      }

      return requestLogicform(logicform);
    },
    {
      refreshDeps: [logicform, result],
    }
  );
  const chartEventDict: Record<string, Function> = {
    click: (params: any) => {
      const { dataIndex } = params;
      const item = data.result[dataIndex];
      onDbClick?.(item);
    },
  };

  // 设定正确的chart
  let chartDom: React.ReactNode = <div />;
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

    chartDom = <EChart option={option} eventsDict={chartEventDict} />;
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

    chartDom = <EChart option={option} eventsDict={chartEventDict} />;
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
        barMaxWidth: 48,
      }));
      option.xAxis.data = data.result.map((r) => _.get(r, nameProp));
    }

    chartDom = <EChart option={option} eventsDict={chartEventDict} />;
  } else if (type === "bar") {
    const option: any = getBarOption(width && width < 900);

    // 灌入Data
    if (data) {
      const nameProp = getNameKeyForChart(logicform, data);
      // 默认取第一个pred为主value
      option.series = logicform.preds.slice(0, 1).map((predItem) => ({
        name: predItem.name,
        type: "bar",
        data: formatBarData(
          data.result,
          predItem.name,
          logicform.preds,
          width && width < 900,
          coloringMap,
        ),
        animationDuration: 500,
        barMaxWidth: 48,
      }));
      option.yAxis.data = data.result.map((r) => _.get(r, nameProp));
      option.tooltip.formatter = chartTooltipFormatter;

      console.log(option);
    }

    chartDom = <EChart option={option} eventsDict={chartEventDict} />;
  } else if (type === "map") {
    chartDom = (
      <Map data={data} logicform={logicform} eventsDict={chartEventDict} coloringMap={coloringMap} />
    );
  } else {
    chartDom = <div>暂未支持</div>;
  }
  return <div data-testid="ZEChart">{chartDom}</div>;
};

const ZEChartWrapper: React.FC<Omit<ZEChartProps, "width">> = (props) => {
  return (
    <SizeMe>{({ size }) => <ZEChart width={size.width} {...props} />}</SizeMe>
  );
};

export default ZEChartWrapper;
