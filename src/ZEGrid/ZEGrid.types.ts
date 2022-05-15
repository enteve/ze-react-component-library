import { number } from "echarts";
import React from "react";

export type ZEGridItem =
  | {
      v: number | string | null;
      formatter?: string; // numeral formatter
    }
  | number
  | string
  | null
  | undefined;

export interface ZEGridProps {
  data: ZEGridItem[][];
  loading?: boolean;

  /* Controls */
  controls?: React.ReactNode;

  /* XLSX导出库 */
  xlsx?: any;
  /* 用于excel导出 */
  key?: string;
  exportFileName?: string;

  /* 合并单元格 */
  autoMergeForIndex?: (row: number, col: number) => boolean;

  /* 固定表头 */
  fix?: { row?: number; col?: number };
}
