// Generated with util/create-component.js
import React from "react";
import ZESchemaForm from "../ZESchemaForm";
import { createData } from "zeroetp-api-sdk";
import { Divider } from "antd";
import "antd/dist/antd.css";
import { ProFormColumnsType } from "@ant-design/pro-form";
import { FooterToolbar } from "@ant-design/pro-layout";

// prepare server
import prepareServerForStories from "../../../util/prepareServerForStories";
prepareServerForStories();

export default {
  title: "ZESchemaForm",
};

const onFinish = async (formData: any) => {
  console.log(formData);
};

export const Product = () => (
  <ZESchemaForm schemaID="product" onFinish={onFinish} />
);

export const ProductWithEditableTable = () => (
  <ZESchemaForm
    schemaID="product"
    onFinish={onFinish}
    columns={[
      {
        dataIndex: "子商品列表",
        valueType: "table",
        fieldProps: { placeholder: "新增产品" },
        columns: [
          {
            title: "商品编码",
            dataIndex: "子商品.编码",
          },
          {
            title: "商品名称",
            dataIndex: "子商品",
            fieldProps: { query: { 分类: { $in: ["单品", "耗材"] } } },
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
);

export const ProductWithEditableTableSupportEnums = () => (
  <ZESchemaForm
    schemaID="productMatchRule"
    columns={[
      { dataIndex: "名称", title: "规则名称" },
      {
        dataIndex: "匹配规则",
        title: "",
        valueType: "table",
        columns: [
          {
            dataIndex: "匹配规则",
            title: "匹配规则",
            valueType: "select",
          },
          {
            dataIndex: "数量",
            title: "数量",
            valueType: "digit",
          },
          {
            title: "操作",
            valueType: "option",
          },
        ],
      },
    ]}
    onFinish={onFinish}
  />
);
export const Dealer = () => (
  <ZESchemaForm schemaID="dealer" onFinish={onFinish} />
);
export const Order = () => (
  <ZESchemaForm schemaID="productsale" onFinish={onFinish} />
);

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
      renderFormItem: () => <Divider />,
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
      <ZESchemaForm schemaID="dealer" onFinish={onFinish} columns={columns} />
    </>
  );
};

export const Submitter = () => (
  <ZESchemaForm
    schemaID="productsale"
    onFinish={onFinish}
    layout="horizontal"
    submitter={{
      render: (_, dom) => {
        return <FooterToolbar>{dom[1]}</FooterToolbar>;
      },
    }}
  />
);

export const Update = () => (
  <ZESchemaForm
    schemaID="productsale"
    onFinish={onFinish}
    initialValues={{
      日期: "2021-06-11",
      状态: "欠费",
      商品: "Gift-02", // Object类型的，只有ID号
      经销商: { _id: "91310115MA1K4P939A", 名称: "易问" }, // Object的，是一个object
    }}
  />
);

// 可以做readOnly和valueType的自定义
// columns里面也可以达到同样的效果。此处这功能是为了方便不用columns的时候用的。
export const PropertyConfig = () => (
  <ZESchemaForm
    schemaID="productsale"
    onFinish={onFinish}
    propertyConfig={{
      日期: { readonly: true, valueType: "date" },
      状态: { valueType: "select" },
      JD目标仓库: { valueType: "select" },
    }}
    initialValues={{
      日期: "2021-06-11",
      状态: "欠费",
    }}
  />
);

export const HierarchyPropertyConfig = () => (
  <ZESchemaForm
    schemaID="dealer"
    onFinish={onFinish}
    columns={[
      {
        title: "所在省市",
        dataIndex: "所在省市",
      },
    ]}
    initialValues={{
      所在省市: "08614101",
    }}
  />
);

export const HierarchyPropertyConfigObjectInitialValues = () => (
  <ZESchemaForm
    schemaID="dealer"
    onFinish={onFinish}
    columns={[
      {
        title: "所在省市",
        dataIndex: "所在省市",
      },
    ]}
    initialValues={{
      所在省市: { _id: "08614101", name: "郑州市", code: "08614101" },
    }}
  />
);

export const LayoutType = () => (
  <ZESchemaForm
    schemaID="employee"
    layoutType="DrawerForm"
    trigger={<a>点击我</a>}
  />
);

export const XueTaiFengStock = () => (
  <ZESchemaForm
    schemaID="stock"
    onFinish={onFinish}
    columns={[
      {
        valueType: "group",
        columns: [
          {
            title: "供应商",
            dataIndex: "供应商",
            width: "lg",
          },
          {
            title: "入库日期",
            dataIndex: "日期",
            width: "lg",
          },
        ],
      },
      {
        renderFormItem: () => <Divider dashed />,
      },
      {
        valueType: "table",
        dataIndex: "商品列表",
        fieldProps: { placeholder: "新增商品" },
        columns: [
          {
            title: "商品",
            dataIndex: "商品",
          },
          {
            title: "入库数量",
            dataIndex: "数量",
          },
          {
            title: "分类",
            dataIndex: "商品.分类",
          },
          {
            title: "生产日期",
            dataIndex: "生产日期",
          },
          {
            title: "操作",
            valueType: "option",
          },
        ],
      },
      {
        valueType: "table",
        dataIndex: "商品列表2",
        columns: [
          {
            title: "商品",
            dataIndex: "商品",
            fieldProps: { query: { 分类: { $in: ["单品", "耗材"] } } },
          },
          {
            title: "入库数量",
            dataIndex: "数量",
          },
          {
            title: "生产日期",
            dataIndex: "生产日期",
          },
          {
            title: "操作",
            valueType: "option",
          },
        ],
      },
    ]}
    initialValues={{
      商品列表2: [
        {
          id: 1628782019762,
          商品: {
            _id: "SoySauce-Z02-L",
            名称: "谁知道呢",
          },
          数量: 1,
          生产日期: "2021-08-24",
        },
      ],
    }}
  />
);
