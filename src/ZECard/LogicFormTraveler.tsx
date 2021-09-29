import { LeftOutlined, RightOutlined, UndoOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import React from "react";

type Props = {
  backLength: number;
  forwardLength: number;
  go: (step: number) => void;
  back: () => void;
  forward: () => void;
};

const LogicFormTraveler: React.FC<Props> = ({
  backLength,
  forwardLength,
  go,
  back,
  forward,
}) => {
  return (
    <>
      {backLength > 1 && (
        <Tooltip title="回到最开始">
          <Button
            icon={<UndoOutlined />}
            onClick={() => {
              go(-backLength);
            }}
          />
        </Tooltip>
      )}
      <Tooltip title="回到上一步">
        <Button icon={<LeftOutlined />} onClick={() => back()} />
      </Tooltip>
      <Tooltip title="回到下一步">
        <Button
          disabled={forwardLength <= 0}
          icon={<RightOutlined />}
          onClick={() => forward()}
        />
      </Tooltip>
    </>
  );
};

export default LogicFormTraveler;
