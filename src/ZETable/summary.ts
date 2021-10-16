// Add summary row into table
// 感觉是一个临时的解决方案。要考虑如何解决percentage的问题
// 20211016暂时关了
import type { LogicformType, PropertyType } from "zeroetp-api-sdk";

export const addSummaryToData = (
  data,
  logicform: LogicformType,
  columnProperties: PropertyType[]
) => {
  return data;
  // // 一些暂不支持的情况
  // if (!logicform.groupby) return data;
  // if (Array.isArray(logicform.groupby) && logicform.groupby.length > 1)
  //   return data;

  // const newData: any[] = [...data];

  // const total: any = {
  //   _id: "__total",
  //   [columnProperties[0].name]: "总计",
  // };

  // // 总计栏
  // for (const item of data) {
  //   for (const property of columnProperties) {
  //     if (property.type === "percentage") {
  //       // 先不管
  //     } else if (property.primal_type === "number") {
  //       if (!(property.name in total)) total[property.name] = 0;

  //       total[property.name] += item[property.name];
  //     }
  //   }
  // }

  // newData.push(total);

  // return newData;
};
