import { S2Options, S2DataConfig } from "@antv/s2";
import React from "react";
import { LogicformAPIResultType, LogicformType } from "zeroetp-api-sdk";

export interface ZESheetProps {
  logicform?: LogicformType;
  result?: LogicformAPIResultType;
  sheetType?: "pivot" | "table" | "gridAnalysis";
  s2DataConfig?: Omit<S2DataConfig, "data">;
  s2Options?: Partial<S2Options>;
  xlsx?: any; // 外链的xlsx库。因为是可选的库，所以用外链的形式去做
  showExport?: boolean;
  showEditor?: boolean; // 是否支持编辑模式
  style?: React.CSSProperties;
  onSave?: (values: {
    logicform?: LogicformType;
    s2DataConfig?: Omit<S2DataConfig, "data">;
    s2Options?: Partial<S2Options>;
  }) => void;

  showInterval?: boolean; // 是否显示柱状图标记
}
