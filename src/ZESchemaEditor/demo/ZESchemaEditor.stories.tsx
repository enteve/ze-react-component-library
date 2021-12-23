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
    editable: false,
  },
  {
    colname: "name",
    type: "string",
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
  },
  {
    colname: "properties",
    type: "object",
    isArray: true,
  },
];

const schemaOfProperty = [
  {
    colname: "name",
    type: "string",
  },
  {
    colname: "syno",
    type: "string",
    isArray: true,
  },
];

export const Basic = () => <ZESchemaEditor />;
