// Generated with util/create-component.js
import React, { useState } from "react";
import ZECard from "../ZECard";
import "antd/dist/antd.css";

import prepareServerForStories from "../../../util/prepareServerForStories";
import { LogicformType } from "zeroetp-api-sdk";
import { Button } from "antd";
import ZELogicform from "../../ZELogicform";
import ZETable from "../../ZETable";
prepareServerForStories();

export default {
  title: "Retail",
};

export const MapCard = () => {
  return (
    <ZECard
      pinable
      chartProps={{
        option: {
          toolbox: {},
          visualMap: {
            dimension: 2,
          },
        },
      }}
      title="今年各省市销量"
      logicform={{
        schema: "sales",
        preds: [
          {
            operator: "$sum",
            pred: "销售量",
            name: "总销量",
          },
          {
            operator: "$percentage",
            pred: "销售量",
            name: "销售量占比",
          },
        ],
        query: {
          日期: { $offset: { year: 0 } },
        },
        sort: { 总销量: -1 },
        groupby: { _id: "店铺_地址", level: "省市" },
      }}
      footer={(logicform) => <div>{JSON.stringify(logicform)})</div>} // footer随着logicform的变化而变化
    />
  );
};

export const TableControlsSync = () => {
  return (
    <ZECard
      representation="table"
      title="搜索控件状态"
      logicform={{
        schema: "sales",
        query: {
          // 日期选择器
          日期: { $offset: { year: 0 } },

          // 筛选器
          // 渠道: "拼多多",
          渠道: { $in: ["天猫", "京东"] },

          // 搜索器
          // 产品: { $contains: "女" },
        },
        // 排序器
        sort: { 销售量: -1, 原价: 1 },
      }}
    />
  );
};

export const BarCard = () => {
  return (
    <ZECard
      representation="bar"
      title="今年各品类销量"
      chartProps={{
        option: {
          toolbox: {},
        },
      }}
      logicform={{
        schema: "sales",
        preds: [
          {
            operator: "$sum",
            pred: "销售量",
            name: "总销量",
          },
          {
            operator: "$avg",
            pred: "销售量",
            name: "平均销量",
          },
        ],
        query: {
          日期: { $offset: { year: 0 } },
        },
        groupby: { _id: "产品_品类" },
        sort: { 总销量: -1 },
      }}
    />
  );
};

export const SingleBar = () => {
  return (
    <ZECard
      chartProps={{
        option: {
          legend: {
            // legend放下面去
            type: "scroll",
            bottom: 0,
            padding: [0, 50],
          },
          toolbox: {
            feature: {}, // 关闭saveAsImage
          },
        },
      }}
      horizontalBarChart
      title="今年各产品销量"
      logicform={{
        schema: "sales",
        preds: [
          {
            operator: "$sum",
            pred: "销售量",
            name: "总销量",
          },
        ],
        query: {
          日期: { $offset: { year: 0 } },
          产品: {
            operator: "$ent",
            schema: "product",
            field: "名称",
            name: "美丽无敌女长袖",
          },
        },
        groupby: { _id: "产品" },
        sort: { 总销量: -1 },
      }}
    />
  );
};

export const MultiCardWithCustomContent = () => {
  const createMainContent = (logicform) => {
    return (
      <ZELogicform
        logicform={{
          ...logicform,
          groupby: undefined,
        }}
        content={(v) => <div>{v}</div>}
      />
      // <ZECard
      //   logicform={{
      //     ...logicform,
      //     groupby: undefined,
      //   }}
      // />
    );
  };

  const [logicforms, setLogicforms] = useState<any[]>([
    {
      lf: {
        schema: "sales",
        preds: [
          {
            operator: "$sum",
            pred: "销售量",
            name: "总销量",
          },
        ],
        query: {
          日期: { $offset: { year: 0 } },
          产品: {
            operator: "$ent",
            schema: "product",
            field: "名称",
            name: "美丽无敌女长袖",
          },
        },
        groupby: { _id: "产品" },
      },
      mainContent: (logicform) => <>{createMainContent(logicform)}</>,
    },
  ]);

  const addOneCard = () => {
    setLogicforms([
      ...logicforms,
      {
        lf: {
          schema: "product",
          limit: 1,
        },
      },
    ]);
  };

  return (
    <>
      <Button onClick={() => addOneCard()}>Add One Card</Button>
      {logicforms.map((item, i) => (
        <ZECard
          title="anyway"
          logicform={item.lf}
          key={i}
          mainContent={item.mainContent}
        />
      ))}
    </>
  );
};

// ZECard因为有内部的lf traverler，所以不支持从外部改变logicform。如需从外部改变，用Key来改。本质上是两个component
export const CardSwitcher = () => {
  const lf1 = {
    schema: "sales",
    preds: [
      {
        operator: "$sum",
        pred: "销售量",
        name: "总销量",
      },
    ],
    query: {
      日期: { $offset: { year: 0 } },
      产品: {
        operator: "$ent",
        schema: "product",
        field: "名称",
        name: "美丽无敌女长袖",
      },
    },
    groupby: { _id: "产品" },
    sort: { 总销量: -1 },
  };

  const lf2 = {
    schema: "sales",
    preds: [
      {
        operator: "$sum",
        pred: "销售量",
        name: "总销量",
      },
    ],
    groupby: { _id: "产品" },
    sort: { 总销量: -1 },
  };

  const [lf, setLF] = useState<LogicformType>(lf1);

  return (
    <>
      <Button onClick={() => setLF(lf2)}>switch!</Button>
      <ZECard key={JSON.stringify(lf)} title="今年各产品销量" logicform={lf} />
    </>
  );
};

export const ByTimeWindow = () => {
  return (
    <ZECard
      title="今年各产品销量"
      logicform={{
        schema: "sales",
        preds: [
          {
            operator: "$sum",
            pred: "销售量",
            name: "总销量",
          },
        ],
        query: {
          日期: { $offset: { year: 0 } },
          产品: {
            operator: "$ent",
            schema: "product",
            field: "名称",
            name: "美丽无敌女长袖",
          },
        },
        groupby: "$month",
      }}
    />
  );
};

export const Transpose = () => {
  const lf: LogicformType = {
    schema: "sales",
    preds: [
      {
        operator: "$sum",
        pred: "销售量",
        name: "总销量",
      },
      {
        operator: "$avg",
        pred: "销售量",
        name: "平均销量",
      },
      {
        operator: "$max",
        pred: "销售量",
        name: "最高销量",
      },
    ],
    groupby: "产品",
  };

  return (
    <>
      <ZETable logicform={lf} />
      <ZETable logicform={lf} transpose="全指标" />
    </>
  );
};
