import React, { useState } from "react";
import {
  PropertyType,
  SchemaType,
  LogicformAPIResultType,
  getHierarchyCodeLength,
  getIDProperty,
  findPropByName,
  getNameProperty,
  LogicformType,
  normaliseGroupby,
  isRelativeDateForm,
  normaliseRelativeDateForm,
} from "zeroetp-api-sdk";

import moment from "moment";
import numeral from "numeral";
import { EditableProTable } from "@ant-design/pro-table";
import {
  Select,
  InputNumber,
  Radio,
  Cascader,
  Spin,
  Typography,
  Popover,
} from "antd";
import { useRequest } from "@umijs/hooks";
import { requestLogicform } from "./request";
import "antd/lib/cascader/style/index";
import { useEffect } from "react";
import escapeStringRegexp from "escape-string-regexp";

const { Option } = Select;
const { Text } = Typography;

import "./formatNumeral";
import ZECard from "./ZECard/ZECard";

/**
 * 相比zeroetp-api-sdk里面的findPropByName，多了对.号的predChain的支持
 * @param schema
 * @param propName
 * @returns
 */
export const findProperty = (schema: SchemaType, propName: string) => {
  // 前端的predChain，要获取正确的property
  let property: PropertyType;
  if (propName.indexOf(".") > 0) {
    const chain = propName.split(".");
    let currentSchema = schema;
    for (const chainItem of chain) {
      property = currentSchema.properties.find((p) => p.name === chainItem);
      if (property) {
        currentSchema = property.schema;
        if (!currentSchema) break;
      }
    }

    if (property) {
      // 记得要改个名字
      property = {
        ...property,
        name: propName,
      };
    }
  } else {
    try {
      // 可以找不到属性
      property = findPropByName(schema, propName);
    } catch (error) {}
  }

  return property;
};

export const valueTypeMapping = (property: PropertyType) => {
  switch (property.type) {
    case "currency":
      return "number"; // 不用money，不然导出Excel之后，这些列无法被操作
    case "percentage":
      return "percentage";
    case "object":
      return "object";
    case "boolean":
      return "boolean";
    case "image":
      return "image";
    case "text":
      return "textarea";
    case "file":
      return "file";
    default:
      break;
  }

  switch (property.primal_type) {
    case "date":
      if (property.granularity) {
        switch (property.granularity) {
          case "second":
          case "minute":
          case "hour":
            return "dateTime";
          case "day":
            return "date";
          case "week":
          case "month":
          // case "quarter":
          case "year":
            return `date${property.granularity
              .toUpperCase()
              .substring(0, 1)}${property.granularity.substring(1)}`;
        }
      }
      return "date";

    case "number":
      return "number";
    case "string":
      if (property.constraints.enum) {
        if (property.constraints.enum.length >= 10) {
          return "select";
        }

        return "radio";
      }
      return "text";
    default:
      return "text";
  }
};

export const valueEnumMapping = (property: PropertyType) => {
  let valueEnum = undefined;
  if (property.primal_type === "boolean") {
    valueEnum = {
      true: {
        text: "是",
      },
      false: {
        text: "否",
      },
    };
  } else if (property.constraints.enum) {
    valueEnum = {};
    property.constraints.enum.forEach((enumItem) => {
      const enumValue = Array.isArray(enumItem) ? enumItem[0] : enumItem;
      valueEnum[enumValue] = { text: enumValue };
    });
  } else if (
    property.stats?.distincts &&
    property.stats?.distincts.length < 10
  ) {
    valueEnum = {};
    property.stats.distincts.forEach((enumItem) => {
      if (enumItem?.length > 0) {
        valueEnum[enumItem] = { text: enumItem };
      }
    });
  }

  return valueEnum;
};

export const formatWithProperty = (property: PropertyType, value: any) => {
  if (property.ui?.formatter) {
    return numeral(value).format(property.ui?.formatter);
  }

  if (property.type === "percentage") {
    return numeral(value).format("0.0%");
  }

  if (property.primal_type === "number") {
    return numeral(value).format("0,0");
  }

  return value;
};

const getPropNameFromProFieldKey = (key: string) => {
  return key.split("-").slice(2).join("-");
};

// config里面目前有table的defaultColWidth.用于计算object的ellipsis。
// TODO：上述解决方案很不行。如果有更好的解决方案就好了。
export const customValueTypes = (schema: SchemaType, config: any = {}) => ({
  percentage: {
    render: (number: number, props) => {
      let property: any;
      if (props) {
        const propName = getPropNameFromProFieldKey(props.proFieldKey);
        property = findPropByName(schema, propName);
      }

      if (!property) {
        property = { type: "percentage" };
      }

      return formatWithProperty(property, number);
    },
    renderFormItem: (text, props) => {
      const propName = getPropNameFromProFieldKey(props.proFieldKey);
      const property = findPropByName(schema, propName);

      // enum
      // 对于其他number类型的props，也要有enum的支持，这个之后用到了再说
      if (property.constraints?.enum) {
        return (
          <Radio.Group {...props?.fieldProps}>
            {property.constraints.enum.map((item: any) => (
              <Radio key={`${item}`} value={item}>
                {item * 100}%
              </Radio>
            ))}
          </Radio.Group>
        );
      }

      return (
        <InputNumber
          min={0}
          max={1}
          step={0.01}
          formatter={(value) => `${(value as number) * 100}%`}
          parser={(value) => parseFloat(value.replace("%", "")) / 100}
          {...props?.fieldProps}
        />
      );
    },
  },
  object: {
    render: (entity: any, props) => {
      let text: string;
      let isSingleEntity = true;
      let property: PropertyType;
      let nameProperty: PropertyType;

      if (typeof entity === "string") {
        text = entity;
      } else {
        const propName = getPropNameFromProFieldKey(props.proFieldKey);
        property = findPropByName(schema, propName);
        nameProperty = getNameProperty(property.schema);

        if (!property.isArray) {
          text = entity[nameProperty.name];
        } else {
          isSingleEntity = false;
          text = entity.map((i) => i[nameProperty.name]).join(",");
        }
      }

      const ellipsisedText = (
        <Text
          style={{ width: config.colWidth || 200 }}
          ellipsis={{ tooltip: text }}
        >
          {text}
        </Text>
      );
      return ellipsisedText;

      // 下面解决方案不太成熟，先关了。
      // 如果用下面的话，上面的文字应该是ellipsis的，但是不弹出tooltip
      // if (!isSingleEntity || !nameProperty || !property) {
      // }
      // return (
      //   <Popover
      //     overlayStyle={{ width: "50%" }}
      //     placement="top"
      //     arrowPointAtCenter
      //     zIndex={999}
      //     content={
      //       <ZECard
      //         logicform={{
      //           operator: "$ent",
      //           field: nameProperty.name,
      //           name: text,
      //           schema: property.schema._id,
      //         }}
      //         showMainContentOnly
      //       />
      //     }
      //   >
      //     {ellipsisedText}
      //   </Popover>
      // );
    },
    renderFormItem: (_text, props) => {
      const propName =
        props?.fieldProps?.propName ||
        getPropNameFromProFieldKey(props.proFieldKey);

      const property = findPropByName(schema, propName);

      // Object有两种表现模式，带Hierarchy的和不带Hierarchy的
      if (property.schema.hierarchy) {
        return renderObjectFormItemHierarchy(property, props);
      }

      return renderObjectFormItem(property.schema, props);
    },
  },
  boolean: {
    render: (v: any) => <div>{v ? "是" : "否"}</div>,
  },
  table: {
    renderFormItem: (_text, props) => {
      const initialValues = props?.fieldProps?.value || [];
      const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(
        initialValues.map((i) => i.id)
      );
      const [dataSource, setDataSource] = useState<any[]>(initialValues);

      useEffect(() => {
        if (props?.fieldProps?.value) {
          setDataSource(props?.fieldProps?.value);
          setEditableRowKeys(props?.fieldProps?.value.map((i) => i.id));
        }
      }, [props?.fieldProps?.value]);

      const setValue = (list) => {
        props?.fieldProps?.onChange?.(list);
      };

      return (
        <EditableProTable
          controlled
          locale={{ emptyText: " " }}
          rowKey="id"
          columns={props.columns}
          recordCreatorProps={
            props?.fieldProps?.recordCreatorProps === undefined
              ? {
                  newRecordType: "dataSource",
                  record: () => ({
                    id: Date.now(),
                  }),
                  creatorButtonText: props?.fieldProps?.placeholder,
                }
              : props?.fieldProps?.recordCreatorProps
          }
          value={dataSource}
          onChange={setValue}
          editable={{
            type: "multiple",
            editableKeys,
            onChange: setEditableRowKeys,
            actionRender: (_row, _, dom) => [dom.delete],
            onValuesChange: (_record, recordList) => setValue(recordList),
          }}
        />
      );
    },
  },
  number: {
    render: (number: number, props) => {
      let property: any;
      if (props) {
        const propName = getPropNameFromProFieldKey(props.proFieldKey);
        property = findPropByName(schema, propName);
      }

      if (!property) {
        property = { primal_type: "number" };
      }
      return formatWithProperty(property, number);
    },
    renderFormItem: (text, props) => {
      return <InputNumber {...props?.fieldProps} />;
    },
  },
});

// 不带Hierarchy的，渲染object类型的
const renderObjectFormItem = (schema, props: any) => {
  const nameProperty = getNameProperty(schema);

  const [search, setSearch] = useState<string>();
  const { data } = useRequest<LogicformAPIResultType>(
    () => {
      // console.log(props);
      let limit = 20;
      const query = { ...props?.fieldProps?.query };
      if (search) {
        query[nameProperty.name] = {
          $regex: escapeStringRegexp(search),
          $options: "i",
        };
        limit = 100;
      }

      return requestLogicform({
        schema: schema._id,
        query,
        limit,
      });
    },
    {
      formatResult: (res) => res.result,
      initialData: [],
      refreshDeps: [search],
    }
  );

  const options = (data as any[]).map((i) => (
    <Option {...i} key={i._id} value={i._id}>
      {i[nameProperty.name]}（{i._id}）
    </Option>
  ));

  return (
    <Select
      showSearch
      defaultActiveFirstOption={false}
      showArrow={false}
      filterOption={false}
      onSearch={setSearch}
      placeholder="请选择"
      allowClear
      {...props?.fieldProps}
      labelInValue
      value={{
        value:
          typeof props?.fieldProps?.value === "object"
            ? props?.fieldProps?.value._id
            : props?.fieldProps?.value,
        label:
          typeof props?.fieldProps?.value === "object"
            ? `${props?.fieldProps?.value[nameProperty.name]}(${
                props?.fieldProps?.value._id
              })`
            : props?.fieldProps?.value,
        key:
          typeof props?.fieldProps?.value === "object"
            ? props?.fieldProps?.value._id
            : props?.fieldProps?.value,
      }}
      onChange={(v: any) => {
        const { value } = v;
        // 为了便于前端显示，这里需要返回整个object。
        const entity = data.find((i) => i._id === value);
        if (entity) {
          props?.fieldProps?.onChange?.(entity);
        }
      }}
    >
      {options}
    </Select>
  );
};

// 带Hierarchy的，渲染object类型的
const renderObjectFormItemHierarchy = (property: PropertyType, props: any) => {
  const { schema } = property;
  const nameProperty = getNameProperty(schema);

  // 设定其实的cascade的level
  let startCodeLength = 1;
  if (property.ui?.startLevel) {
    startCodeLength = getHierarchyCodeLength(schema, property.ui.startLevel);
  }

  const { data, loading } = useRequest<LogicformAPIResultType>(
    () => {
      const query = {};
      if (property.level) {
        const codeLength = getHierarchyCodeLength(schema, property.level);
        if (codeLength > 0) {
          const idProperty = getIDProperty(schema);

          query[idProperty.name] = {
            $regex: `^.{${startCodeLength},${codeLength}}$`,
          };
        }
      }

      return requestLogicform({
        schema: schema._id,
        limit: -1,
        query,
        sort: { _id: 1 },
      });
    },
    {
      formatResult: (res) => {
        // 注意，这套转化算法的前提是，服务器
        const { result } = res;
        if (result.length === 0) return [];

        const cascaded = [];
        const cascadedMap = {};
        result.forEach((item) => {
          const option = {
            value: item._id,
            label: item[nameProperty.name],
            children: [],
          };
          cascadedMap[option.value] = option;

          // 第一个item
          if (cascaded.length === 0) {
            cascaded.push(option);
            return;
          }

          // 其他与第一个item平级的
          if (cascaded[0].value.length === item._id.length) {
            cascaded.push(option);
            return;
          }

          // 计算parentID的length
          let parentIDLength = schema.hierarchy[0].code_length;

          for (let i = 1; i < schema.hierarchy.length; i++) {
            const levelLength = schema.hierarchy[i].code_length;
            if (parentIDLength + levelLength >= item._id.length) {
              break;
            }
            parentIDLength += levelLength;
          }
          let parentID;
          if (parentIDLength < item._id.length) {
            parentID = item._id.substring(0, parentIDLength);
          }

          if (!parentID) {
            cascaded.push(option);
            return;
          }

          if (cascadedMap[parentID]) {
            cascadedMap[parentID].children.push(option);
          } else {
            // 跳脱了原来的层次结构。目前出现于香港和澳门
            // console.log(option);
            // console.log(parentID);
            // console.log(cascadedMap);
          }
        });

        return cascaded;
      },
      initialData: [],
    }
  );

  // Cascader组件所维护的值是一个数组，这里要做一些改造
  // 设定value
  let value: any = undefined;
  if (props?.fieldProps?.value) {
    value = props?.fieldProps?.value;
    if (!Array.isArray(value) && typeof value === "object") {
      value = value._id;
    }

    const newValue = [];
    let totalCodeLength = 0;

    schema.hierarchy.forEach((h: any) => {
      totalCodeLength += h.code_length;

      if (startCodeLength <= totalCodeLength) {
        newValue.push(value.slice(0, totalCodeLength));
      }
    });

    value = newValue;
  }

  return (
    <Spin spinning={loading}>
      <Cascader
        {...props?.fieldProps}
        expandTrigger="hover"
        options={data}
        showSearch
        value={value}
        onChange={(val: string[]) => {
          if (props?.fieldProps?.onChange) {
            props.fieldProps.onChange(val[val.length - 1]);
          }
        }}
      />
    </Spin>
  );
};

/**
 * 逻辑是这样的。
 * TODO：写testcase
 * groupby: "商品_分类"，从’单品‘开始下钻   ->  query:{商品_分类:'单品'}, groupby: "商品",
 * @param logicform
 * @param schema
 * @param groupbyItem
 * @returns new logicform
 */
export const drilldownLogicform = (
  logicform: LogicformType,
  schema: SchemaType,
  groupbyItem: any
) => {
  if (!logicform.groupby) return null; //必须有groupby才能下钻
  const newLF: LogicformType = JSON.parse(JSON.stringify(logicform));
  normaliseGroupby(newLF);

  if (newLF.groupby.length > 1) return null; // 暂时不支持多维数组下钻

  // 一般来说，__开头的，是前端自己添加的一些辅助行。例如汇总行之类的。
  if (
    (typeof groupbyItem === "string" && groupbyItem.startsWith("__")) ||
    (typeof groupbyItem === "object" && groupbyItem._id.startsWith("__"))
  ) {
    return null;
  }

  // 获取下一层
  const groupbyProp = findPropByName(schema, newLF.groupby[0]._id);

  if (newLF.groupby[0].level) {
    const hierarchy: any[] = groupbyProp.schema.hierarchy;

    const thisLevelIndex = hierarchy.findIndex(
      (h) => h.name === newLF.groupby[0].level
    );
    if (thisLevelIndex < hierarchy.length - 1) {
      let drilldownLevel = 1;
      let groupbyItemID = groupbyItem._id;

      // 特殊逻辑，对于geo来说，4个直辖市直接下钻2级
      if (groupbyProp.schema._id === "geo") {
        if (newLF.groupby[0].level === "省市") {
          if (
            groupbyItemID.endsWith("31") ||
            groupbyItemID.endsWith("11") ||
            groupbyItemID.endsWith("12") ||
            groupbyItemID.endsWith("50")
          ) {
            // 4个直辖市判断
            drilldownLevel = 2;
            groupbyItemID += "01";
          }
        }
      }

      const nameProp = getNameProperty(groupbyProp.schema);
      newLF.query[newLF.groupby[0]._id] = {
        schema: groupbyProp.schema._id,
        operator: "$ent",
        field: nameProp.name,
        name: groupbyItem[`${newLF.groupby[0]._id}(${newLF.groupby[0].level})`][
          nameProp.name
        ],
      };
      newLF.groupby[0].level = hierarchy[thisLevelIndex + drilldownLevel].name;
      return newLF;
    }
  } else {
    if (groupbyProp.hierarchy?.down) {
      newLF.query[newLF.groupby[0]._id] = groupbyItem._id;
      const groupbyChain = newLF.groupby[0]._id.split("_");
      groupbyChain.pop();
      if (groupbyProp.hierarchy.down === "_id") {
        newLF.groupby = groupbyChain;
      } else {
        newLF.groupby = [...groupbyChain, groupbyProp.hierarchy?.down].join(
          "_"
        );
      }

      return newLF;
    }
  }

  return null;
};

// 主要是把chained的query给弄回来，方便显示和做filter change
// 目前只做了一层chain的unnormalize，以后遇到再说
export const unnormalizeQuery = (query: any) => {
  const newQuery = {};

  for (const [k, v] of Object.entries<any>(query)) {
    if (
      typeof v === "object" &&
      v.schema &&
      Object.keys(v.query).length === 1
    ) {
      newQuery[`${k}_${Object.keys(v.query)[0]}`] = Object.values(v.query)[0];
    } else {
      newQuery[k] = v;
    }
  }

  return newQuery;
};

export const basicValueDisplay = (oldV: any, toValue?: boolean) => {
  const dateReg = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
  let v = oldV;
  if (v === undefined) {
    if (toValue) {
      return v;
    }
    return "全部";
  }

  if (typeof v === "boolean") {
    if (toValue) {
      return v;
    }
    return v ? "是" : "否";
  }
  if (typeof v !== "object") {
    return v;
  }

  if (v.$lte && isRelativeDateForm(v.$lte)) {
    v.$lte = normaliseRelativeDateForm(v.$lte);
    v.$lte = v.$lte.$lte;
  }

  if (v.$gte && isRelativeDateForm(v.$gte)) {
    v.$gte = normaliseRelativeDateForm(v.$gte);
    v.$gte = v.$gte.$gte;
  }

  if (isRelativeDateForm(v)) {
    v = normaliseRelativeDateForm(v);
  }

  if (
    v.$lte &&
    v.$gte &&
    (dateReg.test(v.$lte) || v.$lte instanceof Date || v.$lte instanceof moment)
  ) {
    let startDate = moment(v.$gte).format("YYYY.MM.DD HH:mm:ss");
    let endDate = moment(v.$lte).format("YYYY.MM.DD HH:mm:ss");
    // 优化一下显示方式
    if (startDate.endsWith(" 00:00:00") && endDate.endsWith(" 23:59:59")) {
      startDate = startDate.substring(0, 10);
      endDate = endDate.substring(0, 10);
    }

    if (toValue) {
      return [startDate, endDate];
    }

    if (startDate === endDate) {
      return startDate;
    }

    return `${startDate} ~ ${endDate}`;
  }

  if (v.$in) {
    return v.$in;
  }

  if (typeof v === "object" && v.operator === "$ent") {
    return v.name;
  }

  return "";
};
