import {
  getNameProperty,
  LogicformAPIResultType,
  PropertyType,
} from "zeroetp-api-sdk";

const getIDKey = (prop: PropertyType, item: any) => {
  if (!prop.schema) {
    return item[prop.name];
  }

  const nameProp = getNameProperty(prop.schema);
  return item[prop.name][nameProp.name];
};

export const transposeResult = (
  ret: LogicformAPIResultType,
  firstColumnName: string
): LogicformAPIResultType => {
  const { result, columnProperties } = ret;

  const newData: any[] = [];
  const newColumnProperties: PropertyType[] = [];

  // 1. 搞newColumnProperties
  // 后面几列的数据变为第一列。要求后面几列的type一样
  newColumnProperties.push({
    name: firstColumnName,
    type: "string",
    primal_type: "string",
    constraints: {},
  });

  // 第一列的数据变为columnProperties。
  for (const item of result) {
    newColumnProperties.push({
      ...columnProperties[1],
      name: getIDKey(columnProperties[0], item),
    });
  }

  // 除去第一列，后面有几列，就是数据有几行
  for (let i = 1; i < columnProperties.length; i++) {
    const property = columnProperties[i];

    const item: any = {
      [firstColumnName]: property.name,
    };

    // 横过来
    for (const i of result) {
      item[getIDKey(columnProperties[0], i)] = i[property.name];
    }

    newData.push(item);
  }

  return {
    ...ret,
    columnProperties: newColumnProperties,
    result: newData,
  };
};
