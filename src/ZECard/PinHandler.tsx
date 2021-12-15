import React, { FC, useState, useEffect } from "react";
import { Tooltip, Button } from "antd";
import { PushpinOutlined, PushpinFilled } from "@ant-design/icons";
import { LogicformType } from "zeroetp-api-sdk";

type PinHandlerProps = {
  title?: string;
  logicform: LogicformType;
  dashboardID?: string;
  representationType: string;
  onPin?: (payload: {
    title: string;
    representationType: string;
    logicform?: string;
    question?: string;
  }) => Promise<any>;
  onUnPin?: (id: string) => Promise<any>;
};

const PinHandler: FC<PinHandlerProps> = ({
  dashboardID,
  title,
  representationType,
  logicform,
  onPin,
  onUnPin,
}) => {
  const [id, setId] = useState<string>();

  useEffect(() => {
    if (dashboardID) {
      setId(dashboardID);
    }
  }, [dashboardID]);

  if (!title) {
    return null;
  }

  if (id) {
    return (
      <Tooltip title="从仪表盘删除">
        <Button
          icon={<PushpinFilled />}
          onClick={async () => {
            const res = await onUnPin?.(id);
            if (res) {
              setId(undefined);
            }
          }}
        />
      </Tooltip>
    );
  }
  return (
    <Tooltip title="放入仪表盘">
      <Button
        icon={<PushpinOutlined />}
        onClick={async () => {
          const res = await onPin?.({
            title,
            logicform: JSON.stringify(logicform),
            representationType,
          });
          if (res) {
            setId(res.dashboard?._id);
          }
        }}
      />
    </Tooltip>
  );
};

export default PinHandler;
