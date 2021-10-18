export default () => {
  return {
    legend: {
      type: "scroll",
      top: 0,
      padding: [0, 50],
    },
    xAxis: {
      type: "category",
      data: [],
    },
    yAxis: {
      type: "value",
    },
    tooltip: {
      trigger: "axis",
      confine: true,
    },
    series: [],
  };
};
