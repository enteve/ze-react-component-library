import React, { FC } from "react";
import { ZETableProps } from "./ZETable.types";
import ZECard from "../ZECard";

const ZETable: FC<ZETableProps> = ({ logicform, ...tableProps }) => {
  return (
    <ZECard
      logicform={logicform}
      showMainContentOnly
      representation="table"
      tableProps={tableProps}
    />
  );
};

export default ZETable;
