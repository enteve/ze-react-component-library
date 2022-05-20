import React, { useContext, useState, useRef } from "react";
import _ from "underscore";
import { FormInstance } from "@ant-design/pro-form";
import ProTable, {
  ActionType,
  ColumnsState,
  EditableProTable,
  ProColumnType,
} from "@ant-design/pro-table";
import { SizeMe } from "react-sizeme";
import { useRequest } from "@umijs/hooks";
import ProProvider from "@ant-design/pro-provider";
import {
  Tooltip,
  Result,
  Button,
  Popconfirm,
  Drawer,
  message,
  Space,
} from "antd";
import type { TablePaginationConfig } from "antd";
import {
  DeleteOutlined,
  DownloadOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  LogicformType,
  normaliseGroupby,
  createData,
  getNameProperty,
  removeDataByID,
  updateDataByID,
  drilldownLogicform,
  commonRequest,
  findPropByName,
  isSimpleQuery,
  removeData,
} from "zeroetp-api-sdk";
import type { LogicformAPIResultType } from "zeroetp-api-sdk";
import excelExporter from "./excelExporter";
import { requestLogicform, request as requestAPI } from "../../request";
import type { TableProps, PredItemType } from "./Table.types";

import {
  customValueTypes,
  getFormatter,
  getColumnPublicProps,
} from "../../util";

import ZESchemaForm from "../../ZESchemaForm";

import "./Table.less";
import {
  getColumnDateProps,
  getColumnSearchProps,
  getColumnNumberProps,
} from "./FilterComponents";
import { canUseCrossTable, crossResult } from "../../crossTableGen";
import { transposeResult } from "./transposeGen";
import { useTableParams } from "./useTableParams";
import { logicformValueToColumnFilter } from "./util";

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
    } else if (property.primal_type === "number") {
      additionalProps = {
        ...additionalProps,
        ...getColumnNumberProps(property.name),
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
  // 去掉数字的sorter，改成filter
  // if (showSorter && property.primal_type === "number") {
  //   additionalProps.sorter = true;
  // }
  const { valueEnum, valueType, fieldProps } = getColumnPublicProps(property);
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
    filters[k] = logicformValueToColumnFilter(logicform?.query?.[k]);
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
    valueType,
    filters: valueEnum !== undefined,
    onFilter: false,
    valueEnum,
    fieldProps,
    ...additionalProps,
    width,
  };

  // unit
  if (showUnit && property.unit) {
    let unit: any = property.unit;
    const formatter = getFormatter(property, 0);
    if (formatter) {
      unit = `${formatter.prefix}${unit}${formatter.postfix}`;
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
  height,
  setLogicform,
  options = false,
  preds,
  search,
  size,
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
  expandFirstColNextLevel,
  result: ret,
  reload,
  formatExpandResult,
  ...restProps
}) => {
  const rootDivRef = useRef<HTMLDivElement>();
  const formRef = useRef<FormInstance>();
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

  // Export相关字段
  const columnsStatePersistentKey = `_columnsState_${JSON.stringify(
    _logicform
  )}`;
  let savedColumnsState: any = localStorage.getItem(columnsStatePersistentKey);
  if (savedColumnsState) {
    savedColumnsState = JSON.parse(
      localStorage.getItem(columnsStatePersistentKey)
    );
    if (Object.keys(savedColumnsState).length === 0) {
      savedColumnsState = undefined;
    }
  }
  const [columnsState, setColumnsState] =
    useState<Record<string, ColumnsState>>(savedColumnsState);

  const [creationFormVisible, setCreationFormVisible] =
    useState<boolean>(false);
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

    // columnsState可以关闭某一列的显示
    if (columnsState?.[col.dataIndex.join("_")]) {
      if (!columnsState[col.dataIndex.join("_")].show) {
        return 0;
      }
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
          onClick={() => {
            if (isSimpleQuery(result.logicform)) {
              const preds: string[] = [];

              for (const property of result.schema.properties) {
                if (columnsState) {
                  if (columnsState[property.name]?.show) {
                    if ("order" in columnsState[property.name]) {
                      preds[columnsState[property.name].order] = property.name;
                    } else {
                      preds.push(property.name);
                    }
                  }
                } else {
                  preds.push(property.name);
                }
              }

              // 如果是object类型，加一个property name列
              const populatedPreds: string[] = [];
              for (const propertyName of preds) {
                if (!propertyName) continue; // preds里面会有undefine的存在，因为show为false之后，order会跳跃
                populatedPreds.push(propertyName);
                const property = findPropByName(result.schema, propertyName);
                if (property.schema) {
                  const nameProp = getNameProperty(property.schema);
                  if (nameProp) {
                    populatedPreds.push(`${property.name}_${nameProp.name}`);
                  }
                }
              }

              // 使用api导出
              commonRequest("/dataexports", {
                method: "POST",
                data: {
                  ...result.logicform,
                  preds: populatedPreds,
                  limit: -1,
                },
              })
                .then(() =>
                  message.info("导出申请已提交，请在个人中心里面下载")
                )
                .catch((e) => {
                  message.error("导出申请发生错误，请稍后再试");
                  console.log(e);
                });
            } else {
              rootDivRef.current &&
                excelExporter(rootDivRef.current, exportFileName, xlsx);
            }
          }}
        />
      </Tooltip>
    );
  }

  let scrollY;
  if (typeof height === "number") {
    // 不同size的表头高度、分页高度不一致
    let thHeight = 47;
    let pgHeight = 40;
    switch (size) {
      case "large":
        thHeight = 55;
        pgHeight = 48;
        break;
      case "small":
        thHeight = 39;
        break;
      default:
        break;
    }
    // 减去表头高
    scrollY = height - thHeight;
    if (options !== false) {
      // 减去toolBar的高度
      scrollY = scrollY - 32;
    }
    if (pagination !== false) {
      // 减去分页的高度
      scrollY = scrollY - pgHeight;
    }
  }

  const tableProps: any = {
    cardProps: {
      bodyStyle: { padding: 0 },
    },
    ...restProps,
    columns,
    rowKey,
    search: search === undefined ? false : search,
    tableClassName: exportFileName,
    dataSource: result?.result || [],
    size,
    scroll:
      scroll !== undefined
        ? { ...scroll, y: scroll?.y || scrollY }
        : { x, y: scrollY },
    options:
      options != undefined
        ? options // 注意，这里options支持false，所以不能简写
        : {
            reload: reload || false,
            setting: false,
            density: false,
          },
    pagination,
    toolBarRender: () => toolBarRender,
    onChange: onTableChange,
  };

  // 20220504, 这个先关了。不然太多了。以后想想怎么搞比较好
  // if (isSimpleQuery(logicform) && tableProps.options?.setting) {
  //   tableProps.columnsState = {
  //     onChange: setColumnsState,
  //     persistenceType: "localStorage",
  //     persistenceKey: columnsStatePersistentKey,
  //   };
  // }

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
    const theLogicForm = drilldownLogicform(
      logicform,
      result.schema,
      record,
      expandFirstColNextLevel
    );
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
        reload?.();
      });
    }
  };
  if (creationMode === "form") {
    toolBarRender.push(
      <Tooltip title="添加数据" key="add">
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
    toolBarRender.push(
      <Tooltip title="删除数据" key="remove">
        <Popconfirm
          title="删除操作不可撤销。是否确定删除？"
          onConfirm={async () => {
            await requestAPI(removeData(logicform.schema, logicform.query));
            tableRef.current.reload();
          }}
        >
          <Button type="text" icon={<DeleteOutlined />} />
        </Popconfirm>
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
          ).then(() => {
            reload?.();
          });
        } else {
          requestAPI(updateDataByID(logicform.schema, id, record)).then(() => {
            reload?.();
          });
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
    <div
      data-testid="ZETable"
      className={["ze-table", className].filter((f) => f).join(" ")}
      ref={rootDivRef}
    >
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
            // maskClosable={false} // 防止误触
            width={500}
            onClose={() => setCreationFormVisible(false)}
            footer={
              <div style={{ display: "flex", flexDirection: "row-reverse" }}>
                <Space>
                  <Button
                    onClick={() => {
                      formRef.current?.resetFields();
                    }}
                  >
                    重置
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => {
                      formRef.current?.submit();
                    }}
                  >
                    提交
                  </Button>
                </Space>
              </div>
            }
          >
            <ZESchemaForm
              formRef={formRef}
              schemaID={logicform.schema}
              columns={creationColumns}
              initialValues={selectedRecord}
              submitter={false}
              onFinish={async (values) => {
                if (!selectedRecord) {
                  await requestAPI(createData(logicform.schema, values));
                } else {
                  await requestAPI(
                    updateDataByID(logicform.schema, selectedRecord._id, values)
                  );
                }
                setCreationFormVisible(false);
                reload?.()
              }}
            />
          </Drawer>
        )}
      </ProProvider.Provider>
    </div>
  );
};

const TableWrapper: React.FC<TableProps> = (props) => {
  if (props.height === "auto") {
    return (
      <SizeMe monitorHeight>
        {({ size: { height } }) => <Table {...props} height={height} />}
      </SizeMe>
    );
  }

  return <Table {...props} />;
};

export default TableWrapper;
