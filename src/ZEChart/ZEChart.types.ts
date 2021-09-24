import { LogicformAPIResultType, LogicformType } from "zeroetp-api-sdk";

// Generated with util/create-component.js
export interface ZEChartProps {
  type: string;
  logicform: LogicformType;
  result?: LogicformAPIResultType;
  onChangeLogicform?: (logicform: LogicformType) => void;
}
