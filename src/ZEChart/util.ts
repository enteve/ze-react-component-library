import { getNameProperty, LogicformAPIResultType } from "zeroetp-api-sdk";

// 这个namekey用来给chart
export const getNameKeyForChart = (logicform, data: LogicformAPIResultType) => {
  if (!logicform.groupby) throw new Error("[getNameKeyForData]必须要有Groupby");
  if (!logicform.preds || logicform.preds.length === 0)
    throw new Error("[getNameKeyForData]必须要有Preds");
  if (Array.isArray(logicform.groupby) && logicform.groupby.length > 1)
    throw new Error("[getNameKeyForData]只支持一维分组");

  let nameProp = data.columnProperties[0];
  const ret = [nameProp.name];

  if (nameProp.type === "object" && nameProp.schema) {
    const nameProp2 = getNameProperty(nameProp.schema);
    ret.push(nameProp2.name);
  }

  return ret;
};