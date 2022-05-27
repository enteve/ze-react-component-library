import { List, Button } from "antd";
import React from "react";
interface UrlListProp {
  data: { url: string; title: string }[];
}

const UrlList: React.FC<UrlListProp> = ({ data }) => {
  return (
    <List
      dataSource={data}
      renderItem={(item) => (
        <List.Item
          key={JSON.stringify(item.url)}
          actions={[
            <Button href={item.url} target="blank" type="primary">
              访问
            </Button>,
          ]}
        >
          <div>{item.title}</div>
        </List.Item>
      )}
      bordered
    />
  );
};

export default UrlList;
