import { message } from "antd";
import type {
  LogicformType,
  LogicformAPIResultType,
  AskAPIResultType,
} from "zeroetp-api-sdk";
import { execLogicform, ask, commonRequest } from "zeroetp-api-sdk";

export async function request(func: Promise<any>) {
  try {
    return await func;
  } catch (error) {
    message.error(error.message);
  }

  return null;
}

export async function requestAsk(
  question: string,
  logicform_only?: boolean
): Promise<AskAPIResultType> {
  const ret = await request(ask(question, logicform_only));
  return ret;
}

export async function requestLogicform(
  logicform: LogicformType
): Promise<LogicformAPIResultType> {
  const ret: LogicformAPIResultType = await request(execLogicform(logicform));

  if (ret.error) {
    message.error(ret.error);
    return null;
  }

  return ret;
}

export async function requestRecommend(logicform: LogicformType): Promise<any> {
  const ret = await request(
    commonRequest("/logicform/recommend", {
      method: "POST",
      data: {
        logicform,
      },
    })
  );
  return ret;
}

export async function requestPinToDashboard(params: {
  title: string;
  representationType: string;
  logicform?: string;
  question?: string;
}) {
  const ret = await request(
    commonRequest("/dashboard", {
      method: "POST",
      data: {
        question: params,
      },
    })
  );
  return ret;
}

export async function requestUnPinToDashboard(id: string) {
  const ret = await request(
    commonRequest(`/dashboard/${id}`, {
      method: "DELETE",
    })
  );
  return ret;
}

export async function requestSuggest(s: string) {
  const ret = await request(
    commonRequest(`/suggest?s=${encodeURIComponent(s)}`)
  );
  return ret;
}

export async function requestSuggestByVoice(formData: FormData) {
  const ret = await request(
    commonRequest("/nlq/voice", {
      method: "POST",
      data: formData,
    })
  );
  return ret;
}

// 获取微信小程序端的问答
export async function requestPollingMicrophoneText() {
  const ret = await request(commonRequest(`/nlq/microphoneQuestion`));
  return ret;
}

export async function getRoles() {
  const ret = await request(commonRequest("/roles"));
  return ret;
}

export async function createRole(payload: any) {
  const ret = await request(
    commonRequest("/roles", { method: "POST", data: payload })
  );
  return ret;
}

export async function updateRole(id: string, payload: any) {
  const ret = await request(
    commonRequest(`/roles/${id}`, { method: "PUT", data: payload })
  );
  return ret;
}

export async function deleteRole(id: string) {
  const ret = await request(
    commonRequest(`/roles/${id}`, { method: "DELETE" })
  );
  return ret;
}

export async function getAccounts() {
  const ret = await request(commonRequest("/accounts"));
  return ret;
}

export async function createAccount(payload: any) {
  const ret = await request(
    commonRequest("/accounts", { method: "POST", data: payload })
  );
  return ret;
}

export async function updateAccount(id: string, payload: any) {
  const ret = await request(
    commonRequest(`/accounts/${id}`, { method: "PUT", data: payload })
  );
  return ret;
}

export async function deleteAccount(id: string) {
  const ret = await request(
    commonRequest(`/accounts/${id}`, { method: "DELETE" })
  );
  return ret;
}
