// Generated with util/create-component.js
import React, { useState } from "react";
import { Space, Button } from "antd";
import ZECard from "../../ZECard";
import ZESearchBar from "../../ZESearchBar";
import { useRequest } from "@umijs/hooks";
import { requestAsk } from "../../request";
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
  const [question, setQuestion] = useState<string>();
  const { data: answer, run: ask } = useRequest(
    () => (question ? requestAsk(question, true) : Promise.resolve(null)),
    { refreshDeps: [question] }
  );

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
                        title: question,
                        logicform: answer.logicform,
                      },
                    },
                    ...oldData,
                  ]);
                  setQuestion(undefined);
                }
                setMode(undefined);
              }}
            >
              确定
            </Button>
            <Button
              onClick={() => {
                mode === "edit" && setData([...initialData]);
                mode === "add" && setQuestion(undefined);
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
                setMode("add");
              }}
            >
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
      {mode === "add" ? (
        <>
          <ZESearchBar
            ask={(ques) => {
              setQuestion(ques);
            }}
          />
          {answer?.logicform && (
            <div style={{ marginTop: 24 }}>
              <ZECard title={question} logicform={answer.logicform} />
            </div>
          )}
        </>
      ) : (
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
      )}
    </div>
  );
};
