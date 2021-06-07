// Generated with util/create-component.js
import React from "react";
import ZETable from "./ZETable";
import { Tag } from "antd";
import { config } from "zeroetp-api-sdk";
import "antd/dist/antd.css";

export default {
  title: "ZETable",
};

config.API_URL = "http://localhost:3052";

export const Normal = () => (
  <ZETable
    logicform={{
      schema: "dealer",
    }}
  />
);

export const PredsSelection = () => (
  <ZETable
    logicform={{
      schema: "dealer",
    }}
    preds={["名称", "公司全称"]}
  />
);

export const AdditionalColumns = () => (
  <ZETable
    logicform={{
      schema: "dealer",
    }}
    preds={["名称", "公司全称"]}
    additionalColumns={[
      {
        dataIndex: "",
        title: "操作",
        render: (v: any, record: any) => (
          <span
            className="link primary"
            onClick={() => {
              console.log(record);
            }}
          >
            查看详情
          </span>
        ),
      },
    ]}
  />
);

export const CustomRender = () => (
  <ZETable
    logicform={{
      schema: "dealer",
    }}
    preds={["名称", "公司全称", "状态"]}
    customRender={{
      状态: (v: any) => {
        return (
          <Tag color="green" style={{ width: 52, textAlign: "center" }}>
            {v}
          </Tag>
        );
      },
    }}
  />
);
