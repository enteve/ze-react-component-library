import React, { useState, useRef, useEffect } from "react";
import { Button, Spin, Drawer, Space, message, Popconfirm, Radio } from "antd";
import {
  getSchemas,
  createSchema,
  updateSchema,
  SchemaType,
  deleteSchema,
} from "zeroetp-api-sdk";
import { useRequest } from "@umijs/hooks";
import ProTable from "@ant-design/pro-table";
import { request } from "../request";
import JsonEditor, { types, Type } from "./JsonEditor";

const ZESchemaEditor: React.FC = () => {
  const {
    data: schemas = [],
    run: fetchSchemas,
    loading,
  } = useRequest(getSchemas, {
    formatResult: (res: any) => res?.schemas || [],
  });
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [editingRecord, setEditingRecord] = useState<SchemaType>();
  const editorRef = useRef<any>();
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [mode, setMode] = useState<"edit" | "detail">("edit");
  const [type, setType] = useState<Type>("entity");

  const onCancel = () => {
    setMode("edit");
    setDrawerVisible(false);
    setEditingRecord(null);
  };

  const onFinish = async () => {
    if (editorRef.current) {
      const errors: any[] = await editorRef.current.validate();
      if (errors && errors.length > 0) {
        message.error("schema校验不通过，请检查！");
        return;
      }
      const newJson = editorRef.current.get();
      setSaveLoading(true);
      let res;
      if (editingRecord) {
        const payload = { ...newJson };
        delete payload._id;
        res = await request(updateSchema(editingRecord._id, payload));
      } else {
        res = await request(createSchema(newJson));
      }

      setSaveLoading(false);
      if (res) {
        message.success("保存成功");
        onCancel();
        fetchSchemas();
      } else {
        message.error("保存失败，请重试");
      }
    }
  };

  const onDelete = async (id?: string) => {
    if (id) {
      const res = await request(deleteSchema(id));
      if (res) {
        message.success("删除成功");
        fetchSchemas();
      } else {
        message.error("删除失败，请重试！");
      }
    }
  };

  const columns = [
    {
      title: "_id",
      dataIndex: "_id",
    },
    {
      title: "name",
      dataIndex: "name",
    },
    {
      title: "type",
      dataIndex: "type",
    },
    {
      title: "syno",
      dataIndex: "syno",
      render: (text, record) => {
        const syno: string[] = record?.syno || [];
        return syno.length > 0 ? syno.join(", ") : "-";
      },
    },
    {
      title: "description",
      dataIndex: "description",
    },
  ]
    .map((d) => ({ ...d, width: 200 }))
    .concat([
      {
        title: "操作",
        fixed: "right",
        width: 140,
        valueType: "option",
        render: (text, record) => [
          <a
            key="detail"
            onClick={() => {
              setMode("detail");
              setDrawerVisible(true);
              setEditingRecord(record);
            }}
          >
            详情
          </a>,
          <a
            key="edit"
            onClick={() => {
              setMode("edit");
              setDrawerVisible(true);
              setEditingRecord(record);
            }}
          >
            编辑
          </a>,
          <Popconfirm
            title="是否确定删除"
            key="delete"
            onConfirm={() => {
              onDelete(record?._id);
            }}
          >
            <Button type="link" danger style={{ padding: 0 }}>
              删除
            </Button>
          </Popconfirm>,
        ],
      } as any,
    ]);

  useEffect(() => {
    if (editorRef.current && drawerVisible) {
      editorRef.current.setMode("tree");
    }
  }, [drawerVisible]);

  return (
    <Spin spinning={loading}>
      <ProTable<SchemaType>
        toolBarRender={() => {
          return [
            <Radio.Group
              key="type"
              options={types.map((d) => ({ label: d, value: d }))}
              onChange={(e) => {
                setType(e.target.value);
              }}
              value={type}
              optionType="button"
            />,
            <Button
              key="add"
              type="primary"
              onClick={() => {
                setMode("edit");
                setDrawerVisible(true);
                setEditingRecord(null);
              }}
            >
              新建
            </Button>,
          ];
        }}
        rowKey="_id"
        headerTitle="Schema列表"
        dataSource={schemas.filter((d) => d.type === type)}
        columns={columns}
        search={false}
        options={false}
        scroll={{ x: columns.reduce((p, c) => p + c.width, 0) }}
        pagination={false}
      />
      <Drawer
        visible={drawerVisible}
        width={800}
        maskClosable={mode === "edit" ? false : true}
        onClose={onCancel}
        title={
          mode === "edit"
            ? editingRecord
              ? "更新Schema"
              : "新增Schema"
            : "Schema详情"
        }
        footer={
          mode === "edit" ? (
            <div style={{ display: "flex", flexDirection: "row-reverse" }}>
              <Space>
                <Button onClick={onCancel}>取消</Button>
                <Button type="primary" onClick={onFinish} loading={saveLoading}>
                  确定
                </Button>
              </Space>
            </div>
          ) : (
            false
          )
        }
      >
        <JsonEditor
          isSchema
          value={editingRecord}
          editorRef={editorRef}
          editable={mode === "edit"}
          type={type}
        />
      </Drawer>
    </Spin>
  );
};

export default ZESchemaEditor;
