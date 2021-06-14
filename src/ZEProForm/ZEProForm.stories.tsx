import React from "react";
import ZEProForm from "./index";
import { FooterToolbar } from "@ant-design/pro-layout";
import { Divider } from "antd";
export default {
  title: "ZEProForm",
};

export const Basic = () => (
  <ZEProForm
    schemaID="order"
    onFinish={async (values) => {
      console.log(values);
    }}
    layout="horizontal"
    labelCol={{ span: 4 }}
    submitter={{
      render: (_, dom) => {
        console.log(dom);
        return (
          <FooterToolbar>
            <div>sla</div>
            <div>sla1</div>
            {dom[1]}
          </FooterToolbar>
        );
      },
    }}
  >
    <ZEProForm.Item></ZEProForm.Item>
    <Divider />
  </ZEProForm>
);
