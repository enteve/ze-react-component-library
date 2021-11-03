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
import { Result } from "antd";

interface Props {
  logicform: LogicformType;
  data: LogicformAPIResultType;
  eventsDict?: Record<string, Function>;
  option?: any; // echarts的option，覆盖默认option
  width: number;
}

const Map: React.FC<Props> = ({
  logicform,
  data,
  eventsDict = {},
  option: userOption = {},
  width,
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

  let option: any = userOption;

  if (
    !logicform.groupby ||
    data?.columnProperties?.[0].schema?._id !== "geo" ||
    data?.logicform.groupby.length !== 1 ||
    !data?.logicform.groupby[0].level
  )
    return <Result status="info" title="此数据不支持地图类型" />;

  if (map && data?.result && data?.logicform) {
    const { logicform } = data;
    const level = logicform.groupby[0].level;
    if (["省市", "城市", "区县"].indexOf(level) < 0) {
      return <Result status="info" title="暂不支持的地图类型" />;
    }

    option.series = [
      {
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
      },
    ];

    let dimension = 1;
    if (option.visualMap?.dimension) {
      dimension = option.visualMap?.dimension;
    }

    // VisualMap，确定一下min和max
    const values = data.result.map(
      (i) => i[logicform.preds[dimension - 1][0].name]
    );
    const max = _.max(values);
    let min = _.min(values);
    if (min === max) {
      if (min > 0) min = 0; // feat: 如果上下限一样，那么下限变为0
    }

    // precision
    let precision = 0;
    if (data.columnProperties[dimension].type === "percentage") {
      precision = 2;
    }

    option.visualMap = {
      min,
      max,
      precision,
      text: ["最高", "最低"],
      realtime: false,
      calculable: true,
      dimension,
      ...option.visualMap, // 用户设定的visualMap可以覆盖原来的
    };
  }

  return <EChart option={option} eventsDict={eventsDict} width={width} />;
};

export default Map;
