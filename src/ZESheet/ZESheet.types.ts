import { S2Options, S2DataConfig } from "@antv/s2";
import { LogicformAPIResultType, LogicformType } from "zeroetp-api-sdk";

export interface ZESheetProps {
  logicform: LogicformType;
  result?: LogicformAPIResultType;
  sheetType?: "pivot" | "table" | "gridAnalysis";
  s2DataConfig: Omit<S2DataConfig, "data">;
  s2Options?: S2Options;
  showExport?: boolean;
}
