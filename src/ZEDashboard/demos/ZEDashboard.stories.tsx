// Generated with util/create-component.js
import React, { useState } from "react";
import { Space, Button } from "antd";
import ZEDashboard, { ZEDashboardItem } from "../index";

// prepare server
import prepareServerForStories from "../../../util/prepareServerForStories";
prepareServerForStories();

export default {
  title: "ZEDashboard",
};

const initialData = [
  {
    id: "card1",
    cardProps: {
      title: "各省市销售额",
      logicform: {
        schema: "sales",
        groupby: { _id: "店铺_地址", level: "省市" },
        preds: [{ name: "销售额", operator: "$sum", pred: "销售额" }],
      },
    },
  },
  {
    id: "card2",
    cardProps: {
      title: "各省市销售额",
      logicform: {
        schema: "sales",
        groupby: { _id: "产品_品类" },
        preds: [
          { name: "销售额", operator: "$sum", pred: "销售额" },
          {
            name: "指标",
            operator: "$sql",
            pred: "sum(sales.`销售额` * 4)",
            type: "int",
          },
        ],
      },
    },
  },
];

export const Basic = () => {
  const [data, setData] = useState<ZEDashboardItem[]>(initialData);
  const [mode, setMode] = useState<"add" | "edit">();

  const onAdd = () => {};

  return (
    <div>
      <Space
        style={{
          marginBottom: 24,
          flexDirection: "row-reverse",
          width: "100%",
        }}
      >
        {mode === "edit" ? (
          <>
            <Button
              type="primary"
              onClick={() => {
                // save
                setMode(undefined);
              }}
            >
              确定
            </Button>
            <Button
              onClick={() => {
                setData([...initialData]);
                setMode(undefined);
              }}
            >
              取消
            </Button>
          </>
        ) : (
          <>
            <Button type="primary" onClick={onAdd}>
              新增
            </Button>
            <Button
              onClick={() => {
                setMode("edit");
              }}
            >
              编辑
            </Button>
          </>
        )}
      </Space>
      <ZEDashboard
        data={data}
        editable={mode === "edit"}
        onItemDelete={(id) => {
          setData((oldData) => oldData.filter((d) => d.id !== id));
        }}
        onLayoutChange={(lay) => {
          setData((oldData) => {
            return oldData.map((d) => {
              const l = lay.find((f) => f.i === d.id);
              if (l) {
                return {
                  ...d,
                  layout: l,
                };
              }
              return d;
            });
          });
        }}
      />
    </div>
  );
};
