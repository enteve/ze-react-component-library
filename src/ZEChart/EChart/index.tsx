/**
 * 单纯的EChart的Wrapper
 */
import React, { useState, useEffect, useRef } from "react";
import ReactECharts from "echarts-for-react";

interface Props {
  option: any;
  style?: React.CSSProperties;
  ref?: any;
  eventsDict?: Record<string, Function>;
}

const CHART_DEFAULT_HEIGHT = 400;

const EChart: React.FC<Props> = ({
  option,
  style = {},
  ref,
  eventsDict = {},
}) => {
  const mountRef = useRef<boolean>(false);
  // 之所以要用一个trueOption，然后在useEffect里面用timeout去改option，是因为这样可以显示图表的change动画。不然第一次初始化数据的时候直接显示图表，没有动画
  const [trueOption, setTrueOption] = useState({});
  const defaultOption = {
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
  };

  useEffect(() => {
    setTimeout(() => {
      if (mountRef.current) {
        setTrueOption(option);
      }
    }, 100);
  }, [JSON.stringify(option)]);

  useEffect(() => {
    mountRef.current = true;
    return () => {
      mountRef.current = false;
    };
  }, []);
  return (
    <ReactECharts
      ref={ref}
      style={{ height: CHART_DEFAULT_HEIGHT, ...style }}
      option={{ ...defaultOption, ...trueOption }}
      notMerge={true}
      lazyUpdate={true}
      onEvents={eventsDict}
      // onChartReady={this.onChartReadyCallback}
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
