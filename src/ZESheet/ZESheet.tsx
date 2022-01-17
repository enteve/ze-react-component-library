import React from "react";
import { ZESheetProps } from "./ZESheet.types";
import { SheetComponent } from "@antv/s2-react";
import { LogicformAPIResultType } from "zeroetp-api-sdk";
import { useRequest } from "@umijs/hooks";
import { requestLogicform } from "../request";
import { Result, Skeleton } from "antd";
import flatten from "flat";
import { S2DataConfig } from "@antv/s2";
import { DownloadOutlined } from "@ant-design/icons";

const ZESheet: React.FC<ZESheetProps> = ({
  logicform,
  result,
  sheetType,
  s2DataConfig,
  s2Options = {
    width: undefined,
    height: 480,
  },
  showExport = true,
}) => {
  const { data, loading } = useRequest<LogicformAPIResultType>(
    () => {
      if (result) {
        return new Promise((resolve) => resolve(result));
      }

      return requestLogicform(logicform);
    },
    {
      refreshDeps: [logicform, result],
    }
  );

  const dataCfg: S2DataConfig = {
    fields: undefined,
    data: [],
    ...s2DataConfig,
  };
  if (data?.result) {
    if (!Array.isArray(data.result)) {
      return <Result title="此组件仅支持数组" />;
    }

    // flatten result
    dataCfg.data = data.result.map((v) => flatten(v));
  }

  return (
    <Skeleton loading={loading}>
      <SheetComponent
        adaptive
        dataCfg={dataCfg}
        options={s2Options}
        sheetType={sheetType}
        header={{ exportCfg: { open: showExport, icon: <DownloadOutlined /> } }}
      />
    </Skeleton>
  );
};
export default ZESheet;
