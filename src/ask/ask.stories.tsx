// Generated with util/create-component.js
import { ArrowUpOutlined } from "@ant-design/icons";
import { Card, Statistic } from "antd";
import React from "react";
import ask from "./index";

// prepare server
import prepareServerForStories from "../../util/prepareServerForStories";
prepareServerForStories();

export default {
  title: "ZEAsk",
};

export const Ask = () => (
  <>
    <h2>近一年易问订单数量</h2>
    <div>{ask("近一年易问订单数量")}</div>
  </>
);

export const WithAntdCard = () => (
  <>
    <Card>
      <Statistic
        title="Active"
        value={ask("近一年易问订单数量")}
        precision={2}
        valueStyle={{ color: "#3f8600" }}
        prefix={<ArrowUpOutlined />}
        suffix="%"
      />
    </Card>
  </>
);
