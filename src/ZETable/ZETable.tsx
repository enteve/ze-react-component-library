// Generated with util/create-component.js
import React, { useContext, useState } from "react";
import ProTable, { ProColumnType } from "@ant-design/pro-table";
import ProProvider from "@ant-design/pro-provider";
import { TablePaginationConfig } from "antd";

import { ZETableProps } from "./ZETable.types";
import { getNameProperty, LogicformAPIResultType } from "zeroetp-api-sdk";
import { getColumnDateProps, getColumnSearchProps } from "./FilterComponents";

import customValueTypes from "./customValueTypes";
import { valueTypeMapping } from "./util";

import "./ZETable.less";

import { requestLogicform } from "../request";

const ZETable: React.FC<ZETableProps> = ({
  logicform,
  options,
  preds,
  customRender = {},
  className,
  titleMap = {},
  scroll,
}) => {
  const values = useContext(ProProvider); // 用来自定义ValueType
  const [result, setResult] = useState<LogicformAPIResultType>();

  const request = async (
    params: {
      pageSize: number;
      current: number;
    },
    sort = {},
    filter = {}
  ) => {
    const { pageSize, current } = params;

    // console.log("FIlters >>>>>");
    // console.log(sort);
    // console.log(filter);
    // console.log("FIlters <<<<<");
    const newLF = JSON.parse(JSON.stringify(logicform));
    if (pageSize && current) {
      // 支持翻页
      newLF.limit = pageSize;
      newLF.skip = pageSize * (current - 1);
    }

    // Filters
    if (!("query" in newLF)) newLF.query = {};
    Object.entries(filter).forEach(([k, v]) => {
      if (v !== null && result) {
        const property = result.columnProperties.find((p) => p.name === k);

        let targetKey = k;
        let targetV = v;

        if (Array.isArray(v)) {
          // 清洗输入的字符串
          const mappedV = v.map((i) => {
            if (i === "true") return true;
            if (i === "false") return false;

            if (typeof i === "string") return i.trim(); // 删除多余空格

            return i;
          });

          if (property.primal_type === "string" && property.constraints.enum) {
            targetV = { $in: mappedV };
          } else if (property.primal_type === "date") {
            targetV = {
              $gte: `${mappedV[0]} 00:00:00`,
              $lte: `${mappedV[1]} 23:59:59`,
            };
          } else if (property.primal_type === "string") {
            targetV = { $regex: mappedV[0], $options: "i" };
          } else if (property.primal_type === "object") {
            // TODO: 有多个NameProperty咋办
            // 搜索entity
            const namePropInRef = getNameProperty(property.schema);
            targetKey = `${k}_${namePropInRef.name}`;
            targetV = {
              $regex: mappedV[0],
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

        // 如果LF已经有了该字段的筛选，那么用$and来解决
        if (targetKey in newLF.query) {
          newLF.query[targetKey] = { $and: [newLF.query[targetKey], targetV] };
        } else {
          newLF.query[targetKey] = targetV;
        }
      }
    });

    // Sort
    Object.entries(sort).forEach(([k, v]) => {
      if (!("sort" in newLF)) newLF.sort = {};

      newLF.sort[k] = v === "ascend" ? 1 : -1;
    });

    try {
      const ret = await requestLogicform(newLF);
      // console.log(ret);

      setResult(ret);
      return {
        data: ret.result,
        success: true,
        total: ret.total,
      };
    } catch (error) {
      return {
        data: [],
        success: false,
        total: 0,
      };
    }
  };

  // 判断要展示的properties
  let properties = result?.columnProperties || [];
  if (preds) {
    if (properties.length > 0) {
      // 不是这个的话，说明result还没拿到
      properties = preds.map((predItem) => {
        const property = properties.find((p) => p.name === predItem);
        if (!property) {
          // return fake property
          return {
            name: predItem,
            type: "string",
            primal_type: "string",
            constraints: {},
            is_fake: true,
          };
        }

        return property;
      }); // 用preds的话，顺序是和preds一样的
    }
  } else {
    properties = properties.filter(
      (property) => !property.ui?.show_in_detail_only
    );
  }

  // Columns配置
  const columns: ProColumnType[] = properties.map((property) => {
    let additionalProps: any = {};

    // Filters
    let valueEnum = undefined;
    if (!property.is_fake) {
      if (property.constraints.enum) {
        valueEnum = {};
        property.constraints.enum.forEach((enumItem) => {
          const enumValue = Array.isArray(enumItem) ? enumItem[0] : enumItem;
          valueEnum[enumValue] = { text: enumValue };
        });
      } else if (property.primal_type === "date") {
        additionalProps = {
          ...additionalProps,
          ...getColumnDateProps(property.name),
        };
      } else if (
        property.primal_type === "string" ||
        property.primal_type === "object"
      ) {
        additionalProps = {
          ...additionalProps,
          ...getColumnSearchProps(property.name),
        };
      } else if (property.primal_type === "boolean") {
        valueEnum = {
          true: {
            text: "是",
          },
          false: {
            text: "否",
          },
        };
      }
    }

    // Alignment
    if (
      property.primal_type === "number" ||
      property.primal_type === "boolean"
    ) {
      additionalProps.align = "right";
    }

    // Sorter
    if (result.schema.type === "entity") {
      if (property.primal_type === "number") {
        additionalProps.sorter = true;
      }
    }

    return {
      title: titleMap[property.name] || property.name,
      dataIndex: property.name,
      ellipsis: property.primal_type === "string" && !property.constraints.enum,
      valueType: valueTypeMapping(property),
      render: customRender[property.name],
      filters: valueEnum !== undefined,
      onFilter: false,
      valueEnum,
      ...additionalProps,
    } as ProColumnType;
  });

  // Pagination
  let pagination: false | TablePaginationConfig = false;
  if ("limit" in logicform && logicform.limit !== -1) {
    pagination = {
      pageSize: logicform.limit,
    };
  }

  return (
    <div data-testid="ZETable" className={className}>
      <ProProvider.Provider
        value={{
          ...values,
          valueTypeMap: customValueTypes(result?.schema),
        }}
      >
        <ProTable
          columns={columns}
          rowKey="_id"
          search={false}
          request={request}
          size="small"
          scroll={scroll !== undefined ? scroll : { x: 200 * columns.length }}
          options={
            options !== undefined
              ? options
              : { reload: true, setting: false, density: false }
          }
          pagination={pagination}
        />
      </ProProvider.Provider>
    </div>
  );
};

export default ZETable;
