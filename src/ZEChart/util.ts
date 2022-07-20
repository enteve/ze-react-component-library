import { drilldownLogicform } from "zeroetp-api-sdk";
import type { ZEChartProps } from "./ZEChart.types";
import { useRef, useCallback } from "react";
import moment, { Moment } from "moment";

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

export function formatChartOptionGrid(options: any) {
  if (options?.series?.[0]?.type === "map") {
    return options;
  }

  const needTopSpace =
    options?.legend &&
    !("bottom" in options.legend) &&
    !("left" in options.legend) &&
    !("right" in options.legend);

  const needBottomSpace =
    (options?.legend && "bottom" in options.legend) ||
    options?.visualMap?.orient === "horizontal";

  const needRightSapce = options?.xAxis?.name !== undefined;

  return {
    ...options,
    grid: {
      containLabel: true,
      top: needTopSpace ? 35 : 12,
      bottom: needBottomSpace ? 35 : 0,
      left: 0,
      right: 30,
    },
  };
}
