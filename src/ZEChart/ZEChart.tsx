// Generated with util/create-component.js
import React from "react";
import _ from "underscore";
import merge from "deepmerge";
import { ZEChartProps } from "./ZEChart.types";
import Map from "./map";

import "./ZEChart.less";
import { useRequest } from "@umijs/hooks";
import {
  getNameProperty,
  LogicformAPIResultType,
  PropertyType,
} from "zeroetp-api-sdk";
import { SizeMe } from "react-sizeme";
import { requestLogicform } from "../request";
import EChart from "./EChart";
import getPieOption from "./EChart/options/pie";
import getLineOption from "./EChart/options/line";
import getBarOption from "./EChart/options/bar";
import { chartTooltipFormatter, formatChartOptionGrid } from "./util";
import { formatWithProperty, getFormatter } from "../util";
import { Result } from "antd";

const ZEChart: React.FC<ZEChartProps> = ({
  type,
  logicform,
  result,
  width,
  height,
  onDbClick,
  option: inputOption = {},
  targetPred,
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
      params?.event?.stop("click");
      const { dataIndex } = params;
      const item = data.result[dataIndex];
      onDbClick?.(item);
    },
  };

  let option: any = {};
  const userOption = JSON.parse(JSON.stringify(inputOption));
  // 第一个数值的prop。目前每张图都只采用第一个measurements。以后都要显示的。
  let measurementProp: PropertyType;

  if (data?.result && data?.logicform) {
    // result to dataset:
    // 要对entity进行一个改写
    const entityColumns = data.columnProperties
      .slice(0, data.logicform.groupby?.length)
      .filter((p) => p.type === "object");

    option.dataset = {
      source: data.result.map((i) => {
        const newI = { ...i };
        entityColumns.forEach((colProp) => {
          if (typeof i[colProp.name] === "object") {
            const nameProp = getNameProperty(colProp.schema);
            if (nameProp) {
              newI[colProp.name] = i[colProp.name][nameProp.name];
            }
          }
        });
        return newI;
      }),
      dimensions: data.columnProperties.map((col) => col.name),
    };

    measurementProp = data.columnProperties[data.logicform.groupby.length];

    // tooltip
    option.tooltip = {
      confine: true,
      formatter: (params) => {
        return chartTooltipFormatter(
          params,
          data.columnProperties.slice(data.logicform.groupby.length)
        );
      },
    };
  }

  // 设定正确的chart
  let chartDom: React.ReactNode;

  if (type === "bar" || type === "column") {
    // Bar是horizontal的，column是vertical的。这里用的是ant charts的表达方法。有点怪怪的。
    option = merge(option, getBarOption());
    option.series = [
      {
        type: "bar",
      },
    ];

    // 显示单位
    if (measurementProp?.unit) {
      option.xAxis.name = measurementProp?.unit;
      if (measurementProp?.ui?.formatters) {
        const formatter = getFormatter(measurementProp, 0);
        if (formatter) {
          option.xAxis.name = `${formatter.prefix}${option.xAxis.name}`;
        }
      }

      // feat: 单位不宜过长。每隔2位给个换行
      if (option.xAxis.name.length > 3) {
        const chars = option.xAxis.name.split("");
        option.xAxis.name = "";
        for (let i = 0; i < chars.length; i++) {
          const char = chars[i];
          if (i > 0 && i % 2 === 0) {
            option.xAxis.name += "\n";
          }
          option.xAxis.name += char;
        }
      }
    }

    // label format
    if (!option.label) option.label = { show: false }; // 这个备着
    option.label.formatter = (item: any) => {
      // 这个label formatter有时会返回整个axis，很奇怪。不过这个时候没有data
      if (!item.data) {
        return;
      }

      return formatWithProperty(
        measurementProp,
        item.data[measurementProp.name]
      );
    };
    if (type === "bar") {
      option.label.show = true;
      option.label.position = "right";

      if (targetPred && option.dataset?.dimensions) {
        // 加上target series
        option.series[0].barGap = "-100%";
        option.series[0].z = 3;
        option.series.push({
          type: "bar",
          label: { show: false },
          encode: {
            x: targetPred,
          },
          itemStyle: { color: "#f2f2f2" },
          emphasis: {
            itemStyle: { color: "#f2f2f2" },
          },
        });
      }
    }
    // value轴format
    option.xAxis.axisLabel.formatter = (value) =>
      formatWithProperty(measurementProp, value);

    if (type === "column") {
      // inverse要去掉
      option.yAxis.inverse = false;

      // x,y轴和bar的倒一倒
      const xAxis = option.xAxis;
      option.xAxis = option.yAxis;
      option.yAxis = xAxis;
    }
  } else if (type === "pie") {
    option = merge(option, getPieOption());
    option.series = [
      {
        type: "pie",
      },
    ];

    // pie没有visualMap
    delete userOption.visualMap;
  } else if (type === "line") {
    option = merge(option, getLineOption());
    option.series = [
      {
        type: "line",
      },
    ];
  } else if (type === "map") {
    chartDom = (
      <Map
        logicform={logicform}
        data={data}
        width={width}
        height={height}
        eventsDict={chartEventDict}
        option={merge(option, userOption)}
      />
    );
  } else {
    chartDom = (
      <Result
        status="info"
        title="暂不支持的图表格式"
        subTitle="请联系开发团队以获取支持"
      />
    );
  }

  if (!chartDom) {
    chartDom = (
      <EChart
        option={formatChartOptionGrid(merge(option, userOption))}
        eventsDict={chartEventDict}
        width={width}
      />
    );
  }
  return (
    <div
      data-testid="ZEChart"
      onClick={() => {
        if (type === "map") {
          onDbClick(null, true);
        }
      }}
    >
      {chartDom}
    </div>
  );
};

const ZEChartWrapper: React.FC<Omit<ZEChartProps, "width">> = (props) => {
  return (
    <SizeMe monitorHeight>
      {({ size }) => (
        <ZEChart width={size.width} height={size.height} {...props} />
      )}
    </SizeMe>
  );
};

export default ZEChartWrapper;
