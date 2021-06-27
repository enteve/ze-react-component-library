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
    options={false}
  />
);

export const Stats = () => (
  <ZETable
    logicform={{
      schema: "order",
      preds: [{ name: "销量", operator: "$sum", pred: "销量" }],
      groupby: ["商品", "经销商"],
    }}
    options={false}
  />
);

export const StatsAndCalcInFront = () => (
  <ZETable
    logicform={{
      schema: "order",
      preds: [
        { name: "销量", operator: "$sum", pred: "销量" },
        { name: "金额", operator: "$sum", pred: "金额" },
      ],
      groupby: "商品",
    }}
    preds={["商品", "金额", "销量", "件单价"]}
    customRender={{
      件单价: (v: any, record: any) => <span>{record.金额 / record.销量}</span>,
    }}
    options={false}
  />
);

export const TwoRowHeader = () => (
  <ZETable
    logicform={{
      schema: "order",
      preds: [
        { name: "销量", operator: "$sum", pred: "销量" },
        { name: "金额", operator: "$sum", pred: "金额" },
      ],
      groupby: "商品",
    }}
    preds={[
      "商品",
      { title: "服务器的统计值", children: ["金额", "销量"] },
      "件单价（本地统计）",
    ]}
    customRender={{
      "件单价（本地统计）": (v: any, record: any) => (
        <span>{record.金额 / record.销量}</span>
      ),
    }}
    options={false}
    bordered
  />
);
