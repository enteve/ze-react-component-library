import React, { useContext, useState } from "react";
import type { ProFormColumnsType } from "@ant-design/pro-form";
import ProProvider from "@ant-design/pro-provider";
import { BetaSchemaForm } from "@ant-design/pro-form";
import type { ZEFromProps } from "./ZEForm.types";
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

const ZEForm: React.FC<ZEFromProps> = ({ schemaID, onFinish }) => {
  const values = useContext(ProProvider); // 用来自定义ValueType
  const { data } = useRequest<SchemaAPIResultType>(() =>
    request(getSchemaByID(schemaID))
  );

  if (!data) return <div></div>;

  const { schema } = data;
  // 通过properties来生成columns
  const columns: ProFormColumnsType<
    any,
    "percentage" | "object" | "boolean" | "file"
  >[] = schema.properties.map((p) => {
    const formItemProps = {
      rules: [],
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
      readonly: p.udf,
      render: () => <div>自动计算</div>,
    };
  });

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
