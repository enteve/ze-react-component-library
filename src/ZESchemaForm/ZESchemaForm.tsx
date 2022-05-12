import React, { useContext } from "react";
import type { ProFormColumnsType } from "@ant-design/pro-form";
import { message, Typography, Tag } from "antd";
import ProProvider from "@ant-design/pro-provider";
import { BetaSchemaForm } from "@ant-design/pro-form";
import { request as requestAPI } from "../request";
import type {
  ZESchemaFormProps,
  ExtendValueTypes,
  ZESchemaFormColumnType,
} from "./ZESchemaForm.types";
import { useRequest } from "@umijs/hooks";
import { request } from "../request";
import {
  getSchemaByID,
  SchemaAPIResultType,
  createData,
  updateDataByID,
  getIDProperty,
} from "zeroetp-api-sdk";
import {
  valueTypeMapping,
  valueEnumMapping,
  customValueTypes,
  findProperty,
} from "../util";

const { Text } = Typography;

const ZESchemaForm: React.FC<ZESchemaFormProps> = ({
  schemaID,
  schema: _schema,
  columns: _columns,
  propertyConfig,
  saveOnFinish = false,
  initialValues,
  ...props
}) => {
  if (!schemaID && !_schema)
    throw new Error("必须提供schemaID或schema二者其一");

  const values = useContext(ProProvider); // 用来自定义ValueType
  const { data } = _schema
    ? { data: { schema: _schema } }
    : useRequest<SchemaAPIResultType>(() => request(getSchemaByID(schemaID)));

  if (!data) return <div></div>;

  const { schema } = data;
  // 通过properties来生成columns
  let columns: ProFormColumnsType<any, ExtendValueTypes>[];

  // 给下面生成columns用的
  const propsForProperty = (
    p,
    col?: ZESchemaFormColumnType
  ): ProFormColumnsType<any, ExtendValueTypes> => {
    const formItemProps = {
      rules: [],
      initialValue: col?.initialValue || p.default,
    };
    if (p.constraints?.required && !p.udf) {
      formItemProps.rules.push({
        required: true,
        message: "此项为必填项",
      });
    }

    // valueType
    let valueType;
    if (
      propertyConfig &&
      propertyConfig[p.name] &&
      "valueType" in propertyConfig[p.name]
    ) {
      valueType = propertyConfig[p.name].valueType;
    } else {
      valueType = valueTypeMapping(p);
    }
    if (col?.valueType) {
      valueType = col.valueType;
    }

    // readonly
    let readonly = "udf" in p || p.name.indexOf(".") > 0; // 第二个判断条件是前端predChain
    if (
      propertyConfig &&
      propertyConfig[p.name] &&
      "readonly" in propertyConfig[p.name]
    ) {
      readonly = propertyConfig[p.name].readonly;
    }

    // render
    let render = undefined;
    if (p.udf) {
      // 这个readonly是给可编辑表格用的
      render = () => <Text disabled>自动计算</Text>;
    }

    const valueEnum = valueEnumMapping(p);
    const valueOptions = valueEnum
      ? Object.keys(valueEnum).map((k) => ({
          label: valueEnum[k]?.text || k,
          value: k,
        }))
      : undefined;

    const colFieldProps: any = col?.fieldProps || {};

    const tagFieldProps = p.isArray
      ? {
          mode: "tags",
          tagRender: (tagProps) => {
            const { label, closable, onClose } = tagProps;
            return (
              <Tag
                color="blue"
                onMouseDown={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                }}
                closable={closable}
                onClose={onClose}
                style={{ marginRight: 3 }}
              >
                {label}
              </Tag>
            );
          },
        }
      : {};

    const column: ProFormColumnsType<any, ExtendValueTypes> = {
      title: p.name,
      dataIndex: p.name,
      valueType,
      valueEnum: valueType === "text" ? undefined : valueEnum,
      formItemProps: { ...formItemProps, ...col?.formItemProps },
      fieldProps:
        valueType === "text"
          ? {
              options: valueOptions,
              ...colFieldProps,
              ...tagFieldProps,
            }
          : colFieldProps,
      readonly,
      render,
      tooltip: p.description,
    };
    if (readonly) {
      // 给可编辑表格用的
      column.editable = false;
    }

    return column;
  };

  if (_columns) {
    const mapCustomColumn = (col: any) => {
      // children
      if (col.columns) {
        return {
          ...col,
          columns: col.columns.map((c) => mapCustomColumn(c)),
        };
      }

      if (!col.dataIndex) return col;

      const property = findProperty(schema, col.dataIndex);
      if (!property) return col;

      return {
        ...propsForProperty(property, col),
        ...col,
        dataIndex: col.dataIndex.split("."),
      };
    };

    columns = _columns.map((c) => mapCustomColumn(c));
  } else {
    columns = schema.properties.map((p) => propsForProperty(p));
  }

  return (
    <ProProvider.Provider
      value={{
        ...values,
        valueTypeMap: customValueTypes(schema),
      }}
    >
      <BetaSchemaForm<any, ExtendValueTypes>
        layoutType="Form"
        initialValues={initialValues}
        {...props}
        columns={columns}
        onFinish={async (v) => {
          // 因为BetaSchemaForm的initialValues只会设置那些在columns里面的，所以在这里把initialValues和vmerge起来
          const values = {
            ...initialValues,
            ...v,
          };
          // 在这里进行一个转换，object变回为_id的形式
          const simplifyValue = (item) => {
            if (Array.isArray(item)) {
              return item.map((i) => simplifyValue(i));
            }

            if (typeof item === "object" && "_id" in item) {
              return item._id;
            }

            if (typeof item === "object") {
              const v = {};
              for (const key of Object.keys(item)) {
                v[key] = simplifyValue(item[key]);
              }

              return v;
            }

            return item;
          };

          for (const key of Object.keys(values)) {
            values[key] = simplifyValue(values[key]);
          }

          if (saveOnFinish) {
            if ("_id" in values) {
              // 要确认这个schema是有IDProp的
              const idProperty = getIDProperty(schema);
              if (idProperty) {
                await requestAPI(updateDataByID(schema, values._id, values));
              } else {
                message.error("暂不支持修改没有ID属性的数据");
              }
            } else {
              await requestAPI(createData(schema, values));
            }
          }

          if (props.onFinish) {
            return props.onFinish?.(values);
          }
          return true;
        }}
      />
    </ProProvider.Provider>
  );
};

export default ZESchemaForm;
