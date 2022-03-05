// Generated with util/create-component.js
import type { ProColumnType, ProTableProps } from "@ant-design/pro-table";
import type { ParamsType } from "@ant-design/pro-provider";
import type { LogicformType, LogicformAPIResultType } from "zeroetp-api-sdk";
import type { ZESchemaFormColumnType } from "../../ZESchemaForm/ZESchemaForm.types";

export type TableOnChangeParams = Parameters<
  Required<ProTableProps<ProColumnType, ParamsType>>["onChange"]
>;

export declare type PredItemType =
  | string
  | { title: string; children: string[] };

export type TableProps = {
  logicform: LogicformType;
  preds?: PredItemType[]; // 显示哪些字段
  customColumns?: { [key: string]: ProColumnType }; // 自定义的column定义参数
  exportToExcel?: boolean | string; // 如果是string，那么就是文件名（不包含扩展名）
  xlsx?: any; // 外链的xlsx库。因为是可选的库，所以用外链的形式去做
  refLFs?: {
    logicform: LogicformType;
    merge: (mainData: any, refData: any) => any;
  }[]; // 补充的LF，用来填写一些其他的数据
  // auto时自适应高度
  height?: number | "auto";
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
  defaultColWidth?: number;

  showUnit?: boolean; //是不是要在column的标题上显示unit，默认为true
  showSorter?: boolean; //是不是要在column的标题上显示sorter，默认为true

  horizontalColumns?: string[]; // 给crosstable和transpose用的，可以指定横向的groupbyProp的顺序、以及加一些数据库里没返回的列(缺失的entity之类的)
  transpose?: string; // 是否转置整个table，这个转置后的第一列的名称
  expandFirstCol?: boolean; // 表格第一列是否可展开
  expandFirstColNextLevel?: string; // 表格第一列展开的时候，可以手动指定下一层的prop

  formatExpandResult?: (result: any) => void; //
  result?: LogicformAPIResultType;
  setLogicform: (
    logicform?: LogicformType,
    logicformWithSkipAndSort?: LogicformType
  ) => void;
  reload?: (...args) => void;
} & Omit<
  ProTableProps<ProColumnType, ParamsType>,
  "columns" | "request" | "pagination" | "toolBarRender" | "scroll"
>;
