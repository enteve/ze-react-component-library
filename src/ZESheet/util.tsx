import { LogicformAPIResultType, getNameProperty } from "zeroetp-api-sdk";
import React from "react";
import {
  S2CellType,
  TooltipShowOptions,
  DataCell,
  ColCell,
  RowCell,
} from "@antv/s2";
import type { CSSProperties } from "react";
import { ZESheetProps } from "./ZESheet.types";

export const getDefaultS2Config = (
  result: LogicformAPIResultType
): ZESheetProps["s2DataConfig"] => {
  if (!result) return {};

  const { logicform } = result;
  if (!logicform) throw new Error("需要有normed logicform");
  if (!logicform.groupby) throw new Error("ZESheet仅支持groupby格式");
  if (!logicform.preds) throw new Error("ZESheet仅支持groupby格式");

  const s2Config: ZESheetProps["s2DataConfig"] = {
    fields: {
      rows: result.columnProperties
        .slice(0, logicform.groupby.length)
        .map((prop) => {
          if (prop.type === "object") {
            const nameProp = getNameProperty(prop.schema);
            return `${prop.name}.${nameProp.name}`;
          }

          return prop.name;
        }),
      values: result.columnProperties
        .slice(logicform.groupby.length)
        .map((prop) => prop.name),
    },
  };

  // console.log(s2Config);

  return s2Config;
};

const renderTooltipItemList = (
  arr: { name: string; value: string | number }[],
  isSummary?: boolean,
  nameStyle?: CSSProperties
) => {
  return arr.map((d, i) => (
    <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
      <span style={{ ...nameStyle, margin: 0 }}>
        {d.name}
        {isSummary ? "(总和)" : ""}
      </span>
      <span>{d.value}</span>
    </div>
  ));
};

export const renderTooltipContent = (
  cell: S2CellType,
  options: TooltipShowOptions
) => {
  // console.log(cell, options);

  const nameStyle: CSSProperties = {
    color: "rgba(0,0,0,0.5)",
    margin: "0 0 8px 0",
  };

  if (cell instanceof DataCell) {
    const {
      data: {
        details,
        headInfo: { rows },
      },
    } = options;
    const title = rows.map((d) => d.value).join("/");
    return (
      <div style={{ padding: 12 }}>
        <div style={nameStyle}>{title}</div>
        {renderTooltipItemList(details)}
      </div>
    );
  }

  if (cell instanceof RowCell || cell instanceof ColCell || cell === null) {
    const title = cell === null ? null : cell.getActualText();
    const {
      data: { summaries },
    } = options;

    if (!summaries) {
      return null;
    }
    
    const count = summaries
      .map((d) => d.selectedData.length)
      .reduce((p, c) => p + c, 0);
    return (
      <div style={{ padding: 12 }}>
        <div
          style={{
            ...nameStyle,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {title}
          <span>
            <span style={{ color: "black", marginRight: 4 }}>
              {count}
              {` 项`}
            </span>
            已选择
          </span>
        </div>
        {!(cell instanceof ColCell) &&
          renderTooltipItemList(summaries, true, nameStyle)}
      </div>
    );
  }
  return null;
};