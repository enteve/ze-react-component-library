// Generated with util/create-component.js
import { OptionConfig } from "@ant-design/pro-table/lib/components/ToolBar";
import type { LogicformType } from "zeroetp-api-sdk";

export interface ZETableProps {
  logicform: LogicformType;
  preds?: string[]; // 显示哪些字段
  options?: OptionConfig; // 传给ProTable的
}
