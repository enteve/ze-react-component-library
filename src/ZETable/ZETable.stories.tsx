// Generated with util/create-component.js
import React from "react";
import ZETable from "./ZETable";
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
