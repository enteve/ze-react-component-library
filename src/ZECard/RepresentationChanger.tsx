import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Button, Dropdown, Menu, Tooltip } from "antd";
import {
  GlobalOutlined,
  LineChartOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
// @ts-ignore
import TableSvg from "./assets/table.svg";
// @ts-ignore
import PieSvg from "./assets/pie.svg";
// @ts-ignore
import BarSvg from "./assets/bar.svg";
// @ts-ignore
import LineSvg from "./assets/line.svg";
// @ts-ignore
import MapSvg from "./assets/map.svg";
// @ts-ignore
import KpiSvg from "./assets/kpi.svg";

const graphics = [
  {
    key: "kpi",
    title: "Kpi指标",
    icon: KpiSvg,
    tip: "",
    type: "basic",
  },
  {
    key: "table",
    title: "数据明细表",
    icon: TableSvg,
    tip: "",
    type: "basic",
  },
  {
    key: "bar",
    title: "柱状图",
    icon: BarSvg,
    tip: "搜索结果中至少一个属性列和一个数值列",
    type: "basic",
  },
  {
    key: "line",
    title: "折线图",
    icon: LineSvg,
    tip: "搜索结果中至少一个属性列和一个数值列",
    type: "basic",
  },
  {
    key: "pie",
    title: "饼图",
    icon: PieSvg,
    tip: "搜索结果中至少一个属性列和一个数值列",
    type: "basic",
  },
  {
    key: "map",
    title: "地图",
    icon: MapSvg,
    tip: "搜索结果中至少一个地址列和一个数值列",
    type: "advanced",
  },
];

const graphicOptions = [
  {
    label: "全部",
    value: "all",
    tip: "",
  },
  {
    label: <LineChartOutlined />,
    value: "basic",
    tip: "基础图形",
  },
  {
    label: <GlobalOutlined />,
    value: "advanced",
    tip: "高级图形",
  },
] as const;

type GraphicType = typeof graphicOptions[number]["value"];

type Props = {
  representationType: string;
  onChange: (representation: string) => void;
  scrollElement?: Element;
  isRepresentationDisabled?: (representation: string) => boolean;
};

const RepresentationChanger: React.FC<Props> = ({
  representationType,
  onChange,
  scrollElement = window,
  isRepresentationDisabled,
}) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [value, setValue] = useState<string>(representationType);
  const [type, setType] = useState<GraphicType>("all");

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

  return (
    <Dropdown
      overlay={
        <div className="ze-graphics-drop-down">
          <div className="ze-graphics-drop-down-left">
            {graphicOptions.map((d) => (
              <Tooltip
                placement="right"
                key={d.value}
                {...(d.tip ? { title: d.tip } : { visible: false, title: "" })}
              >
                <div
                  onMouseEnter={() => {
                    setType(d.value);
                  }}
                  className={`ze-graphics-drop-down-left-item ${
                    d.value === type
                      ? "ze-graphics-drop-down-left-item-active"
                      : ""
                  }`}
                >
                  {d.label}
                </div>
              </Tooltip>
            ))}
          </div>
          <div className="ze-graphics-drop-down-right">
            {graphics
              .filter((d) => (type === "all" ? true : d.type === type))
              .map((d) => (
                <div
                  key={d.key}
                  className="ze-graphics-drop-down-right-item-wrapper"
                >
                  <Tooltip
                    placement="bottom"
                    {...(d.tip
                      ? { title: d.tip }
                      : { visible: false, title: "" })}
                  >
                    <div
                      onClick={() => {
                        setValue(d.key);
                        onChange?.(d.key);
                        setVisible(false);
                      }}
                      className={`ze-graphics-drop-down-right-item ${
                        d.key === value
                          ? "ze-graphics-drop-down-right-item-active"
                          : ""
                      } ${
                        isRepresentationDisabled?.(d.key)
                          ? "ze-graphics-drop-down-right-item-disabled"
                          : ""
                      }`}
                    >
                      <img
                        src={d.icon}
                        alt={d.key}
                        className="ze-graphics-drop-down-right-item-img"
                      />
                    </div>
                  </Tooltip>
                  <span className="ze-graphics-drop-down-right-item-title">
                    {d.title}
                  </span>
                </div>
              ))}
          </div>
        </div>
      }
      trigger={["click"]}
      visible={visible}
      onVisibleChange={(v) => {
        setVisible(v);
        if (!v) {
          setType("all");
        }
      }}
    >
      <Button icon={<PieChartOutlined />} />
    </Dropdown>
  );
};

export default RepresentationChanger;
