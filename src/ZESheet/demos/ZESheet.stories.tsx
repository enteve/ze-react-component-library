// Generated with util/create-component.js
import { ArrowUpOutlined } from "@ant-design/icons";
import { Card, Statistic } from "antd";
import React from "react";
import ZESheet from "../index";

import "@antv/s2-react/dist/style.min.css";
import { SheetComponent } from "@antv/s2-react";

// prepare server
import prepareServerForStories from "../../../util/prepareServerForStories";
prepareServerForStories();

export default {
  title: "ZESheet",
};

export const Basic = () => {
  const s2DataConfig = {
    fields: {
      rows: ["province", "city"],
      columns: ["type"],
      values: ["price"],
    },
    data: [
      {
        province: "浙江",
        city: "杭州",
        type: "笔",
        price: "1",
      },
      {
        province: "浙江",
        city: "杭州",
        type: "纸张",
        price: "2",
      },
      {
        province: "浙江",
        city: "舟山",
        type: "笔",
        price: "17",
      },
      {
        province: "浙江",
        city: "舟山",
        type: "纸张",
        price: "0.5",
      },
      {
        province: "吉林",
        city: "丹东",
        type: "笔",
        price: "8",
      },
      {
        province: "吉林",
        city: "白山",
        type: "笔",
        price: "9",
      },
      {
        province: "吉林",
        city: "丹东",
        type: " 纸张",
        price: "3",
      },
      {
        province: "吉林",
        city: "白山",
        type: "纸张",
        price: "1",
      },
    ],
  };

  return (
    <SheetComponent
      dataCfg={s2DataConfig}
      options={{
        width: 600,
        height: 600,
      }}
    />
  );
  // return <ZESheet s2DataConfig={s2DataConfig} s2Options={s2Options} />;
};

export const Example2 = () => {
  const data = [
    {
      type: "有信用卡",
      job: "白领",
      age: "18岁以下",
      city: "一二线城市",
      count: 76.32,
    },
    {
      type: "有信用卡",
      job: "白领",
      age: "18岁以下",
      city: "三四线城市",
      count: 86.32,
    },
    {
      type: "有信用卡",
      job: "白领",
      age: "19岁到25岁",
      city: "一二城市",
      count: 16.32,
    },
    {
      type: "有信用卡",
      job: "白领",
      age: "19岁到25岁",
      city: "三四线城市",
      count: 16.32,
    },
    {
      type: "有信用卡",
      job: "白领",
      age: "26岁到30岁",
      city: "一二城市",
      count: 26.3,
    },
    {
      type: "有信用卡",
      job: "白领",
      age: "26岁到30岁",
      city: "三四线城市",
      count: 46.32,
    },
    {
      type: "有信用卡",
      job: "白领",
      age: "30岁到35岁",
      city: "一二线城市",
      count: 96.32,
    },
    {
      type: "有信用卡",
      job: "白领",
      age: "30岁到35岁",
      city: "三四线城市",
      count: 86.32,
    },
    {
      type: "有信用卡",
      job: "白领",
      age: "36岁到40岁",
      city: "一二线城市",
      count: 86.32,
    },
    {
      type: "有信用卡",
      job: "白领",
      age: "36岁到40岁",
      city: "三四线城市",
      count: 76.32,
    },
    {
      type: "有信用卡",
      job: "蓝领",
      age: "18岁以下",
      city: "一二线城市",
      count: 46.32,
    },
    {
      type: "有信用卡",
      job: "蓝领",
      age: "18岁以下",
      city: "三四线城市",
      count: 66,
    },
    {
      type: "有信用卡",
      job: "蓝领",
      age: "19岁到25岁",
      city: "一二城市",
      count: 52,
    },
    {
      type: "有信用卡",
      job: "蓝领",
      age: "19岁到25岁",
      city: "三四线城市",
      count: 96.32,
    },
    {
      type: "有信用卡",
      job: "蓝领",
      age: "26岁到30岁",
      city: "一二城市",
      count: 94.32,
    },
    {
      type: "有信用卡",
      job: "蓝领",
      age: "26岁到30岁",
      city: "三四线城市",
      count: 26.3,
    },
    {
      type: "有信用卡",
      job: "蓝领",
      age: "30岁到35岁",
      city: "一二线城市",
      count: 46.32,
    },
    {
      type: "有信用卡",
      job: "蓝领",
      age: "30岁到35岁",
      city: "三四线城市",
      count: 7.32,
    },
    {
      type: "有信用卡",
      job: "蓝领",
      age: "36岁到40岁",
      city: "一二线城市",
      count: 32.32,
    },
    {
      type: "有信用卡",
      job: "蓝领",
      age: "36岁到40岁",
      city: "三四线城市",
      count: 76,
    },
    {
      type: "有信用卡",
      job: "学生",
      age: "18岁以下",
      city: "一二线城市",
      count: 16,
    },
    {
      type: "有信用卡",
      job: "学生",
      age: "18岁以下",
      city: "三四线城市",
      count: 6,
    },
    {
      type: "有信用卡",
      job: "学生",
      age: "19岁到25岁",
      city: "一二城市",
      count: 8,
    },
    {
      type: "有信用卡",
      job: "学生",
      age: "19岁到25岁",
      city: "三四线城市",
      count: 17.2,
    },
    {
      type: "有信用卡",
      job: "学生",
      age: "26岁到30岁",
      city: "一二城市",
      count: 16.32,
    },
    {
      type: "有信用卡",
      job: "学生",
      age: "26岁到30岁",
      city: "三四线城市",
      count: 36.2,
    },
    {
      type: "有信用卡",
      job: "学生",
      age: "30岁到35岁",
      city: "一二线城市",
      count: 6.32,
    },
    {
      type: "有信用卡",
      job: "学生",
      age: "30岁到35岁",
      city: "三四线城市",
      count: 26.32,
    },
    {
      type: "有信用卡",
      job: "学生",
      age: "36岁到40岁",
      city: "一二线城市",
      count: 8.32,
    },
    {
      type: "有信用卡",
      job: "学生",
      age: "36岁到40岁",
      city: "三四线城市",
      count: 76.32,
    },
    {
      type: "有信用卡",
      job: "其他",
      age: "18岁以下",
      city: "一二线城市",
      count: 4.32,
    },
    {
      type: "有信用卡",
      job: "其他",
      age: "18岁以下",
      city: "三四线城市",
      count: 40.3,
    },
    {
      type: "有信用卡",
      job: "其他",
      age: "19岁到25岁",
      city: "一二城市",
      count: 26.3,
    },
    {
      type: "有信用卡",
      job: "其他",
      age: "19岁到25岁",
      city: "三四线城市",
      count: 16.5,
    },
    {
      type: "有信用卡",
      job: "其他",
      age: "26岁到30岁",
      city: "一二城市",
      count: 56.2,
    },
    {
      type: "有信用卡",
      job: "其他",
      age: "26岁到30岁",
      city: "三四线城市",
      count: 36.3,
    },
    {
      type: "无信用卡",
      job: "白领",
      age: "18岁以下",
      city: "一二线城市",
      count: 16.32,
    },
    {
      type: "无信用卡",
      job: "白领",
      age: "18岁以下",
      city: "三四线城市",
      count: 76,
    },
    {
      type: "无信用卡",
      job: "白领",
      age: "19岁到25岁",
      city: "一二城市",
      count: 71.32,
    },
    {
      type: "无信用卡",
      job: "白领",
      age: "19岁到25岁",
      city: "三四线城市",
      count: 26.2,
    },
    {
      type: "无信用卡",
      job: "白领",
      age: "26岁到30岁",
      city: "一二城市",
      count: 66.32,
    },
    {
      type: "无信用卡",
      job: "白领",
      age: "26岁到30岁",
      city: "三四线城市",
      count: 76.32,
    },
    {
      type: "无信用卡",
      job: "白领",
      age: "30岁到35岁",
      city: "一二线城市",
      count: 96.32,
    },
    {
      type: "无信用卡",
      job: "白领",
      age: "30岁到35岁",
      city: "三四线城市",
      count: 80,
    },
    {
      type: "无信用卡",
      job: "白领",
      age: "36岁到40岁",
      city: "一二线城市",
      count: 61.32,
    },
    {
      type: "无信用卡",
      job: "白领",
      age: "36岁到40岁",
      city: "三四线城市",
      count: 30,
    },
    {
      type: "无信用卡",
      job: "蓝领",
      age: "18岁以下",
      city: "一二线城市",
      count: 83.3,
    },
    {
      type: "无信用卡",
      job: "蓝领",
      age: "18岁以下",
      city: "三四线城市",
      count: 76.32,
    },
    {
      type: "无信用卡",
      job: "蓝领",
      age: "19岁到25岁",
      city: "一二城市",
      count: 28,
    },
    {
      type: "无信用卡",
      job: "蓝领",
      age: "19岁到25岁",
      city: "三四线城市",
      count: 7.32,
    },
    {
      type: "无信用卡",
      job: "蓝领",
      age: "26岁到30岁",
      city: "一二城市",
      count: 30,
    },
    {
      type: "无信用卡",
      job: "蓝领",
      age: "26岁到30岁",
      city: "三四线城市",
      count: 6.5,
    },
    {
      type: "无信用卡",
      job: "蓝领",
      age: "30岁到35岁",
      city: "一二线城市",
      count: 6.32,
    },
    {
      type: "无信用卡",
      job: "蓝领",
      age: "30岁到35岁",
      city: "三四线城市",
      count: 72,
    },
    {
      type: "无信用卡",
      job: "蓝领",
      age: "36岁到40岁",
      city: "一二线城市",
      count: 36.32,
    },
    {
      type: "无信用卡",
      job: "蓝领",
      age: "36岁到40岁",
      city: "三四线城市",
      count: 74,
    },
    {
      type: "无信用卡",
      job: "学生",
      age: "18岁以下",
      city: "一二线城市",
      count: 25,
    },
    {
      type: "无信用卡",
      job: "学生",
      age: "18岁以下",
      city: "三四线城市",
      count: 40.2,
    },
    {
      type: "无信用卡",
      job: "学生",
      age: "19岁到25岁",
      city: "一二城市",
      count: 45,
    },
    {
      type: "无信用卡",
      job: "学生",
      age: "19岁到25岁",
      city: "三四线城市",
      count: 76.32,
    },
    {
      type: "无信用卡",
      job: "学生",
      age: "26岁到30岁",
      city: "一二城市",
      count: 26.32,
    },
    {
      type: "无信用卡",
      job: "学生",
      age: "26岁到30岁",
      city: "三四线城市",
      count: 2.2,
    },
    {
      type: "无信用卡",
      job: "学生",
      age: "30岁到35岁",
      city: "一二线城市",
      count: 16.32,
    },
    {
      type: "无信用卡",
      job: "学生",
      age: "30岁到35岁",
      city: "三四线城市",
      count: 70,
    },
    {
      type: "无信用卡",
      job: "学生",
      age: "36岁到40岁",
      city: "一二线城市",
      count: 69.32,
    },
    {
      type: "无信用卡",
      job: "学生",
      age: "36岁到40岁",
      city: "三四线城市",
      count: 90,
    },
    {
      type: "无信用卡",
      job: "其他",
      age: "18岁以下",
      city: "一二线城市",
      count: 69.3,
    },
    {
      type: "无信用卡",
      job: "其他",
      age: "18岁以下",
      city: "三四线城市",
      count: 86.72,
    },
    {
      type: "无信用卡",
      job: "其他",
      age: "19岁到25岁",
      city: "一二城市",
      count: 96.32,
    },
    {
      type: "无信用卡",
      job: "其他",
      age: "19岁到25岁",
      city: "三四线城市",
      count: 6.32,
    },
    {
      type: "无信用卡",
      job: "其他",
      age: "26岁到30岁",
      city: "一二城市",
      count: 73.32,
    },
    {
      type: "无信用卡",
      job: "其他",
      age: "26岁到30岁",
      city: "三四线城市",
      count: 6.2,
    },
    {
      type: "有信用卡",
      job: "其他",
      age: "36岁到40岁",
      city: "三四线城市",
      count: 26,
    },
    {
      type: "有信用卡",
      job: "其他",
      age: "30岁到35岁",
      city: "一二线城市",
      count: 46.32,
    },
    {
      type: "有信用卡",
      job: "其他",
      age: "30岁到35岁",
      city: "三四线城市",
      count: 61.32,
    },
    {
      type: "有信用卡",
      job: "其他",
      age: "36岁到40岁",
      city: "一二线城市",
      count: 38.32,
    },
    {
      type: "有信用卡",
      job: "其他",
      age: "36岁到40岁",
      city: "三四线城市",
      count: 26,
    },
    {
      type: "无信用卡",
      job: "其他",
      age: "30岁到35岁",
      city: "一二线城市",
      count: 69.2,
    },
    {
      type: "无信用卡",
      job: "其他",
      age: "30岁到35岁",
      city: "三四线城市",
      count: 7,
    },
    {
      type: "无信用卡",
      job: "其他",
      age: "36岁到40岁",
      city: "一二线城市",
      count: 62.12,
    },
    {
      type: "无信用卡",
      job: "其他",
      age: "36岁到40岁",
      city: "三四线城市",
      count: 37.0,
    },
    {
      type: "其他",
      job: "白领",
      age: "18岁以下",
      city: "一二线城市",
      count: 26.32,
    },
    {
      type: "其他",
      job: "白领",
      age: "18岁以下",
      city: "三四线城市",
      count: 76.2,
    },
    {
      type: "其他",
      job: "白领",
      age: "19岁到25岁",
      city: "一二城市",
      count: 16.2,
    },
    {
      type: "其他",
      job: "白领",
      age: "19岁到25岁",
      city: "三四线城市",
      count: 30.2,
    },
    {
      type: "其他",
      job: "白领",
      age: "26岁到30岁",
      city: "一二城市",
      count: 46.32,
    },
    {
      type: "其他",
      job: "白领",
      age: "26岁到30岁",
      city: "三四线城市",
      count: 42.32,
    },
    {
      type: "其他",
      job: "蓝领",
      age: "18岁以下",
      city: "一二线城市",
      count: 96.32,
    },
    {
      type: "其他",
      job: "蓝领",
      age: "18岁以下",
      city: "三四线城市",
      count: 76.32,
    },
    {
      type: "其他",
      job: "蓝领",
      age: "19岁到25岁",
      city: "一二城市",
      count: 65.32,
    },
    {
      type: "其他",
      job: "蓝领",
      age: "19岁到25岁",
      city: "三四线城市",
      count: 56,
    },
    {
      type: "其他",
      job: "蓝领",
      age: "26岁到30岁",
      city: "一二城市",
      count: 76.3,
    },
    {
      type: "其他",
      job: "蓝领",
      age: "26岁到30岁",
      city: "三四线城市",
      count: 72.2,
    },
    {
      type: "其他",
      job: "蓝领",
      age: "30岁到35岁",
      city: "一二线城市",
      count: 86.32,
    },
    {
      type: "其他",
      job: "蓝领",
      age: "30岁到35岁",
      city: "三四线城市",
      count: 11.32,
    },
    {
      type: "其他",
      job: "蓝领",
      age: "36岁到40岁",
      city: "一二线城市",
      count: 26.32,
    },
    {
      type: "其他",
      job: "蓝领",
      age: "36岁到40岁",
      city: "三四线城市",
      count: 88.32,
    },
    {
      type: "其他",
      job: "学生",
      age: "18岁以下",
      city: "一二线城市",
      count: 79.32,
    },
    {
      type: "其他",
      job: "学生",
      age: "18岁以下",
      city: "三四线城市",
      count: 42.32,
    },
    {
      type: "其他",
      job: "学生",
      age: "19岁到25岁",
      city: "一二城市",
      count: 40,
    },
    {
      type: "其他",
      job: "学生",
      age: "19岁到25岁",
      city: "三四线城市",
      count: 7.2,
    },
    {
      type: "其他",
      job: "学生",
      age: "26岁到30岁",
      city: "一二城市",
      count: 25.5,
    },
    {
      type: "其他",
      job: "学生",
      age: "26岁到30岁",
      city: "三四线城市",
      count: 26.32,
    },
    {
      type: "其他",
      job: "学生",
      age: "30岁到35岁",
      city: "一二线城市",
      count: 38.32,
    },
    {
      type: "其他",
      job: "学生",
      age: "30岁到35岁",
      city: "三四线城市",
      count: 28.32,
    },
    {
      type: "其他",
      job: "学生",
      age: "36岁到40岁",
      city: "一二线城市",
      count: 76.32,
    },
    {
      type: "其他",
      job: "学生",
      age: "36岁到40岁",
      city: "三四线城市",
      count: 10.32,
    },
    {
      type: "其他",
      job: "其他",
      age: "18岁以下",
      city: "一二线城市",
      count: 50.2,
    },
    {
      type: "其他",
      job: "其他",
      age: "18岁以下",
      city: "三四线城市",
      count: 46.2,
    },
    {
      type: "其他",
      job: "其他",
      age: "19岁到25岁",
      city: "一二城市",
      count: 66.2,
    },
    {
      type: "其他",
      job: "其他",
      age: "19岁到25岁",
      city: "三四线城市",
      count: 36.3,
    },
    {
      type: "其他",
      job: "其他",
      age: "26岁到30岁",
      city: "一二城市",
      count: 16.2,
    },
    {
      type: "其他",
      job: "其他",
      age: "26岁到30岁",
      city: "三四线城市",
      count: 46.2,
    },
    {
      type: "其他",
      job: "白领",
      age: "30岁到35岁",
      city: "一二线城市",
      count: 26.32,
    },
    {
      type: "其他",
      job: "白领",
      age: "30岁到35岁",
      city: "三四线城市",
      count: 16.32,
    },
    {
      type: "其他",
      job: "白领",
      age: "36岁到40岁",
      city: "一二线城市",
      count: 66.32,
    },
    {
      type: "其他",
      job: "白领",
      age: "36岁到40岁",
      city: "三四线城市",
      count: 18.32,
    },
    {
      type: "其他",
      job: "其他",
      age: "30岁到35岁",
      city: "一二线城市",
      count: 26.32,
    },
    {
      type: "其他",
      job: "其他",
      age: "30岁到35岁",
      city: "三四线城市",
      count: 48.32,
    },
    {
      type: "其他",
      job: "其他",
      age: "36岁到40岁",
      city: "一二线城市",
      count: 31.32,
    },
    {
      type: "其他",
      job: "其他",
      age: "36岁到40岁",
      city: "三四线城市",
      count: 77.32,
    },
  ];

  const s2DataConfig = {
    fields: {
      rows: ["type", "job"],
      columns: ["age", "city"],
      values: ["count"],
      valueInCols: true,
    },
    data,
  };

  return (
    <SheetComponent
      dataCfg={s2DataConfig}
      options={{
        width: 600,
        height: 480,
        hierarchyType: "tree",
        showSeriesNumber: false,
      }}
    />
  );
  // return <ZESheet s2DataConfig={s2DataConfig} s2Options={s2Options as any} />;
};

export const Table = () => {
  const data = [
    {
      province: "浙江",
      city: "杭州",
      type: "笔",
      price: "1",
    },
    {
      province: "浙江",
      city: "杭州",
      type: "纸张",
      price: "2",
    },
    {
      province: "浙江",
      city: "舟山",
      type: "笔",
      price: "17",
    },
    {
      province: "浙江",
      city: "舟山",
      type: "纸张",
      price: "6",
    },
    {
      province: "吉林",
      city: "丹东",
      type: "笔",
      price: "8",
    },
    {
      province: "吉林",
      city: "白山",
      type: "笔",
      price: "12",
    },
    {
      province: "吉林",
      city: "丹东",
      type: "纸张",
      price: "3",
    },
    {
      province: "吉林",
      city: "白山",
      type: "纸张",
      price: "25",
    },
    {
      province: "浙江",
      city: "杭州",
      type: "笔",
      cost: "0.5",
    },
    {
      province: "浙江",
      city: "杭州",
      type: "纸张",
      cost: "20",
    },
    {
      province: "浙江",
      city: "舟山",
      type: "笔",
      cost: "1.7",
    },
    {
      province: "浙江",
      city: "舟山",
      type: "纸张",
      cost: "0.12",
    },
    {
      province: "吉林",
      city: "丹东",
      type: "笔",
      cost: "10",
    },
    {
      province: "吉林",
      city: "白山",
      type: "笔",
      cost: "9",
    },
    {
      province: "吉林",
      city: "丹东",
      type: "纸张",
      cost: "3",
    },
    {
      province: "吉林",
      city: "白山",
      type: "纸张",
      cost: "1",
    },
  ];

  const s2DataConfig = {
    fields: {
      columns: ["province", "city", "type", "price", "cost"],
    },
    meta: [
      {
        field: "province",
        name: "省份",
      },
      {
        field: "city",
        name: "城市",
      },
      {
        field: "type",
        name: "商品类别",
      },
      {
        field: "price",
        name: "价格",
      },
      {
        field: "cost",
        name: "成本",
      },
    ],
    data,
  };

  return (
    <SheetComponent
      sheetType="table"
      dataCfg={s2DataConfig}
      options={{
        width: 600,
        height: 480,
        showSeriesNumber: true,
      }}
    />
  );

  // return (
  //   <ZESheet
  //     sheetType="table"
  //     s2DataConfig={s2DataConfig}
  //     s2Options={s2Options as any}
  //   />
  // );
};
