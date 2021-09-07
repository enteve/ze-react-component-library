import { StatisticCard } from "@ant-design/pro-card";
import type { StatisticProps } from "@ant-design/pro-card";
import React from "react";
import { LogicformAPIResultType, LogicformType } from "zeroetp-api-sdk";

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
  const valueName = logicform.name || "";
  let unit = "";
  if (data?.columnProperties?.length > 0) {
    const [firstColProp] = data.columnProperties;
    if (firstColProp.unit) {
      unit = firstColProp.unit;
    }
  }

  const statistic: StatisticProps = {
    value: data.result,
    title: valueName,
    suffix: unit,
  };

  // Recommender
  if (showRecommender) {
    statistic.description = (
      <>
        <Statistic title="周同比" value="6.47%" trend="up" />
        <Statistic title="月同比" value="6.47%" trend="down" />
        <Statistic title="年同比" value="2.47%" trend="up" />
      </>
    );
  }

  return <StatisticCard style={{ margin: -24 }} statistic={statistic} />;
};

export default ValueDisplayer;
