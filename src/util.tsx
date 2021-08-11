import React, { useState, useEffect } from "react";
import {
  PropertyType,
  SchemaType,
  LogicformAPIResultType,
  getHierarchyCodeLength,
  getIDProperty,
  findPropByName,
  getNameProperty,
} from "zeroetp-api-sdk";
import type { ProColumnType } from "@ant-design/pro-table";
import {
  getColumnDateProps,
  getColumnSearchProps,
} from "./ZETable/FilterComponents";
import numeral from "numeral";
import { EditableProTable } from "@ant-design/pro-table";
import { Select, InputNumber, Radio, Cascader, Spin, Input } from "antd";
import { useRequest } from "@umijs/hooks";
import { requestLogicform } from "./request";
import "antd/lib/cascader/style/index";

const { Option } = Select;

export const valueTypeMapping = (property: PropertyType) => {
  switch (property.type) {
    case "currency":
      return "digit"; // 不用money，不然导出Excel之后，这些列无法被操作
    case "percentage":
      return "percentage";
    case "object":
      return "object";
    case "boolean":
      return "boolean";
    case "image":
      return "image";
    case "text":
      return "textarea";
    case "file":
      return "file";
    default:
      break;
  }

  switch (property.primal_type) {
    case "date":
      if (property.granularity) {
        switch (property.granularity) {
          case "second":
          case "minute":
          case "hour":
            return "dateTime";
          case "day":
            return "date";
          case "week":
          case "month":
          // case "quarter":
          case "year":
            return `date${property.granularity
              .toUpperCase()
              .substring(0, 1)}${property.granularity.substring(1)}`;
        }
      }
      return "date";

    case "number":
      return "digit";
    case "string":
      if (property.constraints.enum) {
        if (property.constraints.enum.length >= 10) {
          return "select";
        }

        return "radio";
      }
      return "text";
    default:
      return "text";
  }
};

export const valueEnumMapping = (property: PropertyType) => {
  let valueEnum = undefined;
  if (property.primal_type === "boolean") {
    valueEnum = {
      true: {
        text: "是",
      },
      false: {
        text: "否",
      },
    };
  } else if (property.constraints.enum) {
    valueEnum = {};
    property.constraints.enum.forEach((enumItem) => {
      const enumValue = Array.isArray(enumItem) ? enumItem[0] : enumItem;
      valueEnum[enumValue] = { text: enumValue };
    });
  }

  return valueEnum;
};

export const mapColumnItem = (
  predItem: string,
  customColumn: { [key: string]: ProColumnType },
  properties: any[],
  result: LogicformAPIResultType,
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
      !property.constraints.enum
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
  if (result?.schema.type === "entity") {
    if (property.primal_type === "number") {
      additionalProps.sorter = true;
    }
  }

  const valueEnum = valueEnumMapping(property);
  const defaultColumnType: any = {
    title: property.name,
    dataIndex: property.name.split("."),
    ellipsis:
      property.primal_type === "string" &&
      !property.constraints.enum &&
      !exporting,
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

  if (customColumn[property.name]) {
    return {
      ...defaultColumnType,
      ...customColumn[property.name],
    };
  }

  return defaultColumnType;
};

export const customValueTypes = (schema: SchemaType) => ({
  percentage: {
    render: (number: number) => {
      return numeral(number).format("0.0%");
    },
    renderFormItem: (text, props) => {
      const propName = props.proFieldKey.split("-").pop();
      const property = findPropByName(schema, propName);

      // enum
      // 对于其他number类型的props，也要有enum的支持，这个之后用到了再说
      if (property.constraints?.enum) {
        return (
          <Radio.Group {...props?.fieldProps}>
            {property.constraints.enum.map((item: any) => (
              <Radio key={`${item}`} value={item}>
                {item * 100}%
              </Radio>
            ))}
          </Radio.Group>
        );
      }

      return (
        <InputNumber
          min={0}
          max={1}
          step={0.01}
          formatter={(value) => `${(value as number) * 100}%`}
          parser={(value) => parseFloat(value.replace("%", "")) / 100}
          {...props?.fieldProps}
        />
      );
    },
  },
  object: {
    render: (entity: any, props) => {
      const propName = props.proFieldKey.split("-").pop();
      const property = findPropByName(schema, propName);
      const nameProperty = getNameProperty(property.schema);

      return entity[nameProperty.name];
    },
    renderFormItem: (text, props) => {
      const propName = props.proFieldKey.split("-").pop();
      const property = findPropByName(schema, propName);

      // Object有两种表现模式，带Hierarchy的和不带Hierarchy的
      if (property.schema.hierarchy) {
        return renderObjectFormItemHierarchy(property, props);
      }

      return renderObjectFormItem(property.schema, props);
    },
  },
  boolean: {
    render: (v: any) => <div>{v ? "是" : "否"}</div>,
  },
  table: {
    renderFormItem: (text, props) => {
      const { value, onChange, placeholder } = props.fieldProps;
      const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
      const columns = props?.columns?.map((d) => {
        if (!d.dataIndex) {
          return d;
        }
        let property;
        try {
          property = findPropByName(schema, d.dataIndex);
        } catch (error) {}

        if (property) {
          const valueEnum = valueEnumMapping(property);
          const valueType = valueTypeMapping(property);
          if (valueEnum) {
            return {
              valueType,
              valueEnum,
              fieldProps: (form, config) => {
                return {
                  onChange: (v, option) => {
                    handleEditChange({
                      ...config.entry,
                      [d.dataIndex]: v,
                    });
                  },
                };
              },
              ...d,
            };
          }
          if (property.primal_type === "object") {
            return {
              valueType,
              renderFormItem: (item, itemProps) => {
                return (
                  <ObjectColumnSelect
                    {...d.fieldProps}
                    schema={property.schema}
                    onChange={(v, option) => {
                      handleEditChange({
                        ...item.entry,
                        [d.dataIndex]: v,
                        "@option": option,
                      });
                    }}
                  />
                );
              },
              ...d,
            };
          }
        }
        return {
          fieldProps: (form, config) => {
            return {
              onChange: (v) =>
                handleEditChange({
                  ...config.entry,
                  [d.dataIndex]: v,
                }),
            };
          },
          ...d,
        };
      });

      function handleEditChange(newRecord) {
        if (value instanceof Array) {
          const index = value.findIndex((d) => d?.id === newRecord?.id);
          const newArr = [...value];
          if (index > -1) {
            newArr[index] = newRecord;
          } else {
            newArr.push(newRecord);
          }
          onChange(newArr);
        } else {
          onChange([newRecord]);
        }
      }

      function handleDataSource(v) {
        onChange(v);
      }

      useEffect(() => {
        if (value instanceof Array) {
          setEditableRowKeys(value.map((d) => d?.id));
        }
      }, [value]);

      return (
        <EditableProTable
          value={value}
          onChange={handleDataSource}
          controlled
          rowKey="id"
          toolBarRender={false}
          columns={columns}
          recordCreatorProps={{
            newRecordType: "dataSource",
            position: !value || value?.length === 0 ? "top" : "bottom",
            creatorButtonText: placeholder,
            record: () => ({
              id: Date.now(),
            }),
          }}
          editable={{
            type: "multiple",
            editableKeys,
            onChange: setEditableRowKeys,
            actionRender: (row, _, dom) => {
              return [dom.delete];
            },
          }}
        />
      );
    },
  },
});

function ObjectColumnSelect({ schema, ...fieldProps }) {
  return renderObjectFormItem(schema, { fieldProps });
}

// 不带Hierarchy的，渲染object类型的
const renderObjectFormItem = (schema, props: any) => {
  const nameProperty = getNameProperty(schema);

  const [search, setSearch] = useState<string>();
  const { data } = useRequest<LogicformAPIResultType>(
    () => {
      // console.log(props);
      let limit = 20;
      const query = { ...props?.fieldProps?.query };
      if (search) {
        query[nameProperty.name] = { $regex: search, $options: "i" };
        limit = 100;
      }

      return requestLogicform({
        schema: schema._id,
        query,
        limit,
      });
    },
    {
      formatResult: (res) => res.result,
      initialData: [],
      refreshDeps: [search],
    }
  );

  const options = (data as any[]).map((i) => (
    <Option {...i} key={i._id} value={i._id}>
      {i[nameProperty.name]}（{i._id}）
    </Option>
  ));

  // 这里修改下value，原本是一个object，改成_id
  let value = props?.fieldProps?.value;
  if (value && typeof value === "object") {
    value = value._id;
  }

  return (
    <Select
      showSearch
      defaultActiveFirstOption={false}
      showArrow={false}
      filterOption={false}
      onSearch={setSearch}
      placeholder="请选择"
      allowClear
      {...props?.fieldProps}
      value={value}
    >
      {options}
    </Select>
  );
};

// 带Hierarchy的，渲染object类型的
const renderObjectFormItemHierarchy = (property: PropertyType, props: any) => {
  const { schema } = property;
  const nameProperty = getNameProperty(schema);

  // 设定其实的cascade的level
  let startCodeLength = 1;
  if (property.ui?.startLevel) {
    startCodeLength = getHierarchyCodeLength(schema, property.ui.startLevel);
  }

  const { data, loading } = useRequest<LogicformAPIResultType>(
    () => {
      const query = {};
      if (property.level) {
        const codeLength = getHierarchyCodeLength(schema, property.level);
        if (codeLength > 0) {
          const idProperty = getIDProperty(schema);

          query[idProperty.name] = {
            $regex: `^.{${startCodeLength},${codeLength}}$`,
          };
        }
      }

      return requestLogicform({
        schema: schema._id,
        limit: -1,
        query,
        sort: { _id: 1 },
      });
    },
    {
      formatResult: (res) => {
        // 注意，这套转化算法的前提是，服务器
        const { result } = res;
        if (result.length === 0) return [];

        const cascaded = [];
        const cascadedMap = {};
        result.forEach((item) => {
          const option = {
            value: item._id,
            label: item[nameProperty.name],
            children: [],
          };
          cascadedMap[option.value] = option;

          // 第一个item
          if (cascaded.length === 0) {
            cascaded.push(option);
            return;
          }

          // 其他与第一个item平级的
          if (cascaded[0].value.length === item._id.length) {
            cascaded.push(option);
            return;
          }

          // 计算parentID的length
          let parentIDLength = schema.hierarchy[0].code_length;

          for (let i = 1; i < schema.hierarchy.length; i++) {
            const levelLength = schema.hierarchy[i].code_length;
            if (parentIDLength + levelLength >= item._id.length) {
              break;
            }
            parentIDLength += levelLength;
          }
          let parentID;
          if (parentIDLength < item._id.length) {
            parentID = item._id.substring(0, parentIDLength);
          }

          if (!parentID) {
            cascaded.push(option);
            return;
          }

          if (cascadedMap[parentID]) {
            cascadedMap[parentID].children.push(option);
          } else {
            // 跳脱了原来的层次结构。目前出现于香港和澳门
            // console.log(option);
            // console.log(parentID);
            // console.log(cascadedMap);
          }
        });

        return cascaded;
      },
      initialData: [],
    }
  );

  // Cascader组件所维护的值是一个数组，这里要做一些改造
  // 设定value
  let value: any = undefined;
  if (props?.fieldProps?.value) {
    value = props?.fieldProps?.value;
    if (!Array.isArray(value) && typeof value === "object") {
      value = value._id;
    }

    const newValue = [];
    let totalCodeLength = 0;

    schema.hierarchy.forEach((h: any) => {
      totalCodeLength += h.code_length;

      if (startCodeLength <= totalCodeLength) {
        newValue.push(value.slice(0, totalCodeLength));
      }
    });

    value = newValue;
  }

  return (
    <Spin spinning={loading}>
      <Cascader
        {...props?.fieldProps}
        expandTrigger="hover"
        options={data}
        showSearch
        value={value}
        onChange={(val: string[]) => {
          if (props?.fieldProps?.onChange) {
            props.fieldProps.onChange(val[val.length - 1]);
          }
        }}
      />
    </Spin>
  );
};
