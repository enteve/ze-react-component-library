// Generated with util/create-component.js
import React from "react";
import ZETable from "./ZETable";
import { Tag } from "antd";
import { config } from "zeroetp-api-sdk";
import "antd/dist/antd.css";
import "./ZETable.stories.less";

export default {
  title: "ZETable",
};

config.API_URL = "https://admin.xuetaifeng.com";
localStorage.token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MGJmMmFlOTNmNWUzZDdmM2FjM2MzYzAiLCJpYXQiOjE2MjMxNDExMzMsImV4cCI6MTYyMzc0NTkzM30.9js_H8jJPVfxWDI5JhoGeIspKxZQtSY8K81l6sRn7Gs";
// config.API_URL = "http://localhost:3052";

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
    preds={["公司全称", "名称"]}
  />
);

export const AdditionalColumns = () => (
  <ZETable
    logicform={{
      schema: "dealer",
    }}
    preds={["名称", "公司全称", "操作"]}
    customRender={{
      操作: (v: any, record: any) => (
        <span
          className="link primary"
          onClick={() => {
            console.log(record);
          }}
        >
          查看详情
        </span>
      ),
    }}
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

export const ClassName = () => (
  <ZETable
    logicform={{
      schema: "dealer",
    }}
    className="t"
  />
);

export const TitleMap = () => (
  <ZETable
    logicform={{
      schema: "dealer",
    }}
    titleMap={{ 名称: "供应商" }}
  />
);

export const CloseScroll = () => (
  <ZETable
    logicform={{
      schema: "dealer",
    }}
    scroll={null}
  />
);

export const Pagination = () => (
  <ZETable
    logicform={{
      schema: "order",
      limit: 1,
    }}
  />
);

export const Image = () => (
  <ZETable
    logicform={{
      schema: "product",
      limit: -1,
    }}
  />
);

export const FiltersWithLFQuery = () => (
  <ZETable
    logicform={{
      schema: "product",
      query: { 名称: { $regex: "联名礼盒" } },
      limit: -1,
    }}
  />
);
