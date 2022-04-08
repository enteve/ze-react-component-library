import React, { useState } from "react";
import { Button, Switch, List } from "antd";
import { ZELogicformVisualizerListProps } from "./ZELogicformVisualizerList.types";
import ZELogicformVisualizer from "../ZELogicformVisualizer";
import { LogicformType } from "zeroetp-api-sdk";

/**
 * 注意，ZELogicformVisualizerList只接受norm后的logicform
 */
const ZELogicformVisualizerList: React.FC<ZELogicformVisualizerListProps> = ({
  logicforms,
  onClick,
}) => {
  const [showDiff, setShowDiff] = useState<boolean>(false);
  const diffLogicforms = getDiffLogicforms(logicforms);

  return (
    <>
      <div
        style={{
          paddingTop: 10,
          paddingBottom: 10,
          width: "100%",
          display: "flex",
        }}
      >
        <div style={{ flexGrow: 1 }} />
        <span style={{ marginRight: 5 }}>只显示不同处</span>
        <Switch
          checked={showDiff}
          onChange={() => {
            setShowDiff(!showDiff);
          }}
        />
      </div>
      <List
        dataSource={showDiff ? diffLogicforms : logicforms}
        renderItem={(logicform: LogicformType) => (
          <List.Item
            key={JSON.stringify(logicform)}
            actions={[
              <Button onClick={() => onClick(logicform)} type="primary">
                选择
              </Button>,
            ]}
          >
            <ZELogicformVisualizer logicform={logicform} />
          </List.Item>
        )}
        bordered
      />
    </>
  );
};

const getDiffLogicforms = (logicforms: LogicformType[]): LogicformType[] => {
  const diffKeyValuePool: { [key: string]: Set<string> } = {};

  // 下面循环的一个帮助函数
  const iterObject = (logicform, field) => {
    if (logicform[field]) {
      Object.entries(logicform[field]).forEach(([k, v]) => {
        const key = `query-${k}`;
        if (!(key in diffKeyValuePool))
          diffKeyValuePool[key] = new Set<string>();
        diffKeyValuePool[key].add(JSON.stringify(v));
      });
    }
  };

  logicforms.forEach((logicform) => {
    // schema
    if (!("schema" in diffKeyValuePool))
      diffKeyValuePool.schema = new Set<string>();
    diffKeyValuePool.schema.add(logicform.schema);

    // query
    iterObject(logicform, "query");

    // groupby
    if (!("groupby" in diffKeyValuePool))
      diffKeyValuePool.groupby = new Set<string>();
    diffKeyValuePool.groupby.add(JSON.stringify(logicform.groupby));

    // preds
    if (!("preds" in diffKeyValuePool))
      diffKeyValuePool.preds = new Set<string>();
    diffKeyValuePool.preds.add(JSON.stringify(logicform.preds));
    // limit
    if (!("limit" in diffKeyValuePool))
      diffKeyValuePool.limit = new Set<string>();
    diffKeyValuePool.limit.add(JSON.stringify(logicform.limit));
    // sort
    iterObject(logicform, "sort");

    // having
    iterObject(logicform, "having");
  });

  // 生成diffLogicforms
  const diffLogicforms = JSON.parse(JSON.stringify(logicforms));
  diffLogicforms.forEach((logicform) => {
    Object.keys(diffKeyValuePool).forEach((key) => {
      if (!diffKeyValuePool[key] || diffKeyValuePool[key].size < 2) {
        const split = key.split("-");
        if (split.length > 1) {
          delete logicform[split[0]][split[1]];
        } else {
          delete logicform[key];
        }
      }
    });
  });

  return diffLogicforms;
};

export default ZELogicformVisualizerList;
