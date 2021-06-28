import { message } from "antd";
import type {
  LogicformType,
  LogicformAPIResultType,
  AskAPIResultType,
} from "zeroetp-api-sdk";
import { execLogicform, ask } from "zeroetp-api-sdk";

export async function request(func: Promise<any>) {
  try {
    return await func;
  } catch (error) {
    message.error(error.message);
  }

  return null;
}

export async function requestAsk(question: string): Promise<AskAPIResultType> {
  const ret = await request(ask(question, false));
  return ret;
}

export function requestLogicform(
  logicform: LogicformType
): Promise<LogicformAPIResultType> {
  return request(execLogicform(logicform));
}
