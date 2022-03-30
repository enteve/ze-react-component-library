import { Col, Row, Statistic } from "antd";
import React, { useState, useEffect } from "react";
import numeral from "numeral";
import {
  getLogicformByTimeOffset,
  LogicformAPIResultType,
  LogicformType,
} from "zeroetp-api-sdk";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { getFormatter, genYoyAndMomLogicform } from "../util";
import GroupByMenu from "../components/GroupByMenu";
import { requestLogicform } from "../request";

export type ZEValueDisplayerProps = {
  data: LogicformAPIResultType;
  onChangeLogicform?: (logicform: LogicformType) => void;
  showYoyAndMom?: boolean;
  trend?: "up" | "down";
  title?: string;
};

const ZEValueDisplayer: React.FC<ZEValueDisplayerProps> = ({
  data,
  onChangeLogicform,
  children,
  showYoyAndMom = false,
  trend,
  title,
}) => {
  const [lyLF, setLyLF] = useState<LogicformType>(); // last year logicform，用来计算同比
  const [lmLF, setLmLF] = useState<LogicformType>(); // last month logicform, 用来计算环比

  const [yoyData, setYoyData] = useState<LogicformAPIResultType>();
  const [momData, setMomData] = useState<LogicformAPIResultType>();

  useEffect(() => {
    if (data?.logicform) {
      const lyLF = getLogicformByTimeOffset(data?.logicform, {
        日期: { $offset: { year: -1 } },
      });
      setLyLF(lyLF);

      const lmLF = getLogicformByTimeOffset(data?.logicform, {
        日期: { $offset: { month: -1 } },
      });
      setLmLF(lmLF);
    }
  }, [data]);

  useEffect(() => {
    if (lyLF && showYoyAndMom) {
      requestLogicform(lyLF).then(setYoyData);
    } else {
      setYoyData(undefined);
    }
  }, [lyLF]);
  useEffect(() => {
    if (lmLF && showYoyAndMom) {
      requestLogicform(lmLF).then(setMomData);
    } else {
      setMomData(undefined);
    }
  }, [lmLF]);

  // 如果没有Children的话，采用默认的statistic来表现
  let defaultStatistics: React.ReactNode;
  if (!children) {
    let unit = "";
    let precision = 1;
    let value = data && "result" in data ? data.result : "-";
    let suffix = "";

    let prefix: React.ReactNode;
    let valueStyle: any;

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

    if (trend === "up") {
      prefix = <ArrowUpOutlined />;
      valueStyle = { color: "#3f8600" };
    } else if (trend === "down") {
      prefix = <ArrowDownOutlined />;
      valueStyle = { color: "#cf1322" };
    }

    defaultStatistics = (
      <Statistic
        value={value}
        suffix={suffix}
        precision={precision}
        title={title}
        prefix={prefix}
        valueStyle={valueStyle}
      />
    );
  }

  const moreColSpan = {
    xs: 12,
    sm: 12,
    md: 6,
  };

  const calcPercentageResult = (
    thisPeriodData: LogicformAPIResultType,
    lastPeriodData: LogicformAPIResultType
  ) => {
    const thisPeriod = thisPeriodData.result;
    const lastPeriod = lastPeriodData.result;

    if (lastPeriod === 0) {
      return "N/A";
    }

    const valueProp = thisPeriodData.columnProperties[0];
    if (valueProp.type === "percentage" || valueProp.is_speedish) {
      return thisPeriod - lastPeriod;
    }
    return thisPeriod / lastPeriod - 1;
  };

  let yoy;
  if (data && yoyData) {
    yoy = calcPercentageResult(data, yoyData);
  }
  let mom;
  if (data && momData) {
    mom = calcPercentageResult(data, momData);
  }

  return (
    <>
      <Row>
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
      </Row>
      {/* 下面是更多信息展示 */}
      <Row gutter={16} style={{ marginTop: 20 }}>
        {lyLF && yoyData && (
          <>
            <Col {...moreColSpan}>
              <ZEValueDisplayer
                data={yoyData}
                onChangeLogicform={onChangeLogicform}
                showYoyAndMom={false}
                title="去年同期"
              />
            </Col>
            <Col {...moreColSpan}>
              <ZEValueDisplayer
                data={{
                  ...yoyData,
                  result: yoy,
                  columnProperties: [
                    {
                      ...yoyData.columnProperties[0],
                      type: "percentage",
                    },
                  ],
                  logicform: genYoyAndMomLogicform(yoyData.logicform, "$yoy"),
                }}
                onChangeLogicform={onChangeLogicform}
                showYoyAndMom={false}
                title="同比"
                trend={yoy >= 0 ? "up" : "down"}
              />
            </Col>
          </>
        )}
        {lmLF && momData && (
          <>
            <Col {...moreColSpan}>
              <ZEValueDisplayer
                data={momData}
                onChangeLogicform={onChangeLogicform}
                showYoyAndMom={false}
                title="上一期"
              />
            </Col>
            <Col {...moreColSpan}>
              <ZEValueDisplayer
                data={{
                  ...momData,
                  result: mom,
                  columnProperties: [
                    {
                      ...momData.columnProperties[0],
                      type: "percentage",
                    },
                  ],
                  logicform: genYoyAndMomLogicform(momData.logicform, "$mom"),
                }}
                onChangeLogicform={onChangeLogicform}
                showYoyAndMom={false}
                title="环比"
                trend={mom >= 0 ? "up" : "down"}
              />
            </Col>
          </>
        )}
      </Row>
    </>
  );
};

export default ZEValueDisplayer;
