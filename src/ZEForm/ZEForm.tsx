import React, { useContext, useState } from "react";
import type { ProFormColumnsType } from "@ant-design/pro-form";
import ProProvider from "@ant-design/pro-provider";
import { BetaSchemaForm } from "@ant-design/pro-form";
import type { ZEFromProps } from "./ZEForm.types";
import { useRequest } from "@umijs/hooks";
import { request } from "../request";
import { getSchemaByID, SchemaAPIResultType } from "zeroetp-api-sdk";
import { valueTypeMapping, valueEnumMapping, customValueTypes } from "../util";
import { Divider } from "antd";

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

const ZEForm: React.FC<ZEFromProps> = ({
  schemaID,
  onFinish,
  columns: _columns,
}) => {
  const values = useContext(ProProvider); // 用来自定义ValueType
  const { data } = useRequest<SchemaAPIResultType>(() =>
    request(getSchemaByID(schemaID))
  );

  if (!data) return <div></div>;

  const { schema } = data;
  // 通过properties来生成columns
  let columns: ProFormColumnsType<
    any,
    "percentage" | "object" | "boolean" | "file"
  >[];

  // 给下面生成columns用的
  const propsForProperty = (
    p,
    config: { readOnly?: boolean } = {}
  ): ProFormColumnsType<any, "percentage" | "object" | "boolean" | "file"> => {
    const formItemProps = {
      rules: [],
      // 是否后面加个分割线
      extra: p.with_divider ? <Divider dashed /> : undefined,
    };
    if (p.constraints.required) {
      formItemProps.rules.push({
        required: true,
        message: "此项为必填项",
      });
    }

    return {
      title: p.name,
      dataIndex: p.name,
      valueType: valueTypeMapping(p),
      valueEnum: valueEnumMapping(p),
      formItemProps,
      readonly: p.udf || config.readOnly,
      render: () => <div>自动计算</div>,
    };
  };

  if (_columns) {
    const mapCustomColumn = (col: any) => {
      // children
      if (col.columns) {
        return {
          ...col,
          columns: col.columns.map((c) => mapCustomColumn(c)),
        };
      }

      if (!col.dataIndex) throw new Error("columns参数的item必须有dataIndex");

      const property = schema.properties.find((p) => p.name === col.dataIndex);

      return {
        ...propsForProperty(property),
        ...col,
      };
    };

    columns = _columns.map((c) => mapCustomColumn(c));

    console.log(columns);
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
      <BetaSchemaForm<any, "percentage" | "object" | "boolean" | "file">
        onFinish={onFinish}
        columns={columns}
      />
    </ProProvider.Provider>
  );
};

export default ZEForm;
