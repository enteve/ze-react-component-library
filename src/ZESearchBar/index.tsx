import React, { useState } from "react";
import { AutoComplete, Input, Modal, Space } from "antd";
import { useRequest } from "@umijs/hooks";
import {
  SearchOutlined,
  AudioOutlined,
  MobileOutlined,
} from "@ant-design/icons";
import VoiceRecorder from "./VoiceRecorder";
import { requestSuggest, requestPollingMicrophoneText } from "../request";
import "./index.less";

const { Search } = Input;

export type ZESearchBarProps = {
  ask?: (question: string) => void;
};

const ZESearchBar: React.FC<ZESearchBarProps> = ({ ask }) => {
  const [voiceModalVisible, setVoiceModalVisible] = useState<boolean>(false);
  const [microphoneMode, setMicrophoneMode] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [askString, setAskString] = useState<string>("");
  const {
    run: getSuggestions,
    cancel: cancelGetSuggestions,
    loading: isGettingSuggestions,
  } = useRequest<string[]>(requestSuggest, {
    manual: true,
    debounceInterval: 100,
    onSuccess: (result) => {
      setSuggestions(result);
    },
  });
  const { run: pollMicrophoneText, cancel: cancelPollMicrophoneText } =
    useRequest(requestPollingMicrophoneText, {
      formatResult: (res) => res.question,
      pollingInterval: 500,
      pollingWhenHidden: false,
      manual: true,
      onSuccess: (result) => {
        if (result) {
          setAskString(result);
          if (ask) ask(result);
        }
      },
    });

  const onFocus = () => {
    // Show History
    if (
      askString.length === 0 &&
      suggestions.length === 0 &&
      !voiceModalVisible
    ) {
      try {
        const saved = localStorage.getItem("histories");
        if (saved) {
          const histories = JSON.parse(saved);
          setSuggestions(histories);
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }
    }
  };

  return (
    <>
      <AutoComplete
        backfill
        value={askString}
        onFocus={onFocus}
        options={suggestions.map((s) => ({ value: s }))}
        style={{ width: "100%" }}
        onSearch={(text) => {
          getSuggestions(text);
          setSuggestions([]);
          setAskString(text);
        }}
        onChange={(text) => {
          // 选择option和输入都会触发。
          setSuggestions([]);
          setAskString(text);
        }}
      >
        <Search
          placeholder="输入问题，获得Insights！"
          enterButton="问一下"
          size="large"
          prefix={<SearchOutlined />}
          suffix={
            <Space>
              <AudioOutlined
                onClick={() => setVoiceModalVisible(true)}
                className="text-primary-color"
              />
              <MobileOutlined
                onClick={() => {
                  if (microphoneMode === false) {
                    pollMicrophoneText();
                  } else {
                    cancelPollMicrophoneText();
                  }
                  setMicrophoneMode(!microphoneMode);
                }}
                className={
                  microphoneMode ? "text-primary-color" : "text-secondary-color"
                }
              />
            </Space>
          }
          onSearch={(value) => {
            if (ask) {
              ask(value);
              setSuggestions([]);
              if (isGettingSuggestions) cancelGetSuggestions();

              // History
              try {
                const savedHist = localStorage.getItem("histories");
                let histories = [];
                if (savedHist) {
                  histories = JSON.parse(savedHist);
                }
                histories = histories.filter((h: string) => h !== value);
                histories.splice(0, 0, value);
                histories = histories.slice(0, 5);
                localStorage.setItem("histories", JSON.stringify(histories));
              } catch (e) {
                // eslint-disable-next-line no-console
                console.error(e);
              }
            }
          }}
        />
      </AutoComplete>
      <Modal
        title="录音中，请开始讲话"
        visible={voiceModalVisible}
        onCancel={() => setVoiceModalVisible(false)}
        footer={null}
        closable={false}
        centered
        destroyOnClose
      >
        <VoiceRecorder
          ask={(text) => {
            if (text) {
              setAskString(text);
              if (ask) ask(text);
            }
            setVoiceModalVisible(false);
          }}
        />
      </Modal>
    </>
  );
};

export default ZESearchBar;
