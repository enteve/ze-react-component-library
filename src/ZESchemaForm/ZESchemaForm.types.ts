import { ProFormColumnsType, ProFormProps } from "@ant-design/pro-form";
import { SchemaType } from "zeroetp-api-sdk";
import { FormSchema } from "@ant-design/pro-form/lib/components/SchemaForm";
export type ExtendValueTypes =
  | "percentage"
  | "object"
  | "boolean"
  | "file"
  | "table";

// Generated with util/create-component.js
export type ZESchemaFormColumnType = ProFormColumnsType<
  ProFormColumnsType,
  ExtendValueTypes
>;
export type ZESchemaFormProps = Omit<FormSchema<any>, "columns"> & {
  schemaID?: string;
  schema?: SchemaType;
  columns?: ZESchemaFormColumnType[];
  isKeyPressSubmit?: ProFormProps["isKeyPressSubmit"];
  propertyConfig?: {
    [key: string]: {
      readonly?: boolean;
      valueType?: string;
    };
  };
  saveWhenFinish?: boolean; // 是否要直接把数据存入服务器
};
