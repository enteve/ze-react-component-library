import { LogicformAPIResultType, LogicformType } from "zeroetp-api-sdk";
import { TableProps } from "./Table/Table.types";
import { ZEChartProps } from "../ZEChart/ZEChart.types";
import { ZELogicformVisualizerProps } from "../ZELogicformVisualizer/ZELogicformVisualizer.types";

export type ZECardProps = {
  title?: string;
  logicform: LogicformType;
  formatResult?: (data: any) => any;
  representation?: string;
  warning?: string; // 显示在visualizer下方，一个warning
  extra?: React.ReactNode;
  mainContent?: (
    logicform: LogicformType,
    result: LogicformAPIResultType
  ) => React.ReactNode | null; // 可以用来替换主要的返回的显示内容，做到高度自定义化
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

  tableProps?: Omit<
    TableProps,
    "logicform" | "result" | "setLogicform" | "reload" | "onChange"
  >;
  visualizerProps?: Omit<ZELogicformVisualizerProps, "logicform">;
  chartProps?: Omit<ZEChartProps, "logicform" | "type">;
  horizontalBarChart?: boolean; //是不是用横向的barchart

  pieThreshold?: number; // distincts数量小于多少自动用pie，默认为5
  dashboardID?: string;
  pinable?: boolean;
  close?: () => void;
  enableGroupByMenu?: boolean;
};
