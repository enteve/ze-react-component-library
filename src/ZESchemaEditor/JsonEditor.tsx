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
      description:
        "property的名字，不能有下划线等特殊字符，一般为中文。如【销售额】，【类型】",
    },
    syno: {
      type: "array",
      items: {
        type: "string",
      },
      description: "名称的同义词",
    },
    type: {
      type: "string",
      description: "该属性类型",
    },
    is_name: {
      type: "boolean",
      description:
        "是不是一种称呼。例如员工的名字，产品的名字。设置为true之后，在问答中可以直接通过改名字找到entity",
    },
    is_categorical: {
      type: "boolean",
      description:
        "是不是一种分类。设置为true之后，在问答中可以直接通过分类的值进行筛选",
    },
    ref: {
      type: "string",
      description:
        "当type为object的时候为必须设置，相当于外键，指定对应的Schema的_id",
    },
    unit: {
      type: "string",
      description:
        "如果是一个数值类型的属性，那么unit里面设置单位。例如‘元’，‘分种’",
    },
    constraints: {
      type: "object",
      properties: {
        required: {
          type: "boolean",
          description: "改属性是不是必填项",
        },
        enum: {
          type: "array",
          items: {
            type: ["string", "array", "boolean"],
          },
          description:
            "可选范围。如果填的是一个string array，那么第一个元素是最终存入数据库里面的值，之后的元素都是第一个元素的同义词。",
        },
      },
    },
    ui: {
      type: "object",
      properties: {
        formatter: {
          type: "string",
          description:
            "对于数值类型的属性有用。在前端的format string。format的格式和Numeral.js所要求的一致",
        },
        formatters: {
          type: "array",
          items: {
            type: "object",
            properties: {
              min: {
                type: "string",
              },
              max: {
                type: "number",
              },
              formatter: {
                type: "string",
              },
            },
          },
          description:
            "比较复杂的formatter设置，支持按照条件来决定显示的formatter string。例如，当大于某个值的时候，formatter为xxx，否则formatter为xxx",
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
        description: "数仓的表名，也是property里面ref所指向的id",
      },
      name: {
        type: "string",
        description: "此表的称谓。在智能搜索中搜索改名字可以出明细",
      },
      syno: {
        type: "array",
        items: {
          type: "string",
        },
        description: "name的同义词",
      },
      type: {
        type: "string",
        enum: json ? [json.type] : ["entity", "event"],
        description: "Schema类型，entity或event",
      },
      description: {
        type: "string",
        description: "该Schema的一些描述信息",
      },
      editable: {
        type: "boolean",
        description: "是否能直接通过网页端去增删改查数据",
      },
      use_db_date_as_mtd: {
        type: "boolean",
        description:
          "仅对event类型的Schema起作用。在问答MTD、QTD之类的术语的时候，“今天”这个概念是不是用数据库里数据的最后一天（而不是当前日期）",
      },
      use_view: {
        type: "boolean",
        description:
          "优化选项，是不是要生成一张物化视图来加速问答。设置为true之后，会在数据库中增加一个_id+'_view'的表",
      },
      properties: {
        type: "array",
        items: propertySchema,
        minItems: 1,
      },
      hierarchy: {
        type: "array",
        description: "树状结构的entity的表达，只在entity的schema中有效",
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
    required: false,
  },
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
