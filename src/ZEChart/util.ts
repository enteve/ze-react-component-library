import { PropertyType } from "zeroetp-api-sdk";
import type { ZEChartProps } from "./ZEChart.types";
import { useRef } from "react";
import moment, { Moment } from "moment";
import { drilldownLogicform, formatWithProperty, getFormatter } from "../util";

export function useDrillDownDbClick(
  props: Pick<ZEChartProps, "logicform" | "onChangeLogicform"> & {
    data: any;
    back: () => void;
  }
) {
  const clickRef = useRef<Moment>();
  const { logicform, onChangeLogicform, data, back } = props;

  const onDbClick = (item: any, triggerBack?: boolean) => {
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
    if (triggerBack) {
      back();
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
      let unit: any = property.unit;
      const formatter = getFormatter(property, d?.data?.[property.name]);
      if (formatter) {
        unit = `${formatter.prefix}${unit}`;
      }

      itemTip = `${itemTip}${d?.marker}${property.name}
      ${
        unit ? `(${unit})` : ""
      } <span style="float:right;margin-left:20px;font-size:14px;color:#666;font-weight:900">${formatWithProperty(
        property,
        d?.data?.[property.name]
      )}</span><br />`;
    });
    res = `${res}${itemTip}`;
  });
  return res;
}

export function formatChartOptionGrid(options: any) {
  if (options?.series?.[0]?.type === "map") {
    return options;
  }

  const needBottomSpace =
    (options?.legend && "bottom" in options.legend) ||
    options?.visualMap?.orient === "horizontal";

  const needRightSapce = options?.xAxis?.name !== undefined;

  return {
    ...options,
    grid: {
      containLabel: true,
      top: 12,
      bottom: needBottomSpace ? 35 : 0,
      left: 0,
      right: needRightSapce ? 50 : 0,
    },
  };
}
