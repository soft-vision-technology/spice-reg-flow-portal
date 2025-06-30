import React, { useState, useEffect } from "react";
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
} from "antd";
import {
  UserAddOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  EditOutlined,
  DeleteOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";

const { Option } = Select;
const { TabPane } = Tabs;

// Mock data for demonstration
const mockUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "admin@gmail.com",
    role: 1,
    status: "active",
    createdAt: "2025-01-15",
  },
];

const UserManagement = ({ onUserCreated }) => {
  const [users, setUsers] = useState(mockUsers);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const userRoles = [
    { value: 1, label: "Administrator" },
    { value: 2, label: "User" },
  ];

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
      role: user.role,
      // status: user.status,
    });
    setEditModalVisible(true);
  };

  const handleDelete = async (userId) => {
    try {
      setUsers(users.filter((user) => user.id !== userId));
      message.success("User deleted successfully!");
    } catch (error) {
      message.error("Failed to delete user.");
    }
  };

  const handleEditSubmit = async (values) => {
    setLoading(true);
    try {
      const updatedUsers = users.map((user) =>
        user.id === editingUser.id ? { ...user, ...values } : user
      );
      setUsers(updatedUsers);
      setEditModalVisible(false);
      setEditingUser(null);
      form.resetFields();
      message.success("User updated successfully!");
    } catch (error) {
      message.error("Failed to update user.");
    } finally {
      setLoading(false);
    }
  };

  const handleModalCancel = () => {
    setEditModalVisible(false);
    setEditingUser(null);
    form.resetFields();
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => getRoleName(role),
      filters: userRoles.map((role) => ({
        text: role.label,
        value: role.value,
      })),
      onFilter: (value, record) => record.role === value,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>
      ),
      filters: [
        { text: "Active", value: "active" },
        { text: "Inactive", value: "inactive" },
        { text: "Pending", value: "pending" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Created Date",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            ghost
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this user?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="primary"
              danger
              ghost
              size="small"
              icon={<DeleteOutlined />}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Card
        title={
          <div className="flex items-center">
            <UserSwitchOutlined className="text-xl text-blue-600 mr-2" />
            <span>User Management</span>
          </div>
        }
        className="h-full"
      >
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          size="middle"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} users`,
            size: "small",
          }}
          scroll={{ x: 800 }}
          style={{ fontSize: 13 }}
        />
      </Card>

      <Modal
        title="Edit User"
        open={editModalVisible}
        onCancel={handleModalCancel}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEditSubmit}
          requiredMark={false}
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Full Name"
                name="name"
                rules={[
                  { required: true, message: "Please enter the full name" },
                  {
                    min: 2,
                    message: "Name must be at least 2 characters long",
                  },
                  { max: 50, message: "Name cannot exceed 50 characters" },
                ]}
              >
                <Input placeholder="Enter full name" />
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
                <Input placeholder="Enter email address" />
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
                <Select placeholder="Select user role">
                  {userRoles.map((role) => (
                    <Option key={role.value} value={role.value}>
                      {role.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label="Status"
                name="status"
                rules={[{ required: true, message: "Please select a status" }]}
              >
                <Select>
                  <Option value="active">Active</Option>
                  <Option value="inactive">Inactive</Option>
                  <Option value="pending">Pending</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <div className="flex justify-end space-x-4 pt-4">
            <Button onClick={handleModalCancel}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Update User
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

const RegisterUser = ({ onUserCreated }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const userRoles = [
    { value: 1, label: "Administrator" },
    { value: 2, label: "User" },
  ];

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      console.log("Creating user with values:", values);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      message.success("User created successfully!");
      form.resetFields();

      // Notify parent component if callback provided
      if (onUserCreated) {
        onUserCreated(values);
      }
    } catch (error) {
      message.error("Failed to create user. Please try again.");
      console.error("Error creating user:", error);
    } finally {
      setLoading(false);
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
          <span>Create New User</span>
        </div>
      }
      className="h-full"
    >
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

          {/* <Col xs={24} sm={12}>
            <Form.Item
              label="Status"
              name="status"
              initialValue="active"
              rules={[{ required: true, message: "Please select a status" }]}
            >
              <Select size="large">
                <Option value="active">Active</Option>
                <Option value="inactive">Inactive</Option>
                <Option value="pending">Pending</Option>
              </Select>
            </Form.Item>
          </Col> */}
        </Row>

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <Button size="large" onClick={handleReset} disabled={loading}>
            Reset
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={loading}
            icon={<UserAddOutlined />}
          >
            Create User
          </Button>
        </div>
      </Form>
    </Card>
  );
};

const UserManagementSystem = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUserCreated = (userData) => {
    // Refresh the user management component
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            User Management System
          </h1>
          <p className="text-gray-600">Create and manage system users</p>
        </div>

        {/* <Tabs defaultActiveKey="1" size="large">
          <TabPane tab="Create User" key="1" icon={<UserAddOutlined />}>
            <RegisterUser onUserCreated={handleUserCreated} />
          </TabPane>
          <TabPane tab="Manage Users" key="2" icon={<UserSwitchOutlined />}>
            <UserManagement key={refreshKey} onUserCreated={handleUserCreated} />
          </TabPane>
        </Tabs> */}

        {/* Alternative Side-by-Side Layout (commented out) */}

        <Row gutter={24}>
          <Col xs={24} lg={12}>
            <RegisterUser onUserCreated={handleUserCreated} />
          </Col>
          <Col xs={24} lg={12}>
            <UserManagement
              key={refreshKey}
              onUserCreated={handleUserCreated}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default UserManagementSystem;
