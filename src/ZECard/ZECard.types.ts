import { LogicformAPIResultType, LogicformType } from "zeroetp-api-sdk";
import { ZETableProps } from "../ZETable/ZETable.types";
import { LogicFormVisualizerProps } from "../ZELogicform/LogicFormVisualizer";

export type ZECardProps = {
  title?: string;
  logicform: LogicformType;
  representation?: string;
  warning?: string; // 显示在visualizer下方，一个warning
  extra?: React.ReactNode;
  mainContent?: (logicform: LogicformType) => React.ReactNode; // 可以用来替换主要的返回的显示内容，做到高度自定义化
  footer?: React.ReactNode | ((logicform: LogicformType) => React.ReactNode);
  bodyStyle?: React.CSSProperties;
  getResult?: (result: LogicformAPIResultType) => void;
  exportToExcel?: boolean | string; // 传给ZETable
  xlsx?: any; // 外链的xlsx库。给到ZETable的
  showMainContentOnly?: boolean; // 是不是只显示最主要的content，其他都不显示。主要用在嵌套在其他component里面
  showRecommender?: boolean; // 是不是要显示更多推荐的相关数值

  tableProps?: Omit<ZETableProps, "logicform">;
  visualizerProps?: Omit<LogicFormVisualizerProps, "logicform">;
};
