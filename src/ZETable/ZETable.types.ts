// Generated with util/create-component.js
import { ProColumnType } from "@ant-design/pro-table";
import type { OptionConfig } from "@ant-design/pro-table/lib/components/ToolBar";
import type { LogicformType } from "zeroetp-api-sdk";

export interface ZETableProps {
  logicform: LogicformType;
  preds?: string[]; // 显示哪些字段
  customRender?: any; // 自定义的render函数
  additionalColumns?: ProColumnType[]; // 在表格的最后添加各种自定义的列
  options?: OptionConfig; // 传给ProTable的
}
