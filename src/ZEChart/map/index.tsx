import React from "react";
import { useRequest } from "@umijs/hooks";
import {
  commonRequest,
  LogicformAPIResultType,
  LogicformType,
} from "zeroetp-api-sdk";
import * as echarts from "echarts";
import EChart from "../EChart";
import _ from "underscore";
import { getNameKeyForChart } from "../util";

interface Props {
  logicform: LogicformType;
  data: LogicformAPIResultType;
}

const Map: React.FC<Props> = ({ logicform, data }) => {
  const { data: mapData } = useRequest(() => commonRequest("/map/china"), {
    onSuccess: (geoJSON) => {
      echarts.registerMap("china", geoJSON);
    },
  });

  let option: any = {};

  if (mapData && data) {
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
          mapType: "china",
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
  return <EChart option={option} />;
};

export default Map;
