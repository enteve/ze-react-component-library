import React from "react";
import { useRequest } from "@umijs/hooks";
import { requestLogicform } from "../request";
import type { LogicformAPIResultType, LogicformType } from "zeroetp-api-sdk";
import type { ZEDashboardProps } from "./ZEDashboard.types";
import { Card, Col, Row } from "antd";
import ZEValue from "../ZEValue";
import ZEAsk from "../ZEAsk";
import ZEChart from "../ZEChart";

const ZEDashboard: React.FC<ZEDashboardProps> = () => {
  return (
    <>
      <Row gutter={10}>
        <Col span={6}>
          <Card title="本月销售额">
            {ZEAsk("本月销售额") || 0}
            <br />
            周同比：{ZEAsk("本周销售额") / ZEAsk("上周销售额") - 1}
          </Card>
        </Col>
        <Col span={6}>
          <Card>s</Card>
        </Col>
        <Col span={6}>
          <Card>s</Card>
        </Col>
        <Col span={6}>
          <Card>s</Card>
        </Col>
      </Row>
      <Row style={{ marginTop: 20 }}>
        <Card title="图表" style={{ width: "100%" }}>
          <ZEChart
            type="column"
            logicform={{
              query: {
                日期: {
                  $gte: { $offset: { month: -12 } },
                },
              },
              schema: "productsale",
              groupby: "$month",
              preds: [{ name: "amount", operator: "$sum", pred: "销售额" }],
            }}
            config={{
              xField: "_id",
              yField: "amount",
            }}
          />
        </Card>
      </Row>
    </>
  );
};

export default ZEDashboard;
