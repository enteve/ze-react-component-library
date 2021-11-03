export default () => {
  return {
    xAxis: {
      type: "category",
      axisLabel: {
        rotate: 45,
      },
    },
    yAxis: {
      type: "value",
    },
    tooltip: {
      trigger: "axis",
      confine: true,
    },
  };
};
