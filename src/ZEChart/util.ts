import {
  getNameProperty,
  LogicformAPIResultType,
  PropertyType,
  SchemaType,
} from "zeroetp-api-sdk";
import numeral from "numeral";
import type { ZEChartProps } from "./ZEChart.types";
import { useRef } from "react";
import moment, { Moment } from "moment";
import { drilldownLogicform, customValueTypes } from "../util";

// 这个namekey用来给chart
export const getNameKeyForChart = (logicform, data: LogicformAPIResultType) => {
  if (!logicform.groupby) throw new Error("[getNameKeyForData]必须要有Groupby");
  if (!logicform.preds || logicform.preds.length === 0)
    throw new Error("[getNameKeyForData]必须要有Preds");
  if (Array.isArray(logicform.groupby) && logicform.groupby.length > 1)
    throw new Error("[getNameKeyForData]只支持一维分组");

  let nameProp = data.columnProperties[0];
  const ret = [nameProp.name];

  if (nameProp.type === "object" && nameProp.schema) {
    const nameProp2 = getNameProperty(nameProp.schema);
    ret.push(nameProp2.name);
  }

  return ret;
};

export const formatChartData = ({
  data,
  valueKey,
  valueName,
  coloringMap,
  showLabel,
  preds,
  isBar,
  properties,
  schema,
}: {
  data: any[];
  valueKey: string;
  valueName?: (i: any) => string;
  preds: any;
  showLabel?: boolean;
  coloringMap?: (record: any) => string;
  isBar?: boolean;
  properties?: PropertyType[];
  schema?: SchemaType;
}) => {
  return data.map((d) => {
    const weight = d[valueKey] / Math.max(...data.map((m) => m[valueKey]));
    return {
      name: valueName ? valueName(d) : undefined,
      value: d[valueKey],
      itemStyle: {
        color: coloringMap?.(d),
      },
      label: isBar
        ? {
            show: showLabel,
            position: weight > 0.5 ? "inside" : "right",
            formatter: (p) => `${p.name}`,
            color: weight > 0.5 ? "#fff" : "#000",
            fontWeight: "bolder",
          }
        : undefined,
      ...d,
      preds,
      properties,
      schema,
    };
  });
};

export function useDrillDownDbClick(
  props: Pick<ZEChartProps, "logicform" | "onChangeLogicform"> & { data: any }
) {
  const clickRef = useRef<Moment>();
  const { logicform, onChangeLogicform, data } = props;

  const onDbClick = (item: any) => {
    const current = moment();
    if (
      !clickRef.current ||
      current.diff(clickRef.current, "millisecond") > 200 ||
      !data?.schema ||
      !onChangeLogicform
    ) {
      clickRef.current = current;
      return;
    }
    if (item) {
      // 下钻
      const drilledLF = drilldownLogicform(logicform, data.schema, item);
      if (drilledLF) {
        onChangeLogicform(drilledLF);
      }
    } else {
      console.error("item不存在");
    }
    clickRef.current = current;
  };

  return { onDbClick };
}

export function chartTooltipFormatter(params: any): string {
  let res: string = "";
  if (!params) {
    return res;
  }
  const data: any[] = params instanceof Array ? params : [params];
  data.slice(0, 1).forEach((d) => {
    let itemTip = d.name ? `${d.name} <br />` : "";
    d?.data?.preds?.forEach((f) => {
      const property: PropertyType | undefined = d.data?.properties?.find(
        (i) => i?.name === f?.name
      );

      let render = (v) => v;
      if (property?.primal_type === "number") {
        // 默认千分位分割、保留两位小数
        render = (v) => numeral(v).format("0,0.00");
        // 根据type格式化
        if (d.data.schema) {
          let typeRender = customValueTypes(d.data.schema)[property.type]
            ?.render;
          if (!typeRender)
            typeRender = customValueTypes(d.data.schema)[property.primal_type]
              ?.render;
          if (typeRender) {
            render = typeRender;
          }
        }
        // 根据ui的formatter格式化，优先级最高
        if (property.ui?.formatter) {
          render = (v) => numeral(v).format(property.ui.formatter);
        }
      }
      itemTip = `${itemTip}${d?.marker}${
        f.name
      } <span style="float:right;margin-left:20px;font-size:14px;color:#666;font-weight:900">${render(
        d?.data?.[f.name]
      )}</span><br />`;
    });
    res = `${res}${itemTip}`;
  });
  return res;
}
