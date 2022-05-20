import React, { useState, FC, Fragment } from "react";
import {
  PropertyType,
  SchemaType,
  LogicformAPIResultType,
  getHierarchyCodeLength,
  getIDProperty,
  findPropByName,
  getNameProperty,
  LogicformType,
} from "zeroetp-api-sdk";
import type { FallbackProps } from "react-error-boundary";
import numeral from "numeral";
import { EditableProTable } from "@ant-design/pro-table";
import {
  Select,
  InputNumber,
  Radio,
  Cascader,
  Spin,
  Typography,
  Card,
  Result,
  AutoComplete,
  Image,
  Switch,
  Space,
  Tag,
} from "antd";
import type { CardProps } from "antd";
import { useRequest } from "@umijs/hooks";
import { requestLogicform } from "./request";
import "antd/lib/cascader/style/index";
import { useEffect } from "react";
import escapeStringRegexp from "escape-string-regexp";
import ImageUpload from "./ImageUpload";
import "./formatNumeral";

const { Option } = Select;
const { Text, Paragraph } = Typography;

const findProFieldKey = (props: any) => {
  const res =
    props?.proFieldKey || `${props?.id || ""}`.split("_").reverse()[0];
  return res;
};

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
    case "tag":
      return "string";
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
      if (property.constraints?.enum) {
        if (property.constraints?.enum.length >= 10) {
          return "select";
        }

        return "radio";
      }
      return "string";
    default:
      return "string";
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
  } else if (property.constraints?.enum) {
    valueEnum = {};
    property.constraints?.enum.forEach((enumItem) => {
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

export const getFormatter = (property: PropertyType, value: number): any => {
  // 单个的formatter优先。因为table模式下要决定单个formatter
  if (property.ui?.formatter) {
    return {
      formatter: property.ui?.formatter,
      prefix: "",
      postfix: "",
    };
  }
  if (property.ui?.formatters) {
    // 拿第一个
    const [formatter] = property.ui?.formatters;
    if (formatter) {
      if (!formatter.prefix) formatter.prefix = "";
      if (!formatter.postfix) formatter.postfix = "";
      return formatter;
    }
  }

  return null;
};

export const formatWithProperty = (property: PropertyType, value: any) => {
  if (value === null) return "-";

  const formatter = getFormatter(property, value);

  if (formatter) {
    return numeral(value).format(formatter.formatter);
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
  if (!key?.includes("-")) {
    return key;
  }
  return key.split("-").slice(2).join("-");
};

// config里面目前有table的defaultColWidth.用于计算object的ellipsis。
// TODO：上述解决方案很不行。如果有更好的解决方案就好了。
export const customValueTypes = (schema: SchemaType): any => ({
  percentage: {
    render: (number: number, props, ...rest) => {
      if (props.render) {
        return props.render(number, props, ...rest);
      }
      let property: any;
      if (props) {
        const propName = getPropNameFromProFieldKey(findProFieldKey(props));
        property = findPropByName(schema, propName);
      }

      if (!property) {
        property = { type: "percentage" };
      }

      return formatWithProperty(property, number);
    },
    renderFormItem: (text, props, form) => {
      if (props.renderFormItem) {
        return props.renderFormItem(text, props, form);
      }
      const propName = getPropNameFromProFieldKey(findProFieldKey(props));
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
    render: (entity: any, props, ...rest) => {
      if (props.render) {
        return props.render(entity, props, ...rest);
      }
      if (entity == null) return "N/A";

      const width = (props?.fieldProps?.width || 200) - 16;
      let text: string;
      let isSingleEntity = true;
      let property: PropertyType;
      let nameProperty: PropertyType;

      if (typeof entity === "string") {
        text = entity;
      } else {
        const propName = getPropNameFromProFieldKey(findProFieldKey(props));
        property = findPropByName(schema, propName);
        nameProperty = getNameProperty(property.schema);

        if (!property.isArray) {
          text = entity[nameProperty.name];
        } else {
          isSingleEntity = false;
          text = entity.map((i) => i[nameProperty.name]).join(",");
        }
      }

      return (
        <div style={{ display: "flex" }}>
          <Paragraph
            ellipsis={{
              rows: props?.fieldProps?.ellipsis?.row || 1,
              expandable: false,
              tooltip: text,
            }}
            style={{
              margin: 0,
              width,
              flexGrow: 1,
              flexShrink: 0,
            }}
          >
            {text}
          </Paragraph>
        </div>
      );

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
    renderFormItem: (_text, props, form) => {
      if (props.renderFormItem) {
        return props.renderFormItem(_text, props, form);
      }
      const propName =
        props?.fieldProps?.propName ||
        getPropNameFromProFieldKey(findProFieldKey(props));

      const property = findPropByName(schema, propName);

      // Object有两种表现模式，带Hierarchy的和不带Hierarchy的
      if (property.schema.hierarchy) {
        return renderObjectFormItemHierarchy(property, props);
      }

      return renderObjectFormItem(property.schema, props);
    },
  },
  boolean: {
    render: (v: any, props, ...rest) => {
      if (props.render) {
        return props.render(v, props, ...rest);
      }
      return <div>{v ? "是" : "否"}</div>;
    },
    renderFormItem: (text, props, form) => {
      if (props.renderFormItem) {
        return props.renderFormItem(text, props, form);
      }
      const { value, ...fieldProps } = props?.fieldProps || {};
      return <Switch {...fieldProps} checked={value} />;
    },
  },
  table: {
    renderFormItem: (_text, props, form) => {
      if (props.renderFormItem) {
        return props.renderFormItem(_text, props, form);
      }
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
    render: (number: number, props, ...rest) => {
      // 如果column传入了render，优先级应该最高
      if (props.render) {
        return props.render(number, props, ...rest);
      }
      let property: any;
      if (props) {
        const propName = getPropNameFromProFieldKey(findProFieldKey(props));
        property = findPropByName(schema, propName);
      }

      if (!property) {
        property = { primal_type: "number" };
      }
      return formatWithProperty(property, number);
    },
    renderFormItem: (text, props, form) => {
      if (props.renderFormItem) {
        return props.renderFormItem(text, props, form);
      }
      return (
        <InputNumber placeholder={props?.placeholder} {...props?.fieldProps} />
      );
    },
  },
  // 用户自定义的render具有最高优先级
  string: {
    render: (v, props, ...rest) => {
      if (props.render) {
        return props.render(v, props, ...rest);
      }
      if (props?.fieldProps?.delimiter && v instanceof Array) {
        return v.join(props?.fieldProps?.delimiter);
      }
      if (props?.fieldProps?.tagRender && v instanceof Array) {
        return (
          <Space size="small">
            {v.map((d) => (
              <Fragment key={d}>
                {props?.fieldProps?.tagRender({ label: d, closable: false })}
              </Fragment>
            ))}
          </Space>
        );
      }
      return v;
    },
    renderFormItem: (text, props, form) => {
      if (props.renderFormItem) {
        return props.renderFormItem(text, props, form);
      }
      if (props?.fieldProps?.mode) {
        return (
          <Select
            placeholder={props.placeholder || "请输入"}
            {...props?.fieldProps}
          />
        );
      }
      return (
        <AutoComplete
          placeholder={props.placeholder || "请输入"}
          {...props?.fieldProps}
        />
      );
    },
  },
  image: {
    render: (v, props, ...rest) => {
      if (props.render) {
        return props.render(v, props, ...rest);
      }
      return (
        <Image
          {...props?.fieldProps}
          src={v}
          width={props?.fieldProps?.width || 32}
        />
      );
    },
    renderFormItem: (text, props, form) => {
      if (props.renderFormItem) {
        return props.renderFormItem(text, props, form);
      }
      return <ImageUpload {...props?.fieldProps} />;
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
      formatResult: (res) => (res ? res.result : []),
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
      value={
        props?.fieldProps?.value
          ? {
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
            }
          : undefined
      }
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
        const v = value.slice(0, totalCodeLength);
        if (v && !newValue.includes(v)) {
          newValue.push(v);
        }
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

// 主要是把chained的query给弄回来，方便显示和做filter change
// 目前只做了一层chain的unnormalize，以后遇到再说
export const unnormalizeQuery = (query: any) => {
  const newQuery = {};

  if (query) {
    for (const [k, v] of Object.entries<any>(query)) {
      if (
        typeof v === "object" &&
        v.schema &&
        v.query &&
        Object.keys(v.query).length === 1
      ) {
        newQuery[`${k}_${Object.keys(v.query)[0]}`] = Object.values(v.query)[0];
      } else {
        newQuery[k] = v;
      }
    }
  }

  return newQuery;
};

export const genYoyAndMomLogicform = (
  normedLF: LogicformType,
  op: "$yoy" | "$mom"
): LogicformType => {
  const retLF = JSON.parse(JSON.stringify(normedLF));

  if (retLF.preds.length !== 1) throw new Error("LF的preds长度必须为1");
  if (retLF.preds[0].length !== 1) throw new Error("LF的preds[0]长度必须为1");

  const predItem = retLF.preds[0][0];
  if (!predItem.operator) throw new Error("predItem必须要有operator");

  const { name, query, pred, operator, ...others } = predItem;
  if (!operator.startsWith("$") || operator === "$count") {
    // 自定义函数
    retLF.preds[0][0] = {
      operator: op,
      name: `${name || operator}同比`,
      query,
      pred: {
        name,
        operator,
        ...others,
        pred,
      },
    };
  } else if (operator === "$sum") {
    retLF.preds[0][0] = {
      operator: op,
      name,
      query,
      pred,
    };
  } else {
    throw new Error(`genYoyAndMomLogicform暂不支持的operator: ${operator}`);
  }
  return retLF;
};

export const ErrorFallBack: FC<FallbackProps & { cardProps?: CardProps }> = ({
  error,
  cardProps,
}) => {
  return (
    <Card {...cardProps}>
      <Result status="error" title="程序出错了" subTitle="请联系管理员处理!">
        <div>
          <Paragraph>
            <Text strong>报错信息：</Text>
            {error.message}
          </Paragraph>
        </div>
      </Result>
    </Card>
  );
};

export const getColumnPublicProps = (
  p: any,
  col?: any,
  propertyConfig?: any
) => {
  // valueType
  let valueType: any = "string";
  if (
    propertyConfig &&
    propertyConfig[p.name] &&
    "valueType" in propertyConfig[p.name]
  ) {
    valueType = propertyConfig[p.name].valueType;
  } else {
    valueType = valueTypeMapping(p);
  }
  if (col?.valueType) {
    valueType = col.valueType;
  }
  const valueEnum = valueEnumMapping(p);
  const valueOptions = valueEnum
    ? Object.keys(valueEnum).map((k) => ({
        label: valueEnum[k]?.text || k,
        value: k,
      }))
    : undefined;

  const colFieldProps: any = col?.fieldProps || {};
  let extraFieldProps: any = {};

  if (p.type === "tag") {
    extraFieldProps = {
      mode: "tags",
      tagRender: (tagProps) => {
        const { label, closable, onClose } = tagProps;
        return (
          <Tag
            color="blue"
            onMouseDown={(event) => {
              event.preventDefault();
              event.stopPropagation();
            }}
            closable={closable}
            onClose={onClose}
            style={{ marginRight: 3 }}
          >
            {label}
          </Tag>
        );
      },
    };
  } else if (p.isArray) {
    extraFieldProps = { delimiter: p.ui?.delimiter || " " };
  }

  const fieldProps =
    valueType === "string"
      ? {
          options: valueOptions,
          ...colFieldProps,
          ...extraFieldProps,
        }
      : colFieldProps;

  return {
    valueType,
    valueEnum: valueType === "string" ? undefined : valueEnum,
    fieldProps,
  };
};
