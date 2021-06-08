import { useRequest } from "@umijs/hooks";
import { requestAsk } from "../request";
import { AskAPIResultType } from "zeroetp-api-sdk";

export default (question: string) => {
  const { data } = useRequest<AskAPIResultType>(() => requestAsk(question));

  if (data?.answer) return data.answer.result;
  return "-";
};
