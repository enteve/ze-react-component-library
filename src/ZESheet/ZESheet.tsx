import React, { useState, useEffect, useRef } from "react";
import { ZESheetProps } from "./ZESheet.types";
import { SheetComponent } from "@antv/s2-react";
import { LogicformAPIResultType, LogicformType } from "zeroetp-api-sdk";
import { useRequest } from "@umijs/hooks";
import { findProperty, formatWithProperty } from "../util";
import { requestLogicform } from "../request";
import ZEJsonEditor from "../ZEJsonEditor";
import { Result, Button, Tooltip, Space, Row, Col, Select } from "antd";
import flatten from "flat";
import { S2DataConfig } from "@antv/s2";
import { DownloadOutlined, EditOutlined } from "@ant-design/icons";
import "@antv/s2-react/dist/style.min.css";

const s2FieldOptions: {
  label: React.ReactNode;
  value: "s2Options" | "s2DataConfig";
}[] = [
  { label: "s2DataConfig", value: "s2DataConfig" },
  { label: "s2Options", value: "s2Options" },
];
type S2FieldType = typeof s2FieldOptions[number]["value"];

const ZESheet: React.FC<ZESheetProps> = ({
  logicform,
  result,
  sheetType,
  s2DataConfig,
  s2Options,
  showExport = true,
  onSave,
  style = {},
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const adaptiveRef = React.useRef<HTMLDivElement>();
  const [s2Field, setS2Field] = useState<S2FieldType>("s2DataConfig");
  const [innerLogicform, setInnerLogicForm] =
    useState<LogicformType>(logicform);
  const [innerS2DataConfig, setInnerS2DataConfig] =
    useState<Record<string, any>>(s2DataConfig);
  const [innerS2Options, setInnerS2Options] = useState<any>(s2Options);

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
      refreshDeps: [logicform, result],
    }
  );

  const dataCfg: S2DataConfig = {
    fields: undefined,
    data: [],
    ...s2DataConfig,
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
  }

  const handleSave = () => {
    onSave?.({
      logicform: innerLogicform,
      s2DataConfig: innerS2DataConfig,
      s2Options: innerS2Options,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setInnerS2Options(s2Options);
    setInnerS2DataConfig(s2DataConfig);
    setInnerLogicForm(logicform);
    setIsEditing(false);
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

  return (
    <div className="ze-sheet" style={{ height: "100%", ...style }}>
      <div
        style={{ height: isEditing ? "calc(50% - 56px)" : "calc(100% - 56px)" }}
        ref={adaptiveRef}
      >
        <SheetComponent
          isLoading={loading}
          adaptive={{
            width: true,
            height: true,
            getContainer: () => adaptiveRef.current,
          }}
          dataCfg={dataCfg}
          options={{
            ...s2Options,
          }}
          sheetType={sheetType}
          header={
            isEditing
              ? {
                  extra: (
                    <Space>
                      <Button onClick={handleCancel}>取消</Button>
                      <Button type="primary" onClick={handleSave}>
                        保存
                      </Button>
                    </Space>
                  ),
                }
              : {
                  exportCfg: {
                    open: showExport,
                    icon: <DownloadOutlined />,
                  },
                  extra: (
                    <Tooltip title="编辑">
                      <Button
                        type="link"
                        style={{ padding: 0 }}
                        onClick={() => {
                          setIsEditing(true);
                        }}
                      >
                        <EditOutlined />
                      </Button>
                    </Tooltip>
                  ),
                }
          }
        />
      </div>
      {isEditing && (
        <Row
          gutter={24}
          style={{ height: "calc(50% + 56px)", paddingTop: 56 + 12 }}
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
