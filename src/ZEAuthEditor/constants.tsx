import type { ZESchemaFormColumnType } from "../ZESchemaForm/ZESchemaForm.types";
export const roleColumns: ZESchemaFormColumnType[] = [
  {
    title: "_id",
    dataIndex: "_id",
    hideInForm: true,
  },
  {
    title: "角色",
    dataIndex: "role",
  },
  {
    title: "resource",
    dataIndex: "resource",
  },
];

export const accountColumns: ZESchemaFormColumnType[] = [
  {
    title: "_id",
    dataIndex: "_id",
    hideInForm: true,
  },
  {
    title: "头像",
    hideInForm: true,
    dataIndex: "avatar",
    valueType: "image",
  },
  {
    title: "用户名",
    dataIndex: "username",
  },
  {
    title: "名字",
    dataIndex: "name",
  },
  {
    title: "角色",
    dataIndex: "role",
    valueType: "select",
  },
  {
    title: "default_query",
    dataIndex: "default_query",
    valueType: "json" as any,
    hideInTable: true,
  }
];
