import { useState } from "react";
import { 
  Table, 
  Button, 
  Card, 
  Tag, 
  Space, 
  Modal, 
  Form, 
  Input, 
  Select, 
  message, 
  Popconfirm,
  Avatar,
  Typography,
  Row,
  Col
} from "antd";
import { 
  EditOutlined, 
  DeleteOutlined, 
  UserOutlined, 
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from "@ant-design/icons";

const { Title } = Typography;
const { Option } = Select;

const UserManagement = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@spiceregistry.gov",
      role: "Administrator",
      status: "Active",
      department: "Quality Control",
      lastLogin: "2025-06-26",
      registrationDate: "2024-01-15"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.johnson@spiceregistry.gov",
      role: "Inspector",
      status: "Active",
      department: "Field Operations",
      lastLogin: "2025-06-25",
      registrationDate: "2024-03-22"
    },
    {
      id: 3,
      name: "Michael Chen",
      email: "michael.chen@spiceregistry.gov",
      role: "Analyst",
      status: "Inactive",
      department: "Data Analysis",
      lastLogin: "2025-06-20",
      registrationDate: "2024-02-10"
    },
    {
      id: 4,
      name: "Emma Davis",
      email: "emma.davis@spiceregistry.gov",
      role: "Supervisor",
      status: "Active",
      department: "Compliance",
      lastLogin: "2025-06-27",
      registrationDate: "2023-11-05"
    }
  ]);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [pendingActions, setPendingActions] = useState(new Set());
  const [form] = Form.useForm();

  const handleEdit = (user) => {
    setSelectedUser(user);
    form.setFieldsValue(user);
    setEditModalVisible(true);
  };

  const handleEditSubmit = () => {
    form.validateFields().then(values => {
      const actionId = `edit-${selectedUser.id}-${Date.now()}`;
      setPendingActions(prev => new Set([...prev, actionId]));
      
      message.info({
        content: 'Edit request submitted for approval',
        icon: <ClockCircleOutlined style={{ color: '#e67324' }} />
      });

      // Simulate approval process
      setTimeout(() => {
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user.id === selectedUser.id ? { ...user, ...values } : user
          )
        );
        setPendingActions(prev => {
          const newSet = new Set(prev);
          newSet.delete(actionId);
          return newSet;
        });
        
        message.success({
          content: 'User information updated successfully',
          icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />
        });
      }, 3000);

      setEditModalVisible(false);
      setSelectedUser(null);
      form.resetFields();
    });
  };

  const handleDelete = (user) => {
    const actionId = `delete-${user.id}-${Date.now()}`;
    setPendingActions(prev => new Set([...prev, actionId]));
    
    message.info({
      content: 'Delete request submitted for approval',
      icon: <ClockCircleOutlined style={{ color: '#e67324' }} />
    });

    // Simulate approval process
    setTimeout(() => {
      setUsers(prevUsers => prevUsers.filter(u => u.id !== user.id));
      setPendingActions(prev => {
        const newSet = new Set(prev);
        newSet.delete(actionId);
        return newSet;
      });
      
      message.success({
        content: 'User deleted successfully',
        icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />
      });
    }, 3000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'green';
      case 'Inactive': return 'red';
      case 'Suspended': return 'orange';
      default: return 'default';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'Administrator': return 'purple';
      case 'Supervisor': return 'blue';
      case 'Inspector': return 'green';
      case 'Analyst': return 'orange';
      default: return 'default';
    }
  };

  const columns = [
    {
      title: 'User',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="flex items-center space-x-3">
          <Avatar 
            size={40} 
            icon={<UserOutlined />} 
            style={{ backgroundColor: '#e67324' }}
          />
          <div>
            <div className="font-medium text-gray-900">{text}</div>
            <div className="text-sm text-gray-500">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={getRoleColor(role)} className="font-medium">
          {role}
        </Tag>
      ),
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Last Login',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            style={{ backgroundColor: '#e67324', borderColor: '#e67324' }}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete User"
            description="Are you sure you want to delete this user? This action requires approval."
            icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
            onConfirm={() => handleDelete(record)}
            okText="Yes, Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const pendingActionsCount = pendingActions.size;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <Title level={2} className="text-gray-900 mb-2">
                Manage Registered Individuals
              </Title>
              <p className="text-gray-600">
                Manage user accounts for the Spice Registration System
              </p>
            </div>
            
            {/* Pending Actions Indicator */}
            {pendingActionsCount > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <ClockCircleOutlined style={{ color: '#e67324' }} />
                  <span className="text-orange-800 font-medium">
                    {pendingActionsCount} action{pendingActionsCount !== 1 ? 's' : ''} pending approval
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Statistics Cards */}
        {/* <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={12} lg={6}>
            <Card className="text-center">
              <div className="text-2xl font-bold text-gray-900">{users.length}</div>
              <div className="text-gray-500">Total Users</div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {users.filter(u => u.status === 'Active').length}
              </div>
              <div className="text-gray-500">Active Users</div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {users.filter(u => u.status === 'Inactive').length}
              </div>
              <div className="text-gray-500">Inactive Users</div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="text-center">
              <div className="text-2xl font-bold" style={{ color: '#e67324' }}>
                {pendingActionsCount}
              </div>
              <div className="text-gray-500">Pending Actions</div>
            </Card>
          </Col>
        </Row> */}

        {/* Users Table */}
        <Card className="shadow-sm">
          <Table
            columns={columns}
            dataSource={users}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} users`,
            }}
            className="w-full"
          />
        </Card>

        {/* Edit User Modal */}
        <Modal
          title="Edit User Information"
          open={editModalVisible}
          onOk={handleEditSubmit}
          onCancel={() => {
            setEditModalVisible(false);
            setSelectedUser(null);
            form.resetFields();
          }}
          okText="Submit for Approval"
          okButtonProps={{
            style: { backgroundColor: '#e67324', borderColor: '#e67324' }
          }}
          width={600}
        >
          <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center space-x-2 text-orange-800">
              <ExclamationCircleOutlined />
              <span className="text-sm">
                Changes require administrator approval before taking effect.
              </span>
            </div>
          </div>

          <Form
            form={form}
            layout="vertical"
            className="space-y-4"
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Full Name"
                  name="name"
                  rules={[{ required: true, message: 'Please enter full name' }]}
                >
                  <Input placeholder="Enter full name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Email Address"
                  name="email"
                  rules={[
                    { required: true, message: 'Please enter email address' },
                    { type: 'email', message: 'Please enter valid email' }
                  ]}
                >
                  <Input placeholder="Enter email address" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Role"
                  name="role"
                  rules={[{ required: true, message: 'Please select role' }]}
                >
                  <Select placeholder="Select role">
                    <Option value="Administrator">Administrator</Option>
                    <Option value="Supervisor">Supervisor</Option>
                    <Option value="Inspector">Inspector</Option>
                    <Option value="Analyst">Analyst</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Department"
                  name="department"
                  rules={[{ required: true, message: 'Please enter department' }]}
                >
                  <Input placeholder="Enter department" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Status"
              name="status"
              rules={[{ required: true, message: 'Please select status' }]}
            >
              <Select placeholder="Select status">
                <Option value="Active">Active</Option>
                <Option value="Inactive">Inactive</Option>
                <Option value="Suspended">Suspended</Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default UserManagement;