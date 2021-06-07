// Generated with util/create-component.js
import { ProColumnType } from "@ant-design/pro-table";
import type { OptionConfig } from "@ant-design/pro-table/lib/components/ToolBar";
import type { LogicformType } from "zeroetp-api-sdk";

export interface ZETableProps {
  logicform: LogicformType;
  additionalColumns?: ProColumnType[]; // 在表格的最后添加各种自定义的列
  preds?: string[]; // 显示哪些字段
  options?: OptionConfig; // 传给ProTable的
}
