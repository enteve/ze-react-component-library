// Bar分两种，bar和column。其中bar是horizontal的，column是vertical的
export default () => {
  return {
    yAxis: {
      type: "category",
      inverse: true,
      axisLabel: {
        formatter: (value) => {
          // 每隔4个字符换行
          const chars = value.split("");
          let newValue = "";
          for (let i = 0; i < chars.length; i++) {
            const char = chars[i];
            if (i > 0 && i % 4 === 0) {
              newValue += "\n";
            }

            newValue += char;

            // 最多11个字符
            if (newValue.length >= 11) {
              newValue += "...";
              return newValue;
            }
          }
          return newValue;
        },
        // rotate: 90,
        // overflow: "truncate",
        // width: 60,
      },
    },
    xAxis: {
      type: "value",
      confine: true,
      axisLabel: {
        hideOverlap: true,
      },
    },
    tooltip: {
      trigger: "axis",
    },
    barMaxWidth: 48,
  };
};
