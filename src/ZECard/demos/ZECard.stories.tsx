// Generated with util/create-component.js
import React from "react";
import moment from "moment";
import xlsx from "xlsx";
import ZECard from "../ZECard";
import "antd/dist/antd.css";

// prepare server
import prepareServerForStories from "../../../util/prepareServerForStories";
import { LogicformAPIResultType, LogicformType } from "zeroetp-api-sdk";
import { Card, message, Space } from "antd";
prepareServerForStories();

export default {
  title: "ZECard",
};

export const SimpleTable = () => (
  <ZECard
    title="所有产品"
    logicform={{
      schema: "product",
    }}
    tableProps={{
      defaultColWidth: 150,
    }}
  />
);

export const Value = () => (
  <ZECard
    title="YTD销售额"
    logicform={{
      schema: "sales",
      operator: "$sum",
      pred: "销售额",
      name: "总销售额",
      query: {
        日期: "YTD",
      },
    }}
    showRecommender={true}
    footer={<div>footer</div>}
  />
);

export const PercentageValue = () => (
  <ZECard
    title="YTD销售额环比"
    logicform={{
      schema: "sales",
      operator: "$mom",
      pred: "销售额",
      name: "总销售额",
      query: {
        日期: "YTD",
      },
    }}
  />
);

export const ValueWithDrillDown = () => (
  <ZECard
    title="YTD销售额"
    showMainContentOnly
    logicform={{
      schema: "sales",
      operator: "$yoy",
      name: "同比",
      pred: {
        pred: "销售额",
        operator: "$sum",
        name: "总销售额",
      },
      query: {
        日期: "YTD",
      },
    }}
  />
);

export const Entity = () => (
  <ZECard
    title="女装礼包"
    logicform={{
      schema: "product",
      operator: "$ent",
      field: "名称",
      name: "女装礼包",
    }}
  />
);

export const EntityPreds = () => (
  <ZECard
    title="女装礼包"
    logicform={{
      schema: "product",
      operator: "$ent",
      field: "名称",
      name: "女装礼包",
      preds: ["名称", "品类", "子品类", "图片", "价格"],
    }}
  />
);

export const Stats = () => (
  <ZECard
    title="各省市销售额"
    logicform={{
      schema: "sales",
      groupby: { _id: "店铺_地址", level: "省市" },
      preds: [{ name: "销售额", operator: "$sum", pred: "销售额" }],
    }}
    chartProps={
      {
        // height: 200
      }
    }
  />
);

export const StatsHorizontalBar = () => (
  <ZECard
    title="各品类销售额"
    logicform={{
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
    }}
    horizontalBarChart
    representation="bar"
    enableGroupByMenu
    chartProps={{
      targetPred: "指标", // 可以显示指标
      height: 200, // 调整图的高度
    }}
  />
);

export const CrossTable = () => (
  <ZECard
    title="各商品销量"
    logicform={{
      schema: "sales",
      preds: [{ name: "销量", operator: "$sum", pred: "销售量" }],
      query: { 日期: { $offset: { year: 0 } } },
      groupby: ["$month", "产品"],
    }}
    xlsx={xlsx}
    exportToExcel="交叉表"
    // tableProps={{
    //   refLFs: [
    //     {
    //       // 这里演示一下Summary行的用法。之所以要另外调用logicform，是因为很多东西的【总计】，并不是所有数值加起来，所以还不如再调用一次。
    //       logicform: {
    //         schema: "productsale",
    //         preds: [{ name: "销量", operator: "$sum", pred: "销量" }],
    //         query: { 日期: { $offset: { year: 0 } } },
    //         groupby: ["商品"],
    //       },
    //       merge: (mainData: any[], refData: any) => {
    //         return [
    //           ...mainData,
    //           ...refData.map((r) => ({
    //             ...r,
    //             _id: `__Total_${r._id}`,
    //             "日期(month)": "Total",
    //           })),
    //         ];
    //       },
    //     },
    //   ],
    //   horizontalColumns: [
    //     "S-深海鱼-200ml",
    //     "S-原浆特酿-200ml",
    //     "S-冰油-200ml",
    //     "L-原浆特酿-500ml",
    //     "L-冰油-500ml",
    //     "猪猪套餐",
    //   ], // 有顺序地显示某些entity
    //   customColumns: {
    //     猪猪套餐: {
    //       render: () => "Custom Render",
    //     },
    //   },
    // }}
  />
);

export const LFVisualizerAsFilter = () => (
  <ZECard
    title="LFVisualizerAsFilter"
    logicform={{
      schema: "sales",
      operator: "$sum",
      pred: "销售额",
      name: "总销售额",
      query: {
        日期: {
          $gte: { $offset: { month: 0 }, day: 1 },
          $lte: { $offset: { day: 0 } },
        },
        产品_品类: "女装",
      },
    }}
    visualizerProps={{
      filters: {
        产品_品类: {
          support_all: true,
          distincts: ["女装", "男装", "童装"],
        },
      },
    }}
  />
);

export const GroupByMenu = () => {
  return (
    <ZECard
      enableGroupByMenu
      title="总销量"
      chartProps={{
        option: {
          toolbox: {},
        },
      }}
      logicform={{
        schema: "sales",
        pred: "销售量",
        operator: "$sum",
        query: {
          日期: { $offset: { year: 0 } },
        },
      }}
    />
  );
};

export const MapVisualMapCard = () => {
  return (
    <ZECard
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
    <Space direction="vertical" style={{ width: "100%" }}>
      <ZECard title="转置前" logicform={lf} representation="table" />
      <ZECard
        title="转置后"
        logicform={lf}
        tableProps={{ transpose: "全指标" }}
        representation="table"
      />
    </Space>
  );
};

export const Closable = () => {
  return (
    <ZECard
      title="Extra"
      logicform={{
        schema: "sales",
        operator: "$sum",
        pred: "销售额",
        name: "总销售额",
        query: {
          日期: "MTD",
        },
      }}
      pinable
      enableGroupByMenu
      close={() => {
        message.info("close card");
      }}
    />
  );
};

export const CustomContent = () => {
  return (
    <ZECard
      title="女装礼包"
      logicform={{
        schema: "product",
        operator: "$ent",
        field: "名称",
        name: "女装礼包",
      }}
      mainContent={(logicform, result) => {
        try {
          if (
            logicform.schema === "product" &&
            logicform.preds[0][0].operator === "$ent"
          ) {
            const entity = result.result[0];
            return (
              <Card
                hoverable
                style={{ width: 240 }}
                cover={<img alt="example" src={entity.图片} />}
              >
                <Card.Meta
                  title={entity.名称}
                  description={`品类：${entity.品类}，价格: ${entity.价格}`}
                />
              </Card>
            );
          }
        } catch (error) {}
        return null;
      }}
    />
  );
};

export const ErrorBoundaryExample = () => (
  <ZECard
    title="LFVisualizerAsFilter"
    logicform={{
      schemaName: "销售流水",
      schema: "productsale",
      operator: "$sum",
      pred: "销售额",
      name: "总销售额",
      query: {
        日期: {
          $gte: { $offset: { month: 0 }, day: 1 },
          $lte: { $offset: { day: 0 } },
        },
        商品_分类: "组合",
      },
    }}
    visualizerProps={{
      filters: {
        商品_分类: {
          support_all: false,
          distincts: ["单品", "组合", "耗材"],
        },
        商品_编码: {
          support_all: false,
        },
      },
    }}
  />
);
