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
import { getNameKeyForChart } from "../util";

interface Props {
  logicform: LogicformType;
  data: LogicformAPIResultType;
  eventsDict?: Record<string, Function>;
}

const Map: React.FC<Props> = ({ logicform, data, eventsDict = {} }) => {
  const [map, setMap] = useState<string>("100000");
  const { data: mapData } = useRequest(
    () => {
      if (!data?.schema)
        return new Promise<Response>((resolve) => resolve(null));

      let mapID = map;
      const startLevel = "省市";

      // 决定地图选哪张
      if (logicform?.groupby && data && data.schema) {
        normaliseGroupby(logicform);
        if (
          logicform.groupby.length === 1 &&
          logicform.groupby[0].level &&
          logicform.groupby[0].level !== startLevel
        ) {
          if (data.columnProperties[0].schema?._id === "geo") {
            if (logicform.groupby[0].level === "城市") {
              const startCodeLength = getHierarchyCodeLength(
                data.columnProperties[0].schema,
                startLevel
              );
              const codes = new Set<string>();
              data.result.forEach((i) =>
                codes.add(i._id.substring(0, startCodeLength))
              );
              const codeArray = Array.from(codes);
              if (codeArray.length === 1) {
                mapID = `${codeArray[0].substring(4)}0000`;
              }
            }
          }
        }
      }

      return fetch(`${config.API_URL}/map/china/${mapID}.json`);
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

  if (mapData && data && data.result) {
    const values = data.result.map((i) => i[logicform.preds[0].name]);
    const max = _.max(values);
    const min = _.min(values);
    const nameProp = getNameKeyForChart(logicform, data);

    option = {
      visualMap: {
        min,
        max,
        text: ["最高", "最低"],
        realtime: false,
        calculable: true,
      },
      tooltip: {
        trigger: "item",
      },
      series: [
        {
          name: logicform.preds[0].name,
          roam: true,
          type: "map",
          map,
          label: {
            show: true,
          },
          data: data.result.map((i) => ({
            name: _.get(i, nameProp),
            value: i[logicform.preds[0].name],
          })),
        },
      ],
    };
  }

  return <EChart option={option} eventsDict={eventsDict} />;
};

export default Map;
