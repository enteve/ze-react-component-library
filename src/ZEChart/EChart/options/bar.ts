export default (labelInside?: boolean) => {
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
      ...(labelInside ? {
        axisTick: {
          show: false
        },
        axisLine: {
          show: false
        },
        axisLabel: {
          show: false
        },
        z: 10
      } : {})
    },
    xAxis: {
      type: "value",
      confine: true,
    },
    tooltip: {
      trigger: "axis",
    },
    series: [],
  };
};
