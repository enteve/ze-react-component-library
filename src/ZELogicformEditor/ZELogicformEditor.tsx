import React, { useState } from "react";
import { LogicformType } from "zeroetp-api-sdk";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism-coy.css";
import { Button, Col, message, Row } from "antd";
import ZECard from "../ZECard/ZECard";
import { ZELogicformEditorProps } from "./ZELogicformEditor.types";

const ZELogicformEditor: React.FC<ZELogicformEditorProps> = ({ xlsx }) => {
  const [logicformString, setLogicformString] = useState<string>("");
  const [logicform, setLogicform] = useState<LogicformType>();

  return (
    <Row gutter={10}>
      <Col span={6}>
        <Editor
          value={logicformString}
          onValueChange={(code) => setLogicformString(code)}
          highlight={(code) => highlight(code, languages.js)}
          padding={10}
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 12,
            border: "1px solid",
            marginBottom: 12,
            minHeight: 200,
          }}
        />
        <Button
          type="primary"
          onClick={() => {
            try {
              const lf = eval("(" + logicformString + ")");
              setLogicform(JSON.parse(JSON.stringify(lf)));
            } catch (error) {
              message.error("LF解析错误。请确保格式正确");
            }
          }}
        >
          提交
        </Button>
      </Col>
      <Col span={18}>
        {logicform && (
          <ZECard
            logicform={logicform}
            title="结果"
            xlsx={xlsx}
            exportToExcel
          />
        )}
        {!logicform && "Editing...."}
      </Col>
    </Row>
  );
};

export default ZELogicformEditor;
