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

export async function requestAsk(question: string): Promise<AskAPIResultType> {
  const ret = await request(ask(question, false));
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

  // 20211211 ZXC: 这里有一个关于formatter的特殊逻辑，不知道有没有更好的解决方案
  // 对于一个有ui.formatters的property来说，如果是有groupby的，那么一定要保证这个property的formatter是恒定的。在这里计算
  // TODO： 放semanticdb里面去？
  if (ret.result && logicform.groupby && ret.columnProperties) {
    ret.columnProperties.forEach((property) => {
      if (property.ui?.formatters) {
        // 一个formatter 80%以上合格才行
        const counts = property.ui?.formatters.map((f) => {
          return ret.result.reduce((acc, r) => {
            if (property.name in r) {
              const value = r[property.name];
              let hit = true;

              if (f.max && f.max <= value) {
                hit = false;
              }
              if (f.min && value < f.min) {
                hit = false;
              }

              if (hit) {
                return acc + 1;
              }
            }
            return acc;
          }, 0);
        });
        for (let i = 0; i < counts.length; i++) {
          const element = counts[i];
          if (element / parseFloat(ret.result.length) > 0.8) {
            property.ui.formatters = [
              {
                ...property.ui?.formatters[i],
                min: undefined,
                max: undefined,
              },
            ];
            break;
          }
        }
      }
    });
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
        question: params
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
  const ret = await request(commonRequest(`/suggest?s=${encodeURIComponent(s)}`));
  return ret;
}

export async function requestSuggestByVoice(formData: FormData) {
  const ret = await request(commonRequest('/nlq/voice', {
    method: "POST",
    data: formData
  }));
  return ret;
}


// 获取微信小程序端的问答
export async function requestPollingMicrophoneText() {
  const ret = await request(commonRequest(`/nlq/microphoneQuestion`));
  return ret;
}
