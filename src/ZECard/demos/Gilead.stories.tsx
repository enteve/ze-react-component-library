// Generated with util/create-component.js
import React, { useState } from "react";
import moment from "moment";
import numeral from "numeral";
import ZECard from "../ZECard";
import ProCard, { StatisticCard } from "@ant-design/pro-card";
import "antd/dist/antd.css";

const { Statistic } = StatisticCard;

// prepare server
import prepareServerForStories from "../../../util/prepareServerForStories";
import {
  AskAPIResultType,
  LogicformAPIResultType,
  LogicformType,
} from "zeroetp-api-sdk";
import { useRequest } from "@umijs/hooks";
import { requestRecommend, requestAsk } from "../../request";
import ZEValue from "../../ZEValue";
import ValueDisplayer from "../ValueDisplayer";
import { Button, message, Progress, Skeleton, Space } from "antd";
prepareServerForStories();

export default {
  title: "Gilead",
};

// 本质上是去分析Logicform，然后根据logicform决定ZECard的UI
const GLDCard = (question: string) => {
  let warning: string;
  let mainContent: React.ReactNode;
  let recommender: React.ReactNode;

  const { data: logicform, loading } = useRequest<AskAPIResultType>(
    () => requestAsk(question),
    {
      formatResult: (res) => res.logicform,
      refreshDeps: [question],
    }
  );

  const { data: recommends } = useRequest(
    () => {
      if (!logicform) {
        return new Promise((resolve) => resolve({ recommends: [] }));
      }

      return requestRecommend(logicform);
    },
    {
      initialData: [],
      formatResult: (res: any) => res.recommends,
      refreshDeps: [logicform],
    }
  );

  if (logicform) {
    if (logicform.operator === "$sum") {
      // Warning
      warning = "跨产品的销量不具备参考价值，优先显示销售额";

      // 分析Logicform，如果是一个value类型的，那么三个都要算
      mainContent = (
        <>
          <Space direction="vertical" size="large">
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
                {/* <Statistic
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
                /> */}

                {/* <Statistic
                  title="环比"
                  value={ZEValue({
                    schema: "ddi_sales",
                    operator: "$mom",
                    pred: "销售额",
                    query: {
                      日期: { $offset: { month: -2 } },
                    },
                  })}
                  formatter={(value: any) => numeral(value).format("0.0%")}
                  trend="up"
                /> */}
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
                {/* <Statistic
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
                /> */}

                {/* <Statistic
                  title="环比"
                  value={ZEValue({
                    schema: "ddi_sales",
                    operator: "$mom",
                    pred: "销量",
                    query: {
                      日期: { $offset: { month: -2 } },
                    },
                  })}
                  formatter={(value: any) => numeral(value).format("0.0%")}
                  trend="up"
                /> */}
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
              {/* <Statistic
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
              /> */}
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
  }

  if (recommends.length > 0) {
    recommender = (
      <>
        <h3>您还可以这样问：</h3>
        <ul>
          {recommends.map((r) => (
            <li key={r}>
              <Button
                type="link"
                onClick={() => {
                  message.info("ask next question");
                }}
              >
                {`${r}${question}`}
              </Button>
            </li>
          ))}
        </ul>
      </>
    );
  }

  return (
    <Skeleton loading={loading}>
      <ZECard
        title={question}
        warning={warning}
        logicform={logicform}
        visualizerDisplayProp={{
          preds: false,
          schema: false,
        }}
        mainContent={mainContent}
        footer={recommender}
      />
    </Skeleton>
  );
};

export const BasicCard = () => {
  return GLDCard(
    // {
    //   schema: "ddi_sales",
    //   operator: "$sum",
    //   pred: "销量",
    //   query: {
    //     日期: { $offset: { month: -1 } },
    //   },
    // },
    "上个月销量"
  );
};

export const MapCard = () => {
  return GLDCard(
    // {
    //   schema: "ddi_sales",
    //   preds: [
    //     {
    //       operator: "$sum",
    //       pred: "销量",
    //       name: "总销量",
    //     },
    //   ],
    //   query: {
    //     日期: { $offset: { year: 0 } },
    //   },
    //   groupby: { _id: "客户_地理位置", level: "省市" },
    // },
    "今年各省市销量"
  );
};
