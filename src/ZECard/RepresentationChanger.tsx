import React, { useState, useEffect, useCallback } from "react";
import { Button, Dropdown, Radio, RadioChangeEvent } from "antd";
import {
  BarChartOutlined,
  GlobalOutlined,
  LineChartOutlined,
  PieChartOutlined,
  TableOutlined,
} from "@ant-design/icons";

type Props = {
  representationType: string;
  onChange: (representation: string) => void;
  scrollElement?: Element;
};

const RepresentationChanger: React.FC<Props> = ({
  representationType,
  onChange,
  scrollElement = window,
}) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [value, setValue] = useState<string>(representationType);
  useEffect(() => {
    setValue(representationType);
  }, [representationType]);

  const onScroll = useCallback(() => {
    setVisible(false);
  }, []);

  useEffect(() => {
    scrollElement.addEventListener("scroll", onScroll);
    return () => {
      scrollElement.removeEventListener("scroll", onScroll);
    };
  }, []);

  const menu = (
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

  let mainButton: React.ReactNode;
  switch (representationType) {
    case "table":
      mainButton = <TableOutlined />;
      break;
    case "bar":
      mainButton = <BarChartOutlined />;
      break;
    case "line":
      mainButton = <LineChartOutlined />;
      break;
    case "pie":
      mainButton = <PieChartOutlined />;
      break;
    case "map":
      mainButton = <GlobalOutlined />;
      break;
  }

  return (
    <Dropdown
      overlay={menu}
      trigger={["click"]}
      visible={visible}
      onVisibleChange={setVisible}
    >
      <Button icon={mainButton} />
    </Dropdown>
  );
};

export default RepresentationChanger;
