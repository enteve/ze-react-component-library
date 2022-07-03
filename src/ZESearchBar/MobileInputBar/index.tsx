import React, { useRef, useEffect, useState } from "react";
import Recorder from "js-audio-recorder";
import { Button, Input, message } from "antd";
import { voice } from "zeroetp-api-sdk";
import wx from "weixin-js-sdk";
import "./index.less";
// @ts-ignore
import keyboardIcon from "./assets/keyboardIcon.png";
// @ts-ignore
import voiceIcon from "./assets/voiceIcon.png";

export type InputBarProps = {
  placeholder?: string;
  onSubmit?: (value: string) => void;
  onTouchStart?: () => void;
  onTouchEnd?: () => void;
};

const recorder: Recorder = new Recorder({
  sampleBits: 16,
  sampleRate: 16000,
  numChannels: 1,
  compiling: false,
});

const InputBar: React.FC<InputBarProps> = ({
  placeholder = "输入问题，获得Insights！",
  onSubmit,
  onTouchStart,
  onTouchEnd,
}) => {
  const [value, setValue] = useState<string>();
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [posStart, setPosStart] = useState<number>(0);
  const recordingButton = useRef(null);
  const [mode, setMode] = useState<"text" | "voice" | "textByVoice">(
    (localStorage.getItem("inputMode") as any) || "text"
  ); // textByVoice指的是先voice后，变成修改模式。然后提交完后要再变为voice模式

  useEffect(() => {
    window.oncontextmenu = function (e) {
      //取消默认的浏览器自带右键 很重要！！
      // TODO：测试下会不会复制文字不行了
      e.preventDefault();
    };
    if (recordingButton?.current) {
      (recordingButton?.current as HTMLElement).addEventListener(
        "contextmenu",
        (e) => {
          e.preventDefault();
        }
      );
    }
  }, []);

  const setVoiceText = (s: string | undefined) => {
    let newS = s;
    if (newS) {
      newS = newS.replace(/(病痛啥|并通商)/g, "丙通沙");
      newS = newS.replace(/(夏凡宁|夏凡尼)/g, "夏帆宁");
      newS = newS.replace(/(或是为|卧室伟)/g, "沃士韦");
      newS = newS.replace(/(威力的|韦立德)/g, "韦立得");
      newS = newS.replace(/(捷夫康)/g, "捷扶康");
      newS = newS.replace(/(B所为|B拖尾)/g, "必妥维");
      newS = newS.replace(/(大可灰|大可会)/g, "达可挥");
      newS = newS.replace(/(抒发太)/g, "舒发泰");
    }

    setValue(newS);
  };

  const tryRecord = () => {
    try {
      // @ts-ignore
      if (window.__wxjs_environment) {
        wx.startRecord();
        wx.stopRecord();
      } else {
        recorder.start();
        recorder.stop();
      }
    } catch (error) {
      message.error("无法打开录音设备，请确保浏览器权限设置正确");
    }
  };

  const startRecording = () => {
    try {
      onTouchStart?.();
      // @ts-ignore
      if (window.__wxjs_environment) {
        // 微信环境
        wx.startRecord();
      } else {
        recorder.start();
      }
      setIsRecording(true);
    } catch (error) {
      message.error("无法打开录音设备，请确保浏览器权限设置正确");
    }
  };
  const stopRecording = (endY?: number) => {
    onTouchEnd?.();
    // @ts-ignore
    if (window.__wxjs_environment) {
      wx.stopRecord({
        success: (res: any) => {
          if (endY) {
            if (posStart - endY > 50) return; // 上滑取消
          }

          const { localId } = res;

          // wx.uploadVoice({
          //   localId, // 需要上传的音频的本地ID，由stopRecord接口获得
          //   isShowProgressTips: 1, // 默认为1，显示进度提示
          //   success: function (res2: any) {
          //     const serverId = res2.serverId; // 返回音频的服务器端ID
          //     setVoiceText(serverId);
          //     message.info(serverId);
          //   },
          //   fail: (res2: any) => {
          //     message.info(JSON.stringify(res2));
          //   },
          // });
          wx.translateVoice({
            localId, // 需要识别的音频的本地Id，由录音相关接口获得
            isShowProgressTips: 1, // 默认为1，显示进度提示
            success(res2: any) {
              setMode("textByVoice");
              setVoiceText(res2.translateResult);
            },
          });
        },
        fail: (res: any) => {
          message.info(JSON.stringify(res));
        },
      });
    } else {
      recorder.stop();
      if (endY) {
        if (posStart - endY > 50) return; // 上滑取消
      }

      const formData = new FormData();
      formData.append("voice", recorder.getWAVBlob());

      voice(formData)
        .then((res) => {
          if (res.result.length > 0) {
            setMode("textByVoice");
            setVoiceText(res.result);
          }
        })
        .catch((error) => message.error(error.message));
    }
    setIsRecording(false);
  };

  const submit = () => {
    if (value && value.trim().length > 0) {
      onSubmit?.(value.trim());
      setVoiceText(undefined);

      if (mode === "textByVoice") {
        setMode("voice");
      }
    }
  };

  return (
    <div className="inputBarContainer">
      <img
        className="icon"
        src={mode === "voice" ? keyboardIcon : voiceIcon}
        onClick={() => {
          if (mode.startsWith("text")) {
            tryRecord(); // 先试一下，主要用于第一次的时候出现一个提示
            setVoiceText(undefined);
            setMode("voice");
            localStorage.setItem("inputMode", "voice");
          } else {
            setMode("text");
            localStorage.setItem("inputMode", "text");
          }
        }}
      />
      <div className="input">
        {(mode === "text" || mode === "textByVoice") && (
          <Input
            style={{ height: "100%" }}
            placeholder={placeholder}
            value={value}
            onChange={(e) => setVoiceText(e.target.value)}
            onPressEnter={() => submit()}
          />
        )}
        {mode === "voice" && (
          <div
            ref={recordingButton}
            className="recordingButton"
            onTouchStart={(e) => {
              setPosStart(e.targetTouches[0].pageY);
              startRecording();
            }}
            onTouchEnd={(e) => {
              // setPosEnd(e.changedTouches[0].pageY);
              stopRecording(e.changedTouches[0].pageY);
            }}
            // onTouchMove={(e) => { // 用来改UI上面的文案的，暂时不调了
            // }}
            onMouseDown={() => {
              startRecording();
            }}
            onMouseUp={() => {
              stopRecording();
            }}
          >
            <div className="text">
              {isRecording ? "松开 结束" : "按住 说话"}
            </div>
          </div>
        )}
      </div>
      <Button type="primary" className="sendButton" onClick={() => submit()}>
        发送
      </Button>
    </div>
  );
};

export default InputBar;
