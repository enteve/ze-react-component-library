import React, { useContext } from "react";
import type { ProFormColumnsType } from "@ant-design/pro-form";
import ProProvider from "@ant-design/pro-provider";
import { BetaSchemaForm } from "@ant-design/pro-form";
import type { ZESchemaFromProps, ExtendValueTypes } from "./ZESchemaForm.types";
import { useRequest } from "@umijs/hooks";
import { request } from "../request";
import { getSchemaByID, SchemaAPIResultType } from "zeroetp-api-sdk";
import { valueTypeMapping, valueEnumMapping, customValueTypes } from "../util";

const ZESchemaForm: React.FC<ZESchemaFromProps> = ({
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
  const propsForProperty = (p): ProFormColumnsType<any, ExtendValueTypes> => {
    const formItemProps = {
      rules: [],
      initialValue: undefined,
    };
    if(p.default){
      formItemProps.initialValue = p.default;
    }
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
    let readonly = p.udf;
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
      render = () => <div>自动计算</div>;
    }

    return {
      title: p.name,
      dataIndex: p.name,
      valueType,
      valueEnum: valueEnumMapping(p),
      formItemProps,
      readonly,
      render,
      tooltip: p.description,
    };
  };

  if (_columns) {
    const mapCustomColumn = (col: any) => {
      // children
      if (col.columns && col.valueType !== "table") {
        return {
          ...col,
          columns: col.columns.map((c) => mapCustomColumn(c)),
        };
      }

      if (!col.dataIndex) {
        return col;
      }

      const property = schema.properties.find((p) => p.name === col.dataIndex);

      return {
        ...propsForProperty(property),
        ...col,
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
      <BetaSchemaForm<any, ExtendValueTypes> {...props} columns={columns} />
    </ProProvider.Provider>
  );
};

export default ZESchemaForm;
