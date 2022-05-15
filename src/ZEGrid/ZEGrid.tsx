import React from "react";
import numeral from "numeral";
import { Button, Empty, Table, Tooltip } from "antd";
import { ZEGridItem, ZEGridProps } from "./ZEGrid.types";

import "./ZEGrid.less";
import type { ColumnsType, ColumnType } from "antd/lib/table";
import { DownloadOutlined } from "@ant-design/icons";

const processItem = (item: ZEGridItem) => {
  if (item && typeof item === "object" && "v" in item) {
    if (item.v === "-" || item.v === null) return "-";

    if ("formatter" in item) {
      return numeral(item.v).format(item.formatter);
    }
    return item.v;
  }

  return item;
};

const ZEGrid: React.FC<ZEGridProps> = ({
  data,
  controls,
  autoMergeForIndex,
  fix,
  loading,
  key,
  xlsx,
  exportFileName = "数据导出",
}) => {
  if (!data || data.length === 0 || data[0].length === 0) return <Empty />;

  const datasource = data.map((row, i) => {
    const rowMap = {};

    row.forEach((item, j) => {
      rowMap[`${j}`] = {
        value: processItem(item),
        id: `${j}`,
        i,
        j,
        rowSpan: 1,
        colSpan: 1,
      };

      if (item === undefined) {
        rowMap[`${j}`].colSpan = 0;
      }

      if (item !== undefined && j < row.length) {
        // 不是最后一列，计算一下colSpan
        let colSpan = 1;
        for (let jj = j + 1; jj < row.length; jj += 1) {
          if (row[jj] === undefined) {
            colSpan += 1;
          } else {
            break;
          }
        }

        rowMap[`${j}`].colSpan = colSpan;
      }

      if (autoMergeForIndex && autoMergeForIndex(i, j)) {
        // rowspan, auto merge
        if (typeof item === "string" && item.length > 0) {
          if (i > 0) {
            const prevItem = data[i - 1][j];
            if (prevItem === item) {
              rowMap[`${j}`].rowSpan = 0;
            }
          }

          if (rowMap[`${j}`].rowSpan !== 0) {
            for (let index = i + 1; index < data.length; index += 1) {
              const element = data[index][j];
              if (element === item) {
                rowMap[`${j}`].rowSpan += 1;
              } else {
                break;
              }
            }
          }
        }
      }
    });

    return rowMap;
  });

  const columns: ColumnsType<any> = data[0].map((_item, j) => {
    const col: ColumnType<any> = {
      dataIndex: `${j}`,
      align: "center",
      render: (v) => {
        if (!v) return "-";

        return {
          children: v.value,
          props: {
            colSpan: v.colSpan,
            rowSpan: v.rowSpan,
          },
        };
      },
    };

    if (fix && "col" in fix && j <= fix.col) {
      col.fixed = "left";
    }

    return col;
  });

  const tableProps: any = {};
  if (fix && "col" in fix) {
    tableProps.scroll = { x: columns.length * 100 };
  }

  const tableID = `${key || "zegrid"}`;

  return (
    <div data-testid="ZEGrid">
      {(xlsx || controls) && (
        <div style={{ display: "flex" }}>
          {controls}
          <div style={{ flexGrow: 1 }} />
          {xlsx && (
            <Tooltip title="导出Excel">
              <Button
                type="link"
                icon={<DownloadOutlined />}
                onClick={() => {
                  if (xlsx) {
                    const tbl = document.getElementById(tableID);
                    if (tbl) {
                      const workbook = xlsx.utils.table_to_book(tbl);

                      xlsx.writeFileXLSX(workbook, `${exportFileName}.xlsx`, {
                        compression: true,
                      });
                    } else {
                      console.error("没找到ID为" + tableID + "的组件");
                    }
                  }
                }}
              />
            </Tooltip>
          )}
        </div>
      )}
      <Table
        {...tableProps}
        size="small"
        loading={loading}
        dataSource={datasource}
        columns={columns}
        showHeader={false}
        bordered
        rowKey="id"
        pagination={false}
        components={{
          table: ({ children, style }: any) => (
            <table id={tableID} style={{ ...style }}>
              {children}
            </table>
          ),
        }}
      />
    </div>
  );
};

export default ZEGrid;
