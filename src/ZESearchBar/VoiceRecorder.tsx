import React, { useState, FC, HTMLAttributes } from "react";
import { Button, message } from "antd";
import Recorder from "js-audio-recorder";
import { requestSuggestByVoice } from "../request";

import { AudioOutlined, LoadingOutlined } from "@ant-design/icons";

interface VoiceRecorderProps {
  ask: (text?: string) => void;
}

type LiteralUnion<T extends U, U> = T | (U & {});

const defaultColor = "primary" as const;

export const RecordLoading: FC<
  {
    color?: LiteralUnion<typeof defaultColor, string>;
  } & HTMLAttributes<HTMLDivElement>
> = ({ color = defaultColor, children, style, className = "" }) => {
  const isPrimary = color === defaultColor;
  const props = {
    color: isPrimary ? undefined : color,
    className: isPrimary ? "text-primary-color" : undefined,
  };

  return (
    <div
      style={style}
      className={`ze-search-bar-record-loading-wrapper ${className}`}
    >
      <div className="ze-search-bar-record-loading-icon">
        <AudioOutlined
          style={{
            fontSize: 50,
            color: props.color,
          }}
          className={props.className}
        />
        <LoadingOutlined
          className={props.className}
          style={{
            fontSize: 100,
            color: props.color,
          }}
          spin
        />
      </div>
      <div
        style={{
          fontSize: 18,
          marginTop: 12,
          color: props.color,
          textAlign: "center",
        }}
        className={props.className}
      >
        {children}
      </div>
    </div>
  );
};

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ ask }) => {
  const [translating, setTranslating] = useState<boolean>(false);
  // 开始录音
  const recorder: Recorder = new Recorder({
    sampleBits: 16,
    sampleRate: 16000,
    numChannels: 1,
    compiling: false,
  });

  try {
    recorder.start();
  } catch (error) {
    message.error("无法打开录音设备，请确保浏览器权限设置正确");
    ask(); // 退出去
  }

  const sendVoice = (data: Blob) => {
    const formData = new FormData();
    formData.append("voice", data);

    requestSuggestByVoice(formData)
      .then((res) => {
        ask(res.result);
      })
      .catch((e) => message.error(e.message));
  };

  const translateRecord = () => {
    if (!recorder) return;

    setTranslating(true);
    recorder.stop();
    sendVoice(recorder.getWAVBlob());
    recorder.destroy();
  };

  return (
    <div
      style={{
        textAlign: "center",
      }}
    >
      <RecordLoading />
      <Button
        onClick={() => translateRecord()}
        loading={translating}
        style={{
          marginTop: 60,
        }}
        type="primary"
      >
        提交
      </Button>
    </div>
  );
};

export default VoiceRecorder;
