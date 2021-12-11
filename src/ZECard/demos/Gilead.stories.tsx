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

// TO ADD TO TEST
// 下面2个是测试UI formatters。以后放到统一的测试环境里去
export const UIFormatters1 = () => {
  return (
    <ZECard
      logicform={{
        schema: "ddi_sales",
        operator: "$sum",
        query: { TS_姓名: "汪文俊" },
        pred: "salesQty",
      }}
    />
  );
};

// 和上面为一组
export const UIFormatters2 = () => {
  return (
    <ZECard
      logicform={{
        schema: "ddi_sales",
        operator: "$sum",
        pred: "salesQty",
        query: {
          ID: "080DFF37D6560834C2333415BDAC58",
        },
      }}
    />
  );
};

// 要保证每列数据的formatter都一致
export const UIFormattersTable = () => {
  return (
    <ZECard
      logicform={{
        schema: "ddi_sales",
        preds: [
          {
            name: "数量",
            operator: "$sum",
            pred: "salesQty",
          },
        ],
        groupby: "TS",
      }}
    />
  );
};

export const UIFormattersTable2 = () => {
  return (
    <ZECard
      logicform={{
        schema: "ddi_sales",
        preds: [
          {
            name: "数量",
            operator: "$sum",
            pred: "salesQty",
          },
        ],
        query: {
          日期: "MTD",
        },
        groupby: "TS",
      }}
    />
  );
};
