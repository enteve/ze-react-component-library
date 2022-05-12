import React, { useState } from "react";
import {
  AutoComplete,
  Col,
  Input,
  Modal,
  Row,
  Space,
  Spin,
  Typography,
} from "antd";
import { useRequest } from "@umijs/hooks";
import {
  SearchOutlined,
  AudioOutlined,
  MobileOutlined,
  RightCircleOutlined,
} from "@ant-design/icons";
import type { LogicformType } from "zeroetp-api-sdk";
import VoiceRecorder from "./VoiceRecorder";
import {
  requestSuggest,
  requestPollingMicrophoneText,
  requestAsk,
  requestHot,
} from "../request";
import "./index.less";

const { Search } = Input;

const { Title, Link } = Typography;

export type ZESearchBarAnswerType =
  | {
      question: string;
      logicform: LogicformType;
    }
  | { error: string };

export type ZESearchBarProps = {
  showHot?: boolean;
  onAsk?: (answer: ZESearchBarAnswerType) => void;
};

const ZESearchBar: React.FC<ZESearchBarProps> = ({ showHot = true, onAsk }) => {
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
      if (Array.isArray(result)) {
        setSuggestions(result);
      }
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

          if (result.trim().length > 0) {
            ask(result);
          }
        }
      },
    });

  const { run: ask, loading } = useRequest(
    (question: string) => requestAsk(question, true),
    {
      manual: true,
      onSuccess: (result) => {
        if (result.logicform) {
          onAsk?.({ question: askString, logicform: result.logicform });
        } else if (result.error) {
          onAsk?.({ error: result.error });
        } else {
          console.error("unexpected ask result: ", result);
        }
      },
    }
  );

  const { data: hot } = useRequest(() => requestHot(), {
    initialData: [],
    formatResult: (res) =>
      (res?.hot || "")
        .split("\n")
        .map((h: string) => h.trim())
        .filter((h: string) => h.length > 0),
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
          if (!Array.isArray(histories)) {
            localStorage.removeItem("histories");
          } else {
            setSuggestions(histories);
          }
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
        disabled={loading}
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
          prefix={loading ? <Spin /> : <SearchOutlined />}
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
            if (value.trim().length > 0) {
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
      {showHot && hot.length > 0 && (
        <div style={{ marginTop: 15 }}>
          <Title level={4}>系统热搜</Title>
          <Row gutter={16}>
            {hot.map((i: string) => (
              <Col key={i} span={12}>
                <Link onClick={() => setAskString(i)}>
                  <RightCircleOutlined /> {i}
                </Link>
              </Col>
            ))}
          </Row>
        </div>
      )}
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
            if (text?.length > 0) {
              setAskString(text);
              ask(text);
            }
            setVoiceModalVisible(false);
          }}
        />
      </Modal>
    </>
  );
};

export default ZESearchBar;
