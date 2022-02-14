import React, { FC } from "react";
import { ZETableProps } from "./ZETable.types";
import ZECard from "../ZECard";

const ZETable: FC<ZETableProps> = (props) => {
  return (
    <ZECard
      logicform={props.logicform}
      tableOnly
      tableProps={props}
    />
  );
};

export default ZETable;
