import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Form,
  Input,
  Select,
  Col,
  Row,
  Button,
  message,
  Table,
  Modal,
  Space,
  Tag,
  Popconfirm,
  Card,
  Tabs,
  Spin,
  Alert,
  Tooltip,
} from "antd";
import {
  UserAddOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  EditOutlined,
  DeleteOutlined,
  UserSwitchOutlined,
  ReloadOutlined,
  SearchOutlined,
  UserOutlined,
  MailOutlined,
  LockOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  changeUserStatus,
  setSelectedUser,
  clearSelectedUser,
  clearUsersError,
  clearCreateUserError,
  clearUpdateUserError,
  clearDeleteUserError,
  setPagination,
  setFilters,
  resetFilters,
  updateUserLocally,
  removeUserLocally,
} from "../store/slices/authSlice";

const { Option } = Select;
const { Search } = Input;

const UserManagement = () => {
  const dispatch = useDispatch();
  const {
    users,
    usersLoading,
    usersError,
    updateUserLoading,
    updateUserError,
    deleteUserLoading,
    deleteUserError,
    pagination,
    filters,
  } = useSelector((state) => state.auth);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  const userRoles = [
    { value: 1, label: "Administrator" },
    { value: 2, label: "User" },
  ];

  // Fetch users on component mount
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // Clear errors when they change
  useEffect(() => {
    if (updateUserError) {
      message.error(updateUserError);
      dispatch(clearUpdateUserError());
    }
  }, [updateUserError, dispatch]);

  useEffect(() => {
    if (deleteUserError) {
      message.error(deleteUserError);
      dispatch(clearDeleteUserError());
    }
  }, [deleteUserError, dispatch]);

  useEffect(() => {
    if (usersError) {
      message.error(usersError);
      dispatch(clearUsersError());
    }
  }, [usersError, dispatch]);

  const getRoleName = (roleId) => {
    const role = userRoles.find((r) => r.value === roleId);
    return role ? role.label : "Unknown";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "green";
      case "inactive":
        return "red";
      case "pending":
        return "orange";
      default:
        return "default";
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    form.setFieldsValue({
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
    });
    setEditModalVisible(true);
  };

  const handleDelete = async (userId) => {
    try {
      // Optimistic update
      dispatch(removeUserLocally(userId));
      await dispatch(deleteUser(userId)).unwrap();
      message.success("User deleted successfully!");
    } catch (error) {
      // Revert optimistic update on error
      dispatch(fetchUsers());
      message.error("Failed to delete user.");
    }
  };

  const handleEditSubmit = async (values) => {
    try {
      // Optimistic update
      dispatch(updateUserLocally({ userId: editingUser.id, userData: values }));

      await dispatch(
        updateUser({ userId: editingUser.id, userData: values })
      ).unwrap();
      setEditModalVisible(false);
      setEditingUser(null);
      form.resetFields();
      message.success("User updated successfully!");
    } catch (error) {
      // Revert optimistic update on error
      dispatch(fetchUsers());
      message.error("Failed to update user.");
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await dispatch(changeUserStatus({ userId, status: newStatus })).unwrap();
      message.success("User status updated successfully!");
    } catch (error) {
      message.error("Failed to update user status.");
    }
  };

  const handleModalCancel = () => {
    setEditModalVisible(false);
    setEditingUser(null);
    form.resetFields();
  };

  const handleRefresh = () => {
    dispatch(fetchUsers());
    message.success("Users refreshed!");
  };

  const handleSearch = (value) => {
    dispatch(setFilters({ search: value }));
  };

  const handleTableChange = (pagination, filters, sorter) => {
    dispatch(
      setPagination({
        current: pagination.current,
        pageSize: pagination.pageSize,
      })
    );

    dispatch(
      setFilters({
        role: filters.role?.[0] || null,
        status: filters.status?.[0] || null,
      })
    );
  };

  const clearAllFilters = () => {
    dispatch(resetFilters());
    dispatch(setPagination({ current: 1 }));
  };

  // Filter users based on current filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch = filters.search
      ? user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.search.toLowerCase())
      : true;

    const matchesRole = filters.role ? user.role === filters.role : true;
    const matchesStatus = filters.status
      ? user.status === filters.status
      : true;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text, record) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-xs text-gray-500">ID: {record.id}</div>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email) => (
        <Tooltip title={email}>
          <span className="text-blue-600">{email}</span>
        </Tooltip>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag color={role === 1 ? "gold" : "blue"}>{getRoleName(role)}</Tag>
      ),
      filters: userRoles.map((role) => ({
        text: role.label,
        value: role.value,
      })),
      onFilter: (value, record) => record.role === value,
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Edit User">
            <Button
              type="primary"
              ghost
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              loading={updateUserLoading}
            />
          </Tooltip>
          <Popconfirm
            title="Delete User"
            description="Are you sure you want to delete this user? This action cannot be undone."
            onConfirm={() => handleDelete(record.id)}
            okText="Yes, Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Delete User">
              <Button
                type="primary"
                danger
                ghost
                size="small"
                icon={<DeleteOutlined />}
                loading={deleteUserLoading}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Card
        title={
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <UserSwitchOutlined className="text-xl text-blue-600 mr-2" />
              <span>System Users</span>
              <Tag color="blue" className="ml-2">
                {filteredUsers.length} users
              </Tag>
            </div>
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={handleRefresh}
                loading={usersLoading}
                size="small"
              >
                Refresh
              </Button>
            </Space>
          </div>
        }
        className="h-full"
        extra={
          <Space>
            <Search
              placeholder="Search users..."
              allowClear
              onSearch={handleSearch}
              style={{ width: 200 }}
              size="small"
            />
            {(filters.search || filters.role || filters.status) && (
              <Button size="small" onClick={clearAllFilters}>
                Clear Filters
              </Button>
            )}
          </Space>
        }
      >
        {usersError && (
          <Alert
            message="Error loading users"
            description={usersError}
            type="error"
            showIcon
            closable
            className="mb-4"
            onClose={() => dispatch(clearUsersError())}
          />
        )}

        <Spin spinning={usersLoading}>
          <Table
            columns={columns}
            dataSource={filteredUsers}
            rowKey="id"
            size="small"
            onChange={handleTableChange}
            style={{ fontSize: 14 }}
            loading={usersLoading}
          />
        </Spin>
      </Card>

      <Modal
        title={
          <div className="flex items-center">
            <EditOutlined className="text-blue-600 mr-2" />
            Edit User
          </div>
        }
        open={editModalVisible}
        onCancel={handleModalCancel}
        footer={null}
        width={400}
        destroyOnHidden
      >
        {updateUserError && (
          <Alert
            message="Update Error"
            description={updateUserError}
            type="error"
            showIcon
            closable
            className="mb-4"
            onClose={() => dispatch(clearUpdateUserError())}
          />
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={handleEditSubmit}
          requiredMark={true}
        >
          <Row gutter={16}>
            <Col xs={24} sm={24}>
              <Form.Item
                label="Full Name"
                name="name"
                rules={[
                  { required: false, message: "Please enter the full name" },
                  {
                    min: 2,
                    message: "Name must be at least 2 characters long",
                  },
                  { max: 50, message: "Name cannot exceed 50 characters" },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Enter full name"
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24}>
              <Form.Item
                label="Email Address"
                name="email"
                rules={[
                  { required: false, message: "Please enter an email address" },
                  {
                    type: "email",
                    message: "Please enter a valid email address",
                  },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="Enter email address"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={24}>
              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: false, message: "Please enter a password" },
                  {
                    type: "password",
                    message: "Please enter a valid password",
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Change password"
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24}>
              <Form.Item
                label="Role"
                name="role"
                rules={[{ required: false, message: "Please select a role" }]}
              >
                <Select
                  prefix={<IdcardOutlined />}
                  placeholder="Select user role"
                >
                  {userRoles.map((role) => (
                    <Option key={role.value} value={role.value}>
                      {role.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <div className="flex justify-end space-x-4 pt-4 border-t">
            <Button onClick={handleModalCancel} disabled={updateUserLoading}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={updateUserLoading}
              icon={<EditOutlined />}
              onClick={() => {
                message.info(
                  "Please double-check all details before updating the user."
                );
              }}
            >
              Update User
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

const RegisterUser = () => {
  const dispatch = useDispatch();
  const { createUserLoading, createUserError } = useSelector(
    (state) => state.auth
  );

  const [form] = Form.useForm();

  const userRoles = [
    { value: 1, label: "Administrator" },
    { value: 2, label: "User" },
  ];

  // Clear errors when they change
  useEffect(() => {
    if (createUserError) {
      message.error(createUserError);
      dispatch(clearCreateUserError());
    }
  }, [createUserError, dispatch]);

  const handleSubmit = async (values) => {
    try {
      await dispatch(createUser(values)).unwrap();
      message.success("User created successfully!");
      form.resetFields();
      // Refresh users list
      dispatch(fetchUsers());
    } catch (error) {
      message.error("Failed to create user. Please try again.");
    }
  };

  const handleReset = () => {
    form.resetFields();
  };

  const validatePassword = (_, value) => {
    if (!value) {
      return Promise.reject(new Error("Please enter a password"));
    }
    if (value.length < 8) {
      return Promise.reject(
        new Error("Password must be at least 8 characters long")
      );
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
      return Promise.reject(
        new Error(
          "Password must contain at least one uppercase letter, one lowercase letter, and one number"
        )
      );
    }
    return Promise.resolve();
  };

  return (
    <Card
      title={
        <div className="flex items-center">
          <UserAddOutlined className="text-xl text-blue-600 mr-2" />
          <span>Create New System User</span>
        </div>
      }
      className="h-full"
    >
      {createUserError && (
        <Alert
          message="Creation Error"
          description={createUserError}
          type="error"
          showIcon
          closable
          className="mb-4"
          onClose={() => dispatch(clearCreateUserError())}
        />
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={false}
        className="space-y-4"
      >
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Full Name"
              name="name"
              rules={[
                { required: true, message: "Please enter the full name" },
                { min: 2, message: "Name must be at least 2 characters long" },
                { max: 50, message: "Name cannot exceed 50 characters" },
              ]}
            >
              <Input placeholder="Enter full name" size="large" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label="Email Address"
              name="email"
              rules={[
                { required: true, message: "Please enter an email address" },
                {
                  type: "email",
                  message: "Please enter a valid email address",
                },
              ]}
            >
              <Input placeholder="Enter email address" size="large" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Password"
              name="password"
              rules={[{ validator: validatePassword }]}
              hasFeedback
            >
              <Input.Password
                placeholder="Enter password"
                size="large"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>
            <div className="text-sm text-gray-500 mt-1">
              Password must be at least 8 characters with uppercase, lowercase,
              and number
            </div>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Please confirm the password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match"));
                  },
                }),
              ]}
              hasFeedback
            >
              <Input.Password
                placeholder="Confirm password"
                size="large"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Role"
              name="role"
              rules={[{ required: true, message: "Please select a role" }]}
            >
              <Select placeholder="Select user role" size="large">
                {userRoles.map((role) => (
                  <Option key={role.value} value={role.value}>
                    {role.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <Button
            size="large"
            onClick={handleReset}
            disabled={createUserLoading}
          >
            Reset
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={createUserLoading}
            icon={<UserAddOutlined />}
            onClick={() => {
              message.info(
                "Please double-check all details before creating the user."
              );
            }}
          >
            Create User
          </Button>
        </div>
      </Form>
    </Card>
  );
};

const UserManagementSystem = () => {
  const { users } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            System User Management
          </h1>
          <p className="text-gray-600">
            Create and manage system users • Total: {users.length} users
          </p>
        </div>

        <Row gutter={24}>
          <Col xs={24} lg={12} className="mb-6 lg:mb-0">
            <RegisterUser />
          </Col>
          <Col xs={24} lg={12}>
            <UserManagement />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default UserManagementSystem;
