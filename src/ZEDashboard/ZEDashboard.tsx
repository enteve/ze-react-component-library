import React from "react";
import { Popconfirm } from "antd";
import { SizeMe } from "react-sizeme";
import GridLayout from "react-grid-layout";
import { CloseOutlined } from "@ant-design/icons";
import ZECard from "../ZECard";
import type { ZEDashboardProps } from "./ZEDashboard.types";
import "./ZEDashboard.less";

const ZEDashboard: React.FC<ZEDashboardProps> = ({
  data,
  className = "",
  editable = false,
  cols = 12,
  rowHeight = 92,
  margin = [24, 24],
  containerPadding = [0, 0],
  resizeHandles = ["se", "nw"],
  resizeHandle,
  onItemDelete,
  onLayoutChange,
  width,
}) => {
  const layout = data.map((d) => ({
    x: 0,
    y: 0,
    w: 12,
    h: 4,
    minH: 2,
    minW: 2,
    ...d.layout,
    i: d.id,
  }));

  return (
    <div
      className={["ze-dashboard", className, editable ? "active" : ""].join(
        " "
      )}
    >
      {width !== undefined && (
        <GridLayout
          width={width}
          rowHeight={rowHeight}
          layout={layout}
          isDraggable={editable}
          isResizable={editable}
          isBounded
          cols={cols}
          margin={margin}
          containerPadding={containerPadding}
          resizeHandles={resizeHandles}
          resizeHandle={resizeHandle}
          onLayoutChange={onLayoutChange}
        >
          {data.map((d) => (
            <div key={d.id} className="ze-dashboard-item">
              {editable && (
                <div className="ze-dashboard-actions">
                  <Popconfirm
                    okType="danger"
                    title="是否确定删除?"
                    cancelText="取消"
                    okText="确定"
                    onConfirm={() => {
                      onItemDelete?.(d.id);
                    }}
                  >
                    <CloseOutlined />
                  </Popconfirm>
                </div>
              )}
              <ZECard {...d.cardProps} />
            </div>
          ))}
        </GridLayout>
      )}
    </div>
  );
};

const ZEDashboardWrapper: React.FC<ZEDashboardProps> = (props) => {
  return (
    <SizeMe>
      {({ size: { width } }) => (
        <ZEDashboard {...props} width={props.width || width} />
      )}
    </SizeMe>
  );
};

export default ZEDashboardWrapper;
