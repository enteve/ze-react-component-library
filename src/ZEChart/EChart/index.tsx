/**
 * 单纯的EChart的Wrapper
 */
import React from "react";
import ReactECharts from "echarts-for-react";
import { CSSProperties } from "markdown-to-jsx/node_modules/@types/react";

interface Props {
  option: any;
  style?: CSSProperties;
  ref?: any;
}

const CHART_DEFAULT_HEIGHT = 400;

const EChart: React.FC<Props> = ({ option, style = {}, ref }) => {
  const defaultOption = {
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    legend: {
      type: "scroll",
      top: 0,
      padding: [0, 50],
    },
  };
  return (
    <ReactECharts
      ref={ref}
      style={{ height: CHART_DEFAULT_HEIGHT, ...style }}
      option={{ ...defaultOption, ...option }}
      notMerge={true}
      lazyUpdate={true}
      // onChartReady={this.onChartReadyCallback}
      // onEvents={EventsDict}
      // opts={}
    />
  );
};

export default EChart;

// 下面是优化的方案：
// // import the core library.
// import ReactEChartsCore from "echarts-for-react/lib/core";

// import * as echarts from "echarts/core";

// // Import charts, all with Chart suffix
// import {
//   // LineChart,
//   BarChart,
//   // PieChart,
//   // ScatterChart,
//   // RadarChart,
//   // MapChart,
//   // TreeChart,
//   // TreemapChart,
//   // GraphChart,
//   // GaugeChart,
//   // FunnelChart,
//   // ParallelChart,
//   // SankeyChart,
//   // BoxplotChart,
//   // CandlestickChart,
//   // EffectScatterChart,
//   // LinesChart,
//   // HeatmapChart,
//   // PictorialBarChart,
//   // ThemeRiverChart,
//   // SunburstChart,
//   // CustomChart,
// } from "echarts/charts";
// // import components, all suffixed with Component
// import {
//   // GridSimpleComponent,
//   GridComponent,
//   // PolarComponent,
//   // RadarComponent,
//   // GeoComponent,
//   // SingleAxisComponent,
//   // ParallelComponent,
//   // CalendarComponent,
//   // GraphicComponent,
//   // ToolboxComponent,
//   TooltipComponent,
//   // AxisPointerComponent,
//   // BrushComponent,
//   TitleComponent,
//   // TimelineComponent,
//   // MarkPointComponent,
//   // MarkLineComponent,
//   // MarkAreaComponent,
//   // LegendComponent,
//   // LegendScrollComponent,
//   // LegendPlainComponent,
//   // DataZoomComponent,
//   // DataZoomInsideComponent,
//   // DataZoomSliderComponent,
//   // VisualMapComponent,
//   // VisualMapContinuousComponent,
//   // VisualMapPiecewiseComponent,
//   // AriaComponent,
//   // TransformComponent,
//   DatasetComponent,
// } from "echarts/components";
// // Import renderer, note that introducing the CanvasRenderer or SVGRenderer is a required step
// import {
//   CanvasRenderer,
//   // SVGRenderer,
// } from "echarts/renderers";

// // Register the required components
// echarts.use([
//   TitleComponent,
//   TooltipComponent,
//   GridComponent,
//   BarChart,
//   CanvasRenderer,
// ]);

// const EChart: React.FC<Props> = ({ option }) => {
//   return (
//     <ReactEChartsCore
//       echarts={echarts}
//       option={option}
//       notMerge={true}
//       lazyUpdate={true}
//       // onChartReady={this.onChartReadyCallback}
//       // onEvents={EventsDict}
//       // opts={}
//     />
//   );
// };

// export default EChart;
