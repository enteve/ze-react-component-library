// Generated with util/create-component.js
import React, { useContext, useState } from "react";
import ProTable, { ProColumns, ProColumnType } from "@ant-design/pro-table";
import ProProvider from "@ant-design/pro-provider";
import { TablePaginationConfig } from "antd";

import { ZETableProps } from "./ZETable.types";
import type { LogicformAPIResultType, LogicformType } from "zeroetp-api-sdk";

import customValueTypes from "./customValueTypes";
import { valueTypeMapping } from "./util";

import "./ZETable.less";

// 发布的时候，要用下面的
import { execLogicform } from "zeroetp-api-sdk";

// Demo Data
// import demodata from "./demodata";
// const execLogicform = async (logicform: LogicformType) => {
//   return Promise.resolve(demodata as LogicformAPIResultType);
// };

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

    console.log("FIlters >>>>>");
    console.log(sort);
    console.log(filter);
    console.log("FIlters <<<<<");
    const newLF = JSON.parse(JSON.stringify(logicform));
    if (pageSize && current) {
      // 支持翻页
      newLF.limit = pageSize;
      newLF.skip = pageSize * (current - 1);
    }

    // Filters
    if (!("query" in newLF)) newLF.query = {};
    Object.entries(filter).forEach(([k, v]) => {
      if (v) {
        newLF.query[k] = { $in: v };
      }
    });

    try {
      const ret = await execLogicform(newLF);
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

  // Columns
  // 判断要展示的properties
  let properties = result?.columnProperties || [];
  if (preds) {
    if (properties.length > 0) {
      // 不是这个的话，说明result还没拿到
      properties = preds.map((predItem) => {
        const property = properties.find((p) => p.name === predItem);
        if (!property) {
          // return fake property
          return { name: predItem, type: "string", primal_type: "string" };
        }

        return property;
      }); // 用preds的话，顺序是和preds一样的
    }
  } else {
    properties = properties.filter(
      (property) => !property.ui?.show_in_detail_only
    );
  }

  const columns: ProColumnType[] = properties.map((property) => {
    // Filters
    let valueEnum = undefined;
    if (property.constraints.enum) {
      valueEnum = {};
      property.constraints.enum.forEach((enumItem) => {
        const enumValue = Array.isArray(enumItem) ? enumItem[0] : enumItem;
        valueEnum[enumValue] = { text: enumValue };
      });
    }

    return {
      title: titleMap[property.name] || property.name,
      dataIndex: property.name,
      ellipsis: property.primal_type === "string",
      valueType: valueTypeMapping(property),
      render: customRender[property.name],
      filters: property.constraints.enum ? true : false,
      onFilter: false,
      valueEnum,
    } as ProColumnType;
  });

  // Pagination
  let pagination: false | TablePaginationConfig = false;
  if ("limit" in logicform) {
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
