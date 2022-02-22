import React, { useContext, useState, useRef } from "react";
import _ from "underscore";
import ProTable, {
  ActionType,
  EditableProTable,
  ProColumnType,
} from "@ant-design/pro-table";
import { useRequest } from "@umijs/hooks";
import ProProvider from "@ant-design/pro-provider";
import { Tooltip, Result, Button, Popconfirm, Drawer } from "antd";
import type { TablePaginationConfig } from "antd";
import { DownloadOutlined, PlusOutlined } from "@ant-design/icons";
import {
  LogicformType,
  normaliseGroupby,
  createData,
  getNameProperty,
  removeDataByID,
  updateDataByID,
} from "zeroetp-api-sdk";
import type { LogicformAPIResultType } from "zeroetp-api-sdk";
import excelExporter from "./excelExporter";
import { requestLogicform, request as requestAPI } from "../../request";
import type { TableProps, PredItemType } from "./Table.types";

import {
  customValueTypes,
  valueEnumMapping,
  valueTypeMapping,
  basicValueDisplay,
  drilldownLogicform,
  getFormatter,
} from "../../util";

import ZESchemaForm from "../../ZESchemaForm";

import "./Table.less";
import { getColumnDateProps, getColumnSearchProps } from "./FilterComponents";
import { canUseCrossTable, crossResult } from "./crossTableGen";
import { transposeResult } from "./transposeGen";
import { useTableParams } from "./useTableParams";

const mapColumnItem = (
  logicform: LogicformType,
  predItem: string,
  customColumn: ProColumnType,
  properties: any[],
  exporting: boolean, // 是否需要导出，导出的话，ellipse不要了
  showUnit: boolean,
  showSorter: boolean,
  defaultColWidth?: number
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
      !(property.is_categorical && property.stats?.distincts?.length < 10) &&
      !(customColumn?.filters === false)
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
  if (showSorter && property.primal_type === "number") {
    additionalProps.sorter = true;
  }

  const valueEnum = valueEnumMapping(property);
  let sortOrder = logicform.sort?.[predItem];
  switch (sortOrder) {
    case 1:
      sortOrder = "ascend";
      break;
    case -1:
      sortOrder = "descend";
      break;
    default:
      break;
  }
  const filters: Record<string, any> = {};
  Object.keys(logicform?.query || {}).forEach((k) => {
    filters[k] = basicValueDisplay(logicform?.query?.[k], true);
  });
  let filterKey = predItem;
  if (property?.primal_type === "object") {
    const namePropInRef = getNameProperty(property.schema);
    filterKey = `${predItem}_${namePropInRef.name}`;
  }
  let filteredValue = filters[filterKey];
  filteredValue = filteredValue
    ? filteredValue instanceof Array
      ? filteredValue
      : [filteredValue]
    : [];
  const width = customColumn?.width || defaultColWidth;
  const defaultColumnType: any = {
    title: property.name,
    filteredValue,
    filtered: filteredValue?.length > 0,
    sortOrder,
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
    width,
  };

  // unit
  if (showUnit && property.unit) {
    let unit: any = property.unit;
    const formatter = getFormatter(property, 0);
    if (formatter) {
      unit = `${formatter.prefix}${unit}`;
    }
    defaultColumnType.title = `${defaultColumnType.title}(${unit})`;
  }

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

  const formattedColumn: ProColumnType = {
    ...defaultColumnType,
    ...(customColumn || {}),
  };

  // object类型会走自定义的render，里面有ellipsis逻辑，需要把Column的ellipsis关掉，否则会嵌套两层受到影响
  if (property.primal_type === "object") {
    formattedColumn.ellipsis = false;
    const colFieldProps: any = formattedColumn.fieldProps || {};
    // 给object自定义的render提供width
    formattedColumn.fieldProps = {
      ...colFieldProps,
      width,
    };
  }

  return formattedColumn;
};

const Table: React.FC<TableProps> = ({
  logicform: _logicform,
  setLogicform,
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
  defaultColWidth: defaultColWidthOfProps = 200,
  horizontalColumns,
  transpose,
  showUnit = true,
  showSorter = true,
  expandFirstCol,
  result: ret,
  reload,
  formatExpandResult,
  ...restProps
}) => {
  if (ret?.error)
    return (
      <Result
        status="error"
        title={ret.error}
        subTitle="请联系服务提供商获取技术支持"
      />
    );
  const { tableParams, onTableChange } = useTableParams({
    logicform: _logicform,
    setLogicform,
    data: ret,
  });

  const [paginationParams] = tableParams || [];
  let logicform = JSON.parse(JSON.stringify(_logicform));
  if (ret?.logicform) {
    logicform.sort = ret.logicform.sort;
    logicform.limit = ret.logicform.limit;
  }
  // 关闭滚动时，不应该给column设置默认宽度
  const defaultColWidth = scroll === null ? undefined : defaultColWidthOfProps;
  const values = useContext(ProProvider); // 用来自定义ValueType
  const [selectedRecord, setSelectedRecord] = useState<any>(undefined);
  const [creationFormVisible, setCreationFormVisible] =
    useState<boolean>(false);
  const tableRef = useRef<ActionType>();
  const [rowChildrenMap, setRowChildrenMap] = useState<Record<string, any[]>>(
    {}
  );
  const { data: refResults = [] } = useRequest(() =>
    Promise.all(refLFs.map((r) => requestLogicform(r.logicform)))
  );
  let result: LogicformAPIResultType;
  if (ret) {
    result = { ...ret };
    if (refResults.length > 0) {
      let arr = [...ret.result];
      refLFs.forEach((r, index) => {
        arr = r.merge(arr, refResults[index].result);
      });
      result.result = arr;
    }
    if (transpose) {
      result = transposeResult(result, transpose, horizontalColumns);
    } else if (canUseCrossTable(logicform)) {
      result = crossResult(result, horizontalColumns);
    }
  }

  // 判断要展示的properties
  let predsToShow: PredItemType[] = preds;
  if (!predsToShow) {
    predsToShow = (result?.columnProperties || [])
      .filter((property) => !property.ui?.show_in_detail_only)
      .map((property) => property.name);
  }

  const properties = result?.columnProperties || [];

  const columns: ProColumnType[] =
    properties.length > 0
      ? predsToShow.map((predItem) => {
          if (typeof predItem === "object" && "title" in predItem) {
            return {
              title: predItem.title,
              children: predItem.children.map((pred) =>
                mapColumnItem(
                  logicform,
                  pred,
                  customColumns[pred],
                  properties,
                  exportToExcel != undefined,
                  showUnit,
                  showSorter,
                  defaultColWidth
                )
              ),
            };
          }

          return mapColumnItem(
            logicform,
            predItem,
            customColumns[predItem],
            properties,
            exportToExcel != undefined,
            showUnit,
            showSorter,
            defaultColWidth
          );
        })
      : [];

  // Groupby的id columns需要fixed
  if (logicform.groupby && columns.length > 0) {
    const groupbyCount = Array.isArray(logicform.groupby)
      ? logicform.groupby.length
      : 1;
    for (let i = 0; i < groupbyCount; i++) {
      columns[i].fixed = "left";
      // crosstable，只要第一个就行了
      if (canUseCrossTable(logicform)) {
        break;
      }
    }
  }

  // Pagination
  let pagination: false | TablePaginationConfig = false;
  if (logicform.limit > 0) {
    pagination = {
      pageSize: logicform.limit || 20,
      total: result?.total,
    };
  }
  if (paginationParams && pagination) {
    pagination = {
      ...pagination,
      ...paginationParams,
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
    dataSource: result?.result || [],
    size,
    scroll: scroll !== undefined ? scroll : { x },
    options:
      options !== undefined
        ? options
        : { reload: reload ? reload : false, setting: true, density: false },
    pagination,
    toolBarRender: () => toolBarRender,
    onChange: onTableChange,
  };

  const onExpand = async (expanded, record) => {
    if (!expanded) {
      return;
    }
    const normedLF: LogicformType = JSON.parse(JSON.stringify(logicform));
    normaliseGroupby(normedLF);
    let parentGroupByName = normedLF.groupby[0]._id;
    if (normedLF.groupby[0].level) {
      parentGroupByName = `${parentGroupByName}(${normedLF.groupby[0].level})`;
    }
    const theLogicForm = drilldownLogicform(logicform, result.schema, record);
    let res = await requestLogicform(theLogicForm);

    if (res) {
      if (formatExpandResult) {
        formatExpandResult(res);
      }

      // 一般来说，会出现expand的情况是上一层为分类信息，那么上一层的valueType是string,但是下一层可能是object，所以要在这里做一个转化
      const nameKeys = [res.columnProperties[0].name];
      if (res.columnProperties[0].schema) {
        const nameProp = getNameProperty(res.columnProperties[0].schema);
        nameKeys.push(nameProp.name);
      }

      if (canUseCrossTable(logicform)) {
        res = crossResult(res, horizontalColumns, record);
      }

      setRowChildrenMap({
        ...rowChildrenMap,
        [record._id]: res.result.map((d) => {
          return {
            ...d,
            [parentGroupByName]: _.get(d, nameKeys),
          };
        }),
      });
    }
  };

  if (expandFirstCol && result?.result?.length > 0) {
    tableProps.dataSource = result.result.map((d) => {
      if (d._id in rowChildrenMap) {
        return {
          ...d,
          children: rowChildrenMap[d._id],
        };
      }

      if (d._id && d._id.startsWith("__")) {
        // __开头的是自己增加的统计行，例如total
        return d;
      }
      return {
        ...d,
        children: [],
      };
    });
    tableProps.expandable = { onExpand, indentSize: 0 };
  }

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

  // 对transpose的columns再处理一下，去掉搜索之类的
  if (transpose) {
    tableProps.columns.forEach((col) => {
      delete col.filterDropdown;
      delete col.filterIcon;
      delete col.sorter;
    });
  }

  return (
    <div data-testid="ZETable" className={className}>
      <ProProvider.Provider
        value={{
          ...values,
          valueTypeMap: result
            ? customValueTypes({
                ...result.schema,
                properties: result.columnProperties,
              })
            : {},
        }}
      >
        {creationMode !== "list" && (
          <ProTable {...tableProps} key={JSON.stringify(logicform)} />
        )}
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

export default Table;
