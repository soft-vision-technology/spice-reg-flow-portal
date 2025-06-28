import { useState, useEffect } from "react";
import { 
  Card, 
  Form, 
  Input, 
  Select, 
  Button, 
  message, 
  Typography,
  Row,
  Col,
  Avatar,
  Divider,
  Space
} from "antd";
import { 
  UserOutlined, 
  ArrowLeftOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

const EditPage = ({ userId, onBack, onUserUpdate }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // Mock user data - in real app, this would come from an API
  const mockUsers = [
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
  ];

  useEffect(() => {
    // Simulate fetching user data by ID
    const foundUser = mockUsers.find(u => u.id === userId);
    if (foundUser) {
      setUser(foundUser);
      form.setFieldsValue(foundUser);
    }
  }, [userId, form]);

  const handleSubmit = () => {
    form.validateFields().then(values => {
      setLoading(true);
      
      message.info({
        content: 'Edit request submitted for approval',
        icon: <ClockCircleOutlined style={{ color: '#e67324' }} />
      });

      // Simulate approval process
      setTimeout(() => {
        const updatedUser = { ...user, ...values };
        
        // Call the callback to update the user in parent component
        if (onUserUpdate) {
          onUserUpdate(updatedUser);
        }
        
        message.success({
          content: 'User information updated successfully',
          icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />
        });
        
        setLoading(false);
        
        // Navigate back after successful update
        setTimeout(() => {
          onBack();
        }, 1000);
      }, 3000);
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="text-center p-8">
            <Text>User not found</Text>
            <br />
            <Button 
              type="primary" 
              onClick={onBack}
              style={{ backgroundColor: '#e67324', borderColor: '#e67324', marginTop: 16 }}
            >
              Back to User Management
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button 
            type="text" 
            icon={<ArrowLeftOutlined />}
            onClick={onBack}
            className="mb-4 text-gray-600 hover:text-gray-800"
          >
            Back to User Management
          </Button>
          
          <div className="flex items-center space-x-4 mb-4">
            <Avatar 
              size={64} 
              icon={<UserOutlined />} 
              style={{ backgroundColor: '#e67324' }}
            />
            <div>
              <Title level={2} className="text-gray-900 mb-1">
                Edit User Information
              </Title>
              <Text className="text-gray-600">
                Editing profile for {user.name}
              </Text>
            </div>
          </div>
        </div>

        {/* Current User Info Card */}
        <Card className="mb-6 shadow-sm">
          <Title level={4} className="mb-4">Current Information</Title>
          <Row gutter={[24, 16]}>
            <Col xs={24} sm={12} md={8}>
              <div>
                <Text strong className="text-gray-500">Name:</Text>
                <br />
                <Text className="text-gray-900">{user.name}</Text>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div>
                <Text strong className="text-gray-500">Email:</Text>
                <br />
                <Text className="text-gray-900">{user.email}</Text>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div>
                <Text strong className="text-gray-500">Role:</Text>
                <br />
                <Text className="text-gray-900">{user.role}</Text>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div>
                <Text strong className="text-gray-500">Department:</Text>
                <br />
                <Text className="text-gray-900">{user.department}</Text>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div>
                <Text strong className="text-gray-500">Status:</Text>
                <br />
                <Text className="text-gray-900">{user.status}</Text>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div>
                <Text strong className="text-gray-500">Last Login:</Text>
                <br />
                <Text className="text-gray-900">{user.lastLogin}</Text>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Edit Form */}
        <Card className="shadow-sm">
          <Title level={4} className="mb-4">Update Information</Title>
          
          {/* Approval Notice */}
          <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
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
            onFinish={handleSubmit}
            className="space-y-4"
          >
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Full Name"
                  name="name"
                  rules={[
                    { required: true, message: 'Please enter full name' },
                    { min: 2, message: 'Name must be at least 2 characters' }
                  ]}
                >
                  <Input 
                    placeholder="Enter full name" 
                    size="large"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Email Address"
                  name="email"
                  rules={[
                    { required: true, message: 'Please enter email address' },
                    { type: 'email', message: 'Please enter valid email' }
                  ]}
                >
                  <Input 
                    placeholder="Enter email address" 
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Role"
                  name="role"
                  rules={[{ required: true, message: 'Please select role' }]}
                >
                  <Select placeholder="Select role" size="large">
                    <Option value="Administrator">Administrator</Option>
                    <Option value="Supervisor">Supervisor</Option>
                    <Option value="Inspector">Inspector</Option>
                    <Option value="Analyst">Analyst</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Department"
                  name="department"
                  rules={[
                    { required: true, message: 'Please enter department' },
                    { min: 2, message: 'Department must be at least 2 characters' }
                  ]}
                >
                  <Input 
                    placeholder="Enter department" 
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Status"
              name="status"
              rules={[{ required: true, message: 'Please select status' }]}
            >
              <Select placeholder="Select status" size="large">
                <Option value="Active">Active</Option>
                <Option value="Inactive">Inactive</Option>
                <Option value="Suspended">Suspended</Option>
              </Select>
            </Form.Item>

            <Divider />

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
              <Button 
                size="large"
                onClick={onBack}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                size="large"
                loading={loading}
                htmlType="submit"
                style={{ backgroundColor: '#e67324', borderColor: '#e67324' }}
              >
                {loading ? 'Submitting...' : 'Submit for Approval'}
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default EditPage;