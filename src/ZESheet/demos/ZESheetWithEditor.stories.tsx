// // Generated with util/create-component.js
// import React, { useState } from "react";
// import ZESheet from "../ZESheetWithEditor";
// import "./index.less";
// import numeral from "numeral";
// import * as xlsx from "xlsx";

// // prepare server
// import prepareServerForStories from "../../../util/prepareServerForStories";
// import { LogicformType } from "zeroetp-api-sdk";
// import { Node } from "@antv/s2";
// prepareServerForStories();

// export default {
//   title: "ZESheetWithEditor",
// };

// export const ZESheetEditor = () => {
//   const [lf, setLF] = useState<LogicformType>({
//     schema: "sales",
//     groupby: ["渠道", "$year"],
//     preds: [
//       { name: "总销量", operator: "$sum", pred: "销售量" },
//       { name: "毛利率", operator: "毛利率" },
//     ],
//   });
//   const [s2DataConfig, setS2DataConfig] = useState<any>({
//     fields: {
//       rows: ["渠道"],
//       columns: ["日期(year)"],
//       values: ["总销量", "毛利率"],
//     },
//     meta: [
//       {
//         field: "总销量",
//       },
//     ],
//   });
//   const [s2Options, setS2Options] = useState<any>({});

//   return (
//     <ZESheet
//       logicform={lf}
//       s2DataConfig={s2DataConfig}
//       s2Options={s2Options}
//       showEditor
//       xlsx={xlsx}
//       onSave={(values) => {
//         values.logicform && setLF(values.logicform);
//         values.s2DataConfig && setS2DataConfig(values.s2DataConfig);
//         values.s2Options && setS2Options(values.s2Options);
//       }}
//     />
//   );
// };
