// Generated with util/create-component.js
import React from "react";
import moment from "moment";
import XLSX from "xlsx";
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

export const NormalWithRowClick = () => (
  <ZETable
    logicform={{
      schema: "dealer",
    }}
    onRow={(record) => ({
      onClick: () => {
        console.log(record);
      },
    })}
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
    customColumn={{
      名称: {
        title: "供应商",
        width: 100,
      },
    }}
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
    xlsx={XLSX}
  />
);

// TODO: 这个PredChain还没做的很完美。很完美的是property也顺利找到对应的。
export const PredChain = () => (
  <ZETable
    logicform={{
      schema: "productsale",
      close_default_query: true,
      query: { 类型: "线下" },
    }}
    preds={["经销商.统一社会信用代码"]}
    exportToExcel
    xlsx={XLSX}
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
        // sorter: true, // TODO：本地排序还没做
      },
      商品: {
        width: 300,
      },
      销售额: {
        sorter: true,
      },
    }}
    exportToExcel="复杂表格"
    xlsx={XLSX}
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
      xlsx={XLSX}
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

// 以下代码只有在周黑鸭的数据库里面才能运行
export const RefLogicforms = () => {
  return (
    <ZETable
      logicform={{
        schema: "order",
        query: {
          门店_美团创建时间: {
            $gte: "2021-03-01 00:00:00",
            $lte: "2021-06-30 23:59:59",
          },
          日期: {
            $gte: "2021-06-01 00:00:00",
            $lte: "2021-06-01 23:59:59",
          },
        },
        preds: [
          { name: "订单数量", operator: "$count" },
          { name: "总实销", operator: "$sum", pred: "实销" },
          { name: "实销环比", operator: "$mom", pred: "实销" },
          { name: "折扣率", operator: "折扣费用" },
        ],
        groupby: "门店",
      }}
      preds={[
        "平台",
        "区域",
        "创建时间",
        "门店",
        "订单数量",
        "总实销",
        "折扣率",
        { title: "区域统计", children: ["区域订单数量", "区域总实销"] },
      ]}
      customColumn={{
        平台: {
          render: () => "美团",
        },
        区域: {
          render: (_v: any, record: any) => record.门店_区域,
        },
        创建时间: {
          render: (_v: any, record: any) =>
            moment(record.门店.美团创建时间).format("YYYY-MM-DD"),
          valueType: "date",
        },
        门店: {
          title: "门店名称",
        },
        总实销: {
          title: "实销",
        },
        区域总实销: {
          valueType: "digit",
        },
      }}
      scroll={null}
      exportToExcel={"新店每日业绩表现"}
      xlsx={XLSX}
      refLFs={[
        {
          logicform: {
            schema: "order",
            query: {
              日期: {
                $gte: "2021-06-01 00:00:00",
                $lte: "2021-06-01 23:59:59",
              },
            },
            preds: [
              { name: "区域订单数量", operator: "$count" },
              { name: "区域总实销", operator: "$sum", pred: "实销" },
            ],
            groupby: { _id: "门店_地理位置", level: "区域" },
          },
          merge: (mainData: any, refData: any) => {
            const newMainData = [];
            mainData.forEach((i: any) => {
              const ref = refData.find(
                (r: any) => r["门店_地理位置(区域)"].name === i.门店_区域
              );
              if (ref) {
                newMainData.push({
                  ...ref,
                  ...i,
                });
              } else {
                newMainData.push(i);
              }
            });
            return newMainData;
          },
        },
      ]}
    />
  );
};

export const MultiSchema = () => {
  return (
    <ZETable
      logicform={{
        children: [
          {
            query: {
              日期: {
                $gte: "2021-06-01 00:00:00",
                $lte: "2021-06-01 23:59:59",
              },
            },
            preds: [{ name: "订单数量", operator: "$count" }],
            groupby: [
              { _id: "门店_地理位置", level: "区域" },
              { _id: "门店_类型" },
            ],
            schema: "order",
          },
          {
            query: {
              日期: {
                $gte: "2021-06-01 00:00:00",
                $lte: "2021-06-01 23:59:59",
              },
            },
            preds: [{ name: "流量", operator: "$sum", pred: "曝光人数" }],
            groupby: [
              { _id: "门店_地理位置", level: "区域" },
              { _id: "门店_类型" },
            ],
            schema: "visit",
          },
        ],
      }}
      scroll={null}
      exportToExcel
      xlsx={XLSX}
    />
  );
};

// export const TMP = () => {
//   return (
//     <ZETable
//       logicform={{
//         query: {
//           菜品: "5fd317a148be98f2c1dc60e5",
//           订单号: {
//             schema: "productsale",
//             preds: ["订单号"],
//             query: {
//               日期: {
//                 $gte: "2021-05-01 00:00:00",
//                 $lte: "2021-05-31 23:59:59",
//               },
//               状态: "完成",
//               菜品: "5fd317a148be98f2c1dc60e9",
//             },
//           },
//           日期: {
//             $gte: "2021-05-01 00:00:00",
//             $lte: "2021-05-31 23:59:59",
//           },
//         },
//         schema: "productsale",
//         preds: [
//           { name: "订单量", operator: "$uniq", pred: "订单号" },
//           { name: "总销量", operator: "$sum", pred: "销量" },
//         ],
//         groupby: ["渠道"],
//       }}
//       scroll={null}
//       exportToExcel={"有小锁骨含大锁骨"}
//       xlsx={XLSX}
//     />
//   );
// };
