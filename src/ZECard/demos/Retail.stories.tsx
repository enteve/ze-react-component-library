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
        groupby: { _id: "店铺_地址", level: "省市" },
      }}
      coloringMap={(record) => {
        if (record.总销量 > 20000) {
          return "pink";
        }
        return undefined;
      }}
      footer={(logicform) => <div>{JSON.stringify(logicform)})</div>} // footer随着logicform的变化而变化
    />
  );
};

export const BarCard = () => {
  return (
    <ZECard
      title="今年各品类销量"
      coloringMap={(record) => {
        console.log(record);
        if (record.总销量 > 140000) {
          return "#722ed1";
        }
        return "#eb2f96";
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
