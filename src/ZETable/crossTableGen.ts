import { ProColumnType } from "@ant-design/pro-table";
import { getNameProperty, LogicformType, PropertyType } from "zeroetp-api-sdk";
import { valueTypeMapping } from "../util";

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

export const dataToCrossTable = (
  columnProperties: PropertyType[],
  data: any[]
): any[] => {
  const idProp0 = columnProperties[0];
  const idProp1 = columnProperties[1];
  const measurementName = columnProperties[2].name;

  const newData: any[] = [];

  data.forEach((item) => {
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

  return newData;
};

export const columnPropertiesToCrossTable = (
  columnProperties: PropertyType[],
  data: any[]
): any[] => {
  const idProp0 = columnProperties[0];
  const idProp1 = columnProperties[1];

  const newColumnProperties: any[] = [idProp0];

  const columnSet = new Set();
  data.forEach((item) => {
    const idKey = getIDKey(idProp1, item);
    if (!columnSet.has(idKey)) {
      newColumnProperties.push({
        ...columnProperties[2],
        name: idKey,
      });
      columnSet.add(idKey);
    }
  });

  return newColumnProperties;
};

export const columnToCrossTable = (
  columnProperties: PropertyType[],
  data: any[],
  defaultColWidth
): ProColumnType<any, any>[] => {
  const idProp0 = columnProperties[0];
  const idProp1 = columnProperties[1];
  const measurementProp = columnProperties[2];

  const columns: ProColumnType<any, any>[] = [
    {
      title: idProp0.name,
      dataIndex: idProp0.name,
      fixed: "left",
      width: defaultColWidth,
      valueType: valueTypeMapping(idProp0),
    },
  ];

  data.forEach((item) => {
    const idKey = getIDKey(idProp1, item);

    if (!columns.find((c) => c.title === idKey)) {
      let align: "left" | "right" | "center" = "left";
      if (
        measurementProp.primal_type === "number" ||
        measurementProp.primal_type === "boolean"
      ) {
        align = "right";
      }

      columns.push({
        title: idKey,
        dataIndex: idKey,
        width: defaultColWidth,
        valueType: valueTypeMapping(measurementProp),
        align,
      });
    }
  });

  return columns;
};
