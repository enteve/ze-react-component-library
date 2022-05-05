import React, { FC } from "react";
import { ZETableProps } from "./ZETable.types";
import ZECard from "../ZECard";

const ZETable: FC<ZETableProps> = ({
  logicform,
  allowDrillDown,
  ...tableProps
}) => {
  return (
    <ZECard
      logicform={logicform}
      showMainContentOnly
      representation="table"
      allowDrillDown={allowDrillDown}
      tableProps={tableProps}
    />
  );
};

export default ZETable;
