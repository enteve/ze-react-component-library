import { Statistic } from "antd";
import React from "react";
import numeral from "numeral";
import { LogicformAPIResultType, LogicformType } from "zeroetp-api-sdk";
import { getFormatter } from "../util";
import GroupByMenu from "../components/GroupByMenu";

type Props = {
  logicform: LogicformType;
  data: LogicformAPIResultType;
  onChangeLogicform?: (logicform: LogicformType) => void;
};

const ZEValueDisplayer: React.FC<Props> = ({
  data,
  onChangeLogicform,
  children,
}) => {
  // 如果没有Children的话，采用默认的statistic来表现
  let defaultStatistics: React.ReactNode;
  if (!children) {
    let unit = "";
    let precision = 1;
    let value = data && "result" in data ? data.result : "-";
    let suffix = "";

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
        value = numeral(value).format(formatter.formatter);
        suffix = `${formatter.prefix}${unit}${formatter.postfix}`;
      }
    }

    if (suffix.length === 0) {
      suffix = unit;
    }
    defaultStatistics = (
      <Statistic value={value} suffix={suffix} precision={precision} />
    );
  }

  return (
    <GroupByMenu
      title="深入分析"
      logicform={data.logicform}
      result={data}
      onChangeLogicform={onChangeLogicform}
      selectedItem={null}
      menuStyle={{ width: 200, height: 200, overflow: "scroll" }}
    >
      <div onClick={(e) => e.preventDefault()}>
        {children || defaultStatistics}
      </div>
    </GroupByMenu>
  );
};

export default ZEValueDisplayer;
