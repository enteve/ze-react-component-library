import {
  getNameProperty,
  LogicformAPIResultType,
  PropertyType,
  SchemaType,
} from "zeroetp-api-sdk";
import type { ZEChartProps } from "./ZEChart.types";
import { useRef } from "react";
import moment, { Moment } from "moment";
import { drilldownLogicform, formatWithProperty } from "../util";

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

export function chartTooltipFormatter(
  params: any,
  properties: PropertyType[]
): string {
  let res: string = "";
  if (!params) {
    return res;
  }
  const data: any[] = params instanceof Array ? params : [params];
  data.slice(0, 1).forEach((d) => {
    let itemTip = d.name ? `${d.name} <br />` : "";
    properties.forEach((property) => {
      itemTip = `${itemTip}${d?.marker}${property.name}
      ${
        property.unit ? `(${property.unit})` : ""
      } <span style="float:right;margin-left:20px;font-size:14px;color:#666;font-weight:900">${formatWithProperty(
        property,
        d?.data?.[property.name]
      )}</span><br />`;
    });
    res = `${res}${itemTip}`;
  });
  return res;
}
