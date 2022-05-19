export default () => {
  return {
    xAxis: {
      type: "category",
      boundaryGap: false,
      axisLabel: {
        rotate: 45,
      },
    },
    yAxis: {
      type: "value",
    },
    tooltip: {
      trigger: "axis",
    },
  };
};
