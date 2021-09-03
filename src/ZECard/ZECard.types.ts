import { LogicformAPIResultType, LogicformType } from "zeroetp-api-sdk";

export type ZECardProps = {
  title: string;
  logicform: LogicformType;
  representation?: string;
  extra?: React.ReactNode;
  bodyStyle?: React.CSSProperties;
  getResult?: (result: LogicformAPIResultType) => void;
  exportToExcel?: boolean | string; // 传给ZETable
  xlsx?: any; // 外链的xlsx库。给到ZETable的
};
