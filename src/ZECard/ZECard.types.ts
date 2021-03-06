import {
  LogicformAPIResultType,
  LogicformType,
  RepresentationType,
} from "zeroetp-api-sdk";
import { TableProps } from "./Table/Table.types";
import { ZESheetProps } from "../ZESheet/ZESheet.types";
import { ZEChartProps } from "../ZEChart/ZEChart.types";
import { ZELogicformVisualizerProps } from "../ZELogicformVisualizer/ZELogicformVisualizer.types";
import { ZEValueDisplayerProps } from "../ZEValueDisplayer/ZEValueDisplayer";
import { Fields } from "@antv/s2";

export type ZECardOnChangeParams = {
  logicform?: LogicformType;
  representation?: string;
  chartProps?: {
    userChartOptionStr?: Record<string, string>;
  }
  sheetProps?: {
    s2DataConfig?: {
      fields?: Fields;
    };
  };
};

export type ZECardProps = {
  title?: string;
  titleRender?: (title?: string) => React.ReactNode;
  logicform?: LogicformType;
  formatResult?: (data: any) => any;
  representation?: RepresentationType;
  warning?: string; // 显示在visualizer下方，一个warning
  extra?: React.ReactNode;
  mainContent?: (
    logicform: LogicformType,
    result: LogicformAPIResultType,
    changeLogicform?: (logicform: LogicformType) => void
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
  showRepresentationChanger?: boolean;
  // Recommender相关
  showRecommender?: boolean; // 是不是要显示更多推荐的相关数值
  askMore?: (question: string, logicform: LogicformType) => void;

  tableProps?: Omit<
    TableProps,
    "logicform" | "result" | "setLogicform" | "reload" | "onChange"
  >;
  sheetProps?: Omit<ZESheetProps, "logicform" | "result" | "onChange">;
  // Visualizer
  showVisualizer?: boolean;
  visualizerProps?: Omit<ZELogicformVisualizerProps, "logicform">;

  chartProps?: Omit<ZEChartProps, "logicform" | "type">;
  horizontalBarChart?: boolean; //是不是用横向的barchart
  pieThreshold?: number; // distincts数量小于多少自动用pie，默认为5
  isOtherPredsSupplementary?: boolean; // 是不是其他的preds是帮助性的preds。帮助性的preds不计入pred count中

  valueDisplayerProps?: Omit<ZEValueDisplayerProps, "data">;

  dashboardID?: string;
  pinable?: boolean;
  close?: () => void;
  enableGroupByMenu?: boolean;
  onChange?: (params: ZECardOnChangeParams) => void;

  askError?: string;
  askErrorHelperLink?: string;

  useSheet?: boolean; // 临时字段，是否使用ZESheet替代ZETable

  allowDrillDown?: boolean;
  preprocessDrilldownLogicform?: (logicform: LogicformType) => void; // 在某些前端逻辑下，需要再对自动生成的drilldown lf做一下处理。此函数会修改input logicform
};
