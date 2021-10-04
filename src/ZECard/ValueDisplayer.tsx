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
  let precision = 1;
  let value = data && "result" in data ? data.result : "-";
  if (data?.columnProperties?.length > 0) {
    const [firstColProp] = data.columnProperties;

    if (firstColProp.type === "percentage") {
      // 如果是百分比类型的呢
      unit = "%";
      value = value * 100;
    } else if (firstColProp.unit) {
      unit = firstColProp.unit;
    }

    // precision
    if (firstColProp.type === "int") {
      precision = 0;
    }
  }

  const statistic: StatisticProps = {
    value,
    suffix: unit,
    precision,
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
