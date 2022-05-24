import React from "react";
import { Input, Button, DatePicker, Space, InputNumber, Checkbox } from "antd";
import { SearchOutlined, FilterFilled } from "@ant-design/icons";
import { FilterDropdownProps } from "antd/lib/table/interface";
import moment from "moment";
import { PropertyType } from "zeroetp-api-sdk";

const { RangePicker } = DatePicker;
const nullValue = JSON.stringify({ $exists: false });
const isNullValue = (selectedKeys: FilterDropdownProps["selectedKeys"]) =>
  selectedKeys[0] === nullValue;

const NullValueHandler = ({
  setSelectedKeys,
  selectedKeys,
}: Pick<FilterDropdownProps, "selectedKeys" | "setSelectedKeys">) => {
  return (
    <div style={{ marginBottom: 8 }}>
      <Checkbox
        checked={selectedKeys[0] === nullValue}
        onChange={(e) => {
          if (e.target.checked) {
            setSelectedKeys([nullValue]);
          } else {
            setSelectedKeys([]);
          }
        }}
      >
        空值
      </Checkbox>
    </div>
  );
};

// Search控件
export const getColumnSearchProps = (property: PropertyType) => ({
  filterDropdown: ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
  }: FilterDropdownProps) => {
    const nullValueSelected = isNullValue(selectedKeys);
    return (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`搜索 ${property.name}`}
          value={nullValueSelected ? undefined : selectedKeys[0]}
          disabled={nullValueSelected}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => confirm()}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        {!property.constraints?.required && (
          <NullValueHandler
            selectedKeys={selectedKeys}
            setSelectedKeys={setSelectedKeys}
          />
        )}
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
export const getColumnDateProps = (property: PropertyType) => ({
  filterDropdown: ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
  }: FilterDropdownProps) => {
    const nullValueSelected = isNullValue(selectedKeys);

    return (
      <div style={{ padding: 8 }}>
        <RangePicker
          style={{ marginBottom: 8, width: 248 }}
          disabled={nullValueSelected}
          value={
            selectedKeys.length === 2
              ? [moment(selectedKeys[0]), moment(selectedKeys[1])]
              : undefined
          }
          onChange={(v) =>
            setSelectedKeys(v ? v.map((i) => i!.format("YYYY-MM-DD")) : [])
          }
        />
        {!property.constraints?.required && (
          <NullValueHandler
            selectedKeys={selectedKeys}
            setSelectedKeys={setSelectedKeys}
          />
        )}
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
    );
  },
  filterIcon: (filtered: boolean) => (
    <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
  ),
});

// 数字筛选控件
export const getColumnNumberProps = (property: PropertyType) => ({
  filterDropdown: ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
  }: FilterDropdownProps) => {
    const nullValueSelected = isNullValue(selectedKeys);

    return (
      <div style={{ padding: 8 }}>
        <Space style={{ marginBottom: 8 }}>
          <InputNumber
            placeholder="最小值"
            style={{ width: 112 }}
            value={nullValueSelected ? undefined : selectedKeys?.["0"]}
            disabled={nullValueSelected}
            onChange={(v) => {
              setSelectedKeys([
                v === null ? undefined : v,
                selectedKeys?.["1"],
              ]);
            }}
          />
          <div style={{ width: 8, textAlign: "center" }}>~</div>
          <InputNumber
            placeholder="最大值"
            style={{ width: 112 }}
            value={nullValueSelected ? undefined : selectedKeys?.["1"]}
            disabled={nullValueSelected}
            onChange={(v) => {
              setSelectedKeys([
                selectedKeys?.["0"],
                v === null ? undefined : v,
              ]);
            }}
          />
        </Space>
        {!property.constraints?.required && (
          <NullValueHandler
            selectedKeys={selectedKeys}
            setSelectedKeys={setSelectedKeys}
          />
        )}
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
    );
  },
  filterIcon: (filtered: boolean) => (
    <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
  ),
});

// 枚举筛选控件
export const getColumnEnumFilterProps = (property: PropertyType) => ({
  filterDropdown: ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
    filters,
  }: FilterDropdownProps) => {
    const enums: any[] = filters instanceof Array ? filters : [];
    const nullValueSelected = isNullValue(selectedKeys);

    return (
      <div style={{ padding: 8 }}>
        {enums.map((d) => (
          <div style={{ marginBottom: 8 }} key={d.value}>
            <Checkbox
              checked={selectedKeys.includes(d.value)}
              disabled={nullValueSelected}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedKeys([...selectedKeys, d.value]);
                } else {
                  setSelectedKeys(selectedKeys.filter((s) => s !== d.value));
                }
              }}
            >
              {d.label}
            </Checkbox>
          </div>
        ))}
        {!property.constraints?.required && (
          <NullValueHandler
            selectedKeys={selectedKeys}
            setSelectedKeys={setSelectedKeys}
          />
        )}
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
    <FilterFilled style={{ color: filtered ? "#1890ff" : undefined }} />
  ),
});
