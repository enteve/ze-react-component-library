import { Statistic } from "antd";
import React from "react";
import numeral from "numeral";
import { LogicformAPIResultType, LogicformType } from "zeroetp-api-sdk";
import { getFormatter } from "../util";

type Props = {
  logicform: LogicformType;
  data: LogicformAPIResultType;
};

const ValueDisplayer: React.FC<Props> = ({ data }) => {
  let unit = "";
  let precision = 1;
  let value = data && "result" in data ? data.result : "-";
  if (data?.columnProperties?.length > 0) {
    const [firstColProp] = data.columnProperties;

    if (firstColProp.type === "percentage") {
      // 如果是百分比类型的呢
      unit = "%";
      value = value * 100;
    } else if (firstColProp.unit) {
      unit = firstColProp.unit;
    }

    // precision
    if (firstColProp.type === "int") {
      precision = 0;
    }

    let formatter = getFormatter(firstColProp, value);
    if (formatter) {
      return (
        <Statistic
          value={numeral(value).format(formatter.formatter)}
          suffix={`${formatter.prefix}${unit}${formatter.postfix}`}
        />
      );
    }
  }

  return <Statistic value={value} suffix={unit} precision={precision} />;
};

export default ValueDisplayer;
