import type { ZECardProps } from "../ZECard/ZECard.types";

type Layout = {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  maxW?: number;
  minH?: number;
  maxH?: number;
  isDraggable?: boolean;
  // If false, will not be resizable. Overrides `static`.
  isResizable?: boolean;
};

export type ZEDashboardItem = {
  id: string;
  layout?: Layout;
  cardProps: ZECardProps;
};

export type ZEDashboardProps = {
  data: ZEDashboardItem[];
  width?: number;
  className?: string;
  // default false
  editable?: boolean;
  // default 12
  cols?: number;
  // default 100
  rowHeight?: number;
  // default [24,24]
  margin?: [number, number];
  // default [0, 0]
  containerPadding?: [number, number];
  // default ['se', 'nw']
  resizeHandles?: Array<"s" | "w" | "e" | "n" | "sw" | "nw" | "se" | "ne">;
  resizeHandle?: React.ReactElement;
  onItemDelete?: (id: string) => void;
  onLayoutChange?: (layout: Layout[]) => void;
};
