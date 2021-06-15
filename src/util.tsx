import React, { useState } from "react";
import type {
  PropertyType,
  SchemaType,
  LogicformAPIResultType,
} from "zeroetp-api-sdk";
import numeral from "numeral";
import { findPropByName, getNameProperty } from "zeroetp-api-sdk";
import { Select, InputNumber, Radio } from "antd";
import { useRequest } from "@umijs/hooks";
import { requestLogicform } from "./request";

const { Option } = Select;

export const valueTypeMapping = (property: PropertyType) => {
  switch (property.type) {
    case "currency":
      return "money";
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
  if (property.constraints.enum) {
    valueEnum = {};
    property.constraints.enum.forEach((enumItem) => {
      const enumValue = Array.isArray(enumItem) ? enumItem[0] : enumItem;
      valueEnum[enumValue] = { text: enumValue };
    });
  } else if (property.primal_type === "boolean") {
    valueEnum = {
      true: {
        text: "是",
      },
      false: {
        text: "否",
      },
    };
  }

  return valueEnum;
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
      const nameProperty = getNameProperty(property.schema);

      const [search, setSearch] = useState<string>();
      const { data } = useRequest<LogicformAPIResultType>(
        () => {
          let limit = 20;
          const query = {};
          if (search) {
            query[nameProperty.name] = { $regex: search, $options: "i" };
            limit = 100;
          }

          return requestLogicform({
            schema: property.schema._id,
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
        <Option key={i._id} value={i._id}>
          {i[nameProperty.name]}（{i._id}）
        </Option>
      ));

      // 这里修改下value，原本是一个object，改成_id
      let value = props?.fieldProps?.value;
      if (property.type === "object" && value && typeof value === "object") {
        value = value._id;
      }

      return (
        <Select
          showSearch
          defaultActiveFirstOption={false}
          showArrow={false}
          filterOption={false}
          onSearch={setSearch}
          allowClear
          {...props?.fieldProps}
          value={value}
        >
          {options}
        </Select>
      );
    },
  },
  boolean: {
    render: (v: any) => <div>{v ? "✓" : "x"}</div>,
  },
});
