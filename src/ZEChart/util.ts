import { getNameProperty, LogicformAPIResultType } from "zeroetp-api-sdk";
import type { ZEChartProps } from "./ZEChart.types";
import { useRef } from "react";
import moment, { Moment } from "moment";
import { drilldownLogicform } from "../util";

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

export const formatBarData = (data: any[], valueKey: string, preds: any, showLabel?: boolean, coloringMap?: (record: any) => string) => {
  return data.map((d) => {
    const weight = d[valueKey] / Math.max(...data.map(m => m[valueKey]));
    return {
      value: d[valueKey],
      itemStyle: {
        color: coloringMap?.(d),
      },
      label: {
        show: showLabel,
        position: weight > 0.5 ? "inside" : "right",
        formatter: (p) => `${p.name}`,
        color: weight > 0.5 ? "#fff" : "#000",
        fontWeight: "bolder",
      },
      ...d,
      preds,
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

// 千分位分割
export function toThousands(param) {
  if (!param) return 0;
  const n = param.toString().split('.');
  if (n.length > 1) {
    return `${(n[0] || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')}.${n[1]}`;
  }
  return (n[0] || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
}

export function chartTooltipFormatter(params: any): string {
  let res: string = '';
  if (!params) {
    return res;
  }
  const data: any[] = params instanceof Array ? params : [params];
  data.forEach(d => {
    let itemTip = '';
    d?.data?.preds?.forEach(f => {
      itemTip = `${itemTip}${d?.marker}${f.name}: <span style="font-weight: bolder;">${toThousands(d?.data?.[f.name])}</span><br />`
    })
    res = `${res}${itemTip}`
  })
  return res;
}
