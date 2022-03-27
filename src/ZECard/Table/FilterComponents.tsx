import React from "react";
import { Input, Button, DatePicker, Space, InputNumber } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { FilterDropdownProps } from "antd/lib/table/interface";
import moment from "moment";

const { RangePicker } = DatePicker;

// Search控件
export const getColumnSearchProps = (propertyName: string) => ({
  filterDropdown: ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
  }: FilterDropdownProps) => {
    return (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`搜索 ${propertyName}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => confirm()}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Button
          size="small"
          style={{ width: 90, marginRight: 8 }}
          onClick={() => {
            clearFilters && clearFilters();
            confirm();
          }}
        >
          重置
        </Button>
        <Button
          type="primary"
          onClick={() => confirm()}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90 }}
        >
          搜索
        </Button>
      </div>
    );
  },
  filterIcon: (filtered: boolean) => (
    <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
  ),
});

// 日期筛选控件
export const getColumnDateProps = (propertyName: string) => ({
  filterDropdown: ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
  }: FilterDropdownProps) => (
    <div style={{ padding: 8 }}>
      <RangePicker
        style={{ marginBottom: 8, width: 248 }}
        value={
          selectedKeys.length === 2
            ? [moment(selectedKeys[0]), moment(selectedKeys[1])]
            : undefined
        }
        onChange={(v) =>
          setSelectedKeys(v ? v.map((i) => i!.format("YYYY-MM-DD")) : [])
        }
      />
      <div>
        <Button
          size="small"
          style={{ width: 120, marginRight: 8 }}
          onClick={() => {
            clearFilters && clearFilters();
            confirm();
          }}
        >
          重置
        </Button>
        <Button
          type="primary"
          size="small"
          style={{ width: 120 }}
          onClick={() => confirm()}
        >
          选择
        </Button>
      </div>
    </div>
  ),
  filterIcon: (filtered: boolean) => (
    <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
  ),
});

// 数字筛选控件
export const getColumnNumberProps = (propertyName: string) => ({
  filterDropdown: ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
  }: FilterDropdownProps) => (
    <div style={{ padding: 8 }}>
      <Space style={{ marginBottom: 8 }}>
        <InputNumber
          placeholder="最小值"
          style={{ width: 112 }}
          value={selectedKeys?.["0"]}
          onChange={(v) => {
            setSelectedKeys([v, selectedKeys?.["1"]]);
          }}
        />
        <div style={{ width: 8, textAlign: "center" }}>~</div>
        <InputNumber
          placeholder="最大值"
          style={{ width: 112 }}
          value={selectedKeys?.["1"]}
          onChange={(v) => {
            setSelectedKeys([selectedKeys?.["0"], v]);
          }}
        />
      </Space>
      <div>
        <Button
          size="small"
          style={{ width: 120, marginRight: 8 }}
          onClick={() => {
            clearFilters && clearFilters();
            confirm();
          }}
        >
          重置
        </Button>
        <Button
          type="primary"
          size="small"
          style={{ width: 120 }}
          onClick={() => confirm()}
        >
          确定
        </Button>
      </div>
    </div>
  ),
  filterIcon: (filtered: boolean) => (
    <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
  ),
});
