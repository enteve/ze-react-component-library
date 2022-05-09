import { PropertyType, drilldownLogicform } from "zeroetp-api-sdk";
import type { ZEChartProps } from "./ZEChart.types";
import { useRef, useCallback } from "react";
import moment, { Moment } from "moment";
import { formatWithProperty, getFormatter } from "../util";

export function useDrillDownDbClick(
  props: Pick<ZEChartProps, "logicform" | "onChangeLogicform"> & {
    back: () => void;
  }
) {
  const clickRef = useRef<Moment>();
  const { logicform, onChangeLogicform, back } = props;

  const onDbClick = useCallback(
    (item: any, data: any, triggerBack?: boolean) => {
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
        // N/A值处理成{ $exists: false }
        const query = drilledLF?.query;
        if (query) {
          const _query = { ...query };
          Object.keys(query).forEach((k) => {
            if (query[k] === "N/A") {
              _query[k] = { $exists: false };
            }
          });
          drilledLF.query = _query;
        }
        if (drilledLF) {
          onChangeLogicform(drilledLF);
        }
      } else {
        console.error("item不存在");
      }
      clickRef.current = current;
    },
    [JSON.stringify({ logicform }), back, onChangeLogicform]
  );

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
    properties.forEach((property, index) => {
      let unit: any = property.unit;
      const formatter = getFormatter(property, d?.data?.[property.name]);
      if (formatter) {
        unit = `${formatter.prefix}${unit}${formatter.postfix}`;
      }

      itemTip = `${itemTip}${(data[index] || d)?.marker}${property.name}
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
