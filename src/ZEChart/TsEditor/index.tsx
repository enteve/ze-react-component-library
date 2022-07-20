import React, { FC } from "react";
import AceEditor, { IAceEditorProps } from "react-ace";
import "ace-builds/src-noconflict/mode-typescript";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

type TsEditorProps = Partial<IAceEditorProps>;

const TsEditor: FC<TsEditorProps> = ({ name = "ze-ts-editor", ...restProps }) => {
  return (
    <AceEditor
      mode="typescript"
      theme="github"
      name={name}
      showPrintMargin={true}
      showGutter={true}
      highlightActiveLine={true}
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
