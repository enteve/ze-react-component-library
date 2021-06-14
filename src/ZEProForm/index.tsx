import React from "react";
import ProForm, { ProFormText } from "@ant-design/pro-form";
import { ColProps, Divider } from "antd";
import {
  BasicLayout,
  FooterToolbar,
  PageContainer,
} from "@ant-design/pro-layout";
import type { ZEProFromProps, ZEProFromItemProps } from "./ZEProForm.types";
import { customValueTypes } from "../util";
import { useRequest } from "@umijs/hooks";
import { request } from "../request";
import { getSchemaByID, SchemaAPIResultType } from "zeroetp-api-sdk";

export const Item = ({
  schema,
  propertyName,
  ...props
}: ZEProFromItemProps) => {
  const property = schema.properties.find((p) => p.name === propertyName);
  console.log(schema.properties);
  console.log(property);

  const renderFormItem = customValueTypes(schema)[property.type];
  if (renderFormItem) {
    return renderFormItem(null, props);
  }

  return <ProFormText {...props} />;
};

export default ({ schemaID }: ZEProFromProps) => {
  const { data } = useRequest<SchemaAPIResultType>(() =>
    request(getSchemaByID(schemaID))
  );

  if (!data) return <div></div>;

  const { schema } = data;

  return (
    <ProForm
      onFinish={async (values) => {
        console.log(values);
      }}
      layout="horizontal"
      labelCol={{ span: 4 }}
      submitter={{
        render: (_, dom) => {
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
      <Item schema={schema} propertyName="金额" />
      <ProFormText width="sm" name="id" label="主合同编号" />
      <ProFormText width="sm" name="id2" label="主合同编号2" />
      <Divider />
      <ProFormText name="id3" label="主合同编号3" />
    </ProForm>
  );
};
