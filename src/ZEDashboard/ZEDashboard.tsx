import React, { useRef, useEffect } from "react";
import { SizeMe } from "react-sizeme";
import GridLayout from "react-grid-layout";
import ZECard from "../ZECard";
import type { ZECardOnChangeParams } from "../ZECard/ZECard.types";
import type { ZEDashboardProps, ZEDashboardItem } from "./ZEDashboard.types";
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
  onDataChange,
  width,
  dashboardRef,
  style,
}) => {
  const cardsStateRef = useRef<Record<string, ZECardOnChangeParams>>({});

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

  const onLayoutChange = (lay: Required<ZEDashboardItem>["layout"][]) => {
    const newData = data.map((d) => {
      const l = lay.find((f) => f.i === d.id);
      if (l) {
        return {
          ...d,
          layout: l,
        };
      }
      return d;
    });
    onDataChange?.(newData);
  };

  const onItemDelete = (id: string) => {
    onDataChange?.(data.filter((d) => d.id !== id));
  };

  useEffect(() => {
    if (dashboardRef) {
      dashboardRef.current.getDashboardState = () => {
        const cardsState = cardsStateRef.current;
        return data.map((d) => ({
          ...d,
          cardProps: { ...d.cardProps, ...cardsState[d.id] },
        }));
      };
    }
  }, [data]);

  return (
    <div
      className={["ze-dashboard", className, editable ? "active" : ""].join(
        " "
      )}
      style={style}
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
              <ZECard
                {...d.cardProps}
                tableProps={{ height: "auto", ...d.cardProps?.tableProps }}
                onChange={(params) => {
                  cardsStateRef.current[d.id] = params;
                }}
                close={
                  editable || d.cardProps?.close
                    ? () => {
                        if (d.cardProps?.close) {
                          // close本身不需要处理删除操作
                          d.cardProps.close();
                        }
                        onItemDelete(d.id);
                      }
                    : undefined
                }
              />
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
