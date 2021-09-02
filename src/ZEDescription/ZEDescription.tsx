import React, { useContext } from "react";
import ProDescriptions from "@ant-design/pro-descriptions";
import ProProvider from "@ant-design/pro-provider";
import { customValueTypes, valueTypeMapping } from "../util";
import { ZEDescriptionProps } from "./ZEDescription.types";

const ZEDescription: React.FC<ZEDescriptionProps> = ({
  schema,
  columnProperties,
  item,
}) => {
  const values = useContext(ProProvider); // 用来自定义ValueType

  // 2021-09-02 ProDescriptions不支持ProProvider.Provider的workaround
  const customRenders = customValueTypes(schema);

  const columns = columnProperties.map((property) => {
    const col: any = {
      title: property.name,
      dataIndex: property.name.split("."),
      valueType: valueTypeMapping(property),
    };

    if (customRenders[col.valueType]) {
      col.render = (_dom, entity) =>
        customRenders[col.valueType].render(entity[property.name], {
          proFieldKey: property.name,
        });
    }

    return col;
  });

  // console.log(columns);

  return (
    <ProProvider.Provider
      value={{
        ...values,
        valueTypeMap: schema ? customValueTypes(schema) : {},
      }}
    >
      <ProDescriptions
        title="详情"
        columns={columns}
        request={async () => {
          return Promise.resolve({
            success: true,
            data: item,
          });
        }}
      />
    </ProProvider.Provider>
  );
};

export default ZEDescription;
