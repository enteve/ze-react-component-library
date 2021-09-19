export default () => {
  return {
    legend: {
      type: "scroll",
      top: 0,
      padding: [0, 50],
    },
    tooltip: {
      trigger: "item",
    },
    series: [
      {
        top: 20,
        type: "pie",
        data: [],
      },
    ],
  };
};
