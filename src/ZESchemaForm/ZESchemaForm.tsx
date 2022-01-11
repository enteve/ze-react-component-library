import React, { useContext } from "react";
import type { ProFormColumnsType } from "@ant-design/pro-form";
import ProProvider from "@ant-design/pro-provider";
import { BetaSchemaForm } from "@ant-design/pro-form";
import type {
  ZESchemaFormProps,
  ExtendValueTypes,
  ZESchemaFormColumnType,
} from "./ZESchemaForm.types";
import { useRequest } from "@umijs/hooks";
import { request } from "../request";
import { getSchemaByID, SchemaAPIResultType } from "zeroetp-api-sdk";
import {
  valueTypeMapping,
  valueEnumMapping,
  customValueTypes,
  findProperty,
} from "../util";

const ZESchemaForm: React.FC<ZESchemaFormProps> = ({
  schemaID,
  columns: _columns,
  propertyConfig,
  ...props
}) => {
  const values = useContext(ProProvider); // 用来自定义ValueType
  const { data } = useRequest<SchemaAPIResultType>(() =>
    request(getSchemaByID(schemaID))
  );

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
    if (p.constraints.required && !p.udf) {
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

    // readonly
    let readonly = p.udf || p.name.indexOf(".") > 0; // 第二个判断条件是前端predChain
    if (
      propertyConfig &&
      propertyConfig[p.name] &&
      "readonly" in propertyConfig[p.name]
    ) {
      readonly = propertyConfig[p.name].readonly;
    }

    // render
    let render = undefined;
    if (p.udf && !readonly) {
      // 这个readonly是给可编辑表格用的
      render = () => <div>自动计算</div>;
    }

    const column: ProFormColumnsType<any, ExtendValueTypes> = {
      title: p.name,
      dataIndex: p.name,
      valueType,
      valueEnum: valueType === "text" ? undefined : valueEnumMapping(p),
      formItemProps: { ...formItemProps, ...col?.formItemProps },
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
        {...props}
        columns={columns}
        onFinish={async (values) => {
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

          return props.onFinish?.(values);
        }}
      />
    </ProProvider.Provider>
  );
};

export default ZESchemaForm;
