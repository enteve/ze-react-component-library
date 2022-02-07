// Generated with util/create-component.js
import React from "react";
import ZESchemaForm from "../ZESchemaForm";
import { Divider } from "antd";
import "antd/dist/antd.css";
import { FooterToolbar } from "@ant-design/pro-layout";
import StoryBookUseCaseDescription from "../../StoryBookUseCaseDescription";

// prepare server
import prepareServerForStories from "../../../util/prepareServerForStories";
import { ZESchemaFormColumnType } from "../ZESchemaForm.types";
prepareServerForStories();

export default {
  title: "ZESchemaForm",
};

const onFinish = async (formData: any) => {
  console.log(formData);
};

export const AutoFormWithSchema = () => (
  <StoryBookUseCaseDescription info="根据Schema生成Form">
    <ZESchemaForm schemaID="product" onFinish={onFinish} />
  </StoryBookUseCaseDescription>
);

export const FormCompose = () => {
  /**
   * Width的设置
   * @type auto 使用组件默认的宽度
   * @type xs=104px 适用于短数字、短文本或选项。
   * @type sm=216px 适用于较短字段录入、如姓名、电话、ID 等。
   * @type md=328px 标准宽度，适用于大部分字段长度。
   * @type lg=440px 适用于较长字段录入，如长网址、标签组、文件路径等。
   * @type xl=552px 适用于长文本录入，如长链接、描述、备注等，通常搭配自适应多行输入框或定高文本域使用。
   */
  const columns: ZESchemaFormColumnType[] = [
    {
      valueType: "group",
      columns: [
        {
          title: "产品名称",
          dataIndex: "名称",
          width: "lg",
        },
        {
          title: "产品品类",
          dataIndex: "品类",
          valueType: "select",
          width: "lg",
        },
      ],
    },
    {
      renderFormItem: () => <Divider />,
    },
    {
      valueType: "group",
      columns: [
        {
          title: "产品价格",
          dataIndex: "价格",
          width: "md",
        },
        {
          title: "产品成本",
          dataIndex: "成本",
          width: "md",
        },
      ],
    },
  ];

  return (
    <StoryBookUseCaseDescription info="Form排版">
      <ZESchemaForm
        schemaID="product"
        onFinish={onFinish}
        columns={columns}
        submitter={{
          render: (_, dom) => {
            return <FooterToolbar>{dom[1]}</FooterToolbar>;
          },
        }}
      />
    </StoryBookUseCaseDescription>
  );
};

export const Update = () => (
  <StoryBookUseCaseDescription info="initialValues">
    <ZESchemaForm
      schemaID="sales"
      onFinish={onFinish}
      initialValues={{
        日期: "2021-06-11",
        产品: { _id: "P001", 名称: "美丽无敌女长袖" }, // Object的，是一个object
        渠道: "京东",
      }}
    />
  </StoryBookUseCaseDescription>
);

// 可以做readOnly和valueType的自定义
// columns里面也可以达到同样的效果。此处这功能是为了方便不用columns的时候用的。
export const PropertyConfig = () => (
  <StoryBookUseCaseDescription info="readOnly和valueType的自定义（不通过columns）">
    <ZESchemaForm
      schemaID="sales"
      onFinish={onFinish}
      propertyConfig={{
        日期: { readonly: true, valueType: "date" },
        渠道: { valueType: "select" },
      }}
      initialValues={{
        日期: "2021-06-11",
      }}
    />
  </StoryBookUseCaseDescription>
);

export const HierarchyProperty = () => (
  <StoryBookUseCaseDescription info="Hierarchy类型的Property">
    <ZESchemaForm
      schemaID="store"
      onFinish={onFinish}
      columns={[
        {
          title: "所在地址",
          dataIndex: "地址",
        },
      ]}
      initialValues={{
        地址: { _id: "08614101", name: "郑州市", code: "08614101" },
      }}
    />
  </StoryBookUseCaseDescription>
);

export const LayoutType = () => (
  <ZESchemaForm
    schemaID="user"
    layoutType="DrawerForm"
    trigger={<a>点击我</a>}
  />
);

export const PropertyWithEditableTable = () => (
  <StoryBookUseCaseDescription info="property可以是一个ObjectArrayTable。值得注意的是，dataIndex里面带有.的字段无法被编辑">
    <ZESchemaForm
      schemaID="product"
      onFinish={onFinish}
      columns={[
        {
          dataIndex: "编号",
        },
        {
          title: "子商品",
          dataIndex: "子商品列表",
          valueType: "table",
          fieldProps: { placeholder: "新增商品" },
          columns: [
            {
              title: "商品编号",
              dataIndex: "子商品.编号",
            },
            {
              title: "商品名称",
              dataIndex: "子商品",
              fieldProps: { query: { 分类: "单品" } },
            },
            {
              title: "数量",
              dataIndex: "数量",
              valueType: "digit",
            },
            {
              title: "操作",
              valueType: "option",
            },
          ],
        },
      ]}
    />
  </StoryBookUseCaseDescription>
);
