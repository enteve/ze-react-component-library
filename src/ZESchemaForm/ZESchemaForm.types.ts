import { ProFormColumnsType } from "@ant-design/pro-form";
import { FormSchema } from "@ant-design/pro-form/lib/components/SchemaForm";
export type ExtendValueTypes = "percentage" | "object" | "boolean" | "file" | "table";

// Generated with util/create-component.js
export type ZESchemaFromColumnType = ProFormColumnsType<ProFormColumnsType, ExtendValueTypes>;
export type ZESchemaFromProps = Omit<FormSchema<any>, "columns"> & {
  schemaID: string;
  columns?: ZESchemaFromColumnType[];
  propertyConfig?: {
    [key: string]: {
      readonly?: boolean;
      valueType?: string;
    };
  };
};
