import React, { ReactElement } from "react";
import { useRequest } from "@umijs/hooks";
import { requestLogicform } from "../request";
import type { LogicformAPIResultType } from "zeroetp-api-sdk";
import type { ZELogicformProps } from "./ZELogicform.types";

const ZELogicform: React.FC<ZELogicformProps> = ({
  logicform,
  dataKey,
  loadingKey,
  content,
  children,
}) => {
  const { data, loading } = useRequest<LogicformAPIResultType>(
    () => requestLogicform(logicform),
    {
      refreshDeps: [JSON.stringify(logicform)],
    }
  );

  if (content) {
    return <>{content(data.result, data)}</>;
  }

  const prop: any = {
    [dataKey]: data.result,
  };
  if (loadingKey) prop[loadingKey] = loading;

  return React.cloneElement(children as ReactElement, prop);
};

export default ZELogicform;
