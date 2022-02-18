import React, { useState, useRef, useEffect } from "react";
import { FormInstance } from "@ant-design/pro-form";
import { Button, Spin, Drawer, Space, message, Popconfirm, Radio } from "antd";
import {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
  getAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
} from "../request";
import { roleColumns, accountColumns } from "./constants";
import { useRequest } from "@umijs/hooks";
import ProTable from "@ant-design/pro-table";
import ZESchemaForm from "../ZESchemaForm";

const types = [
  { label: "角色", value: "role" },
  { label: "账号", value: "account" },
];

const loopRoles = (
  arr: any[],
  source: any[],
  level: number,
  currentRole?: string
) => {
  return arr
    .map((d) => {
      const disabled = d.role === currentRole;
      const children = source.filter((a) => a.parent === d.role);
      const restSource = source.filter((a) => a.parent !== d.role);
      if (d.parent && level === 0) {
        return null;
      }
      if (disabled) {
        return null;
      }
      return {
        label: d.role,
        value: d.role,
        children: loopRoles(children, restSource, level + 1, currentRole),
      };
    })
    .filter((f) => f);
};

const ZEAuthEditor: React.FC = () => {
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [editingRecord, setEditingRecord] = useState<any>();
  const formRef = useRef<FormInstance>();
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [mode, setMode] = useState<"edit" | "detail">("edit");
  const [type, setType] = useState<"role" | "account">("role");
  const typeName = types.find((d) => d.value === type)?.label;
  const fetches = {
    getAllData: type === "role" ? getRoles : getAccounts,
    createData: type === "role" ? createRole : createAccount,
    updateData: type === "role" ? updateRole : updateAccount,
    deleteData: type === "role" ? deleteRole : deleteAccount,
  };
  const { getAllData, createData, updateData, deleteData } = fetches;
  const { data: roles = [], run: loadRoles } = useRequest(getRoles, {
    formatResult: (res: any) => res?.roles || [],
    manual: true,
  });

  const {
    data = [],
    run: fetchData,
    loading,
  } = useRequest(getAllData, {
    formatResult: (res: any) =>
      res?.[type === "role" ? "roles" : "accounts"] || [],
    refreshDeps: [type],
  });

  const onCancel = () => {
    setMode("edit");
    setDrawerVisible(false);
    setEditingRecord(null);
    if (formRef.current) {
      formRef.current.resetFields();
    }
  };

  const onFinish = async (formData: any) => {
    setSaveLoading(true);
    let res;
    if (editingRecord) {
      const payload = { ...formData };
      delete payload._id;
      res = await updateData(editingRecord._id, payload);
    } else {
      res = await createData(formData);
    }

    setSaveLoading(false);
    if (res) {
      message.success("保存成功");
      onCancel();
      fetchData();
    }
  };

  const onDelete = async (id?: string) => {
    if (id) {
      const res = await deleteData(id);
      if (res) {
        message.success("删除成功");
        fetchData();
      }
    }
  };

  const columns: any = (type === "role" ? roleColumns : accountColumns)
    .map((d) => ({ ...d, width: 200 }))
    .concat([
      {
        title: "操作",
        fixed: "right",
        width: 140,
        valueType: "option",
        render: (text, record) => [
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

  const roleOptions = loopRoles(roles, roles, 0);

  useEffect(() => {
    if (drawerVisible) {
      loadRoles();
    }
  }, [drawerVisible]);

  useEffect(() => {
    if (editingRecord) {
      const defaultQuery = editingRecord.default_query;
      const parsedQuery = {};
      if (defaultQuery) {
        Object.keys(defaultQuery).forEach((k) => {
          try {
            parsedQuery[k] = JSON.parse(defaultQuery[k]);
          } catch (error) {
            parsedQuery[k] = defaultQuery[k];
          }
        });
      }
      formRef?.current?.setFieldsValue({
        ...editingRecord,
        default_query: parsedQuery,
      });
    }
  }, [editingRecord]);

  return (
    <Spin spinning={loading}>
      <ProTable
        toolBarRender={() => {
          return [
            <Radio.Group
              key="type"
              options={types}
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
        headerTitle={<>{typeName}列表</>}
        dataSource={data}
        columns={columns}
        search={false}
        options={false}
        scroll={{ x: columns.reduce((p, c) => p + c.width, 0) }}
        pagination={false}
      />
      <Drawer
        visible={drawerVisible}
        width={600}
        maskClosable={mode === "edit" ? false : true}
        onClose={onCancel}
        title={editingRecord ? `更新${typeName}` : `新增${typeName}`}
        footer={
          mode === "edit" ? (
            <div style={{ display: "flex", flexDirection: "row-reverse" }}>
              <Space>
                <Button onClick={onCancel}>取消</Button>
                <Button
                  type="primary"
                  onClick={() => {
                    formRef?.current?.submit();
                  }}
                  loading={saveLoading}
                >
                  确定
                </Button>
              </Space>
            </div>
          ) : (
            false
          )
        }
      >
        {type === "role" ? (
          <ZESchemaForm
            schemaID="role"
            formRef={formRef}
            columns={roleColumns.map((d) => {
              if (d.dataIndex === "role" && editingRecord) {
                return {
                  ...d,
                  readonly: true,
                };
              }
              if (d.dataIndex === "parent") {
                return {
                  ...d,
                  fieldProps: (form, config) => {
                    const currentRole = form.getFieldValue("role");
                    return {
                      options: loopRoles(roles, roles, 0, currentRole),
                      treeDefaultExpandAll: true,
                    };
                  },
                };
              }
              return d;
            })}
            isKeyPressSubmit={false}
            schema={{
              _id: "role",
              type: "entity",
              name: "角色",
              properties: [
                {
                  name: "role",
                  primal_type: "string",
                  type: "string",
                  constraints: { required: true },
                },
                {
                  name: "resource",
                  primal_type: "string",
                  type: "string",
                  constraints: { required: true },
                },
              ],
            }}
            submitter={false}
            onFinish={onFinish}
          />
        ) : (
          <ZESchemaForm
            schemaID="account"
            formRef={formRef}
            columns={accountColumns.map((d) => {
              if (d.dataIndex === "username" && editingRecord) {
                return {
                  ...d,
                  readonly: true,
                };
              }
              if (d.dataIndex === "role") {
                return {
                  ...d,
                  fieldProps: {
                    options: roleOptions,
                    treeDefaultExpandAll: true,
                  },
                };
              }
              return d;
            })}
            isKeyPressSubmit={false}
            schema={{
              _id: "account",
              type: "entity",
              name: "账号",
              properties: [
                {
                  name: "username",
                  primal_type: "string",
                  type: "string",
                  constraints: { required: true },
                },
                {
                  name: "password",
                  primal_type: "string",
                  type: "string",
                  constraints: { required: editingRecord ? false : true },
                },
                {
                  name: "role",
                  primal_type: "string",
                  type: "string",
                  constraints: {
                    required: true,
                  },
                },
              ],
            }}
            submitter={false}
            onFinish={onFinish}
          />
        )}
      </Drawer>
    </Spin>
  );
};

export default ZEAuthEditor;
