import React, { useState } from "react";
import { useRequest } from "@umijs/hooks";
import {
  LogicformAPIResultType,
  LogicformType,
  config,
  normaliseGroupby,
  getHierarchyCodeLength,
} from "zeroetp-api-sdk";
import * as echarts from "echarts";
import EChart from "../EChart";
import _ from "underscore";
import {
  getNameKeyForChart,
  chartTooltipFormatter,
  formatChartData,
} from "../util";
import { Result } from "antd";

interface Props {
  logicform: LogicformType;
  data: LogicformAPIResultType;
  eventsDict?: Record<string, Function>;
  coloringMap?: (record: any) => string;
  option?: any; // echarts的option，覆盖默认option
}

const Map: React.FC<Props> = ({
  logicform,
  data,
  eventsDict = {},
  coloringMap,
  option: userOption = {},
}) => {
  const [map, setMap] = useState<string | undefined>();

  useRequest(
    () => {
      if (logicform?.groupby && data && data.schema) {
        // 朱曦炽：这里就直接假定了地图有以下level：区域、省市、城市、区县
        // 决定地图选哪张
        normaliseGroupby(logicform);
        if (
          logicform.groupby.length === 1 &&
          logicform.groupby[0].level &&
          data.columnProperties?.[0].schema?._id === "geo"
        ) {
          const level = logicform.groupby[0].level;
          let mapID;
          if (level === "省市") {
            mapID = "100000";
          } else if (level === "城市") {
            const startCodeLength = getHierarchyCodeLength(
              data.columnProperties[0].schema,
              "省市"
            );
            const codes = new Set<string>();
            data.result.forEach((i) =>
              codes.add(i._id.substring(0, startCodeLength))
            );
            const codeArray = Array.from(codes);

            if (codeArray.length === 1) {
              mapID = `${codeArray[0].substring(
                startCodeLength - codeArray[0].length
              )}0000`;
            }
          } else if (level === "区县") {
            const startCodeLength = getHierarchyCodeLength(
              data.columnProperties[0].schema,
              "城市"
            );
            const codes = new Set<string>();
            data.result.forEach((i) =>
              codes.add(i._id.substring(0, startCodeLength))
            );
            const codeArray = Array.from(codes);
            if (codeArray.length === 1) {
              mapID = `${codeArray[0].substring(
                startCodeLength - codeArray[0].length
              )}00`;
            }
          }

          if (mapID) {
            // mapID的长度为6位
            if (mapID.length > 6) {
              mapID = mapID.substring(mapID.length - 6);
            }

            return fetch(`${config.API_URL}/map/china/${mapID}.json`);
          }
        }
      }

      return new Promise<Response>((resolve) => resolve(null));
    },
    {
      onSuccess: async (response) => {
        if (response) {
          const json = await response.json();
          const mapID = response.url.split("/").pop().split(".")[0];
          echarts.registerMap(mapID, json);
          setMap(mapID);
        }
      },
      refreshDeps: [data],
    }
  );

  let option: any = {};

  if (map && data && data.result) {
    if (!logicform.groupby)
      return <Result status="error" title="地图不支持非分组数据" />;
    normaliseGroupby(logicform);
    if (logicform.groupby.length !== 1)
      return <Result status="error" title="地图组件不支持多维分组" />;
    if (data.columnProperties?.[0].schema?._id !== "geo") {
      return <Result status="error" title="必须以地理位置分组" />;
    }
    if (!logicform.groupby[0].level) {
      return <Result status="error" title="分组必须要有level信息" />;
    }
    const level = logicform.groupby[0].level;
    if (["省市", "城市", "区县"].indexOf(level) < 0) {
      return <Result status="error" title="暂不支持的地图类型" />;
    }

    const values = data.result.map((i) => i[logicform.preds[0].name]);
    const max = _.max(values);
    let min = _.min(values);
    if (min === max) {
      if (min > 0) min = 0; // feat: 如果上下限一样，那么下限变为0
    }
    const nameProp = getNameKeyForChart(logicform, data);

    option = {
      visualMap: {
        min,
        max,
        text: ["最高", "最低"],
        realtime: false,
        calculable: true,
        show: coloringMap ? false : true,
      },
      tooltip: {
        trigger: "item",
        confine: true,
        formatter: chartTooltipFormatter,
      },
      series: [
        {
          name: logicform.preds[0].name,
          roam: true,
          type: "map",
          scaleLimit: {
            min: 1,
            max: 5,
          },
          map,
          label: {
            show: logicform?.groupby[0]?.level !== "省市",
          },
          data: formatChartData({
            data: data.result,
            valueKey: logicform.preds[0].name,
            valueName: (i) => _.get(i, nameProp),
            preds: logicform.preds,
            coloringMap,
            properties: data.columnProperties,
            schema: data.schema,
          }),
        },
      ],
    };
  }

  return (
    <EChart option={{ ...option, ...userOption }} eventsDict={eventsDict} />
  );
};

export default Map;
