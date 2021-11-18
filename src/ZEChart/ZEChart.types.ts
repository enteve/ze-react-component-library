import { LogicformAPIResultType, LogicformType } from "zeroetp-api-sdk";

// Generated with util/create-component.js
export interface ZEChartProps {
  type: string;
  logicform: LogicformType;
  result?: LogicformAPIResultType;
  onDbClick?: (item: any, triggerBack?: boolean) => void;
  onChangeLogicform?: (logicform: LogicformType) => void;
  width?: number;
  height?: number;
  option?: any; // echarts的option，覆盖默认option
  targetPred?: string; // 用作目标的pred。目前只在bar chart里面起作用
}
