// Generated with util/create-component.js
import { ProColumnType } from "@ant-design/pro-table";
import type { OptionConfig } from "@ant-design/pro-table/lib/components/ToolBar";
import type { LogicformType } from "zeroetp-api-sdk";

export interface ZETableProps {
  logicform: LogicformType;
  preds?: string[]; // 显示哪些字段
  titleMap?: { [key: string]: string }; // 字段在表格上显示什么样的标题
  customRender?: { [key: string]: Function }; // 自定义的render函数
  additionalColumns?: ProColumnType[]; // 在表格的最后添加各种自定义的列
  options?: OptionConfig; // 传给ProTable的
  scroll?: {
    x?: string | number | true;
    y?: string | number;
  } & {
    scrollToFirstRowOnChange?: boolean;
  }; // 传给ProTable的。ZETable默认会有Scroll的。用null来关闭
  className?: string;
}
