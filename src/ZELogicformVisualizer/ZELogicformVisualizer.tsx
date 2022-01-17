import React from "react";
import { Badge, Button, Dropdown, Menu } from "antd";
import { isRelativeDateForm, isSimpleQuery } from "zeroetp-api-sdk";
import { DownOutlined } from "@ant-design/icons";
import { unnormalizeQuery, basicValueDisplay } from "../util";
import { ZELogicformVisualizerProps } from "./ZELogicformVisualizer.types";

/**
 * @param param0
 * @returns
 */
const ZELogicformVisualizer: React.FC<ZELogicformVisualizerProps> = ({
  logicform: initLogicform,
  badgeColor,
  display = {},
  filters = {},
  onQueryChange,
}) => {
  const badges: { color: string; text: React.ReactNode }[] = [];
  const filterColor = "green";

  // unnormalizeQuery
  const logicform = {
    ...initLogicform,
    query: unnormalizeQuery(initLogicform.query || {}),
  };

  // 有个逻辑，如果有preds且只有一个，且里面有query那么拿到外面去，这样可以绕过preds不显示的问题。
  if (logicform.preds?.length === 1 && logicform.preds[0].query) {
    if (!logicform.query) logicform.query = {};
    logicform.query = { ...logicform.query, ...logicform.preds[0].query };
    delete logicform.preds[0].query;
  }

  if (!(display.schema === false)) {
    badges.push({
      color: "red",
      text: (
        <span>
          数据源：<strong>{logicform.schemaName || logicform.schema}</strong>
        </span>
      ),
    });
  }

  if (!(display.groupby === false) && logicform.groupby) {
    const doWithGroupbyItem = (groupbyItem: any) => {
      if (typeof groupbyItem === "object") {
        if (groupbyItem.level) {
          return `${groupbyItem._id}(${groupbyItem.level})`;
        }
        return groupbyItem._id;
      }
      return groupbyItem;
    };

    let innerText: any;
    if (Array.isArray(logicform.groupby)) {
      innerText = logicform.groupby
        .map((groupbyItem) => doWithGroupbyItem(groupbyItem))
        .join(",");
    } else {
      innerText = doWithGroupbyItem(logicform.groupby);
    }

    badges.push({
      color: "purple",
      text: (
        <span>
          按 <strong>{innerText}</strong> 分组
        </span>
      ),
    });
  }
  if (!(display.query === false) && logicform.query) {
    let { query } = logicform;
    if (logicform.having) {
      query = { ...query, ...logicform.having };
    }

    Object.entries(query).forEach(([k, v]: [string, any]) => {
      if (!(k in filters)) {
        // 如果在filters里面，那么由👇的代码来管
        if (
          typeof v === "boolean" ||
          typeof v !== "object" ||
          (v.$lte && v.$gte) ||
          isRelativeDateForm(v)
        ) {
          // 基本属性
          badges.push({
            color: filterColor,
            text: (
              <span>
                {k}：<strong>{basicValueDisplay(v)}</strong>
              </span>
            ),
          });
        } else if ("$ne" in v) {
          badges.push({
            color: filterColor,
            text: (
              <span>
                {k} 不等于 <strong>{basicValueDisplay(v.$ne)}</strong>
              </span>
            ),
          });
        } else if ("$gt" in v) {
          badges.push({
            color: filterColor,
            text: (
              <span>
                {k} 大于 <strong>{basicValueDisplay(v.$gt)}</strong>
              </span>
            ),
          });
        } else if ("$lt" in v) {
          badges.push({
            color: filterColor,
            text: (
              <span>
                {k} 小于 <strong>{basicValueDisplay(v.$lt)}</strong>
              </span>
            ),
          });
        } else if ("$gte" in v) {
          badges.push({
            color: filterColor,
            text: (
              <span>
                {k} 大于等于 <strong>{basicValueDisplay(v.$gte)}</strong>
              </span>
            ),
          });
        } else if ("$lte" in v) {
          badges.push({
            color: filterColor,
            text: (
              <span>
                {k} 小于等于 <strong>{basicValueDisplay(v.$lte)}</strong>
              </span>
            ),
          });
        } else if ("$in" in v) {
          badges.push({
            color: filterColor,
            text: (
              <span>
                {k} 等于 <strong>{v.$in.join(",")}</strong>
              </span>
            ),
          });
        } else if (v.operator === "$ent" && !v.level) {
          // TODO: 20201103：level的显示不应该在query里面。但是现在在query里面。
          badges.push({
            color: filterColor,
            text: (
              <span>
                {k}：<strong>{v.name}</strong>
              </span>
            ),
          });
        }
      }
    });

    Object.entries(filters).forEach(([k, v]) => {
      if (v.show === false) return;
      badges.push({
        color: filterColor,
        text: (
          <span>
            {k}：
            <Dropdown
              trigger={["click"]}
              overlay={
                <Menu>
                  {v.support_all && (
                    <Menu.Item
                      key={"全部"}
                      onClick={() => {
                        onQueryChange?.({
                          ...logicform.query,
                          [k]: undefined,
                        });
                      }}
                    >
                      全部
                    </Menu.Item>
                  )}
                  {v.distincts.map((f) => (
                    <Menu.Item
                      key={f === undefined ? "全部" : f}
                      onClick={() => {
                        onQueryChange?.({
                          ...logicform.query,
                          [k]: f,
                        });
                      }}
                    >
                      {f === undefined ? "全部" : f}
                    </Menu.Item>
                  ))}
                </Menu>
              }
            >
              <Button type="primary" shape="round" size="small">
                {basicValueDisplay(query[k])}
                <DownOutlined />
              </Button>
            </Dropdown>
          </span>
        ),
      });
    });
  }

  if (!(display.preds === false) && logicform.operator) {
    if (logicform.operator === "$ent" && logicform.name) {
      badges.push({
        color: "blue",
        text: (
          <span>
            实体： <strong>{logicform.name}</strong>
          </span>
        ),
      });
    } else {
      badges.push({
        color: "orange",
        text: (
          <span>
            公式： <strong>{logicform.operator}</strong>{" "}
            {logicform.pred && `(${logicform.pred})`}
          </span>
        ),
      });
    }
  }
  if (!(display.preds === false) && logicform.preds) {
    const preds = logicform.preds.map((p, index) => {
      // TODO: Traverse尚未支持
      if (Array.isArray(p)) {
        p = p[0];
      }

      return (
        <span key={index}>
          {p.operator && (
            <>
              <strong>{p.operator}</strong> {p.pred && `(${p.pred})`}
            </>
          )}
          {!p.operator && <>{typeof p === "object" ? p.pred : p}</>}
          {index < logicform.preds!.length - 1 && "，"}
        </span>
      );
    });

    if (!isSimpleQuery(logicform)) {
      badges.push({
        color: "orange",
        text: <span>公式： {preds}</span>,
      });
    } else {
      badges.push({
        color: "orange",
        text: (
          <span>
            字段： <strong>{preds}</strong>
          </span>
        ),
      });
    }
  }

  if (!(display.sort === false) && logicform.sort) {
    Object.entries(logicform.sort).forEach(([k, v]) => {
      badges.push({
        color: "gold",
        text: (
          <span>
            按 <strong>{k}</strong> {v === -1 ? "倒序" : "正序"}
          </span>
        ),
      });
    });
  }

  if (!(display.sort === false) && logicform.limit && logicform.limit > 0) {
    badges.push({
      color: "pink",
      text: (
        <span>
          显示<strong>{logicform.limit}</strong>条记录
        </span>
      ),
    });
  }

  // badge color
  if (badgeColor) {
    badges.forEach((b) => (b.color = badgeColor));
  }

  return (
    <div>
      {badges.map((badge, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Badge key={`${index}`} {...badge} style={{ marginRight: 25 }} />
      ))}
    </div>
  );
};

export default ZELogicformVisualizer;