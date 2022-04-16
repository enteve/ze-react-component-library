import React, { FC } from "react";
import { Button, Result } from "antd";

type ErrorDisplayerProps = {
  error: string;
  helperLink?: string;
};

const ErrorDisplayer: FC<ErrorDisplayerProps> = ({ error, helperLink }) => {
  return (
    <Result
      title={error}
      status="500"
      subTitle={
        helperLink && (
          <>
            不知道如何提问？
            <Button type="link" href={helperLink}>
              查看教程
            </Button>
          </>
        )
      }
    />
  );
};

export default ErrorDisplayer;
