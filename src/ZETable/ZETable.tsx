// Generated with util/create-component.js
import React, { useContext, useState } from "react";
import ProTable from "@ant-design/pro-table";
import ProProvider from "@ant-design/pro-provider";

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

const ZETable: React.FC<ZETableProps> = ({ logicform, options }) => {
  const values = useContext(ProProvider); // 用来自定义ValueType
  const [result, setResult] = useState<LogicformAPIResultType>();

  const request = async (
    params: {
      pageSize: number;
      current: number;
    },
    sort,
    filter
  ) => {
    // console.log("FIlters >>>>>");
    // console.log(params);
    // console.log(sort);
    // console.log(filter);
    // console.log("FIlters <<<<<");

    try {
      const ret = await execLogicform(logicform);
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
  const columns =
    result?.columnProperties
      .filter((property) => !property.ui?.show_in_detail_only)
      .map((property) => ({
        title: property.name,
        dataIndex: property.name,
        ellipsis: property.primal_type === "string",
        valueType: valueTypeMapping(property),
      })) || [];

  return (
    <div data-testid="ZETable">
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
          scroll={{ x: 200 * columns.length }}
          options={options || { reload: true, setting: false, density: false }}
        />
      </ProProvider.Provider>
    </div>
  );
};

export default ZETable;