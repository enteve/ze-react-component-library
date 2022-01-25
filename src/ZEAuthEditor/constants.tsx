import ZEJsonEditor from "../ZEJsonEditor";
import type { ZESchemaFormColumnType } from "../ZESchemaForm/ZESchemaForm.types";

const { ZEJsonEditorRender } = ZEJsonEditor;

export const roleColumns: ZESchemaFormColumnType[] = [
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
  // 头像暂时隐藏
  // {
  //   title: "头像",
  //   hideInForm: true,
  //   dataIndex: "avatar",
  //   valueType: "image",
  // },
  {
    title: "用户名",
    dataIndex: "username",
  },
  {
    // 这东西吧，SSO的时候不需要
    title: "密码",
    dataIndex: "password",
    valueType: "password",
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
    hideInTable: true,
    render: ZEJsonEditorRender.render,
    renderFormItem: ZEJsonEditorRender.renderFormItem,
  },
];
