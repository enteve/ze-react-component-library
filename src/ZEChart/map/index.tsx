import React from "react";
import { useRequest } from "@umijs/hooks";
import {
  LogicformAPIResultType,
  LogicformType,
  config,
  normaliseGroupby,
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
  const { data: mapData } = useRequest(
    () => {
      const mapUrl = "100000.json";

      // 决定地图
      if (logicform?.groupby && data && data.schema) {
        normaliseGroupby(logicform);
        if (logicform.groupby.length === 1 && logicform.groupby[0].level) {
          console.log("nb！");
          // 看data所有的start code。拿到统一的startcode。
        }
      }

      return fetch(`${config.API_URL}/map/china/${mapUrl}`);
    },
    {
      onSuccess: async (response) => {
        const json = await response.json();
        echarts.registerMap("china", json);
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
          map: "china",
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
