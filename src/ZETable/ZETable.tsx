/**
 * 这个控件是SimpleQuery时候的控件，用来浏览原始数据。
 * 如果是通过GroupBy生成的答案，那么要用ZEStatsTable。ZEStatsTable具有下钻功能。
 */
import React, { useContext, useState } from "react";
import ProTable, { ProColumnType } from "@ant-design/pro-table";
import ProProvider from "@ant-design/pro-provider";
import { Tooltip, Result } from "antd";
import type { TablePaginationConfig } from "antd";
import { Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import excelExporter from "./excelExporter";

import { ZETableProps, PredItemType } from "./ZETable.types";
import { getColumnDateProps, getColumnSearchProps } from "./FilterComponents";
import { getNameProperty } from "zeroetp-api-sdk";
import type { LogicformAPIResultType } from "zeroetp-api-sdk";

import { valueTypeMapping, valueEnumMapping, customValueTypes } from "../util";

import "./ZETable.less";

import { requestLogicform } from "../request";

const ZETable: React.FC<ZETableProps> = ({
  logicform,
  options,
  preds,
  customColumn = {},
  className,
  scroll,
  bordered = false,
  exportToExcel,
  refLFs = [],
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
      const refResults = await Promise.all(
        refLFs.map((r) => requestLogicform(r.logicform))
      );
      // console.log(ret);
      setResult(ret);

      let result = JSON.parse(JSON.stringify(ret.result));
      refLFs.forEach(
        (r, index) => (result = r.merge(result, refResults[index].result))
      );

      return {
        data: result,
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

  if (result?.error)
    return (
      <Result
        status="error"
        title={result.error}
        subTitle="请联系服务提供商获取技术支持"
      />
    );

  // 判断要展示的properties
  let predsToShow: PredItemType[] = preds;
  if (!predsToShow) {
    predsToShow = (result?.columnProperties || [])
      .filter((property) => !property.ui?.show_in_detail_only)
      .map((property) => property.name);
  }

  const properties = result?.columnProperties || [];

  // Columns配置
  const mapColumnItem = (predItem: string): ProColumnType => {
    let property = properties.find((p) => p.name === predItem);
    if (!property) {
      // fake property
      property = {
        name: predItem,
        type: "string",
        primal_type: "string",
        constraints: {},
        is_fake: true,
      };
    }

    let additionalProps: any = {};

    // Filters
    if (!property.is_fake) {
      if (property.primal_type === "date") {
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
    if (result?.schema.type === "entity") {
      if (property.primal_type === "number") {
        additionalProps.sorter = true;
      }
    }

    const valueEnum = valueEnumMapping(property);
    const defaultColumnType: ProColumnType = {
      title: property.name,
      dataIndex: property.name,
      ellipsis: property.primal_type === "string" && !property.constraints.enum,
      valueType: valueTypeMapping(property),
      filters: valueEnum !== undefined,
      onFilter: false,
      valueEnum,
      ...additionalProps,
    };

    if (customColumn[property.name]) {
      return {
        ...defaultColumnType,
        ...customColumn[property.name],
      };
    }

    return defaultColumnType;
  };

  const columns: ProColumnType[] = predsToShow.map((predItem) => {
    if (typeof predItem === "object" && "title" in predItem) {
      return {
        title: predItem.title,
        children: predItem.children.map((pred) => mapColumnItem(pred)),
      };
    }

    return mapColumnItem(predItem);
  });

  // Pagination
  let pagination: false | TablePaginationConfig = false;
  if ("limit" in logicform && logicform.limit !== -1) {
    pagination = {
      pageSize: logicform.limit,
    };
  }

  let exportFileName = "数据导出";
  const toolBarRender: React.ReactNode[] = [];
  if (exportToExcel) {
    if (typeof exportToExcel === "string") {
      exportFileName = exportToExcel;
    }

    toolBarRender.push(
      <Tooltip title="导出Excel">
        <Button
          type="text"
          icon={<DownloadOutlined />}
          onClick={() => excelExporter(result, exportFileName)}
        />
      </Tooltip>
    );
  }

  return (
    <div data-testid="ZETable" className={className}>
      <ProProvider.Provider
        value={{
          ...values,
          valueTypeMap: result ? customValueTypes(result.schema) : {},
        }}
      >
        <ProTable
          bordered={bordered}
          columns={columns}
          rowKey="_id"
          search={false}
          tableClassName={exportFileName}
          request={request}
          size="small"
          scroll={scroll !== undefined ? scroll : { x: 200 * columns.length }}
          options={
            options !== undefined
              ? options
              : { reload: true, setting: false, density: false }
          }
          pagination={pagination}
          toolBarRender={() => toolBarRender}
        />
      </ProProvider.Provider>
    </div>
  );
};

export default ZETable;
