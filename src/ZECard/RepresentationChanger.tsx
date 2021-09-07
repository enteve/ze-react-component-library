import React from "react";
import { Radio, RadioChangeEvent } from "antd";
import {
  BarChartOutlined,
  GlobalOutlined,
  LineChartOutlined,
  PieChartOutlined,
  TableOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useEffect } from "react";

type Props = {
  representationType: string;
  onChange: (representation: string) => void;
};

const RepresentationChanger: React.FC<Props> = ({
  representationType,
  onChange,
}) => {
  const [value, setValue] = useState<string>(representationType);
  useEffect(() => {
    setValue(representationType);
  }, [representationType]);

  return (
    <Radio.Group
      value={value}
      buttonStyle="solid"
      onChange={(e: RadioChangeEvent) => {
        setValue(e.target.value);
        onChange(e.target.value);
      }}
    >
      <Radio.Button value="table">
        <TableOutlined />
      </Radio.Button>
      <Radio.Button value="bar">
        <BarChartOutlined />
      </Radio.Button>
      <Radio.Button value="line">
        <LineChartOutlined />
      </Radio.Button>
      <Radio.Button value="pie">
        <PieChartOutlined />
      </Radio.Button>
      <Radio.Button value="map">
        <GlobalOutlined />
      </Radio.Button>
    </Radio.Group>
  );
};

export default RepresentationChanger;
