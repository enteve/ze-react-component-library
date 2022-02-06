import React from "react";
import { Alert, Space } from "antd";

type Props = {
  info: string;
};

const StoryBookUseCaseDescription: React.FC<Props> = ({ info, children }) => {
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Alert message={info} type="info" />
      {children}
    </Space>
  );
};

export default StoryBookUseCaseDescription;
