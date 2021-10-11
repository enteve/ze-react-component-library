import type { LogicformType } from "zeroetp-api-sdk";

export interface ZELogicformProps {
  logicform: LogicformType;
  dataKey?: string;
  content?: (value: any) => React.ReactNode;
  loadingKey?: string;
}
