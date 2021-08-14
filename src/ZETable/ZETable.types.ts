// Generated with util/create-component.js
import type { ProColumnType, ProTableProps } from "@ant-design/pro-table";
import type { ParamsType } from "@ant-design/pro-provider";
import type { LogicformType } from "zeroetp-api-sdk";
import type { ZESchemaFormColumnType } from "../ZESchemaForm/ZESchemaForm.types";

export declare type PredItemType =
  | string
  | { title: string; children: string[] };

export type ZETableProps = {
  logicform: LogicformType;
  preds?: PredItemType[]; // 显示哪些字段
  customColumns?: { [key: string]: ProColumnType }; // 自定义的column定义参数
  exportToExcel?: boolean | string; // 如果是string，那么就是文件名（不包含扩展名）
  xlsx?: any; // 外链的xlsx库。因为是可选的库，所以用外链的形式去做
  refLFs?: {
    logicform: LogicformType;
    merge: (mainData: any, refData: any) => any;
  }[]; // 补充的LF，用来填写一些其他的数据
  scroll?:
    | ({
        x?: string | number | true;
        y?: string | number;
      } & {
        scrollToFirstRowOnChange?: boolean;
      })
    | null; // 传给ProTable的。ZETable默认会有Scroll的。用null来关闭

  creationMode?: "form" | "list"; // form是单个单个新增，产生一个form。而list是直接在列表里面操作
  creationColumns?: ZESchemaFormColumnType[]; // 就是ZESchemaForm里面的columns属性
} & Omit<
  ProTableProps<ProColumnType, ParamsType>,
  "columns" | "request" | "pagination" | "toolBarRender" | "scroll"
>;
