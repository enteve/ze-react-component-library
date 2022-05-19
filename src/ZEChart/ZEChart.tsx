// Generated with util/create-component.js
import React, { useMemo, memo } from "react";
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
import { canUseCrossTable, crossResult } from "../crossTableGen";

const ZEChart: React.FC<ZEChartProps> = memo(
  ({
    type,
    logicform,
    result,
    width,
    height,
    onDbClick,
    onItemSelect,
    option: inputOption = {},
    targetPred,
    isOtherPredsSupplementary = false,
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

    const chartEventDict: Record<string, Function> = useMemo(() => {
      return {
        click: (params: any) => {
          params?.event?.stop("click");
          const { dataIndex } = params;
          const item = data?.result[dataIndex];
          item && onDbClick?.(item, data);
        },
        selectchanged: (params: any) => {
          const dataIndex = params?.selected?.[0]?.dataIndex?.[0];
          const item = data?.result[dataIndex];
          item && onItemSelect?.(item);
        },
      };
    }, [JSON.stringify({ data })]);

    const chartOption = useMemo(() => {
      let option: any = {};
      // 第一个数值的prop。目前每张图都只采用第一个measurements。以后都要显示的。
      let measurementProp: PropertyType;

      const labelFormatter = (property) => (item: any) => {
        // 这个label formatter有时会返回整个axis，很奇怪。不过这个时候没有data
        if (!item.data) {
          return;
        }

        return formatWithProperty(property, item.data[property.name]);
      };

      if (data?.result && data?.logicform) {
        let dataForChart = data;
        // 20220519
        // 二维分组 + 单行数据。改造result和columnProperties，目的是为了把第二个维度拆成多个legend
        // 其实就是改造成交叉表
        if (canUseCrossTable(data.logicform)) {
          dataForChart = crossResult(data);
        }

        // result to dataset:
        // 要对entity进行一个改写
        const entityColumns = dataForChart.columnProperties
          .slice(0, dataForChart.logicform.groupby?.length)
          .filter((p) => p.type === "object");

        // 设定dimensions
        const dimensions = dataForChart.columnProperties.map((col) => col.name);

        // 设定dataset
        option.dataset = {
          source: dataForChart.result.map((i) => {
            const newI = { ...i };
            entityColumns.forEach((colProp) => {
              const entity = i[colProp.name];
              if (entity && typeof entity === "object") {
                const nameProp = getNameProperty(colProp.schema);
                if (nameProp) {
                  newI[colProp.name] = entity[nameProp.name];
                }
              }
            });
            dimensions.forEach((d) => {
              if (newI[d] === null) {
                newI[d] = "N/A";
              }
            });
            return newI;
          }),
          dimensions,
        };

        measurementProp =
          dataForChart.columnProperties[dataForChart.logicform.groupby.length];

        // tooltip
        option.tooltip = {
          confine: true,
          formatter: (params) => {
            return chartTooltipFormatter(
              params,
              dataForChart.columnProperties.slice(
                dataForChart.logicform.groupby.length
              )
            );
          },
        };

        let selectProps: any = {};
        if (onItemSelect) {
          selectProps = {
            selectedMode: true,
            select: {
              itemStyle: {
                color: "#f72c5b",
              },
            },
          };
        }

        if (type === "bar" || type === "column") {
          // Bar是horizontal的，column是vertical的。这里用的是ant charts的表达方法。有点怪怪的。
          option = merge(option, getBarOption());
          option.series = [
            {
              type: "bar",
              avoidLabelOverlap: true,
              ...selectProps,
            },
          ];

          // 显示单位
          if (measurementProp?.unit) {
            option.xAxis.name = measurementProp?.unit;
            if (measurementProp?.ui?.formatters) {
              const formatter = getFormatter(measurementProp, 0);
              if (formatter) {
                option.xAxis.name = `${formatter.prefix}${option.xAxis.name}${formatter.postfix}`;
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
          if (!option.label) option.label = { show: true };
          option.label.formatter = labelFormatter(measurementProp);
          if (type === "bar") {
            // option.label.show = true;
            option.label.position = "right";

            if (
              targetPred &&
              option.dataset?.dimensions?.find((d) => d === targetPred)
            ) {
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
                ...selectProps,
              });
            }
          }
          // value轴format
          option.xAxis.axisLabel.formatter = (value) =>
            formatWithProperty(measurementProp, value);

          if (type === "column") {
            // inverse要去掉
            option.yAxis.inverse = false;

            option.label.position = "top";

            // x,y轴和bar的倒一倒
            const xAxis = option.xAxis;
            option.xAxis = option.yAxis;
            option.yAxis = [xAxis];

            // 加入其他preds
            for (
              let index = 1 + dataForChart.logicform.groupby.length;
              index < dataForChart.columnProperties.length;
              index++
            ) {
              const columnProperty = dataForChart.columnProperties[index];
              let type: string = "bar";
              let yAxisIndex: number = 0;
              if (
                columnProperty.type === "percentage" &&
                measurementProp.type !== columnProperty.type // 量纲不同，引入第二轴
              ) {
                type = "line";
                yAxisIndex = 1;
                option.yAxis.push(
                  JSON.parse(
                    JSON.stringify({
                      ...xAxis,
                      splitLine: {
                        show: false,
                      },
                    })
                  )
                );
                option.yAxis[1].axisLabel.formatter = (v) =>
                  formatWithProperty(columnProperty, v);
              }

              option.series.push({
                type,
                yAxisIndex,
                label: {
                  formatter: labelFormatter(columnProperty),
                },
                ...selectProps,
              });
            }

            // legend
            if (!isOtherPredsSupplementary) {
              option.legend = {};
            } else {
              option.legend = { selectedMode: "single", show: false };
            }
          }
        } else if (type === "pie") {
          option = merge(option, getPieOption());
          option.series = [
            {
              type: "pie",
              label: {
                position: "inside",
                show: true,
                formatter: (p: any) => `${p.name}\n${p.percent}%`,
              },
              radius: ["50%", "95%"],
              itemStyle: {
                borderRadius: 10,
                borderColor: "#fff",
                borderWidth: 2,
              },
              emphasis: {
                label: {
                  show: true,
                  // fontSize: "40",
                  fontWeight: "bold",
                },
              },
              labelLine: {
                show: false,
              },
              ...selectProps,
            },
          ];
        } else if (type === "line") {
          option = merge(option, getLineOption());

          const numberOfSeries = option.dataset.dimensions.length - 1;
          option.series = [];
          for (let i = 0; i < numberOfSeries; i++) {
            option.series.push({
              type: "line",
              avoidLabelOverlap: true,
              ...selectProps,
            });
          }
          option.label = {
            show: true,
            formatter: labelFormatter(measurementProp),
          };

          if (numberOfSeries > 1) {
            option.legend = {};
          }
        }
        return option;
      }
    }, [JSON.stringify({ data, type })]);

    const notSupportedResult = (
      <Result
        status="info"
        title="此类数据暂不支持可视化形式展现，请以表格形式查看"
        subTitle="请联系开发团队以获取支持"
      />
    );
    if (data?.logicform.groupby?.length > 2) return notSupportedResult;
    if (
      data?.logicform.groupby?.length === 2 &&
      data?.logicform.preds.length >= 2
    )
      return notSupportedResult;

    // 设定正确的chart
    let chartDom: React.ReactNode;
    if (["bar", "column", "pie", "line"].includes(type)) {
      const finalOption = formatChartOptionGrid({
        ...merge(chartOption, inputOption),
        visualMap: false,
      });

      // console.log(finalOption);

      chartDom = (
        <EChart
          option={finalOption}
          eventsDict={chartEventDict}
          width={width}
          height={height}
        />
      );
    } else if (type === "map") {
      chartDom = (
        <Map
          logicform={logicform}
          data={data}
          width={width}
          height={height}
          eventsDict={chartEventDict}
          option={merge(chartOption, inputOption)}
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
    return (
      <div
        className="ze-chart"
        data-testid="ZEChart"
        onClick={() => {
          if (type === "map") {
            onDbClick(null, data, true);
          }
        }}
      >
        {chartDom}
      </div>
    );
  }
);

const ZEChartWrapper: React.FC<ZEChartProps> = (props) => {
  return (
    <SizeMe monitorHeight>
      {({ size: { width, height } }) => (
        <ZEChart
          {...props}
          width={props.width || width}
          height={props.height || height}
        />
      )}
    </SizeMe>
  );
};

export default ZEChartWrapper;
