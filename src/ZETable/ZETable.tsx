/**
 * 这个控件是SimpleQuery时候的控件，用来浏览原始数据。
 * 如果是通过GroupBy生成的答案，那么要用ZEStatsTable。ZEStatsTable具有下钻功能。
 */
import React, { useContext, useState, useRef } from "react";
import ProTable, {
  ActionType,
  EditableProTable,
  ProColumnType,
} from "@ant-design/pro-table";
import ProProvider from "@ant-design/pro-provider";
import { Tooltip, Result, Button, Popconfirm, Drawer } from "antd";
import type { TablePaginationConfig } from "antd";
import { DownloadOutlined, PlusOutlined } from "@ant-design/icons";
import excelExporter from "./excelExporter";

import { ZETableProps, PredItemType } from "./ZETable.types";
import {
  createData,
  getNameProperty,
  removeDataByID,
  updateDataByID,
} from "zeroetp-api-sdk";
import type { LogicformAPIResultType } from "zeroetp-api-sdk";

import { customValueTypes, mapColumnItem } from "../util";

import ZESchemaForm from "../ZESchemaForm";

import "./ZETable.less";

import { requestLogicform, request as requestAPI } from "../request";

const ZETable: React.FC<ZETableProps> = ({
  logicform,
  options,
  preds,
  search,
  size = "small",
  rowKey = "_id",
  customColumn = {},
  className,
  scroll,
  exportToExcel,
  xlsx,
  refLFs = [],
  creationMode,
  creationColumns,
  ...restProps
}) => {
  const values = useContext(ProProvider); // 用来自定义ValueType
  const [result, setResult] = useState<LogicformAPIResultType>();
  const [selectedRecord, setSelectedRecord] = useState<any>(undefined);
  const [creationFormVisible, setCreationFormVisible] =
    useState<boolean>(false);
  const tableRef = useRef<ActionType>();

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

  const columns: ProColumnType[] = predsToShow.map((predItem) => {
    if (typeof predItem === "object" && "title" in predItem) {
      return {
        title: predItem.title,
        children: predItem.children.map((pred) =>
          mapColumnItem(
            pred,
            customColumn,
            properties,
            result,
            exportToExcel != undefined
          )
        ),
      };
    }

    return mapColumnItem(
      predItem,
      customColumn,
      properties,
      result,
      exportToExcel != undefined
    );
  });

  // Pagination
  let pagination: false | TablePaginationConfig = false;
  if ("limit" in logicform && logicform.limit !== -1) {
    pagination = {
      pageSize: logicform.limit,
    };
  }

  // Scroll
  const defaultColWidth = 200;
  const calcWidth = (col: any) => {
    if (col.children) {
      return col.children.reduce((acc, c) => acc + calcWidth(c), 0);
    }

    return "width" in col ? col.width : defaultColWidth;
  };
  const x = columns.reduce((acc, c) => acc + calcWidth(c), 0);

  const toolBarRender: React.ReactNode[] = [];

  // Export
  let exportFileName = "数据导出";

  if (exportToExcel) {
    if (typeof exportToExcel === "string") {
      exportFileName = exportToExcel;
    }

    toolBarRender.push(
      <Tooltip title="导出Excel">
        <Button
          type="text"
          icon={<DownloadOutlined />}
          onClick={() => excelExporter(result, exportFileName, xlsx)}
        />
      </Tooltip>
    );
  }

  // result的schema中的properties其实没啥用，应该改为columnProperties的
  if (result?.columnProperties) {
    result.schema.properties = result.columnProperties;
  }

  const tableProps: any = {
    ...restProps,
    actionRef: tableRef,
    columns,
    rowKey,
    search: search === undefined ? false : search,
    tableClassName: exportFileName,
    request,
    size,
    scroll: scroll !== undefined ? scroll : { x },
    options:
      options !== undefined
        ? options
        : { reload: true, setting: false, density: false },
    pagination,
    toolBarRender: () => toolBarRender,
  };

  // Creation
  const deleteRecord = (record: any) => {
    if (logicform.schema) {
      requestAPI(removeDataByID(logicform.schema, record._id)).then(() => {
        tableRef.current.reload();
      });
    }
  };
  if (creationMode === "form") {
    toolBarRender.push(
      <Tooltip title="添加数据">
        <Button
          type="text"
          icon={<PlusOutlined />}
          onClick={() => {
            setSelectedRecord(undefined);
            setCreationFormVisible(true);
          }}
        />
      </Tooltip>
    );

    // Create的话，添加【操作】column
    columns.push({
      title: "操作",
      width: 150,
      key: "_operation",
      valueType: "option",
      render: (_dom, record: any) => [
        // 修改
        <a
          key="edit"
          onClick={() => {
            setSelectedRecord(record);
            setCreationFormVisible(true);
          }}
        >
          修改
        </a>,
        // 删除
        <Popconfirm
          title="确定删除？删除后将不可恢复。"
          key="delete"
          onConfirm={() => {
            deleteRecord(record);
          }}
          okText="确定"
          cancelText="取消"
        >
          <a>删除</a>
        </Popconfirm>,
      ],
    });
  } else if (creationMode === "list") {
    tableProps.editable = {
      onSave: (id, record: any, _origin, newLine: boolean) => {
        if (newLine) {
          // 用logicform.query里面的数据来设置默认的一些属性
          // TODO: 目前只接受非chain的query
          requestAPI(
            createData(logicform.schema, { ...logicform.query, ...record })
          ).then(() => tableRef.current.reload());
        } else {
          requestAPI(updateDataByID(logicform.schema, id, record)).then(() =>
            tableRef.current.reload()
          );
        }
      },
      onDelete: (_id, record) => deleteRecord(record),
    };
    columns.push({
      title: "操作",
      width: 150,
      key: "_operation",
      valueType: "option",
      render: (text, record: any, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record._id);
          }}
        >
          编辑
        </a>,
        <Popconfirm
          title="确定删除？删除后将不可恢复。"
          key="delete"
          onConfirm={() => {
            deleteRecord(record);
          }}
          okText="确定"
          cancelText="取消"
        >
          <a>删除</a>
        </Popconfirm>,
      ],
    });
  }

  return (
    <div data-testid="ZETable" className={className}>
      <ProProvider.Provider
        value={{
          ...values,
          valueTypeMap: result ? customValueTypes(result.schema) : {},
        }}
      >
        {creationMode !== "list" && <ProTable {...tableProps} />}
        {creationMode === "list" && <EditableProTable {...tableProps} />}
        {creationMode === "form" && (
          <Drawer
            destroyOnClose
            visible={creationFormVisible}
            maskClosable={false} // 防止误触
            width={500}
            onClose={() => setCreationFormVisible(false)}
          >
            <ZESchemaForm
              schemaID={logicform.schema}
              columns={creationColumns}
              initialValues={selectedRecord}
              onFinish={async (values) => {
                if (!selectedRecord) {
                  await requestAPI(createData(logicform.schema, values));
                } else {
                  await requestAPI(
                    updateDataByID(logicform.schema, selectedRecord._id, values)
                  );
                }
                setCreationFormVisible(false);
                tableRef.current.reload();
              }}
            />
          </Drawer>
        )}
      </ProProvider.Provider>
    </div>
  );
};

export default ZETable;
