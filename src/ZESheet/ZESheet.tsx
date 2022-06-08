import React, { useRef, useState, useEffect } from "react";
import { ZESheetProps } from "./ZESheet.types";
import { SheetComponent, Switcher } from "@antv/s2-react";
import { SpreadSheet, copyData, S2Options } from "@antv/s2";
import {
  getNameProperty,
  LogicformAPIResultType,
  LogicformType,
} from "zeroetp-api-sdk";
import { useRequest } from "@umijs/hooks";
import { findProperty, formatWithProperty } from "../util";
import { requestLogicform } from "../request";
import { Result, Button, Tooltip, Space } from "antd";
import flatten from "flat";
import { S2DataConfig } from "@antv/s2";
import { DownloadOutlined } from "@ant-design/icons";
import "@antv/s2-react/dist/style.min.css";
import { getDefaultS2Config, renderTooltipContent } from "./util";
import excelExporter from "./excelExporter";
import "./ZESheet.less";

// Tableau的颜色配置，先留在这里
// const colors = [
//   "#e49243",
//   "#6a9e58",
//   "#d1605e",
//   "#e7c960",
//   "#5779a3",
//   "#a87c9f",
// ];

const ZESheet: React.FC<ZESheetProps> = ({
  logicform,
  result,
  sheetType,
  entityTooltipCardProps,
  s2DataConfig: s2DataConfigSrc,
  s2Options: s2OptionsSrc,
  showExport = true,
  xlsx,
  style = {},
  showInterval = false,
  showSwitcher = true,
  onChange,
  onRow,
}) => {
  // 加上一点default的设置
  // 此处类型用any，不用ZESheetProps["s2Options"]，因为s2Options.totals.row里面的属性是readonly，很奇怪
  const s2Options: any = {
    totals: {
      row: {
        showGrandTotals: true,
        showSubTotals: true,
      },
    },
    conditions: {
      interval: [],
    },
    interaction: {
      enableCopy: true,
    },
    ...s2OptionsSrc,
  };

  const s2Ref = useRef<SpreadSheet>();
  const adaptiveRef = useRef<HTMLDivElement>();

  const [s2DataConfig, setS2DataConfig] =
    useState<Omit<S2DataConfig, "data">>(s2DataConfigSrc);

  const { data, loading } = useRequest<LogicformAPIResultType>(
    () => {
      if (result) {
        return new Promise((resolve) => resolve(result));
      }

      if (!logicform) {
        return Promise.resolve(null);
      }

      return requestLogicform(logicform);
    },
    {
      refreshDeps: [JSON.stringify(logicform), result],
    }
  );

  const dataCfg: S2DataConfig = {
    fields: {},
    data: [],
    ...getDefaultS2Config(data),
    ...s2DataConfig,
  };

  const { data: totalAndSubTotalData } = useRequest<LogicformAPIResultType[]>(
    () => {
      if (!data) {
        return Promise.resolve([]);
      }

      const fieldNameToGroupByItem = (fieldName) => {
        let _id = fieldName;
        let level = undefined;

        if (_id.indexOf("(") > 0 && _id.endsWith(")")) {
          [_id, level] = _id.split(/[\(\)]/);
        }

        return { _id, level };
      };

      // Total & Subtotal
      let logicforms: LogicformType[] = [];
      if (dataCfg?.fields?.rows?.length > 0) {
        if (!dataCfg?.fields?.columns || dataCfg.fields.columns.length === 0) {
          logicforms = dataCfg.fields.rows.map((_groupbyItem, index) => ({
            ...data.logicform,
            groupby:
              index === 0
                ? undefined
                : dataCfg.fields.rows
                    .slice(0, index)
                    .map(fieldNameToGroupByItem),
            preds: data.logicform.preds.filter((p) => p[0].operator),
            sort: undefined,
            limit: undefined,
            skip: undefined,
          }));
        } else {
          // 一部分在rows一部分在cols
          logicforms = [
            {
              ...data.logicform,
              groupby: dataCfg.fields.columns.map(fieldNameToGroupByItem),
              preds: data.logicform.preds.filter((p) => p[0].operator),
              sort: undefined,
              limit: undefined,
              skip: undefined,
            },
          ];
        }
      }

      // console.log(logicforms);

      return Promise.all(logicforms.map((lf) => requestLogicform(lf)));
    },
    {
      formatResult: (res) => {
        let result: any[] = [];

        for (const resItem of res) {
          // 这个是为了兼容老的SDM的result返回
          if (Array.isArray(resItem.result)) {
            result = [...result, ...resItem.result];
          }
        }

        return result;
      },
      refreshDeps: [data, JSON.stringify(dataCfg?.fields)],
    }
  );

  if (data?.result) {
    if (!Array.isArray(data.result)) {
      return <Result title="此组件仅支持数组" />;
    }

    const meta: Required<S2DataConfig>["meta"] = ["rows", "columns", "values"]
      .reduce((p, r) => p.concat(dataCfg.fields[r] || []), [])
      .map((d) => {
        const property = findProperty(
          { ...data.schema, properties: data.columnProperties },
          d
        );

        const metaOfProps = dataCfg.meta?.find((f) => f.field === d);
        const defaultFormatter = (v) => {
          return formatWithProperty(property, v);
        };
        if (metaOfProps) {
          return {
            ...metaOfProps,
            formatter: metaOfProps.formatter || defaultFormatter,
          };
        }
        return {
          field: d,
          formatter: defaultFormatter,
        };
      });
    // meta
    dataCfg.meta = meta;

    dataCfg.data = data.result;

    // interval
    if (showInterval) {
      s2Options.conditions = {
        interval: data.columnProperties
          .filter((p) => p.primal_type === "number")
          .map((p) => ({
            field: p.name,
            mapping() {
              return {
                fill: "#80BFFF",
              };
            },
          })),
      };
    }

    // Total & Subtotal
    s2Options.totals.row.subTotalsDimensions = data.logicform.groupby
      .slice(0, data.logicform.groupby.length - 1)
      .map((g) => g.name);
  }

  const defaultOptions: Partial<S2Options> = {
    hierarchyType: "grid",
    tooltip: {
      content: (cell, options) =>
        renderTooltipContent(
          cell,
          options,
          data?.schema,
          entityTooltipCardProps
        ),
    },
  };

  // 配置Header
  const sheetComponentHeader: any = {
    extra: (
      <Space>
        {showExport && (
          <Tooltip title="导出Excel">
            <Button
              type="link"
              size="small"
              style={{ padding: 0 }}
              onClick={() => {
                if (s2Ref.current) {
                  const text = copyData(s2Ref.current, "\t");
                  const formattedText = copyData(s2Ref.current, "\t", true);
                  excelExporter(text, formattedText, "数据导出", xlsx);
                }
              }}
            >
              <DownloadOutlined />
            </Button>
          </Tooltip>
        )}
        {showSwitcher && (
          <Switcher
            popover={{ placement: "leftTop" }}
            rows={{
              items: (dataCfg?.fields?.rows || []).map((r) => ({ id: r })),
            }}
            columns={{
              items: (dataCfg?.fields?.columns || []).map((r) => ({ id: r })),
            }}
            values={{
              // selectable: true, // 这个啊，如果把这个更新到data config里面去了。那么状态的同步也很麻烦。除非把selectable也给同步了
              items: (dataCfg?.fields?.values || []).map((r) => ({ id: r })),
            }}
            onSubmit={(result) => {
              setS2DataConfig({
                ...dataCfg,
                fields: {
                  ...dataCfg.fields,
                  rows: result.rows.items.map((i) => i.id),
                  columns: result.columns.items.map((i) => i.id),
                  values: result.values.items
                    .filter((i) => i.checked !== false)
                    .map((i) => i.id),
                },
              });
            }}
          />
        )}
      </Space>
    ),
  };

  // 总计 & 小计
  if (dataCfg.data) {
    if (totalAndSubTotalData) {
      dataCfg.data = [...totalAndSubTotalData, ...dataCfg.data];
    }

    if (data?.result) {
      // flatten result
      const objectProps = data.columnProperties.filter(
        (prop) => prop.primal_type === "object"
      );
      dataCfg.data = dataCfg.data.map((v) => {
        const flatted = flatten(v);

        // 这里还要设置一下object类型的数据
        objectProps.forEach((prop) => {
          if (prop.schema) {
            const nameProp = getNameProperty(prop.schema);
            if (nameProp && flatted[`${prop.name}.${nameProp.name}`]) {
              flatted[prop.name] = flatted[`${prop.name}.${nameProp.name}`];
            }
          }
        });
        return flatted;
      });
    }
  }

  // valueInCols配置
  if (dataCfg?.fields) {
    if (!dataCfg.fields.rows || dataCfg.fields.rows.length === 0) {
      dataCfg.fields.valueInCols = false;

      // 暂时不显示total
      s2Options.totals.row.showGrandTotals = false;
      s2Options.totals.row.showSubTotals = false;
    } else {
      dataCfg.fields.valueInCols = true;

      // 显示回来total。 如果上面的【暂时不显示total】
      s2Options.totals.row.showGrandTotals = true;
      s2Options.totals.row.showSubTotals = true;
    }
  }

  const offsetHeight = 0;

  useEffect(() => {
    onChange?.(dataCfg);
  }, [JSON.stringify(dataCfg)]);

  return (
    <div className={`ze-sheet`} style={{ height: "100%", ...style }}>
      <div
        style={{
          height: `calc(100% - ${offsetHeight}px)`,
        }}
        ref={adaptiveRef}
      >
        <SheetComponent
          loading={loading}
          adaptive={{
            width: true,
            height: true,
            getContainer: () => adaptiveRef.current,
          }}
          dataCfg={dataCfg}
          options={{ ...defaultOptions, ...s2Options }}
          sheetType={sheetType}
          header={sheetComponentHeader}
          ref={s2Ref}
          onRowCellClick={({ target: rowCell }) => {
            const meta = rowCell.getMeta();
            if (meta.isTotals) {
              return;
            }
            onRow?.({ _id: meta.value, ...meta.query });
          }}
          onDataCellClick={({ target: dataCell }) => {
            onRow?.(dataCell.getMeta().data);
          }}
        />
      </div>
    </div>
  );
};
export default ZESheet;
