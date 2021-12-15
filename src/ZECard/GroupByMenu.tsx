import React, { FC } from "react";
import { Dropdown, Menu, Button } from "antd";
import { DownOutlined } from "@ant-design/icons";
import {
  LogicformAPIResultType,
  LogicformType,
  SchemaType,
} from "zeroetp-api-sdk";
import { ZEChartProps } from "../ZEChart/ZEChart.types";
import { drillDownPropForLogicform, drilldownLogicform } from "../util";

// 处理地图相关的groupBy，比如：按 店铺_地址(省市) 分组
const getGroupByPropertyByName = (name: string) => {
  if (name.includes("(")) {
    const arr = name.split("(");
    return {
      _id: arr[0],
      level: arr[1]?.replace(")", ""),
    };
  }
  return {
    _id: name,
  };
};

type GroupByMenuProps = Pick<
  ZEChartProps,
  "logicform" | "onChangeLogicform"
> & {
  result: LogicformAPIResultType;
  selectedItem: any;
};

const getNewLogicform = ({
  propertyName,
  logicform,
  selectedItem,
  scheme,
  groupByProperty,
}: {
  propertyName: string;
  logicform: LogicformType;
  scheme: SchemaType;
  selectedItem?: any;
  groupByProperty?: string;
}) => {
  const newLogicForm = {
    ...logicform,
    groupby: getGroupByPropertyByName(propertyName),
  };
  if (logicform.pred && logicform.operator) {
    newLogicForm.pred = undefined;
    newLogicForm.operator = undefined;
    newLogicForm.preds = [
      {
        name: logicform.pred,
        pred: logicform.pred,
        operator: logicform.operator,
      },
    ];
  }
  if (selectedItem) {
    if(!newLogicForm.query){
      newLogicForm.query = {};
    }
    if(groupByProperty){
      newLogicForm.query = {
        ...newLogicForm.query,
        [groupByProperty]: selectedItem._id
      }
    }
    const newLF = drilldownLogicform(logicform, scheme, selectedItem);
    if (newLF) {
      newLogicForm.query = {
        ...newLogicForm.query,
        ...(newLF.query || {})
      }
    }
  }
  return newLogicForm;
};

const GroupByMenu: FC<GroupByMenuProps> = ({
  logicform,
  result,
  selectedItem,
  onChangeLogicform,
}) => {
  let groupByProperty;
  if (typeof logicform.groupby === "string") {
    groupByProperty === logicform.groupby;
  } else if (
    logicform.groupby instanceof Array &&
    logicform.groupby.length === 1
  ) {
    groupByProperty = logicform.groupby[0]?._id;
  } else {
    groupByProperty = logicform.groupby?._id;
  }

  let drillDownMenus: React.ReactNode[] = [];
  const props = drillDownPropForLogicform(result.schema);

  if (props && props.length > 0) {
    drillDownMenus = props.map((propertyName: string) => (
      <Menu.Item key={propertyName} disabled={propertyName === groupByProperty}>
        按照 <b className="text-primary-color">{propertyName}</b> 分组
      </Menu.Item>
    ));
  }

  if (drillDownMenus.length === 0) {
    return null;
  }

  return (
    <Dropdown
      overlay={
        <Menu
          onClick={(menu) => {
            const newLF = getNewLogicform({
              selectedItem,
              propertyName: menu.key,
              logicform,
              scheme: result.schema,
              groupByProperty,
            });
            if (newLF) {
              onChangeLogicform?.(newLF);
            }
          }}
        >
          {drillDownMenus}
        </Menu>
      }
    >
      <Button>
        深入分析 <DownOutlined />
      </Button>
    </Dropdown>
  );
};

export default GroupByMenu;
