import { useState, useEffect } from "react";
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
  EyeOutlined,
  PrinterOutlined
} from "@ant-design/icons";
import CertificatePrintDrawer from "../components/custom/CertificatePrintDrawer";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchExistingEntrepreneurs,
  fetchExistingExporters,
  fetchExistingTraders,
  // deleteUser as deleteUserApi,
  // updateUser as updateUserApi,
} from "../store/slices/reportSlice";

const { Title } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

const UserManagement = () => {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [certificateDrawerVisible, setCertificateDrawerVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [pendingActions, setPendingActions] = useState(new Set());
  const [activeTab, setActiveTab] = useState("entrepreneurs");
  const [form] = Form.useForm();

  // Redux integration for real data
  const dispatch = useDispatch();
  const { existingEntrepreneurs, existingExporters, existingTraders, loading } = useSelector(
    (state) => state.report
  );

  // Fetch users on mount
  useEffect(() => {
    dispatch(fetchExistingEntrepreneurs());
    dispatch(fetchExistingExporters());
    dispatch(fetchExistingTraders());
  }, [dispatch]);

  // Combine all users for statistics and certificate drawer
  const allUsers = [
    ...(existingEntrepreneurs || []),
    ...(existingExporters || []),
    ...(existingTraders || []),
  ];

  // Helper to get users by role
  const getDataByRole = (role) => {
    switch (role) {
      case "Entrepreneur":
        return existingEntrepreneurs || [];
      case "Exporter":
        return existingExporters || [];
      case "IntermediaryTrader":
        return existingTraders || [];
      default:
        return [];
    }
  };

  // --- Edit, View, Delete handlers using API ---
  const handleView = (user) => {
    setSelectedUser(user);
    setViewModalVisible(true);
  };

  const handleEdit = (user) => {
    // Flatten nested business fields for editing
    const business =
      user.entrepreneur ||
      user.exporter ||
      user.intermediaryTrader ||
      {};
    form.setFieldsValue({
      ...user,
      businessName: business.businessName || "",
      businessType: business.businessType || "",
      location:
        typeof user.location === "object"
          ? user.location?.name
          : user.district?.name
          ? user.district?.name
          : user.location || "",
    });
    setSelectedUser(user);
    setEditModalVisible(true);
  };

  // const handleEditSubmit = () => {
  //   form.validateFields().then(async (values) => {
  //     const actionId = `edit-${selectedUser.id}-${Date.now()}`;
  //     setPendingActions((prev) => new Set([...prev, actionId]));

  //     message.info({
  //       content: "Edit request submitted for approval",
  //       icon: <ClockCircleOutlined style={{ color: "#e67324" }} />,
  //     });

  //     // Simulate approval process, then call API
  //     setTimeout(async () => {
  //       try {
  //         await dispatch(updateUserApi({ id: selectedUser.id, ...values }));
  //         message.success({
  //           content: "User information updated successfully",
  //           icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
  //         });
  //       } catch (e) {
  //         message.error("Failed to update user");
  //       }
  //       setPendingActions((prev) => {
  //         const newSet = new Set(prev);
  //         newSet.delete(actionId);
  //         return newSet;
  //       });
  //     }, 3000);

  //     setEditModalVisible(false);
  //     setSelectedUser(null);
  //     form.resetFields();
  //   });
  // };

  // const handleDelete = (user) => {
  //   const actionId = `delete-${user.id}-${Date.now()}`;
  //   setPendingActions((prev) => new Set([...prev, actionId]));

  //   message.info({
  //     content: "Delete request submitted for approval",
  //     icon: <ClockCircleOutlined style={{ color: "#e67324" }} />,
  //   });

  //   setTimeout(async () => {
  //     try {
  //       await dispatch(deleteUserApi(user.id));
  //       message.success({
  //         content: "User deleted successfully",
  //         icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
  //       });
  //     } catch (e) {
  //       message.error("Failed to delete user");
  //     }
  //     setPendingActions((prev) => {
  //       const newSet = new Set(prev);
  //       newSet.delete(actionId);
  //       return newSet;
  //     });
  //   }, 3000);
  // };

  const handleCertificatePrintSubmit = (printData) => {
    const actionId = `certificate-print-${Date.now()}`;
    setPendingActions(prev => new Set([...prev, actionId]));

    // Simulate approval process for certificate printing
    setTimeout(() => {
      setPendingActions(prev => {
        const newSet = new Set(prev);
        newSet.delete(actionId);
        return newSet;
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

  // --- Columns for each tab (adapted from ReportsPage) ---
  const getColumns = (role) => [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div className="flex items-center space-x-3">
          <Avatar size={40} icon={<UserOutlined />} style={{ backgroundColor: "#e67324" }} />
          <div>
            <div className="font-medium text-gray-900">{record.title ? `${record.title} ${text}` : text}</div>
            <div className="text-sm text-gray-500">{record.email}</div>
          </div>
        </div>
      ),
      width: 200,
    },
    {
      title: "Business Name",
      dataIndex: ["entrepreneur", "exporter", "intermediaryTrader"],
      key: "businessName",
      render: (_, record) => {
        const businessData = record.exporter || record.entrepreneur || record.intermediaryTrader;
        return businessData?.businessName || "N/A";
      },
      width: 150,
    },
    {
      title: "Business Type",
      dataIndex: "businessType",
      key: "businessType",
      render: (_, record) => {
        const businessData = record.exporter || record.entrepreneur || record.intermediaryTrader;
        return businessData?.businessType || "N/A";
      },
      width: 120,
    },
    {
      title: "Location",
      key: "location",
      render: (_, record) => (
        <div>
          <div>{record.district?.name || record.location}</div>
          <div className="text-sm text-gray-500">{record.province?.name}</div>
        </div>
      ),
      width: 150,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, record) => {
        const status = record.status || record.businessStatus;
        return (
          <Tag color={getStatusColor(status)}>
            {status}
          </Tag>
        );
      },
      width: 120,
    },
    {
      title: "Registration Date",
      dataIndex: "createdAt",
      key: "registrationDate",
      render: (date, record) =>
        date
          ? new Date(date).toLocaleDateString()
          : record.registrationDate || "N/A",
      width: 120,
    },
    {
      title: "Last Login",
      dataIndex: "lastLogin",
      key: "lastLogin",
      render: (date) => date || "N/A",
      width: 120,
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
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
            style={{ backgroundColor: "#e67324", borderColor: "#e67324" }}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete User"
            description="Are you sure you want to delete this user? This action requires approval."
            icon={<ExclamationCircleOutlined style={{ color: "red" }} />}
            onConfirm={() => handleDelete(record)}
            okText="Yes, Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Button danger icon={<DeleteOutlined />} size="small">
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
            
            <div className="flex items-center space-x-4">
              {/* Print Certificates Button */}
              <Button
                type="primary"
                icon={<PrinterOutlined />}
                onClick={() => setCertificateDrawerVisible(true)}
                style={{ backgroundColor: '#e67324', borderColor: '#e67324' }}
              >
                Print Certificates
              </Button>

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
        </div>

        {/* Statistics Cards */}
        <Row gutter={[16, 16]} className="mb-6">
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
        </Row>

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
                columns={getColumns("Entrepreneur")}
                dataSource={getDataByRole("Entrepreneur")}
                rowKey="id"
                loading={loading}
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
                columns={getColumns("Exporter")}
                dataSource={getDataByRole("Exporter")}
                rowKey="id"
                loading={loading}
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
                columns={getColumns("IntermediaryTrader")}
                dataSource={getDataByRole("IntermediaryTrader")}
                rowKey="id"
                loading={loading}
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

        {/* Certificate Print Drawer */}
        <CertificatePrintDrawer
          visible={certificateDrawerVisible}
          onClose={() => setCertificateDrawerVisible(false)}
          users={allUsers}
          onSubmitForApproval={handleCertificatePrintSubmit}
        />

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
                    <div className="text-gray-900">
                      {selectedUser.businessName ||
                        selectedUser.entrepreneur?.businessName ||
                        selectedUser.exporter?.businessName ||
                        selectedUser.intermediaryTrader?.businessName ||
                        "N/A"}
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Business Type</label>
                    <div className="text-gray-900">
                      {selectedUser.businessType ||
                        selectedUser.entrepreneur?.businessType ||
                        selectedUser.exporter?.businessType ||
                        selectedUser.intermediaryTrader?.businessType ||
                        "N/A"}
                    </div>
                  </div>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Location</label>
                    <div className="text-gray-900">
                      {selectedUser.location?.name ||
                        selectedUser.district?.name ||
                        (typeof selectedUser.location === "string"
                          ? selectedUser.location
                          : "N/A")}
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Department</label>
                    <div className="text-gray-900">{selectedUser.department || "N/A"}</div>
                  </div>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Registration Date</label>
                    <div className="text-gray-900">
                      {selectedUser.registrationDate ||
                        (selectedUser.createdAt
                          ? new Date(selectedUser.createdAt).toLocaleDateString()
                          : "N/A")}
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Last Login</label>
                    <div className="text-gray-900">{selectedUser.lastLogin || "N/A"}</div>
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
          // onOk={handleEditSubmit}
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