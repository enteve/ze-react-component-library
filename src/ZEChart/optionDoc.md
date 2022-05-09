一个类似于 Tableau 的多维图表解决方案

```js
option = {
  legend: {},
  tooltip: {},
  dataset: {
    source: [
      ["product", "2012", "2013", "2014", "2015"],
      ["Matcha Latte", 41.1, 30.4, 65.1, 53.3],
      ["Milk Tea", 86.5, 92.1, 85.7, 83.1],
      ["Cheese Cocoa", 24.1, 67.2, 79.5, 86.4],
    ],
  },
  label: {
    show: true,
    position: "right",
  },
  xAxis: [{ gridIndex: 0 }, { gridIndex: 1 }, { gridIndex: 2 }],
  yAxis: [
    { type: "category", gridIndex: 0 },
    { type: "category", gridIndex: 1, axisLabel: { show: false } },
    { type: "category", gridIndex: 2, axisLabel: { show: false } },
  ],
  grid: [{ right: "70%" }, { left: "35%", right: "35%" }, { left: "70%" }],
  series: [
    // These series are in the first grid.
    { type: "bar" },
    { type: "bar", xAxisIndex: 1, yAxisIndex: 1 },
    { type: "bar", xAxisIndex: 2, yAxisIndex: 2 },
    // { type: 'bar', seriesLayoutBy: 'row' },
    // { type: 'bar', seriesLayoutBy: 'row' },
    // // These series are in the second grid.
    // { type: 'bar', xAxisIndex: 1, yAxisIndex: 1 },
    // { type: 'bar', xAxisIndex: 1, yAxisIndex: 1 },
    // { type: 'bar', xAxisIndex: 1, yAxisIndex: 1 },
    // { type: 'bar', xAxisIndex: 1, yAxisIndex: 1 }
  ],
};
```
