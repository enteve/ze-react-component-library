import { useState, useEffect } from "react";
import {
  LogicformType,
  getNameProperty,
  LogicformAPIResultType,
} from "zeroetp-api-sdk";
import escapeStringRegexp from "escape-string-regexp";
import type { TableOnChangeParams } from "./Table";

export function useTableParams({
  logicform,
  setLogicform,
}: {
  logicform: LogicformType;
  setLogicform: (val: LogicformType) => void;
}) {
  const [tableParams, setTableParams] = useState<TableOnChangeParams>();
  const [data, setData] = useState<LogicformAPIResultType>();

  const resetTableParams = (params?: TableOnChangeParams) => {
    if (params) {
      const [, filter, ...rest] = params;
      const newParams: TableOnChangeParams = [{ current: 1 }, filter, ...rest];
      setTableParams(newParams);
    }
  };

  const onTableChange = (...params: TableOnChangeParams) => {
    const newLF: LogicformType = JSON.parse(JSON.stringify(logicform));
    const [, filter, ...rest] = params;
    // Filters
    if (!("query" in newLF)) newLF.query = {};
    Object.entries(filter).forEach(([k, v]) => {
      if (data) {
        const property = data.columnProperties.find((p) => p.name === k);
        let targetKey: any = k;
        let targetV: any = v;
        if (property?.primal_type === "object") {
          const namePropInRef = getNameProperty(property.schema);
          targetKey = `${k}_${namePropInRef.name}`;
        }

        if (Array.isArray(v)) {
          // 清洗输入的字符串
          const mappedV: any[] = v.map((i) => {
            if (i === "true") return true;
            if (i === "false") return false;

            if (typeof i === "string") return i.trim(); // 删除多余空格

            return i;
          });

          if (property.primal_type === "string" && property.is_categorical) {
            targetV = { $in: mappedV };
          } else if (property.primal_type === "date") {
            targetV = {
              $gte: `${mappedV[0]} 00:00:00`,
              $lte: `${mappedV[1]} 23:59:59`,
            };
          } else if (property.primal_type === "string") {
            targetV = { $regex: escapeStringRegexp(mappedV[0]), $options: "i" };
          } else if (property.primal_type === "object") {
            // TODO: 有多个NameProperty咋办
            // 搜索entity
            targetV = {
              $regex: escapeStringRegexp(mappedV[0]),
              $options: "i",
            };
          } else if (property.primal_type === "boolean") {
            if (v.length === 1) {
              targetV = v[0] === "true" ? true : false;
            }
          } else {
            throw new Error("筛选器中有未准备的数据类型：" + property.type);
          }
        }
        // TODO: 这段逻辑暂时去掉，不然会造成表格筛选有问题
        // 如果LF已经有了该字段的筛选，那么用$and来解决
        // if (targetKey in newLF.query) {
        //   if (
        //     JSON.stringify(newLF.query[targetKey]) !== JSON.stringify(targetV)
        //   ) {
        //     if (
        //       typeof newLF.query[targetKey] === "string" &&
        //       typeof targetV === "string"
        //     ) {
        //       newLF.query[targetKey] = {
        //         $in: [newLF.query[targetKey], targetV],
        //       };
        //     } else {
        //       newLF.query[targetKey] = {
        //         $and: [newLF.query[targetKey], targetV],
        //       };
        //     }
        //   }
        // }
        newLF.query[targetKey] = targetV;
        if (v === null) {
          newLF.query[targetKey] = undefined;
        }
      }
    });

    if (JSON.stringify(newLF) !== JSON.stringify(logicform)) {
      resetTableParams(params);
      setLogicform(newLF);
    } else {
      setTableParams(params);
    }
  };

  useEffect(() => {
    resetTableParams(tableParams);
  }, [JSON.stringify(logicform)]);

  return {
    tableParams,
    setTableParams,
    onTableChange,
    setData,
  };
}
