import React, { useState, useEffect, useRef } from "react";
import { ZESheetProps } from "./ZESheet.types";
import { SheetComponent } from "@antv/s2-react";
import { SpreadSheet, copyData } from "@antv/s2";
import { LogicformAPIResultType, LogicformType } from "zeroetp-api-sdk";
import { useRequest } from "@umijs/hooks";
import { findProperty, formatWithProperty } from "../util";
import { requestLogicform } from "../request";
import ZEJsonEditor from "../ZEJsonEditor";
import { Result, Button, Tooltip, Space, Row, Col, Select } from "antd";
import flatten from "flat";
import { S2DataConfig } from "@antv/s2";
import { DownloadOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import "@antv/s2-react/dist/style.min.css";
import { getDefaultS2Config } from "./util";
import excelExporter from "./excelExporter";
import { HeaderCfgProps } from "@antv/s2-react/esm/components/header";
import "./ZESheet.less";

const s2FieldOptions: {
  label: React.ReactNode;
  value: "s2Options" | "s2DataConfig";
}[] = [
  { label: "s2DataConfig", value: "s2DataConfig" },
  { label: "s2Options", value: "s2Options" },
];

type S2FieldType = typeof s2FieldOptions[number]["value"];

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
  s2DataConfig,
  s2Options: s2OptionsSrc,
  showExport = true,
  xlsx,
  showEditor = false,
  onSave,
  style = {},
  showInterval = false,
}) => {
  // 加上一点default的设置
  // 此处类型用any，不用ZESheetProps["s2Options"]，因为s2Options.totals.row里面的属性是readonly，很奇怪
  const s2Options: any = {
    tooltip: {
      col: {
        showTooltip: false,
      },
    },
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
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const adaptiveRef = useRef<HTMLDivElement>();
  const [s2Field, setS2Field] = useState<S2FieldType>("s2DataConfig");
  const [innerLogicform, setInnerLogicForm] =
    useState<ZESheetProps["logicform"]>(logicform);
  const [innerS2DataConfig, setInnerS2DataConfig] =
    useState<ZESheetProps["s2DataConfig"]>(s2DataConfig);
  const [innerS2Options, setInnerS2Options] =
    useState<ZESheetProps["s2Options"]>(s2Options);
  const [previewConfig, setPreviewConfig] =
    useState<Pick<ZESheetProps, "logicform" | "s2DataConfig" | "s2Options">>();

  const { data: totalAndSubTotalData, run: requestTotalAndSubTotalData } =
    useRequest<LogicformAPIResultType[]>(
      (logicforms: LogicformType[]) =>
        Promise.all(logicforms.map((lf) => requestLogicform(lf))),
      {
        manual: true,
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
      }
    );

  const { data, loading } = useRequest<LogicformAPIResultType>(
    () => {
      if (result) {
        return new Promise((resolve) => resolve(result));
      }

      if (!logicform && !previewConfig?.logicform) {
        return Promise.resolve(null);
      }

      return requestLogicform(previewConfig?.logicform || logicform);
    },
    {
      refreshDeps: [
        JSON.stringify(previewConfig?.logicform || logicform),
        result,
      ],
      onSuccess: (res) => {
        // Total & Subtotal
        const logicforms: LogicformType[] = res.logicform.groupby.map(
          (_groupbyItem, index) => ({
            ...res.logicform,
            groupby:
              index === 0 ? undefined : res.logicform.groupby.slice(0, index),
            preds: res.logicform.preds.filter((p) => p[0].operator),
            sort: undefined,
            limit: undefined,
            skip: undefined,
          })
        );
        requestTotalAndSubTotalData(logicforms);
      },
    }
  );

  const dataCfg: S2DataConfig = {
    fields: {},
    data: [],
    ...getDefaultS2Config(data),
    ...(previewConfig?.s2DataConfig || s2DataConfig),
  };

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

    // flatten result
    dataCfg.data = data.result.map((v) => flatten(v));
    // meta
    dataCfg.meta = meta;

    // interval
    if (showInterval) {
      s2Options.conditions = {
        interval: data.columnProperties
          .filter((p) => p.primal_type === "number")
          .map((p, index) => ({
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

  const reset = () => {
    setInnerS2Options(s2Options);
    setInnerS2DataConfig(s2DataConfig);
    setInnerLogicForm(logicform);
    setS2Field("s2DataConfig");
    setPreviewConfig(undefined);
  };

  const handleSave = () => {
    onSave?.({
      logicform: innerLogicform,
      s2DataConfig: innerS2DataConfig,
      s2Options: innerS2Options,
    });
    setIsEditing(false);
  };

  const handlePreview = () => {
    setPreviewConfig({
      logicform: innerLogicform,
      s2DataConfig: innerS2DataConfig,
      s2Options: innerS2Options,
    });
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  const defaultOptions: any = {
    hierarchyType: "grid",
  };

  useEffect(() => {
    setInnerS2Options(s2Options);
  }, [JSON.stringify({ s2Options })]);

  useEffect(() => {
    setInnerS2DataConfig(s2DataConfig);
  }, [JSON.stringify({ s2DataConfig })]);

  useEffect(() => {
    setInnerLogicForm(logicform);
  }, [JSON.stringify({ logicform })]);

  // 配置一下Editor
  const sheetComponentHeader: HeaderCfgProps = {
    switcherCfg: { open: true },
  };
  if (isEditing) {
    sheetComponentHeader.extra = (
      <Space>
        <Button size="small" onClick={handleCancel}>
          取消
        </Button>
        <Button size="small" onClick={handlePreview}>
          <EyeOutlined /> 预览
        </Button>
        <Button size="small" type="primary" onClick={handleSave}>
          保存
        </Button>
      </Space>
    );
  } else if (showEditor || showExport) {
    sheetComponentHeader.extra = (
      <Space>
        {showEditor && (
          <Tooltip title="编辑">
            <Button
              type="link"
              size="small"
              style={{ padding: 0 }}
              onClick={() => {
                setIsEditing(true);
              }}
            >
              <EditOutlined />
            </Button>
          </Tooltip>
        )}
        {showExport && (
          <Tooltip title="导出Excel">
            <Button
              type="link"
              size="small"
              style={{ padding: 0 }}
              onClick={() => {
                if (s2Ref.current) {
                  const formatText = copyData(s2Ref.current, "\t", true);
                  excelExporter(formatText, "数据导出", xlsx);
                }
              }}
            >
              <DownloadOutlined />
            </Button>
          </Tooltip>
        )}
      </Space>
    );
  }

  // 总计 & 小计
  if (dataCfg.data && totalAndSubTotalData) {
    dataCfg.data = [...totalAndSubTotalData, ...dataCfg.data];
  }

  // valueInCols配置
  if (dataCfg?.fields) {
    if (dataCfg.fields.rows || dataCfg.fields.rows.length === 0) {
      dataCfg.fields.valueInCols = false;
    } else {
      dataCfg.fields.valueInCols = true;
    }
  }

  const offsetHeight = 0;

  return (
    <div
      className={`ze-sheet ${isEditing ? "editing" : ""}`}
      style={{ height: "100%", ...style }}
    >
      <div
        style={{
          height: isEditing
            ? `calc(50% - ${offsetHeight}px)`
            : `calc(100% - ${offsetHeight}px)`,
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
          options={previewConfig?.s2Options || s2Options || defaultOptions}
          sheetType={sheetType}
          header={sheetComponentHeader}
          ref={s2Ref}
        />
      </div>
      {isEditing && (
        <Row
          gutter={24}
          style={{
            height: `calc(50% + ${offsetHeight}px)`,
            paddingTop: offsetHeight + 12,
          }}
        >
          <Col span={12} style={{ display: "flex", flexDirection: "column" }}>
            <Space>
              <Select
                options={[{ label: "logicform", value: "logicform" }]}
                value="logicform"
                size="small"
                dropdownMatchSelectWidth={false}
                style={{ marginBottom: 12 }}
              />
            </Space>
            <ZEJsonEditor
              editable
              mode="code"
              value={innerLogicform}
              onChange={(v) => {
                setInnerLogicForm(v);
              }}
              style={{ height: undefined, flexGrow: 1 }}
            />
          </Col>
          <Col span={12} style={{ display: "flex", flexDirection: "column" }}>
            <Space>
              <Select
                options={s2FieldOptions}
                value={s2Field}
                size="small"
                style={{ marginBottom: 12 }}
                dropdownMatchSelectWidth={false}
                onChange={(v) => {
                  setS2Field(v);
                }}
              />
            </Space>
            {s2Field === "s2DataConfig" && (
              <ZEJsonEditor
                editable
                mode="code"
                value={innerS2DataConfig}
                onChange={setInnerS2DataConfig}
                style={{ height: undefined, flexGrow: 1 }}
              />
            )}
            {s2Field === "s2Options" && (
              <ZEJsonEditor
                editable
                mode="code"
                value={innerS2Options}
                onChange={setInnerS2Options}
                style={{ height: undefined, flexGrow: 1 }}
              />
            )}
          </Col>
        </Row>
      )}
    </div>
  );
};
export default ZESheet;
