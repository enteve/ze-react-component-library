// Generated with util/create-component.js
import React from "react";
import ZEForm from "./ZEForm";
import { Tag } from "antd";
import { config } from "zeroetp-api-sdk";
import "antd/dist/antd.css";

export default {
  title: "ZEForm",
};

config.API_URL = "http://localhost:3052";

const onFinish = async (formData: any) => {
  console.log(formData);
};

export const Product = () => <ZEForm schemaID="product" onFinish={onFinish} />;
export const Dealer = () => <ZEForm schemaID="dealer" onFinish={onFinish} />;
export const Order = () => <ZEForm schemaID="order" onFinish={onFinish} />;
