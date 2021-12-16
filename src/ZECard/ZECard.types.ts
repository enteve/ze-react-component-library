import { LogicformAPIResultType, LogicformType } from "zeroetp-api-sdk";
import { ZETableProps } from "../ZETable/ZETable.types";
import { LogicFormVisualizerProps } from "../ZELogicform/LogicFormVisualizer";
import { ZEChartProps } from "..";

export type ZECardProps = {
  title?: string;
  logicform: LogicformType;
  formatResult?: (data: any) => any;
  representation?: string;
  warning?: string; // 显示在visualizer下方，一个warning
  extra?: React.ReactNode;
  mainContent?: (logicform: LogicformType) => React.ReactNode; // 可以用来替换主要的返回的显示内容，做到高度自定义化
  footer?: React.ReactNode | ((logicform: LogicformType) => React.ReactNode);
  compact?: boolean; // 是否排版紧凑一点
  size?: "default" | "small";
  headStyle?: React.CSSProperties;
  bodyStyle?: React.CSSProperties;
  getResult?: (result: LogicformAPIResultType) => void;
  exportToExcel?: boolean | string; // 传给ZETable
  xlsx?: any; // 外链的xlsx库。给到ZETable的
  showMainContentOnly?: boolean; // 是不是只显示最主要的content，其他都不显示。主要用在嵌套在其他component里面

  // Recommender相关
  showRecommender?: boolean; // 是不是要显示更多推荐的相关数值
  askMore?: (question: string) => void;

  tableProps?: Omit<ZETableProps, "logicform">;
  visualizerProps?: Omit<LogicFormVisualizerProps, "logicform">;
  chartProps?: Omit<ZEChartProps, "logicform" | "type">;
  horizontalBarChart?: boolean; //是不是用横向的barchart

  pieThreshold?: number; // distincts数量小于多少自动用pie，默认为5
  dashboardID?: string;
  pinable?: boolean;
  enableGroupByMenu?: boolean;
};
