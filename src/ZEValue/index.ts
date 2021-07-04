/**
 * 一个直接从Logicform转化为某一个Value的组件。比用问答更稳定。
 * TODO：默认的显示format，通过property来决定
 */
import { useRequest } from "@umijs/hooks";
import { requestLogicform } from "../request";
import type { LogicformAPIResultType, LogicformType } from "zeroetp-api-sdk";

export default (logicform: LogicformType) => {
  const { data } = useRequest<LogicformAPIResultType>(() =>
    requestLogicform(logicform)
  );

  if (data?.result) return data.result;
  return "-";
};
