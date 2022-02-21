import { useState, useEffect } from "react";
import {
  LogicformType,
  getNameProperty,
  LogicformAPIResultType,
} from "zeroetp-api-sdk";
import escapeStringRegexp from "escape-string-regexp";
import type { TableOnChangeParams } from "./Table.types";

export function useTableParams({
  logicform,
  setLogicform,
  data,
}: {
  data?: LogicformAPIResultType;
  logicform: LogicformType;
  setLogicform: (
    logicform?: LogicformType,
    logicformWithSkipAndSort?: LogicformType
  ) => void;
}) {
  const [tableParams, setTableParams] = useState<TableOnChangeParams>();

  const resetTableParams = (params?: TableOnChangeParams) => {
    if (params) {
      const [, filter, ...rest] = params;
      const newParams: TableOnChangeParams = [{ current: 1 }, filter, ...rest];
      setTableParams(newParams);
    }
  };

  const onTableChange = (...params: TableOnChangeParams) => {
    const newLF: LogicformType = JSON.parse(JSON.stringify(logicform));
    const [pagination = {}, filter, sort = {}] = params;
    // Filters
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
        if (v !== null) {
          if (!("query" in newLF)) newLF.query = {};
          newLF.query[targetKey] = targetV;
        } else if (newLF.query && targetKey in newLF.query) {
          // 重置筛选
          delete newLF.query[targetKey];
        }
      }
    });
    // Sorters And Pagination
    const newLFWithSkipAndSort = JSON.parse(JSON.stringify(newLF));
    let sorter: any = { ...sort };
    if (sorter.columnKey) {
      sorter = {
        [sorter.columnKey]: sorter.order,
      };
    } else {
      sorter = {};
    }
    const { pageSize, current } = pagination;
    if (pageSize && current) {
      // 支持翻页
      newLFWithSkipAndSort.limit = pageSize;
      newLFWithSkipAndSort.skip = pageSize * (current - 1);
    }

    // Sort，新的sort覆盖掉原始sort。此逻辑代表同时只允许一种sort key
    if (Object.keys(sorter).length > 0) {
      newLFWithSkipAndSort.sort = {};
      Object.entries(sorter).forEach(([k, v]) => {
        switch (v) {
          case "ascend":
            newLFWithSkipAndSort.sort[k] = 1;
            break;
          case "descend":
            newLFWithSkipAndSort.sort[k] = -1;
            break;
          default:
            newLFWithSkipAndSort.sort[k] = undefined;
            break;
        }
      });
    }
    if (JSON.stringify(newLF) !== JSON.stringify(logicform)) {
      resetTableParams(params);
      setLogicform(newLF);
    } else {
      setTableParams(params);
      setLogicform(undefined, newLFWithSkipAndSort);
    }
  };

  useEffect(() => {
    resetTableParams(tableParams);
    // 重置logicformWithSkipAndSort
    setLogicform();
  }, [JSON.stringify(logicform)]);

  return {
    tableParams,
    setTableParams,
    onTableChange,
  };
}
