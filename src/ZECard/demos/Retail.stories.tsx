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
        ],
        query: {
          日期: { $offset: { year: 0 } },
        },
        groupby: { _id: "店铺_地址", level: "省市" },
      }}
    />
  );
};

export const BarCard = () => {
  return (
    <ZECard
      title="今年各品类销量"
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
