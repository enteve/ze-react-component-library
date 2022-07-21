import React, { forwardRef, useRef, useEffect } from "react";
import AceEditor, { IAceEditorProps } from "react-ace";
import jsBeautify from "js-beautify";
import "ace-builds/webpack-resolver";
import "ace-builds/src-noconflict/mode-typescript";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

type TsEditorProps = Partial<IAceEditorProps>;
export type AceEditorType = AceEditor;
export type AceEditorInstance = Parameters<IAceEditorProps["onLoad"]>[0];

const BeautifyOptions = { indent_size: 2 };

const TsEditor = forwardRef<AceEditor, TsEditorProps>(
  ({ name = "ze-ts-editor", defaultValue, ...restProps }, ref) => {
    const editorRef = useRef<AceEditorInstance>();

    useEffect(() => {
      const session = editorRef.current?.getSession();
      if (session) {
        session.setValue(jsBeautify(defaultValue || "", BeautifyOptions));
        //@ts-ignore 默认第一层折叠起来
        session.foldAll(1, undefined, 0);
      }
    }, [defaultValue]);

    return (
      <AceEditor
        ref={ref}
        mode="typescript"
        theme="github"
        name={name}
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        onLoad={(editor) => {
          editorRef.current = editor;
        }}
        commands={[
          {
            name: "beautify",
            bindKey: { win: "Ctrl-shift-F", mac: "Ctrl-shift-F" },
            exec: () => {
              const session = editorRef.current?.getSession();
              if (session) {
                session.setValue(
                  jsBeautify(session.getValue(), BeautifyOptions)
                );
              }
            },
          },
        ]}
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
  }
);

export default TsEditor;
