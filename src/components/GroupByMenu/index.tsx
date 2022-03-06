import React, { FC } from "react";
import { Dropdown, Menu, Button } from "antd";
import { DownOutlined } from "@ant-design/icons";
import {
  LogicformAPIResultType,
  LogicformType,
  SchemaType,
  drilldownLogicform,
  PredItemType,
  getDrillDownProp,
} from "zeroetp-api-sdk";
import "./index.less";

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

type GroupByMenuProps = {
  logicform: LogicformType;
  onChangeLogicform?: (logicform: LogicformType) => void;
  result: LogicformAPIResultType;
  selectedItem: any;
  title?: string;
  menuStyle?: React.CSSProperties;
};

const getNewLogicform = ({
  propertyName,
  logicform,
  selectedItem,
  schema,
  groupByProperty,
}: {
  propertyName: string;
  logicform: LogicformType;
  schema: SchemaType;
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
        name: logicform.name || logicform.pred,
        pred: logicform.pred,
        operator: logicform.operator,
      } as PredItemType,
    ];
  }
  if (selectedItem) {
    if (!newLogicForm.query) {
      newLogicForm.query = {};
    }
    if (groupByProperty) {
      newLogicForm.query = {
        ...newLogicForm.query,
        [groupByProperty]: selectedItem._id,
      };
    }
    const newLF = drilldownLogicform(logicform, schema, selectedItem);
    if (newLF) {
      newLogicForm.query = {
        ...newLogicForm.query,
        ...(newLF.query || {}),
      };
    }
  }

  return newLogicForm;
};

const GroupByMenu: FC<GroupByMenuProps> = ({
  logicform,
  result,
  selectedItem,
  onChangeLogicform,
  children = (
    <Button>
      深入分析 <DownOutlined />
    </Button>
  ),
  title,
  menuStyle,
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

  const props = result?.schema ? getDrillDownProp(result.schema) : undefined;

  const renderMenus = () => {
    return (
      <>
        {title && (
          <Menu.Item key="-1" disabled className="groupby-menu-title-color">
            {title}
          </Menu.Item>
        )}
        {props &&
          props.length > 0 &&
          props.map((propertyName: string) => (
            <Menu.Item
              key={propertyName}
              disabled={propertyName === groupByProperty}
            >
              按 <b className="text-primary-color">{propertyName}</b> 下钻
            </Menu.Item>
          ))}
      </>
    );
  };

  return (
    <Dropdown
      trigger={["click"]}
      overlay={
        <Menu
          onClick={(menu) => {
            const newLF = getNewLogicform({
              selectedItem,
              propertyName: menu.key,
              logicform,
              schema: result.schema,
              groupByProperty,
            });
            if (newLF) {
              onChangeLogicform?.(newLF);
            }
          }}
          style={menuStyle}
        >
          {renderMenus()}
        </Menu>
      }
    >
      {children}
    </Dropdown>
  );
};

export default GroupByMenu;
