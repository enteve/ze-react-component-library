import { LogicformAPIResultType, getNameProperty } from "zeroetp-api-sdk";
import { ZESheetProps } from "./ZESheet.types";

export const getDefaultS2Config = (
  result: LogicformAPIResultType
): ZESheetProps["s2DataConfig"] => {
  if (!result) return {};

  const { logicform } = result;
  if (!logicform) throw new Error("需要有normed logicform");
  if (!logicform.groupby) throw new Error("ZESheet仅支持groupby格式");
  if (!logicform.preds) throw new Error("ZESheet仅支持groupby格式");

  const s2Config: ZESheetProps["s2DataConfig"] = {
    fields: {
      rows: result.columnProperties
        .slice(0, logicform.groupby.length)
        .map((prop) => {
          console.log(prop);
          if (prop.type === "object") {
            const nameProp = getNameProperty(prop.schema);
            return `${prop.name}.${nameProp.name}`;
          }

          return prop.name;
        }),
      values: result.columnProperties
        .slice(logicform.groupby.length)
        .map((prop) => prop.name),
    },
  };

  // console.log(s2Config);

  return s2Config;
};
