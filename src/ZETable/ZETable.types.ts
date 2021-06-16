// Generated with util/create-component.js
import type { OptionConfig } from "@ant-design/pro-table/lib/components/ToolBar";
import type { LogicformType } from "zeroetp-api-sdk";

export declare type PredItemType =
  | string
  | { title: string; children: string[] };
export interface ZETableProps {
  logicform: LogicformType;
  preds?: PredItemType[]; // 显示哪些字段
  titleMap?: { [key: string]: string }; // 字段在表格上显示什么样的标题
  customRender?: { [key: string]: Function }; // 自定义的render函数
  options?: OptionConfig | false; // 传给ProTable的
  scroll?:
    | ({
        x?: string | number | true;
        y?: string | number;
      } & {
        scrollToFirstRowOnChange?: boolean;
      })
    | null; // 传给ProTable的。ZETable默认会有Scroll的。用null来关闭
  className?: string;
  bordered?: boolean;
}
