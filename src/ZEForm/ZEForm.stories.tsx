// Generated with util/create-component.js
import React from "react";
import ZEForm from "./ZEForm";
import { Tag } from "antd";
import { config } from "zeroetp-api-sdk";
import "antd/dist/antd.css";
import { ProFormColumnsType } from "@ant-design/pro-form";

export default {
  title: "ZEForm",
};

config.API_URL = "https://admin.xuetaifeng.com";
localStorage.token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MGJmMmFlOTNmNWUzZDdmM2FjM2MzYzAiLCJpYXQiOjE2MjMxNDExMzMsImV4cCI6MTYyMzc0NTkzM30.9js_H8jJPVfxWDI5JhoGeIspKxZQtSY8K81l6sRn7Gs";
// config.API_URL = "http://localhost:3052";

const onFinish = async (formData: any) => {
  console.log(formData);
};

export const Product = () => <ZEForm schemaID="product" onFinish={onFinish} />;
export const Dealer = () => <ZEForm schemaID="dealer" onFinish={onFinish} />;
export const Order = () => <ZEForm schemaID="order" onFinish={onFinish} />;

export const DealerCompose = () => {
  /**
   * Width的设置
   * @type auto 使用组件默认的宽度
   * @type xs=104px 适用于短数字、短文本或选项。
   * @type sm=216px 适用于较短字段录入、如姓名、电话、ID 等。
   * @type md=328px 标准宽度，适用于大部分字段长度。
   * @type lg=440px 适用于较长字段录入，如长网址、标签组、文件路径等。
   * @type xl=552px 适用于长文本录入，如长链接、描述、备注等，通常搭配自适应多行输入框或定高文本域使用。
   */
  const columns: ProFormColumnsType[] = [
    {
      valueType: "group",
      columns: [
        {
          title: "公司简称",
          dataIndex: "名称",
          width: "lg",
        },
        {
          title: "公司全称",
          dataIndex: "公司全称",
          width: "lg",
        },
      ],
    },
    {
      title: "公司简称",
      dataIndex: "名称",
      width: "lg",
    },
    {
      title: "公司备注",
      dataIndex: "公司备注",
      width: "lg",
    },
  ];
  return (
    <>
      <h3>自定义排版</h3>
      <ZEForm schemaID="dealer" onFinish={onFinish} columns={columns} />
    </>
  );
};
