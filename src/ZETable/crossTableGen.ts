import {
  getNameProperty,
  LogicformAPIResultType,
  LogicformType,
  PropertyType,
} from "zeroetp-api-sdk";

export const canUseCrossTable = (logicform: LogicformType): boolean => {
  if (Array.isArray(logicform.groupby) && logicform.groupby.length === 2) {
    if (logicform.preds?.length === 1) {
      return true;
    }
  }

  return false;
};

const getIDKey = (prop: PropertyType, item: any) => {
  if (!prop.schema) {
    return item[prop.name];
  }

  const nameProp = getNameProperty(prop.schema);
  return item[prop.name][nameProp.name];
};

export const crossResult = (
  ret: LogicformAPIResultType,
  horizontalColumns?: string[]
): LogicformAPIResultType => {
  const { result, columnProperties } = ret;

  const idProp0 = columnProperties[0];
  const idProp1 = columnProperties[1];
  const measurementName = columnProperties[2].name;

  const newData: any[] = [];
  const newColumnProperties: PropertyType[] = [];

  // 1. 搞newColumnProperties
  newColumnProperties.push({
    ...idProp0
  });

  // 第一列的数据变为columnProperties。
  if (horizontalColumns) {
    for (const item of horizontalColumns) {
      newColumnProperties.push({
        ...columnProperties[2],
        name: item,
      });
    }
  } else {
    const secondColKeys = new Set<string>();
    for (const item of result) {
      secondColKeys.add(getIDKey(columnProperties[1], item));
    }

    for (const key of Array.from(secondColKeys)) {
      newColumnProperties.push({
        ...columnProperties[2],
        name: key,
      });
    }
  }

  result.forEach((item) => {
    const id =
      typeof item[idProp0.name] === "string"
        ? item[idProp0.name]
        : item[idProp0.name]._id;
    if (newData.length === 0 || newData[newData.length - 1]._id !== id) {
      newData.push({
        _id: id,
        [idProp0.name]: item[idProp0.name],
      });
    }

    const idKey = getIDKey(idProp1, item);

    newData[newData.length - 1][idKey] = item[measurementName];
  });

  return {
    ...ret,
    columnProperties: newColumnProperties,
    result: newData,
  };
};
