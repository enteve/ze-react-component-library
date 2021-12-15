import { S2Options, S2DataConfig } from "@antv/s2";

export interface ZESheetProps {
  sheetType?: "pivot" | "table" | "gridAnalysis";
  s2DataConfig: S2DataConfig;
  s2Options: S2Options;
}
