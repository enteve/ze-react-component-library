import React from "react";
import ZEAuthEditor from '../ZEAuthEditor'

// prepare server
import prepareServerForStories from "../../../util/prepareServerForStories";

prepareServerForStories();

export default {
  title: "ZEAuthEditor",
};

export const Basic = () => <ZEAuthEditor />;
