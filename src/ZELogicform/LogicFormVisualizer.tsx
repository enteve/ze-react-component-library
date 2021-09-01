import React from "react";
import moment from "moment";
import { Badge } from "antd";

import type { LogicformType } from "zeroetp-api-sdk";

import { isRelativeDateForm, normaliseRelativeDateForm } from "zeroetp-api-sdk";

export interface LogicFormVisualizerProps {
  logicform: LogicformType;
}

/**
 * TODO: 有Bug，会改变LF里面时间的数据。这个函数应该是Mutable的
 * @param param0
 * @returns
 */
export const LogicFormVisualizer: React.FC<LogicFormVisualizerProps> = ({
  logicform,
}) => {
  const badges: { color: string; text: React.ReactNode }[] = [];
  const filterColor = "green";

  badges.push({
    color: "red",
    text: (
      <span>
        数据源：<strong>{logicform.schemaName || logicform.schema}</strong>
      </span>
    ),
  });

  if (logicform.groupby) {
    const doWithGroupbyItem = (groupbyItem: any) => {
      if (typeof groupbyItem === "object") {
        return `${groupbyItem._id}(${groupbyItem.level})`;
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
  if (logicform.query) {
    const dateReg = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
    const basicValueDisplay = (oldV: any) => {
      let v = oldV;
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
        return `${moment(v.$gte).format("YYYY-MM-DD HH:mm:ss")} ~ ${moment(
          v.$lte
        ).format("YYYY-MM-DD HH:mm:ss")}`;
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
      if (
        typeof v === "boolean" ||
        typeof v !== "object" ||
        (v.$lte && v.$gte) ||
        isRelativeDateForm(v)
      ) {
        // 时间格式
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
    });
  }

  if (logicform.operator) {
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
  if (logicform.preds) {
    const preds = logicform.preds.map((p, index) => (
      <span key={index}>
        <strong>{p.operator}</strong> {p.pred && `(${p.pred})`}
        {index < logicform.preds!.length - 1 && "，"}
      </span>
    ));
    badges.push({
      color: "orange",
      text: <span>公式： {preds}</span>,
    });
  }

  if (logicform.sort) {
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

  if (logicform.limit && logicform.limit > 0) {
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