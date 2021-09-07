import { LogicformAPIResultType, LogicformType } from "zeroetp-api-sdk";

export type ZECardProps = {
  title: string;
  logicform: LogicformType;
  representation?: string;
  extra?: React.ReactNode;
  footer?: React.ReactNode;
  bodyStyle?: React.CSSProperties;
  getResult?: (result: LogicformAPIResultType) => void;
  exportToExcel?: boolean | string; // 传给ZETable
  xlsx?: any; // 外链的xlsx库。给到ZETable的
  showRecommender?: boolean; // 是不是要显示更多推荐的相关数值
};
