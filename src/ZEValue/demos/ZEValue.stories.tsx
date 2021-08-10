// Generated with util/create-component.js
import { ArrowUpOutlined } from "@ant-design/icons";
import { Card, Statistic } from "antd";
import React from "react";
import ZEValue from "../index";

// prepare server
import prepareServerForStories from "../../../util/prepareServerForStories";
prepareServerForStories();

export default {
  title: "ZEValue",
};

export const Basic = () => (
  <>
    <h2>总订单数量</h2>
    <div>
      {ZEValue({
        schema: "productsale",
        operator: "$count",
        pred: "订单编号",
      })}
    </div>
  </>
);

export const WithAntdCard = () => (
  <>
    <Card>
      <Statistic
        title="Active"
        value={ZEValue({
          schema: "productsale",
          operator: "$count",
          pred: "订单编号",
        })}
        precision={2}
        valueStyle={{ color: "#3f8600" }}
        prefix={<ArrowUpOutlined />}
        suffix="%"
      />
    </Card>
  </>
);
