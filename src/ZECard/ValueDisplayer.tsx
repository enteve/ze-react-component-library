import { StatisticCard } from "@ant-design/pro-card";
import type { StatisticProps } from "@ant-design/pro-card";
import React from "react";
import { LogicformAPIResultType, LogicformType } from "zeroetp-api-sdk";
import ZEValue from "../ZEValue";

const { Statistic } = StatisticCard;

type Props = {
  logicform: LogicformType;
  data: LogicformAPIResultType;
  showRecommender?: boolean;
};

const ValueDisplayer: React.FC<Props> = ({
  logicform,
  data,
  showRecommender = false,
}) => {
  let unit = "";
  if (data?.columnProperties?.length > 0) {
    const [firstColProp] = data.columnProperties;
    if (firstColProp.unit) {
      unit = firstColProp.unit;
    }
  }

  const statistic: StatisticProps = {
    value: data.result,
    suffix: unit,
    precision: 1,
  };

  // Recommender
  if (showRecommender) {
    // 目前只对时间的环比做出反应
    if (logicform.operator === "$sum" && data.schema.type === "event") {
      const momValue = ZEValue(
        {
          ...logicform,
          operator: "$mom",
        },
        (v) => v * 100
      );
      const prop: any = {
        value: momValue,
      };
      if (typeof momValue === "number") {
        prop.value = Math.abs(momValue);
        if (momValue > 0) {
          prop.trend = "up";
        } else if (momValue < 0) {
          prop.trend = "down";
        }
      }

      statistic.description = (
        <Statistic title="环比" precision={1} suffix="%" {...prop} />
      );
    }
  }

  return <StatisticCard statistic={statistic} />;
};

export default ValueDisplayer;
