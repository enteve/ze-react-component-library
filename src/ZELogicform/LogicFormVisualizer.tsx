import React from "react";
import moment from "moment";
import { Badge, Button, Dropdown, Menu } from "antd";

import { isSimpleQuery, LogicformType } from "zeroetp-api-sdk";

import { isRelativeDateForm, normaliseRelativeDateForm } from "zeroetp-api-sdk";
import { DownOutlined } from "@ant-design/icons";

export type LogicFormVisualizerDisplayProp = {
  schema?: boolean;
  preds?: boolean;
  query?: boolean;
  groupby?: boolean;
  sort?: boolean; // sort同时掌管着skip，sort，limit
};

export interface LogicFormVisualizerProps {
  logicform: LogicformType;

  // 表达要不要显示某一些的部分。默认都是true。可以把schema和preds关掉
  display?: LogicFormVisualizerDisplayProp;

  // feat: 支持筛选控件
  filters?: {
    [key: string]: {
      support_all?: boolean;
      distincts: string[];
    };
  };
  onQueryChange?: (query: any) => void;
}

/**
 * TODO: 有Bug，会改变LF里面时间的数据。这个函数应该是Mutable的
 * @param param0
 * @returns
 */
export const LogicFormVisualizer: React.FC<LogicFormVisualizerProps> = ({
  logicform,
  display = {},
  filters = {},
  onQueryChange,
}) => {
  const badges: { color: string; text: React.ReactNode }[] = [];
  const filterColor = "green";

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
    const dateReg = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
    const basicValueDisplay = (oldV: any) => {
      let v = oldV;
      if (v === undefined) {
        return "全部";
      }

      if (typeof v === "boolean") {
        return v ? "是" : "否";
      }
      if (typeof v !== "object") {
        return v;
      }

      if (v.$lte && isRelativeDateForm(v.$lte)) {
        v.$lte = normaliseRelativeDateForm(v.$lte);
        v.$lte = v.$lte.$lte;
      }

      if (v.$gte && isRelativeDateForm(v.$gte)) {
        v.$gte = normaliseRelativeDateForm(v.$gte);
        v.$gte = v.$gte.$gte;
      }

      if (isRelativeDateForm(v)) {
        v = normaliseRelativeDateForm(v);
      }

      if (
        v.$lte &&
        v.$gte &&
        (dateReg.test(v.$lte) ||
          v.$lte instanceof Date ||
          v.$lte instanceof moment)
      ) {
        let startDate = moment(v.$gte).format("YYYY.MM.DD HH:mm:ss");
        let endDate = moment(v.$lte).format("YYYY.MM.DD HH:mm:ss");

        // 优化一下显示方式
        if (startDate.endsWith(" 00:00:00") && endDate.endsWith(" 23:59:59")) {
          startDate = startDate.substring(0, 10);
          endDate = endDate.substring(0, 10);
        }

        if (startDate === endDate) {
          return startDate;
        }

        return `${startDate} ~ ${endDate}`;
      }

      if (typeof v === "object" && v.operator === "$ent") {
        return v.name;
      }

      return "";
    };

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
              <Button>
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

  return (
    <div>
      {badges.map((badge, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Badge key={`${index}`} {...badge} style={{ marginRight: 25 }} />
      ))}
    </div>
  );
};
