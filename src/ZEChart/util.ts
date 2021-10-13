import { getNameProperty, LogicformAPIResultType } from "zeroetp-api-sdk";
import type { ZEChartProps } from './ZEChart.types';
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

export const formatBarData = (data: number[], showLabel?: boolean) => {
  return data.map(d => {
    const weight = d / Math.max(...data);
    return {
      value: d,
      label: {
        show: showLabel,
        position: weight > 0.5 ? 'inside' : 'right',
        formatter: p => `${p.name}`,
        color: weight > 0.5 ? '#fff' : '#000',
        fontWeight: 'bolder',
      }
    }
  })
}

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
      const drilledLF = drilldownLogicform(logicform, data.schema, item._id);
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
