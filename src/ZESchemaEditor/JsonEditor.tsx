import React, { FC, useRef, useEffect } from "react";
import JSONEditor from "jsoneditor";
import "jsoneditor/dist/jsoneditor.css";

export const types = ["entity", "event"] as const;
export type Type = typeof types[number];

type JsonEditorProps = {
  json?: Record<string, any>;
  editorRef?: React.MutableRefObject<any>;
  editable: boolean;
  type: Type;
};
const modes = ["tree", "code"] as const;

const propertySchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
    },
    syno: {
      type: "array",
      items: {
        type: "string",
      },
    },
    type: {
      type: "string",
    },
    is_name: {
      type: "boolean",
    },
    is_categorical: {
      type: "boolean",
    },
    ref: {
      type: "string",
    },
    unit: {
      type: "string",
    },
    constraints: {
      type: "object",
      properties: {
        required: {
          type: "boolean",
        },
        enum: {
          type: "array",
          items: {
            type: ["string", "array", "boolean"],
          },
        },
      },
    },
    ui: {
      type: "object",
      properties: {
        formatter: {
          type: "string",
        },
        formatters: {
          type: "array",
          items: {
            type: "object",
            properties: {
              formatter: {
                type: "string",
              },
            },
          },
        },
      },
    },
  },
  anyOf: [
    {
      not: {
        properties: {
          type: { const: "object" },
        },
        required: ["name"],
      },
    },
    {
      required: ["name", "ref"],
    },
  ],
};

const getSchema = (json?: Record<string, any>) => {
  const scheme = {
    type: "object",
    properties: {
      _id: {
        type: "string",
        // 更新时，设定enum，不允许修改
        enum: json ? [json?._id] : undefined,
      },
      name: {
        type: "string",
      },
      syno: {
        type: "array",
        items: {
          type: "string",
        },
      },
      type: {
        type: "string",
        enum: json ? [json.type] : ["entity", "event"],
      },
      description: {
        type: "string",
      },
      editable: {
        type: "boolean",
      },
      use_db_date_as_mtd: {
        type: "boolean",
      },
      use_view: {
        type: "boolean",
      },
      properties: {
        type: "array",
        items: propertySchema,
        minItems: 1,
      },
      hierarchy: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: {
              type: "string",
            },
            syno: {
              type: "array",
              items: {
                type: "string",
              },
            },
            code_length: {
              type: "number",
            },
          },
          required: ["name", "code_length"],
        },
      },
    },
    required: ["_id", "name", "type"],
  };

  return scheme;
};

// 初始值设置成null，需要手动输入，否则校验不通过
const propertyTemplate = {
  name: null,
  syno: [],
  description: "",
  type: null,
  is_name: false,
  is_categorical: false,
  constraints: {
    required: true,
  }
};

const hierarchyTemplate = {
  name: null,
  syno: [],
  code_length: null,
};

export const schemaTemplate = {
  _id: null,
  name: null,
  syno: [],
  type: "entity",
  description: "",
  editable: false,
  use_db_date_as_mtd: false,
  use_view: false,
  properties: [propertyTemplate],
};

const JsonEditor: FC<JsonEditorProps> = ({
  json,
  editorRef: editorInstanceRef,
  editable,
  type,
}) => {
  const containerRef = useRef<HTMLDivElement>();
  const editorRef = useRef<any>();
  const editableRef = useRef<boolean>(true);
  editableRef.current = editable;

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.setSchema(getSchema(json));
      editorRef.current.set(json || { ...schemaTemplate, type });
    }
  }, [json, type]);

  useEffect(() => {
    if (containerRef.current) {
      editorRef.current = new JSONEditor(
        containerRef.current,
        {
          mode: "tree",
          // 传入modes可开启模式切换
          modes,
          schema: getSchema(json),
          onEditable: () => {
            return editableRef.current;
          },
          templates: [
            {
              text: "property",
              title: "新增一个属性",
              field: "properties",
              value: propertyTemplate,
            },
            {
              text: "hierarchy",
              title: "新增一个hierarchy",
              field: "hierarchy",
              value: hierarchyTemplate,
            },
          ],
        },
        json || { ...schemaTemplate, type }
      );
      if (editorInstanceRef) {
        editorInstanceRef.current = editorRef.current;
      }
    }
  }, []);

  return (
    <div
      className="ze-json-editor"
      ref={containerRef}
      style={{ height: "100%" }}
    />
  );
};

export default JsonEditor;
