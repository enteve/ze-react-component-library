import React, { FC, useRef, useEffect, useState } from "react";
import { Select } from "antd";
import JSONEditor from "jsoneditor";
import "jsoneditor/dist/jsoneditor.css";
import "./index.less";

const modes = ["tree", "view", "form", "code", "text", "preview"] as const;
type Mode = typeof modes[number];

export type ZEJsonEditorProps = {
  mode?: Mode;
  modes?: Mode[];
  value?: Record<string, any>;
  onChange?: (v: Record<string, any>) => void;
  editorRef?: React.MutableRefObject<any>;
  editable: boolean;
  schema?: Record<string, any>;
  templates?: Record<string, any>[];
  style?: React.CSSProperties;
};

const ZEJsonEditor: FC<ZEJsonEditorProps> = ({
  value: json,
  mode: _mode = "tree",
  modes: modeOptions,
  onChange,
  editorRef: editorInstanceRef,
  editable,
  schema,
  templates,
  style = {},
}) => {
  const containerRef = useRef<HTMLDivElement>();
  const editorRef = useRef<any>();
  const editableRef = useRef<boolean>(true);
  const editingRef = useRef<boolean>(false);
  const [mode, setMode] = useState<Mode>();
  editableRef.current = editable;
  const value = json || {};

  const onModeChange = (m: Mode) => {
    if (editorRef.current) {
      editorRef.current.setMode(m);
    }
    setMode(m);
  };

  useEffect(() => {
    const newMode = editable ? _mode : "view";
    onModeChange(newMode);
  }, [editable, _mode]);

  useEffect(() => {
    if (editorRef.current) {
      schema && editorRef.current.setSchema(schema);
    }
  }, [JSON.stringify({ schema })]);

  useEffect(() => {
    if (editorRef.current && !editingRef.current) {
      editorRef.current.set(value);
    }
  }, [JSON.stringify({ value })]);

  useEffect(() => {
    if (containerRef.current) {
      editorRef.current = new JSONEditor(
        containerRef.current,
        {
          mode: _mode,
          schema,
          onEditable: () => {
            return editableRef.current;
          },
          templates,
          onChange: () => {
            editingRef.current = true;
            const newJson = editorRef.current.get();
            onChange?.(newJson);
          },
          onBlur: () => {
            editingRef.current = false;
          },
        },
        value
      );
      if (editorInstanceRef) {
        editorInstanceRef.current = editorRef.current;
      }
    }
  }, []);

  return (
    <div
      className={`ze-json-editor ${
        modeOptions?.length > 0 ? "mode-changeable" : ""
      }`}
      style={{ height: "100%", ...style }}
    >
      {modeOptions?.length > 0 && (
        <Select
          className="ze-json-editor-mode-switcher"
          value={mode}
          bordered={false}
          options={modeOptions.map((d) => ({ label: d, value: d }))}
          onChange={onModeChange}
        />
      )}
      <div ref={containerRef} style={{ height: "100%" }} />
    </div>
  );
};

export default ZEJsonEditor;
