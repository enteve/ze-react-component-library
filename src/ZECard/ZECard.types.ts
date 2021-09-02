import { LogicformType } from "zeroetp-api-sdk";

export type ZECardProps = {
  title: string;
  logicform: LogicformType;
  extra?: React.ReactNode;
};
