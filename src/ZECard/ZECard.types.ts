import { LogicformAPIResultType, LogicformType } from "zeroetp-api-sdk";

export type ZECardProps = {
  title: string;
  logicform: LogicformType;
  representation?: string;
  extra?: React.ReactNode;
  getResult?: (result: LogicformAPIResultType) => void;
};
