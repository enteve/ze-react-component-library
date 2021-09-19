import React from "react";
import { MapboxScene } from "@antv/l7-react";
import { DrillDownLayer } from "@antv/l7-district";

interface Props {
  data: any[];
}

const Map: React.FC<Props> = ({ data }) => {
  console.log(data);
  return (
    <MapboxScene
      map={{
        center: [116.2825, 39.9],
        pitch: 0,
        style: "blank",
        zoom: 3,
        minZoom: 3,
        maxZoom: 10,
      }}
      option={{ logoVisible: false }}
      onSceneLoaded={(scene) => {
        new DrillDownLayer(scene, {
          viewStart: "Country",
          viewEnd: "City",
          joinBy: ["NAME_CHN", "name"],
          provinceData: [
            {
              name: "青海省",
              value: 1223,
            },
            {
              name: "上海市",
              value: 23,
            },
          ],
          cityData: [
            {
              name: "海东市",
              value: 1223,
            },
          ],
          countyData: [
            {
              name: "平安区",
              value: "456",
            },
          ],
          fill: {
            color: {
              field: "value",
              values: ["lightskyblue", "yellow", "orangered"],
            },
          },
          // popup: {
          //   enable: true,
          //   Html: (props) => {
          //     return `<span>${props.NAME_CHN}</span>`;
          //   },
          // },
        });
      }}
    />
  );
};

export default Map;
