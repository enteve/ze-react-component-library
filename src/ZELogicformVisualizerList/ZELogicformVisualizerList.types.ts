import type { LogicformType } from "zeroetp-api-sdk";

export interface ZELogicformVisualizerListProps {
  logicforms: LogicformType[];
  onClick?: (logicform: LogicformType) => void;
}
