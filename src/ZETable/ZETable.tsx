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
import escapeStringRegexp from "escape-string-regexp";

import { ZETableProps, PredItemType } from "./ZETable.types";
import {
  createData,
  getNameProperty,
  removeDataByID,
  updateDataByID,
} from "zeroetp-api-sdk";
import type { LogicformAPIResultType } from "zeroetp-api-sdk";

import { customValueTypes, valueEnumMapping, valueTypeMapping } from "../util";

import ZESchemaForm from "../ZESchemaForm";

import "./ZETable.less";

import { requestLogicform, request as requestAPI } from "../request";
import { getColumnDateProps, getColumnSearchProps } from "./FilterComponents";
import {
  canUseCrossTable,
  columnPropertiesToCrossTable,
  columnToCrossTable,
  dataToCrossTable,
} from "./crossTableGen";

const mapColumnItem = (
  predItem: string,
  customColumn: ProColumnType,
  properties: any[],
  exporting: boolean // 是否需要导出，导出的话，ellipse不要了
): ProColumnType => {
  let property = properties.find((p) => p.name === predItem);

  // 前端的predChain，要获取正确的property
  // 后端不会出现有.的情况。
  if (predItem.indexOf(".") > 0) {
    const chain = predItem.split(".");
    let currentSchema = { properties };
    for (const chainItem of chain) {
      property = currentSchema.properties.find((p) => p.name === chainItem);
      if (property) {
        currentSchema = property.schema;
        if (!currentSchema) break;
      }
    }

    if (property) {
      // 记得要改个名字
      property = {
        ...property,
        name: predItem,
      };
    }
  }

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
      (property.primal_type === "string" ||
        property.primal_type === "object") &&
      !(property.is_categorical && property.stats?.distincts?.length < 10)
    ) {
      additionalProps = {
        ...additionalProps,
        ...getColumnSearchProps(property.name),
      };
    }
  }

  // Alignment
  if (property.primal_type === "number" || property.primal_type === "boolean") {
    additionalProps.align = "right";
  }

  // Sorter
  if (property.primal_type === "number") {
    additionalProps.sorter = true;
  }

  const valueEnum = valueEnumMapping(property);
  const defaultColumnType: any = {
    title: property.name,
    dataIndex: property.name.split("."),
    ellipsis:
      property.ui?.ellipsis ||
      (property.primal_type === "string" &&
        !property.constraints.enum &&
        !exporting), // 前端默认的ellipsis逻辑
    valueType: valueTypeMapping(property),
    filters: valueEnum !== undefined,
    onFilter: false,
    valueEnum,
    ...additionalProps,
  };

  // 以下是用来给createMode=list用的
  // formItemProps
  if (!defaultColumnType.formItemProps) defaultColumnType.formItemProps = {};
  if (!defaultColumnType.formItemProps.rules)
    defaultColumnType.formItemProps.rules = [];
  if (property.constraints.required && !property.udf) {
    // 这个rules会在EditableProTable里面起作用
    defaultColumnType.formItemProps.rules.push({
      required: true,
      message: "此项为必填项",
    });
  }
  if (property.name.indexOf(".") > 0 || property.udf) {
    // 在creation模式里面，这样的情况不可能需要edit
    defaultColumnType.editable = false;
  }

  if (customColumn) {
    return {
      ...defaultColumnType,
      ...customColumn,
    };
  }

  return defaultColumnType;
};

const ZETable: React.FC<ZETableProps> = ({
  logicform,
  options,
  preds,
  search,
  size = "small",
  rowKey = "_id",
  customColumns = {},
  className,
  scroll,
  exportToExcel,
  xlsx,
  refLFs = [],
  creationMode,
  creationColumns,
  defaultColWidth = 200,
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
            const namePropInRef = getNameProperty(property.schema);
            targetKey = `${k}_${namePropInRef.name}`;
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

        // 如果LF已经有了该字段的筛选，那么用$and来解决
        if (targetKey in newLF.query) {
          newLF.query[targetKey] = { $and: [newLF.query[targetKey], targetV] };
        } else {
          newLF.query[targetKey] = targetV;
        }
      }
    });

    // Sort，新的sort覆盖掉原始sort。此逻辑代表同时只允许一种sort key
    if (Object.keys(sort).length > 0) {
      newLF.sort = {};
      Object.entries(sort).forEach(([k, v]) => {
        newLF.sort[k] = v === "ascend" ? 1 : -1;
      });
    }

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

      if (canUseCrossTable(logicform)) {
        result = dataToCrossTable(ret.columnProperties, result);
      }

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
            customColumns[pred],
            properties,
            exportToExcel != undefined
          )
        ),
      };
    }

    return mapColumnItem(
      predItem,
      customColumns[predItem],
      properties,
      exportToExcel != undefined
    );
  });

  // Groupby的id columns需要fixed
  if (logicform.groupby && columns.length > 0) {
    const groupbyCount = Array.isArray(logicform.groupby)
      ? logicform.groupby.length
      : 1;
    for (let i = 0; i < groupbyCount; i++) {
      columns[i].fixed = "left";

      // TODO：为什么在这里还要设一遍defaultColWidth？为什么不统一设一下？
      if (!columns[i].width) {
        columns[i].width = defaultColWidth;
      }
    }
  }

  // Pagination
  let pagination: false | TablePaginationConfig = false;
  if ("limit" in logicform && logicform.limit !== -1 && !logicform.groupby) {
    pagination = {
      pageSize: logicform.limit,
    };
  }

  // Scroll
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
    if (canUseCrossTable(logicform)) {
      result.schema.properties = columnPropertiesToCrossTable(
        result?.columnProperties,
        result.result
      );
    } else {
      result.schema.properties = result.columnProperties;
    }
  }

  const tableProps: any = {
    cardProps: {
      bodyStyle: { padding: 0 },
    },
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

  if (result && canUseCrossTable(logicform)) {
    tableProps.columns = columnToCrossTable(
      result.columnProperties,
      result.result,
      defaultColWidth
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
        {creationMode !== "list" && <ProTable {...tableProps} />}
        {creationMode === "list" && (
          <EditableProTable
            {...tableProps}
            recordCreatorProps={{ record: { _id: new Date() } }}
          />
        )}
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
