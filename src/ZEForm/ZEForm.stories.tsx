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

export const Product = () => <ZEForm schemaID="product" />;
export const Dealer = () => <ZEForm schemaID="dealer" />;
export const Order = () => <ZEForm schemaID="order" />;
