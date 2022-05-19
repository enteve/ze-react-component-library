// Generated with util/create-component.js
import React, { useState, useRef } from "react";
import { Space, Button } from "antd";
import ZECard from "../../ZECard";
import ZESearchBar, { ZESearchBarAnswerType } from "../../ZESearchBar";
import ZEDashboard, { ZEDashboardItem, ZEDashboardInstance } from "../index";
import * as xlsx from "xlsx";

// prepare server
import prepareServerForStories from "../../../util/prepareServerForStories";
prepareServerForStories();

export default {
  title: "ZEDashboard",
};

const report: ZEDashboardItem[] = [
  {
    id: "card0",
    cardProps: {
      title: "所有产品",
      logicform: {
        schema: "product",
      },
      tableProps: {
        options: {
          setting: true,
        },
        xlsx,
        exportToExcel: true,
        size: "small",
        // size: "middle"
        // size: "large"
      },
      close: () => {},
    },
    layout: {
      h: 8,
      i: "card0",
      minH: 4,
      minW: 2,
      w: 6,
      x: 0,
      y: 0,
    },
  },
  {
    id: "card1",
    cardProps: {
      title: "各省市销售额",
      logicform: {
        schema: "sales",
        groupby: { _id: "店铺_地址", level: "省市" },
        preds: [{ name: "销售额", operator: "$sum", pred: "销售额" }],
      },
      close: () => {},
    },
    layout: {
      h: 8,
      i: "card1",
      minH: 4,
      minW: 2,
      w: 6,
      x: 6,
      y: 0,
    },
  },
];

const initialData: ZEDashboardItem[] = [
  {
    id: "card2",
    cardProps: {
      xlsx,
      title: "各产品销售额",
      useSheet: true,
      logicform: {
        query: { 日期: { $offset: { quarter: -1 } } },
        preds: [
          { pred: "销售量", operator: "$sum", name: "总销售量" },
          { pred: "销售额", operator: "$sum", name: "总销售额" },
          { operator: "$yoy", pred: "销售额", name: "销售额同比" },
        ],
        schema: "sales",
        groupby: ["产品_品类", "产品"],
        schemaName: "销售",
      },
      close: () => {},
    },
  },
];

export const Basic = () => {
  const [data, setData] = useState<ZEDashboardItem[]>(initialData);
  const [draftData, setDraftData] = useState<ZEDashboardItem[]>();
  const dashboardRef = useRef<ZEDashboardInstance>({});
  const [mode, setMode] = useState<"add" | "edit">();
  const [answer, setAnswer] = useState<ZESearchBarAnswerType>();

  return (
    <div>
      <Space
        style={{
          marginBottom: 24,
          flexDirection: "row-reverse",
          width: "100%",
        }}
      >
        {mode ? (
          <>
            <Button
              type="primary"
              disabled={mode === "add" && !answer?.logicform}
              onClick={() => {
                // save
                if (mode === "add" && answer?.logicform) {
                  setData((oldData) => [
                    {
                      id: `item_${oldData.length}`,
                      cardProps: {
                        title: answer.question,
                        logicform: answer.logicform,
                      },
                    },
                    ...oldData,
                  ]);
                }
                if (mode === "edit" && draftData) {
                  setData(draftData);
                  setDraftData(undefined);
                }
                setMode(undefined);
              }}
            >
              确定
            </Button>
            <Button
              onClick={() => {
                mode === "edit" && setDraftData(undefined);
                setMode(undefined);
              }}
            >
              取消
            </Button>
          </>
        ) : (
          <>
            <Button
              type="primary"
              onClick={() => {
                console.log(dashboardRef.current.getDashboardState?.(data));
              }}
            >
              保存
            </Button>
            <Button
              type="primary"
              onClick={() => {
                setMode("add");
              }}
            >
              新增
            </Button>
            <Button
              type="primary"
              onClick={() => {
                // 计算report里面的报表y方向的最大位置
                const reportMaxY = Math.max(
                  ...report.map((d) => d.layout?.y || 0)
                );
                const newData = [
                  ...report,
                  ...data.map((d) => ({
                    ...d,
                    layout: {
                      ...d.layout,
                      y: d.layout?.y > reportMaxY ? d.layout.y : reportMaxY + 1,
                    },
                  })),
                ];
                setData(newData);
              }}
            >
              新增报告
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

      {mode === "add" && (
        <>
          <ZESearchBar onAsk={setAnswer} />
          <div style={{ minHeight: 400, marginTop: 24 }}>
            {answer && (
              <ZECard
                title={answer.question}
                logicform={answer.logicform}
                askError={answer.error}
              />
            )}
          </div>
        </>
      )}
      <ZEDashboard
        style={mode === "add" ? { pointerEvents: "none", opacity: 0 } : {}}
        data={draftData || data}
        editable={mode === "edit"}
        onDataChange={(d) => (mode === "edit" ? setDraftData(d) : setData(d))}
        dashboardRef={dashboardRef}
      />
    </div>
  );
};
