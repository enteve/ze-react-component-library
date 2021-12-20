import React, { useState } from "react";
import { Button, message } from "antd";
import Recorder from "js-audio-recorder";
import { requestSuggestByVoice } from "../request";

import { AudioOutlined, LoadingOutlined } from "@ant-design/icons";

interface VoiceRecorderProps {
  ask: (text?: string) => void;
}

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
      <div
        style={{
          marginTop: 30,
        }}
      >
        <AudioOutlined
          style={{
            fontSize: 50,
          }}
          className="text-primary-color"
        />
        <LoadingOutlined
          className="text-primary-color"
          style={{
            fontSize: 100,
            position: "fixed",
            top: "50%",
            left: "50%",
            marginTop: "-60px",
            marginLeft: "-50px",
          }}
          spin
        />
      </div>
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
