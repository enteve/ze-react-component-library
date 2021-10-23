import { LogicformAPIResultType, LogicformType } from "zeroetp-api-sdk";

// Generated with util/create-component.js
export interface ZEChartProps {
  type: string;
  logicform: LogicformType;
  result?: LogicformAPIResultType;
  onDbClick?: (item: any) => void;
  onChangeLogicform?: (logicform: LogicformType) => void;
  width?: number;
  coloringMap?: (record: any) => string;
  option?: any; // echarts的option，覆盖默认option
}
