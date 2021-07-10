import React, { useContext } from "react";
import type { ProFormColumnsType } from "@ant-design/pro-form";
import ProProvider from "@ant-design/pro-provider";
import { BetaSchemaForm } from "@ant-design/pro-form";
import type { ZESchemaFromProps, ExtendValueTypes } from "./ZESchemaForm.types";
import { useRequest } from "@umijs/hooks";
import { request } from "../request";
import { getSchemaByID, SchemaAPIResultType } from "zeroetp-api-sdk";
import { valueTypeMapping, valueEnumMapping, customValueTypes } from "../util";

// const columns: ProFormColumnsType<DataItem>[] = [
//   {
//     title: "标题",
//     dataIndex: "title",
//     formItemProps: {
//       rules: [
//         {
//           required: true,
//           message: "此项为必填项",
//         },
//       ],
//     },
//     width: "m",
//   },
//   {
//     title: "状态",
//     dataIndex: "state",
//     valueType: "select",
//     valueEnum,
//     width: "m",
//   },
//   {
//     title: "标签",
//     dataIndex: "labels",
//     width: "m",
//   },
//   {
//     title: "创建时间",
//     key: "showTime",
//     dataIndex: "createName",
//     valueType: "date",
//   },
//   {
//     title: "分组",
//     valueType: "group",
//     columns: [
//       {
//         title: "状态",
//         dataIndex: "groupState",
//         valueType: "select",
//         width: "xs",
//         valueEnum,
//       },
//       {
//         title: "标题",
//         width: "md",
//         dataIndex: "groupTitle",
//         formItemProps: {
//           rules: [
//             {
//               required: true,
//               message: "此项为必填项",
//             },
//           ],
//         },
//       },
//     ],
//   },
//   {
//     title: "列表",
//     valueType: "formList",
//     dataIndex: "list",
//     initialValue: [{ state: "all", title: "标题" }],
//     columns: [
//       {
//         valueType: "group",
//         columns: [
//           {
//             title: "状态",
//             dataIndex: "state",
//             valueType: "select",
//             width: "xs",
//             valueEnum,
//           },
//           {
//             title: "标题",
//             dataIndex: "title",
//             formItemProps: {
//               rules: [
//                 {
//                   required: true,
//                   message: "此项为必填项",
//                 },
//               ],
//             },
//             width: "m",
//           },
//         ],
//       },
//     ],
//   },
//   {
//     title: "FormSet",
//     valueType: "formSet",
//     dataIndex: "formSet",
//     columns: [
//       {
//         title: "状态",
//         dataIndex: "groupState",
//         valueType: "select",
//         width: "xs",
//         valueEnum,
//       },
//       {
//         title: "标题",
//         dataIndex: "groupTitle",
//         tip: "标题过长会自动收缩",
//         formItemProps: {
//           rules: [
//             {
//               required: true,
//               message: "此项为必填项",
//             },
//           ],
//         },
//         width: "m",
//       },
//     ],
//   },
//   {
//     title: "创建时间",
//     dataIndex: "created_at",
//     valueType: "dateRange",
//     transform: (value) => {
//       return {
//         startTime: value[0],
//         endTime: value[1],
//       };
//     },
//   },
// ];

const ZESchemaForm: React.FC<ZESchemaFromProps> = ({
  schemaID,
  columns: _columns,
  propertyConfig,
  ...props
}) => {
  const values = useContext(ProProvider); // 用来自定义ValueType
  const { data } = useRequest<SchemaAPIResultType>(() =>
    request(getSchemaByID(schemaID))
  );

  if (!data) return <div></div>;

  const { schema } = data;
  // 通过properties来生成columns
  let columns: ProFormColumnsType<any, ExtendValueTypes>[];

  // 给下面生成columns用的
  const propsForProperty = (p): ProFormColumnsType<any, ExtendValueTypes> => {
    const formItemProps = {
      rules: [],
    };
    if (p.constraints.required && !p.udf) {
      formItemProps.rules.push({
        required: true,
        message: "此项为必填项",
      });
    }

    // valueType
    let valueType;
    if (
      propertyConfig &&
      propertyConfig[p.name] &&
      "valueType" in propertyConfig[p.name]
    ) {
      valueType = propertyConfig[p.name].valueType;
    } else {
      valueType = valueTypeMapping(p);
    }

    // readonly
    let readonly = p.udf;
    if (
      propertyConfig &&
      propertyConfig[p.name] &&
      "readonly" in propertyConfig[p.name]
    ) {
      readonly = propertyConfig[p.name].readonly;
    }

    // render
    let render = undefined;
    if (p.udf) {
      render = () => <div>自动计算</div>;
    }

    return {
      title: p.name,
      dataIndex: p.name,
      valueType,
      valueEnum: valueEnumMapping(p),
      formItemProps,
      readonly,
      render,
      tooltip: p.description,
    };
  };

  if (_columns) {
    const mapCustomColumn = (col: any) => {
      // children
      if (col.columns && col.valueType !== "table") {
        return {
          ...col,
          columns: col.columns.map((c) => mapCustomColumn(c)),
        };
      }

      if (!col.dataIndex) {
        return col;
      }

      const property = schema.properties.find((p) => p.name === col.dataIndex);

      return {
        ...propsForProperty(property),
        ...col,
      };
    };

    columns = _columns.map((c) => mapCustomColumn(c));
  } else {
    columns = schema.properties.map((p) => propsForProperty(p));
  }

  return (
    <ProProvider.Provider
      value={{
        ...values,
        valueTypeMap: customValueTypes(schema),
      }}
    >
      <BetaSchemaForm<any, ExtendValueTypes> {...props} columns={columns} />
    </ProProvider.Provider>
  );
};

export default ZESchemaForm;
