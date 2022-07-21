import React, { FC, useRef, useEffect } from "react";
import AceEditor, { IAceEditorProps } from "react-ace";
import "ace-builds/src-noconflict/mode-typescript";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

type TsEditorProps = Partial<IAceEditorProps>;
export type AceEditorType = Parameters<IAceEditorProps["onLoad"]>[0];

const TsEditor: FC<TsEditorProps> = ({
  name = "ze-ts-editor",
  ...restProps
}) => {
  const editorRef = useRef<AceEditorType>();

  return (
    <AceEditor
      mode="typescript"
      theme="github"
      name={name}
      showPrintMargin={true}
      showGutter={true}
      highlightActiveLine={true}
      onLoad={(editor) => {
        editorRef.current = editor;
        //@ts-ignore 默认第一层折叠起来
        editor.session.foldAll(1, undefined, 0);
      }}
      setOptions={{
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: true,
        showLineNumbers: true,
        tabSize: 2,
      }}
      {...restProps}
    />
  );
};

export default TsEditor;
