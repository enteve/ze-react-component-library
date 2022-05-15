// Generated with util/create-component.js
import React from "react";
import ZEGrid from "./ZEGrid";
import * as xlsx from "xlsx";

export default {
  title: "ZEGrid",
};

export const Basic = () => (
  <ZEGrid
    data={[
      ["红黑榜店务数据", undefined, undefined, undefined],
      ["品牌类型", "商贸单元", "日店均时长（h）", "百分比"],
      ["直营", "安徽商贸单元", 11.95, "1%"],
      ["直营", "北京商贸单元", 12],
      ["特许", "安徽商贸单元", 11.95, "-"],
      ["特许", "北京商贸单元", 12],
    ]}
    autoMergeForIndex={(_i, j) => j === 0}
  />
);

export const XLSX = () => (
  <ZEGrid
    data={[
      ["红黑榜店务数据", undefined, undefined, undefined],
      ["品牌类型", "商贸单元", "日店均时长（h）", "百分比"],
      ["直营", "安徽商贸单元", 11.95, "1%"],
      ["直营", "北京商贸单元", 12],
      ["特许", "安徽商贸单元", 11.95, "-"],
      ["特许", "北京商贸单元", 12],
    ]}
    autoMergeForIndex={(_i, j) => j === 0}
    xlsx={xlsx}
  />
);

export const Fix = () => (
  <ZEGrid
    data={[
      ["红黑榜店务数据", undefined, undefined, undefined],
      ["品牌类型", "商贸单元", "日店均时长（h）", "百分比"],
      ["直营", "安徽商贸单元", 11.95, "1%"],
      ["直营", "北京商贸单元", 12],
      ["特许", "安徽商贸单元", 11.95, "-"],
      ["特许", "北京商贸单元", 12],
    ]}
    autoMergeForIndex={(_i, j) => j === 0}
    fix={{ col: 1 }}
  />
);

export const Controls = () => (
  <ZEGrid
    data={[
      ["红黑榜店务数据", undefined, undefined, undefined],
      ["品牌类型", "商贸单元", "日店均时长（h）", "百分比"],
      ["直营", "安徽商贸单元", 11.95, "1%"],
      ["直营", "北京商贸单元", 12],
      ["特许", "安徽商贸单元", 11.95, "-"],
      ["特许", "北京商贸单元", 12],
    ]}
    autoMergeForIndex={(_i, j) => j === 0}
    controls={<div>zxc</div>}
  />
);

export const Empty = () => <ZEGrid data={[]} />;
