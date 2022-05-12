import React, { useState } from "react";
import ZESearchBar, { ZESearchBarAnswerType } from "../index";
// prepare server
import prepareServerForStories from "../../../util/prepareServerForStories";
prepareServerForStories();

export default {
  title: "ZESearchBar",
};

export const ZESearchBarDemo = () => {
  const [answer, setAnswer] = useState<ZESearchBarAnswerType>();
  return (
    <>
      <ZESearchBar onAsk={setAnswer} />
      {answer && <pre>{JSON.stringify(answer, null, 2)}</pre>}
    </>
  );
};
