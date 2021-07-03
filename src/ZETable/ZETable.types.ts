// Generated with util/create-component.js
import { ProColumnType } from "@ant-design/pro-table";
import type { OptionConfig } from "@ant-design/pro-table/lib/components/ToolBar";
import type { LogicformType } from "zeroetp-api-sdk";

export declare type PredItemType =
  | string
  | { title: string; children: string[] };
export interface ZETableProps {
  logicform: LogicformType;
  preds?: PredItemType[]; // 显示哪些字段
  customColumn?: { [key: string]: ProColumnType }; // 自定义的column定义参数
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
  exportToExcel?: boolean | string; // 如果是string，那么就是文件名（不包含扩展名）
  refLFs?: {
    logicform: LogicformType;
    merge: (mainData: any, refData: any) => any;
  }[]; // 补充的LF，用来填写一些其他的数据
}
