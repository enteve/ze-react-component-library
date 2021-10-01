// Generated with util/create-component.js
import React, { useState } from "react";
import moment from "moment";
import ZECard from "../ZECard";
import ProCard, { StatisticCard } from "@ant-design/pro-card";
import "antd/dist/antd.css";

const { Statistic } = StatisticCard;

// prepare server
import prepareServerForStories from "../../../util/prepareServerForStories";
import { LogicformAPIResultType, LogicformType } from "zeroetp-api-sdk";
import { useRequest } from "@umijs/hooks";
import { requestLogicform } from "../../request";
import ZEValue from "../../ZEValue";
import ValueDisplayer from "../ValueDisplayer";
import { Progress, Space } from "antd";
prepareServerForStories();

export default {
  title: "Gilead",
};

// 本质上是去分析Logicform，然后根据logicform决定ZECard的UI
const GLDCard = (logicform: LogicformType) => {
  // Warning
  let warning: string;
  if (logicform.operator === "$sum") {
    warning = "跨产品的销量不具备参考价值，优先显示销售额";
  }

  // 分析Logicform，如果是一个value类型的，那么三个都要算
  let mainContent: React.ReactNode;
  if (logicform.operator === "$sum") {
    mainContent = (
      <>
        <Space direction="vertical">
          <div>
            <h3>销售额</h3>
            <ZECard
              showMainContentOnly
              logicform={{
                ...logicform,
                pred: "销售额",
              }}
            />
            <Space>
              <Statistic
                title="上月同期"
                value={ZEValue({
                  schema: "ddi_sales",
                  operator: "$sum",
                  pred: "销售额",
                  query: {
                    日期: { $offset: { month: -2 } },
                  },
                })}
                suffix="万元"
              />

              <Statistic
                title="环比"
                value={ZEValue({
                  schema: "ddi_sales",
                  operator: "$mom",
                  pred: "销售额",
                  query: {
                    日期: { $offset: { month: -2 } },
                  },
                })}
                trend="up"
              />
            </Space>
          </div>

          <div>
            <h3>销量</h3>
            <ZECard
              showMainContentOnly
              logicform={{
                ...logicform,
                pred: "销量",
              }}
            />

            <Space>
              <Statistic
                title="上月同期"
                value={ZEValue({
                  schema: "ddi_sales",
                  operator: "$sum",
                  pred: "销量",
                  query: {
                    日期: { $offset: { month: -2 } },
                  },
                })}
                suffix="瓶"
              />

              <Statistic
                title="环比"
                value={ZEValue({
                  schema: "ddi_sales",
                  operator: "$mom",
                  pred: "销量",
                  query: {
                    日期: { $offset: { month: -2 } },
                  },
                })}
                trend="up"
              />
            </Space>
          </div>

          <div>
            <h3>达成率</h3>
            <ZECard
              showMainContentOnly
              logicform={{
                ...logicform,
                operator: "达成率",
              }}
            />
            <Statistic
              title="目标"
              value={ZEValue({
                schema: "ddi_sales_target",
                operator: "$sum",
                pred: "销量指标",
                query: {
                  日期: { $offset: { month: -2 } },
                },
              })}
              suffix="瓶"
            />
            <Progress
              percent={20}
              status="exception"
              showInfo={false}
              strokeWidth={20}
            />
          </div>
        </Space>
      </>
    );
  }

  return (
    <ZECard
      title="9月份销量"
      warning={warning}
      logicform={logicform}
      visualizerDisplayProp={{
        preds: false,
        schema: false,
      }}
      mainContent={mainContent}
    />
  );
};

export const BasicCard = () => {
  return GLDCard({
    schema: "ddi_sales",
    operator: "$sum",
    pred: "销量",
    query: {
      日期: { $offset: { month: -1 } },
    },
  });
};

export const MapCard = () => {
  return GLDCard({
    schema: "ddi_sales",
    preds: [
      {
        operator: "$sum",
        pred: "销量",
        name: "总销量",
      },
    ],
    query: {
      日期: { $offset: { year: 0 } },
    },
    groupby: { _id: "客户_地理位置", level: "省市" },
  });
};
