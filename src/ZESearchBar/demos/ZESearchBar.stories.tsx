import React from "react";
import ZESearchBar from "../index";
// prepare server
import prepareServerForStories from "../../../util/prepareServerForStories";
prepareServerForStories();

export default {
  title: "ZESearchBar",
};

export const ZESearchBarDemo = () => {
  return (
    <ZESearchBar
      ask={(query: string) => {
        console.log(query);
      }}
    />
  );
};
