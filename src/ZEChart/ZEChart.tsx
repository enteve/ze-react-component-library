// Generated with util/create-component.js
import React, { useMemo, memo, useState, useEffect, useRef } from "react";
import _ from "underscore";
import merge from "deepmerge";
import { ZEChartProps } from "./ZEChart.types";
import Map from "./map";
import TsEditor from "./TsEditor";
import { obj2str } from "obj2str";
import _numeral from "numeral";
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
import { formatChartOptionGrid } from "./util";
import { getFormatter } from "../util";
import { Result, Button, message, Space } from "antd";
import { canUseCrossTable, crossResult } from "../crossTableGen";

const getFormatterString = (property: PropertyType) => {
  const formatter = getFormatter(property);
  if (formatter) {
    return formatter.formatter;
  }
  if (property.type === "percentage") {
    return "0.0%";
  }
  if (property.primal_type === "number") {
    return "0,0";
  }
  return null;
};

const chartTooltipFormatter = (
  params: any,
  properties: PropertyType[],
  formatDisplayValue: (property: PropertyType, value: number) => string | number
): string => {
  let res: string = "";
  if (!params) {
    return res;
  }
  const data: any[] = params instanceof Array ? params : [params];

  data.slice(0, 1).forEach((d) => {
    let itemTip = d.name ? `${d.name} <br />` : "";
    properties.forEach((property, index) => {
      let unit: any = property.unit;
      const formatter = getFormatter(property);
      if (formatter) {
        unit = `${formatter.prefix}${unit}${formatter.postfix}`;
      }
      const v = d?.data?.[property.name];
      const displayV = formatDisplayValue(property, v);

      itemTip = `${itemTip}${(data[index] || d)?.marker}${property.name}
      ${
        unit ? `(${unit})` : ""
      } <span style="float:right;margin-left:20px;font-size:14px;color:#666;font-weight:900">${displayV}</span><br />`;
    });
    res = `${res}${itemTip}`;
  });
  return res;
};

const newlineCharacter = "\n";

const ZEChart: React.FC<ZEChartProps> = memo(
  ({
    type,
    logicform,
    result,
    width,
    height,
    onDbClick,
    onItemSelect,
    userChartOptionStr: _userChartOptionStr,
    onSave,
    option: inputOption = {},
    targetPred,
    isOtherPredsSupplementary = false,
  }) => {
    const userChartOptionStr = _userChartOptionStr?.[type];
    const globalVarsRef = useRef<{
      dataForChart: any;
      numeral: any;
      measurementProp: any;
    }>({
      dataForChart: undefined,
      numeral: _numeral,
      measurementProp: {},
    });

    const editorWidth = width / 2;
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
    /* 直接对最终options修改 */
    const [editMode, setEditMode] = useState<boolean>(false);
    const [editingOption, setEditingOption] =
      useState<string>(userChartOptionStr);
    const [userChangedOption, setUserChangedOption] = useState<any>(); // 最终用户的option，会完全覆盖默认的配置

    const resetEditingOption = () => {
      readOptionsFromString(userChartOptionStr);
      onSave?.(type, userChartOptionStr);
      setEditingOption(userChartOptionStr);
    };
    const toggleEditMode = () => {
      setEditMode(!editMode);
    };

    const additionalToolboxFeature = {
      myEditor: {
        show: true,
        icon: "path://M541.866667,238.933333l243.2,243.2L413.866667,853.333333H170.666667v-243.2l371.2-371.2z,m0,59.733334L213.333333,631.466667V810.666667h179.2l328.533334-328.533334L541.866667,298.666667z,m72.533333-128L853.333333,413.866667l-29.866666,29.866666-243.2-243.2,34.133333-29.866666z",
        onclick: function () {
          toggleEditMode();
        },
        title: "编辑图表",
      },
    };

    const readOptionsFromString = (optionStr?: string) => {
      setEditingOption(optionStr);
      if (optionStr) {
        // console.log(optionStr);
        try {
          const { dataForChart, numeral, measurementProp } =
            globalVarsRef.current;
          let option: any;
          eval(optionStr);
          setUserChangedOption(option);
        } catch (error) {
          console.log(error);
          message.error("非法的格式，请检查配置");
        }
      } else {
        setUserChangedOption(undefined);
      }
    };

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

      if (data?.result && data?.logicform) {
        globalVarsRef.current.dataForChart = data;
        // 20220519
        // 二维分组 + 单行数据。改造result和columnProperties，目的是为了把第二个维度拆成多个legend
        // 其实就是改造成交叉表
        if (canUseCrossTable(data.logicform)) {
          globalVarsRef.current.dataForChart = crossResult(data);
        }
        const { dataForChart, numeral } = globalVarsRef.current;

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

        globalVarsRef.current.measurementProp =
          dataForChart.columnProperties[dataForChart.logicform.groupby.length];
        const { measurementProp } = globalVarsRef.current;

        // tooltip
        option.tooltip = {
          confine: true,
          formatter: (params) => {
            const formatDisplayValue = (p, v) => {
              const formatterStr = getFormatterString(p);
              return formatterStr ? numeral(v).format(formatterStr) : v;
            };
            return chartTooltipFormatter(
              params,
              dataForChart.columnProperties.slice(
                dataForChart.logicform.groupby.length
              ),
              formatDisplayValue
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
              const formatter = getFormatter(measurementProp);
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
                  option.xAxis.name += newlineCharacter;
                }
                option.xAxis.name += char;
              }
            }
          }

          // label format
          if (!option.label) option.label = { show: true };
          option.label.formatter = (item) => {
            if (!item.data) {
              return;
            }
            const value = item.data[measurementProp.name];
            const formatterStr = getFormatterString(measurementProp);
            if (formatterStr) {
              return numeral(value).format(formatterStr);
            }
            return value;
          };
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
          option.xAxis.axisLabel.formatter = (value) => {
            const formatterStr = getFormatterString(measurementProp);
            if (formatterStr) {
              return numeral(value).format(formatterStr);
            }
            return value;
          };

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
                option.yAxis[1].axisLabel.formatter = (value) => {
                  const formatterStr = getFormatterString(measurementProp);
                  if (formatterStr) {
                    return numeral(value).format(formatterStr);
                  }
                  return value;
                };
              }

              option.series.push({
                type,
                yAxisIndex,
                label: {
                  formatter: (item) => {
                    if (!item.data) {
                      return;
                    }
                    const value = item.data[measurementProp.name];
                    const formatterStr = getFormatterString(measurementProp);
                    if (formatterStr) {
                      return numeral(value).format(formatterStr);
                    }
                    return value;
                  },
                },
                ...selectProps,
              });
            }

            // legend
            if (!isOtherPredsSupplementary) {
              option.legend = {};
              option.label = {
                show: false,
              };
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
                formatter: (p: any) =>
                  p.name + newlineCharacter + p.percent + "%",
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

          if (numberOfSeries > 1) {
            option.legend = {};
          } else {
            option.label = {
              show: true,
              formatter: (item) => {
                if (!item.data) {
                  return;
                }
                const value = item.data[measurementProp.name];
                const formatterStr = getFormatterString(measurementProp);
                if (formatterStr) {
                  return numeral(value).format(formatterStr);
                }
                return value;
              },
            };
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

    // 设定正确的chart
    let chartDom: React.ReactNode;
    let finalOption: any;
    if (["bar", "column", "pie", "line"].includes(type)) {
      if (userChangedOption) {
        finalOption = { ...userChangedOption, dataset: chartOption.dataset };
      } else {
        finalOption = formatChartOptionGrid({
          ...merge(chartOption, inputOption),
          visualMap: false,
        });
      }

      // console.log(finalOption);

      chartDom = (
        <EChart
          option={finalOption}
          eventsDict={chartEventDict}
          width={editMode ? width - editorWidth : width}
          height={height}
          additionalToolboxFeature={additionalToolboxFeature}
        />
      );
    } else if (type === "map") {
      if (userChangedOption) {
        finalOption = userChangedOption;
      } else {
        finalOption = merge(chartOption, inputOption);
      }
      chartDom = (
        <Map
          logicform={logicform}
          data={data}
          width={editMode ? width - editorWidth : width}
          height={height}
          eventsDict={chartEventDict}
          option={finalOption}
          // additionalToolboxFeature={additionalToolboxFeature}
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

    const optionsForEdit = { ...finalOption };
    delete optionsForEdit["dataset"];

    // Editor
    const editComponent = (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minWidth: 0,
        }}
      >
        <Space style={{ flexDirection: "row-reverse" }}>
          <Button
            type="primary"
            style={{ float: "right" }}
            onClick={() => {
              readOptionsFromString(editingOption);
              onSave?.(type, editingOption);
            }}
          >
            保存
          </Button>
          <Button
            onClick={() => {
              resetEditingOption();
            }}
          >
            重置
          </Button>
        </Space>
        <TsEditor
          width={`${editorWidth}px`}
          value={
            editingOption || obj2str(optionsForEdit, { prefix: "option = " })
          }
          onChange={(v) => {
            setEditingOption(v);
          }}
        />
      </div>
    );

    useEffect(() => {
      if (chartOption?.dataset) {
        readOptionsFromString(userChartOptionStr);
      }
    }, [userChartOptionStr, chartOption]);

    if (data?.logicform.groupby?.length > 2) return notSupportedResult;
    if (
      data?.logicform.groupby?.length === 2 &&
      data?.logicform.preds.length >= 2
    )
      return notSupportedResult;

    return (
      <div
        className="ze-chart"
        data-testid="ZEChart"
        style={{ display: "flex" }}
      >
        <div
          onClick={() => {
            if (type === "map") {
              onDbClick(null, data, true);
            }
          }}
        >
          {chartDom}
        </div>
        {editMode && editComponent}
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
