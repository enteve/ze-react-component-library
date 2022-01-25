import React from "react";
import InnerZEJsonEditor from "./ZEJsonEditor";
export type { ZEJsonEditorProps } from "./ZEJsonEditor";

type InnerZEJsonEditorType = typeof InnerZEJsonEditor;

const ZEJsonEditorRender = {
  render: (v, props, ...rest) => {
    return (
      <InnerZEJsonEditor
        editable={false}
        mode="code"
        value={props?.fieldProps?.value}
      />
    );
  },
  renderFormItem: (text, props, form) => {
    return (
      <InnerZEJsonEditor
        editable
        mode="code"
        value={props?.fieldProps?.value}
        onChange={props?.fieldProps?.onChange}
      />
    );
  },
};

interface ZEJsonEditorInstance extends InnerZEJsonEditorType {
  ZEJsonEditorRender: typeof ZEJsonEditorRender;
}

const ZEJsonEditor = InnerZEJsonEditor as ZEJsonEditorInstance;
ZEJsonEditor.ZEJsonEditorRender = ZEJsonEditorRender;

export default ZEJsonEditor;
