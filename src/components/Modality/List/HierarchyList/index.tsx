import React from "react";
import { LogicformAPIResultType } from "zeroetp-api-sdk";
import Table from "../../../../ZECard/Table";

type HierarchyListProps = {
  data: LogicformAPIResultType;
};

const HierarchyList: React.FC<HierarchyListProps> = ({ data }) => {
  if (!data || !data.result) return <div />;

  const hierarchyDatasource: any[] = [];

  const idProp = data.schema.properties.find((p) => p.type === "ID"); // 一定有的
  const idPropName = idProp.name;

  const totalCodeLength = data.schema.hierarchy.reduce(
    (acc, h) => acc + h.code_length,
    0
  );
  let parentCodeLength = 0;
  const itemDict = {};
  data.schema.hierarchy.forEach((level) => {
    const codeLength = parentCodeLength + level.code_length;

    const dataWithCodeLength = data.result.filter(
      (item) => item[idPropName].length === codeLength
    );

    dataWithCodeLength.forEach((item) => {
      if (parentCodeLength === 0) {
        const newItem = { ...item, children: [] };
        hierarchyDatasource.push(newItem);
        itemDict[item[idPropName]] = newItem;
      } else {
        const parentItem =
          itemDict[item[idPropName].substring(0, parentCodeLength)];
        let newItem = item;
        if (codeLength !== totalCodeLength) {
          newItem = { ...item, children: [] };
        }

        if (parentItem) {
          parentItem.children.push(newItem);
          itemDict[item[idPropName]] = newItem;
        } else {
          hierarchyDatasource.push(newItem);
        }
      }
    });

    parentCodeLength += level.code_length;
  });

  const dataSource = hierarchyDatasource.sort((a, b) =>
    a[idPropName].localeCompare(b[idPropName])
  );

  return (
    <Table
      setLogicform={() => {}}
      logicform={data.logicform}
      result={{
        ...data,
        result: dataSource,
      }}
    />
  );
};

export default HierarchyList;
