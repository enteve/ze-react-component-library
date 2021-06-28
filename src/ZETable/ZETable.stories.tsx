// Generated with util/create-component.js
import React from "react";
import ZETable from "./ZETable";
import { Tag } from "antd";
import "antd/dist/antd.css";
import "./ZETable.stories.less";

// prepare server
import prepareServerForStories from "../../util/prepareServerForStories";
prepareServerForStories();

export default {
  title: "ZETable",
};

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
    customColumn={{
      操作: {
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
    }}
  />
);

export const CustomRender = () => (
  <ZETable
    logicform={{
      schema: "dealer",
    }}
    preds={["名称", "公司全称", "状态"]}
    customColumn={{
      状态: {
        render: (v: any) => {
          return (
            <Tag color="green" style={{ width: 52, textAlign: "center" }}>
              {v}
            </Tag>
          );
        },
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
      schema: "productsale",
      limit: 1,
      close_default_query: true,
    }}
    exportToExcel
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
    options={false}
  />
);

export const Stats = () => (
  <ZETable
    logicform={{
      schema: "productsale",
      preds: [{ name: "销量", operator: "$sum", pred: "销量" }],
      groupby: ["商品", "经销商"],
    }}
    options={false}
  />
);

export const StatsAndCalcInFront = () => (
  <ZETable
    logicform={{
      schema: "productsale",
      preds: [
        { name: "销量", operator: "$sum", pred: "销量" },
        { name: "销售额", operator: "$sum", pred: "销售额" },
      ],
      groupby: "商品",
    }}
    preds={["商品", "销售额", "销量", "件单价"]}
    customColumn={{
      件单价: {
        render: (v: any, record: any) => (
          <span>{record.销售额 / record.销量}</span>
        ),
        align: "right",
      },
    }}
    options={false}
  />
);

export const TwoRowHeader = () => (
  <ZETable
    logicform={{
      schema: "productsale",
      preds: [
        { name: "销量", operator: "$sum", pred: "销量" },
        { name: "销售额", operator: "$sum", pred: "销售额" },
      ],
      groupby: "商品",
    }}
    preds={[
      "商品",
      { title: "服务器的统计值", children: ["销售额", "销量"] },
      "件单价（本地统计）",
    ]}
    customColumn={{
      "件单价（本地统计）": {
        render: (v: any, record: any) => (
          <span>{record.销售额 / record.销量}</span>
        ),
        align: "right",
      },
    }}
    exportToExcel="复杂表格"
    options={false}
    bordered
  />
);

export const ExportExcel = () => {
  return (
    <ZETable
      logicform={{
        schema: "productsale",
        close_default_query: true,
        limit: 20,
      }}
      exportToExcel="商品销售流水列表"
    />
  );
};

/**
 * 将数据库里面拆单的流水记录转变为Order
 * @returns {*}
 */
export const ProductSaleToOrder = () => {
  return (
    <ZETable
      logicform={{
        schema: "productsale",
        limit: 20,
        sort: { 日期: -1 },
        groupby: "订单编号",
        close_default_query: true,
        preds: ["日期", "经销商", "发货日期", "销量", "销售额", "件数"],
        expands: ["经销商.所在省市"],
      }}
      scroll={null}
      customColumn={{
        经销商: {
          render: (v: any, record: any) => {
            return `${record.经销商?.名称}(${
              record.经销商?.所在省市?.parents[
                record.经销商?.所在省市?.parents.length - 1
              ]
            }${record.经销商?.所在省市?.name})`;
          },
        },
      }}
    />
  );
};
