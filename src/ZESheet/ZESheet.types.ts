import { S2Options, S2DataConfig } from "@antv/s2";
import React, { ReactNode } from "react";
import { LogicformAPIResultType, LogicformType } from "zeroetp-api-sdk";

export interface ZESheetProps {
  // Data
  logicform?: LogicformType;
  result?: LogicformAPIResultType;

  // S2 Config
  sheetType?: "pivot" | "table" | "gridAnalysis";
  s2DataConfig?: Omit<S2DataConfig, "data">;
  s2Options?: Partial<S2Options>;
  entityTooltipCardProps?: {
    width?: number;
    height?: number;
    extra?: ReactNode;
  };

  // functions
  onChange?: (s2DataConfig?: Omit<S2DataConfig, "data">) => void;
  onRow?: (record: any) => void;

  // Export
  showExport?: boolean;
  xlsx?: any; // 外链的xlsx库。因为是可选的库，所以用外链的形式去做

  style?: React.CSSProperties;
  showInterval?: boolean; // 是否显示柱状图标记
  showSwitcher?: boolean; // 行列转化控件
}
