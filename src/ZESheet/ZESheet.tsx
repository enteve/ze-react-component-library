import React from "react";
import { ZESheetProps } from "./ZESheet.types";
import "@antv/s2-react/dist/style.min.css";
import { SheetComponent } from "@antv/s2-react";

const ZESheet: React.FC<ZESheetProps> = ({
  sheetType,
  s2DataConfig,
  s2Options,
}) => {
  return (
    <SheetComponent
      sheetType={sheetType}
      dataCfg={s2DataConfig}
      options={s2Options}
    />
  );
};
export default ZESheet;
