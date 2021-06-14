import { FormItemProps, ProFormProps } from "@ant-design/pro-form";
import { ProColumnsValueType } from "@ant-design/pro-table";
import { SchemaType } from "zeroetp-api-sdk";

// Generated with util/create-component.js
export type ZEProFromProps = ProFormProps & {
  schemaID: string;
};

export type ZEProFromItemProps = {
  schema: SchemaType;
  propertyName: string;
  [key: string]: any; // 其他的所有Properties
};
