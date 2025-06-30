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
  Col,
  Tabs
} from "antd";
import { 
  EditOutlined, 
  DeleteOutlined, 
  UserOutlined, 
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EyeOutlined
} from "@ant-design/icons";

const { Title } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

const UserManagement = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@spiceregistry.gov",
      role: "Entrepreneur",
      status: "Active",
      department: "Quality Control",
      lastLogin: "2025-06-26",
      registrationDate: "2024-01-15",
      businessName: "Spice World Enterprises",
      businessType: "Manufacturing",
      location: "Colombo"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.johnson@spiceregistry.gov",
      role: "Exporter",
      status: "Active",
      department: "Field Operations",
      lastLogin: "2025-06-25",
      registrationDate: "2024-03-22",
      businessName: "Global Spice Exports",
      businessType: "Export",
      location: "Galle"
    },
    {
      id: 3,
      name: "Michael Chen",
      email: "michael.chen@spiceregistry.gov",
      role: "IntermediaryTrader",
      status: "Inactive",
      department: "Data Analysis",
      lastLogin: "2025-06-20",
      registrationDate: "2024-02-10",
      businessName: "Trading Hub Lanka",
      businessType: "Trading",
      location: "Kandy"
    },
    {
      id: 4,
      name: "Emma Davis",
      email: "emma.davis@spiceregistry.gov",
      role: "Entrepreneur",
      status: "Active",
      department: "Compliance",
      lastLogin: "2025-06-27",
      registrationDate: "2023-11-05",
      businessName: "Ceylon Spice Co.",
      businessType: "Processing",
      location: "Matara"
    },
    {
      id: 5,
      name: "David Wilson",
      email: "david.wilson@spiceregistry.gov",
      role: "Exporter",
      status: "Active",
      department: "Export Division",
      lastLogin: "2025-06-28",
      registrationDate: "2024-05-12",
      businessName: "Premium Spice Exports",
      businessType: "Export",
      location: "Colombo"
    },
    {
      id: 6,
      name: "Lisa Anderson",
      email: "lisa.anderson@spiceregistry.gov",
      role: "IntermediaryTrader",
      status: "Active",
      department: "Trading Operations",
      lastLogin: "2025-06-29",
      registrationDate: "2024-04-18",
      businessName: "Spice Connect",
      businessType: "Intermediary",
      location: "Negombo"
    }
  ]);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [pendingActions, setPendingActions] = useState(new Set());
  const [activeTab, setActiveTab] = useState("entrepreneurs");
  const [form] = Form.useForm();

  const handleView = (user) => {
    setSelectedUser(user);
    setViewModalVisible(true);
  };

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
      case 'Entrepreneur': return 'purple';
      case 'Exporter': return 'blue';
      case 'IntermediaryTrader': return 'green';
      default: return 'default';
    }
  };

  const getDataByRole = (role) => {
    return users.filter(user => user.role === role);
  };

  const getColumns = (tabType) => {
    const baseColumns = [
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
        title: 'Business Name',
        dataIndex: 'businessName',
        key: 'businessName',
      },
      {
        title: 'Business Type',
        dataIndex: 'businessType',
        key: 'businessType',
      },
      {
        title: 'Location',
        dataIndex: 'location',
        key: 'location',
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
        title: 'Registration Date',
        dataIndex: 'registrationDate',
        key: 'registrationDate',
      },
      {
        title: 'Last Login',
        dataIndex: 'lastLogin',
        key: 'lastLogin',
      },
      {
        title: 'Actions',
        key: 'actions',
        fixed: 'right',
        width: 200,
        render: (_, record) => (
          <Space size="small">
            <Button
              type="default"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleView(record)}
            >
              View
            </Button>
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

    return baseColumns;
  };

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
              <div className="text-2xl font-bold text-purple-600">
                {getDataByRole("Entrepreneur").length}
              </div>
              <div className="text-gray-500">Entrepreneurs</div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {getDataByRole("Exporter").length}
              </div>
              <div className="text-gray-500">Exporters</div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {getDataByRole("IntermediaryTrader").length}
              </div>
              <div className="text-gray-500">Traders</div>
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

        {/* Tabbed Tables */}
        <Card className="shadow-sm">
          <Tabs activeKey={activeTab} onChange={setActiveTab} type="card">
            <TabPane
              tab={
                <span>
                  <Tag color="purple" className="mr-1">
                    {getDataByRole("Entrepreneur").length}
                  </Tag>
                  Entrepreneurs
                </span>
              }
              key="entrepreneurs"
            >
              <Table
                columns={getColumns("entrepreneurs")}
                dataSource={getDataByRole("Entrepreneur")}
                rowKey="id"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} entrepreneurs`,
                }}
                scroll={{ x: 1600 }}
                size="small"
              />
            </TabPane>
            <TabPane
              tab={
                <span>
                  <Tag color="blue" className="mr-1">
                    {getDataByRole("Exporter").length}
                  </Tag>
                  Exporters
                </span>
              }
              key="exporters"
            >
              <Table
                columns={getColumns("exporters")}
                dataSource={getDataByRole("Exporter")}
                rowKey="id"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} exporters`,
                }}
                scroll={{ x: 1600 }}
                size="small"
              />
            </TabPane>
            <TabPane
              tab={
                <span>
                  <Tag color="green" className="mr-1">
                    {getDataByRole("IntermediaryTrader").length}
                  </Tag>
                  Traders
                </span>
              }
              key="traders"
            >
              <Table
                columns={getColumns("traders")}
                dataSource={getDataByRole("IntermediaryTrader")}
                rowKey="id"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} traders`,
                }}
                scroll={{ x: 1600 }}
                size="small"
              />
            </TabPane>
          </Tabs>
        </Card>

        {/* View User Modal */}
        <Modal
          title="User Details"
          open={viewModalVisible}
          onCancel={() => {
            setViewModalVisible(false);
            setSelectedUser(null);
          }}
          footer={[
            <Button key="close" onClick={() => setViewModalVisible(false)}>
              Close
            </Button>
          ]}
          width={600}
        >
          {selectedUser && (
            <div className="space-y-4">
              <Row gutter={16}>
                <Col span={12}>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Full Name</label>
                    <div className="text-gray-900">{selectedUser.name}</div>
                  </div>
                </Col>
                <Col span={12}>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <div className="text-gray-900">{selectedUser.email}</div>
                  </div>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Role</label>
                    <div>
                      <Tag color={getRoleColor(selectedUser.role)} className="mt-1">
                        {selectedUser.role}
                      </Tag>
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <div>
                      <Tag color={getStatusColor(selectedUser.status)} className="mt-1">
                        {selectedUser.status}
                      </Tag>
                    </div>
                  </div>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Business Name</label>
                    <div className="text-gray-900">{selectedUser.businessName}</div>
                  </div>
                </Col>
                <Col span={12}>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Business Type</label>
                    <div className="text-gray-900">{selectedUser.businessType}</div>
                  </div>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Location</label>
                    <div className="text-gray-900">{selectedUser.location}</div>
                  </div>
                </Col>
                <Col span={12}>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Department</label>
                    <div className="text-gray-900">{selectedUser.department}</div>
                  </div>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Registration Date</label>
                    <div className="text-gray-900">{selectedUser.registrationDate}</div>
                  </div>
                </Col>
                <Col span={12}>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Last Login</label>
                    <div className="text-gray-900">{selectedUser.lastLogin}</div>
                  </div>
                </Col>
              </Row>
            </div>
          )}
        </Modal>

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
                    <Option value="Entrepreneur">Entrepreneur</Option>
                    <Option value="Exporter">Exporter</Option>
                    <Option value="IntermediaryTrader">Intermediary Trader</Option>
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

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Business Name"
                  name="businessName"
                  rules={[{ required: true, message: 'Please enter business name' }]}
                >
                  <Input placeholder="Enter business name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Business Type"
                  name="businessType"
                  rules={[{ required: true, message: 'Please enter business type' }]}
                >
                  <Input placeholder="Enter business type" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Location"
                  name="location"
                  rules={[{ required: true, message: 'Please enter location' }]}
                >
                  <Input placeholder="Enter location" />
                </Form.Item>
              </Col>
              <Col span={12}>
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
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default UserManagement;