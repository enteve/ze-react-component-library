import React from "react";
import ZESchemaEditor from "../ZESchemaEditor";

// prepare server
import prepareServerForStories from "../../../util/prepareServerForStories";

prepareServerForStories();

export default {
  title: "ZESchemaEditor",
};

export const Basic = () => <ZESchemaEditor />;
