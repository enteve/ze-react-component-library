import type { LogicformAPIResultType, LogicformType } from "zeroetp-api-sdk";

export interface ZELogicformProps {
  logicform: LogicformType;
  dataKey?: string;
  content?: (value: any, result?: LogicformAPIResultType) => React.ReactNode;
  loadingKey?: string;
}
