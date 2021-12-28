import React, { useState } from "react";
import ZESchemaEditor from "../ZESchemaEditor";

// prepare server
import prepareServerForStories from "../../../util/prepareServerForStories";

prepareServerForStories();

export default {
  title: "ZESchemaEditor",
};

const schemaOfSchema = [
  {
    colname: "_id",
    type: "string",
    editable: false, // 只能新建，不能修改。editable属性默认true
    constraints: {
      required: true,
    },
  },
  {
    colname: "name",
    type: "string",
    constraints: {
      required: true,
    },
  },
  {
    colname: "syno",
    type: "string",
    isArray: true,
  },
  {
    colname: "type",
    type: "string",
    enum: ["entity", "event"],
    editable: false, // 只能新建，不能修改
    constraints: {
      required: true,
    },
  },
  {
    colname: "description",
    type: "string",
  },
  {
    // 默认给一个空数组，新建、修改和删除都要另外调用API
    colname: "properties",
    type: "object",
    isArray: true,
  },
  {
    // hierarchy也是比较复杂的。也算是一个子列表了。下面hierarchyColnames指明了这个子列表是什么样子的
    colname: "hierarchy",
    type: "mixed",
    hierarchyColnames: [
      {
        colname: "name",
        type: "string",
        constraints: {
          required: true,
        },
      },
      {
        colname: "syno",
        type: "string",
        isArray: true,
      },
      {
        colname: "code_length",
        type: "number",
        constraints: {
          required: true,
        },
      },
    ],
  },
  {
    // 表达这个schema相关的数据在前端页面是否支持可以修改数据（是的话，ZETable会出现（新建按钮和修改删除按钮）
    colname: "editable",
    type: "boolean",
  },
  {
    // 反正是一个boolean，默认false
    colname: "use_db_date_as_mtd",
    type: "boolean",
  },
  {
    // 反正是一个boolean，默认false
    colname: "use_view",
    type: "boolean",
  },
];

const schemaOfProperty = [
  {
    colname: "name",
    type: "string",
    constraints: {
      required: true,
    },
  },
  {
    colname: "syno",
    type: "string",
    isArray: true,
  },
  {
    colname: "description",
    type: "string",
  },
  {
    colname: "type",
    type: "string", // type其实比较复杂的，最好是让别人选，但是又支持自定义的type类型。所以但暂时先用string吧。
  },

  {
    // 反正是一个boolean，默认false
    colname: "is_name",
    type: "boolean",
  },
  {
    // 反正是一个boolean，默认false
    colname: "is_categorical",
    type: "boolean",
  },
  {
    // type=object的时候必填
    colname: "ref",
    type: "string",
  },
  {
    colname: "unit",
    type: "string",
  },
  {
    colname: "constraints", // 这个并不是一个array，就是一个嵌套的子object
    type: "mixed",
    constraintsColnames: [
      {
        colname: "required",
        type: "boolean",
      },
      {
        colname: "enum",
        type: "string",
        isArray: true,
      },
    ],
  },
  {
    colname: "ui", // 这个并不是一个array，就是一个嵌套的子object
    type: "mixed",
    uiColnames: [
      {
        colname: "formatter",
        type: "string",
      },
      {
        colname: "formatters", // 有点复杂[捂脸]，这又是一个子object的Array。不知道能不能搞？
        type: "mixed",
      },
    ],
  },
];

export const Basic = () => <ZESchemaEditor />;
