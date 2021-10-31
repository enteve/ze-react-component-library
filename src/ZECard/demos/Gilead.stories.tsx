// Generated with util/create-component.js
import React from "react";
import numeral from "numeral";
import ZECard from "../ZECard";
import { StatisticCard } from "@ant-design/pro-card";
import "antd/dist/antd.css";

const { Statistic } = StatisticCard;

// prepare server
import {
  AskAPIResultType,
  config,
  getLogicformByTimeOffset,
} from "zeroetp-api-sdk";
import { useRequest } from "@umijs/hooks";
import { requestRecommend, requestAsk } from "../../request";
import { Button, message, Progress, Skeleton, Space } from "antd";
import ZELogicform from "../../ZELogicform";
import prepareServerForStories from "../../../util/prepareServerForStories";

prepareServerForStories();
export default {
  title: "Gilead",
};

export const MapCard = () => {
  return (
    <ZECard
      logicform={{
        schema: "ddi_sales",
        query: { 日期: "MTD" },
        operator: "$sum",
        pred: "销量",
      }}
      visualizerProps={{
        filters: {
          产品_TA: {
            support_all: true,
            distincts: ["HIV", "HBV", "HCV"],
          },
        },
      }}
      showRecommender
      askMore={(question) => message.info(`ASK: ${question}`)}
      mainContent={(logicform) => {
        const momLF = getLogicformByTimeOffset(logicform, {
          日期: { $offset: { month: -1 } },
        });
        return (
          <>
            <div>{JSON.stringify(logicform)}</div>
            <div>{JSON.stringify(momLF)}</div>
          </>
        );
      }}
    />
  );
};
