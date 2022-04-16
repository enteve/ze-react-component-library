import React, { FC } from "react";
import { Button, Image, Result } from "antd";
import "./index.less";

type ErrorDisplayerProps = {
  error: string;
  helperLink?: string;
};

const ErrorDisplayer: FC<ErrorDisplayerProps> = ({ error, helperLink }) => {
  return (
    <div className="error-displayer">
      <Result
        title={error}
        icon={
          <Image
            src="https://cdn.zeroetp.com/yiask/error.svg"
            preview={false}
          />
        }
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
    </div>
  );
};

export default ErrorDisplayer;
