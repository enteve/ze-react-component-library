import { ProFormColumnsType } from "@ant-design/pro-form";
import { FormSchema } from "@ant-design/pro-form/lib/components/SchemaForm";

// Generated with util/create-component.js
export type ZEFromProps = Omit<FormSchema<any>, "columns"> & {
  schemaID: string;
  columns?: ProFormColumnsType[];
};
