import { LogicformAPIResultType, LogicformType } from "zeroetp-api-sdk";

// Generated with util/create-component.js
export interface ZEChartProps {
  type: string;
  logicform: LogicformType;
  result?: LogicformAPIResultType;
  onDbClick?: (item: any, data: any, triggerBack?: boolean) => void;
  onItemSelect?: (item: any) => void;
  onChangeLogicform?: (logicform: LogicformType) => void;
  width?: number;
  height?: number;
  option?: any; // echarts的option，覆盖默认option
  targetPred?: string; // 用作目标的pred。目前只在bar chart里面起作用
  isOtherPredsSupplementary?: boolean; // 这个配置，指的是是不是其他的preds是帮助性的preds。帮助性的preds不显示在柱状图中。目前这个功能只有Gilead项目用到
}
