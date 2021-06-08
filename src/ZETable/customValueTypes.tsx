import React from "react";
import numeral from "numeral";
import { findPropByName, getNameProperty, SchemaType } from "zeroetp-api-sdk";

export default (schema?: SchemaType) => ({
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
  },
  boolean: {
    render: (v: any) => <div>{v ? "✓" : "x"}</div>,
  },
});
