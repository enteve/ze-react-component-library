import React from "react";
import type { PropertyType, SchemaType } from "zeroetp-api-sdk";
import numeral from "numeral";
import { findPropByName, getNameProperty } from "zeroetp-api-sdk";

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
      return "text";
    case "file":
      return "file";
    default:
      break;
  }

  switch (property.primal_type) {
    case "date":
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
      return undefined;
    default:
      return undefined;
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

export const customValueTypes = (schema?: SchemaType) => ({
  percentage: {
    render: (number: number) => {
      return numeral(number).format("0.0%");
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
      console.log("renderFormItem>>>");
      console.log(text);
      console.log(props);
      console.log("<<<<<renderFormItem");
      return <div>under construction</div>;
    },
  },
  boolean: {
    render: (v: any) => <div>{v ? "✓" : "x"}</div>,
  },
});
