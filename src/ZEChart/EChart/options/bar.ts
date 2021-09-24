export default () => {
  return {
    legend: {
      type: "scroll",
      top: 0,
      padding: [0, 50],
    },
    yAxis: {
      type: "category",
      inverse: true,
      data: [],
    },
    xAxis: {
      type: "value",
    },
    tooltip: {
      trigger: "axis",
    },
    series: [],
  };
};
