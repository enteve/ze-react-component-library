// Generated with util/create-component.js
import React from "react";
import ZESheet from "../index";

import "@antv/s2-react/dist/style.min.css";

// prepare server
import prepareServerForStories from "../../../util/prepareServerForStories";
prepareServerForStories();

export default {
  title: "ZESheet",
};

export const Basic = () => (
  <ZESheet
    logicform={{
      schema: "sales",
      groupby: ["店铺"],
      preds: [{ name: "s", operator: "$sum", pred: "销售量" }],
    }}
    s2DataConfig={{
      fields: {
        rows: ["店铺.名称"],
        values: ["s"],
      },
    }}
  />
);
