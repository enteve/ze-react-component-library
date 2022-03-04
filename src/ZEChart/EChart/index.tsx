/**
 * 单纯的EChart的Wrapper
 */
import React, { memo } from "react";
import ReactECharts from "echarts-for-react";
interface Props {
  option: any;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
  ref?: any;
  eventsDict?: Record<string, Function>;
}

export const CHART_MAX_HEIGHT = 400;

const EChart: React.FC<Props> = memo(
  ({
    option,
    width,
    height: _height = CHART_MAX_HEIGHT,
    style = {},
    ref,
    eventsDict = {},
  }) => {
    const defaultOption = {
      toolbox: {
        feature: {
          saveAsImage: {},
        },
      },
    };
    const height =
      _height > 0 && _height < CHART_MAX_HEIGHT ? _height : CHART_MAX_HEIGHT;

    return (
      <ReactECharts
        ref={ref}
        style={{
          width,
          height,
          ...style,
        }}
        option={{ ...defaultOption, ...option }}
        notMerge={true}
        lazyUpdate={true}
        onEvents={eventsDict}
        // onChartReady={this.onChartReadyCallback}
        // opts={}
      />
    );
  }
);

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
