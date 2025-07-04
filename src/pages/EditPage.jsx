import { useState, useEffect } from "react";
import {
  Card,
  Form,
  Select,
  Button,
  message,
  Typography,
  Row,
  Col,
  Avatar,
  Divider,
  Tabs,
} from "antd";
import {
  UserOutlined,
  ArrowLeftOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import BasicInfoEditForm from "../components/forms/basicInfo/BasicInfoEditForm";
import EntrepreneurEditForm from "../components/forms/entrepreneur/EntrepreneurEditForm";
import ExporterEditForm from "../components/forms/exporter/ExporterEditForm";
import TraderEditForm from "../components/forms/intermediaryTrader/TraderEditForm";

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

const EditPage = ({ userId, onUserUpdate }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("basic");
  const [formData, setFormData] = useState({});
  const [selectedProvince, setSelectedProvince] = useState(null);
  const location = useLocation();
  const { id } = useParams();

  console.log(id);
  const states = location.state || {};
  const userRole = states.userRole || "";
  const usersRoleId = states.usersRoleId || "";
  const [roleData, setRoleData] = useState();
  const [editRoleData, setEditRoleData] = useState("");


  useEffect(() => {
    if (userRole == "exporter") {
      setEditRoleData("exporter");
    } else if (userRole == "entrepreneur") {
      setEditRoleData("entrepreneur");
    } else if (userRole == "intermediarytrader") {
      setEditRoleData("trader");
    } else {
      setEditRoleData("basic");
    }
  }, [userRole]);

  const fetchRoleData = async (usersRoleId) => {
    console.log('res: ',usersRoleId)
    try {
      const apiRole = userRole == "intermediarytrader" ? "trader" : userRole;
      const response = await axiosInstance(`/api/${apiRole}/${usersRoleId}`);
      setRoleData(response.data);
    } catch (error) {
      console.log(error);
      throw new Error("Failed to fetch user data");
    }
  };


  const fetchUserData = async (userId) => {
    try {
      const response = await axiosInstance(`/api/users/${userId}`);
      console.log(response);
      setUser(response.data);
    } catch (error) {
      console.log(error);
      throw new Error("Failed to fetch user data");
    }
  };

  console.log(roleData);

  useEffect(() => {
    if (id ) {
      fetchUserData(id);
      fetchRoleData(usersRoleId);
    }
  }, [userId, form, usersRoleId]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      setLoading(true);

      message.info({
        content: "Edit request submitted for approval",
        icon: <ClockCircleOutlined style={{ color: "#e67324" }} />,
      });

      // Simulate approval process
      setTimeout(() => {
        const updatedUser = { ...user, ...formData, ...values };

        // Call the callback to update the user in parent component
        if (onUserUpdate) {
          onUserUpdate(updatedUser);
        }

        message.success({
          content: "User information updated successfully",
          icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
        });

        setLoading(false);

        // Navigate back after successful update
        setTimeout(() => {
          onBack();
        }, 1000);
      }, 3000);
    });
  };

  const handleTabChange = (key) => {
    // Save current form values before switching tabs
    const currentValues = form.getFieldsValue();
    setFormData((prev) => ({ ...prev, ...currentValues }));
    setActiveTab(key);
  };

  const handleBack = () => {
    navigate("/user-management");
  };

  const handleNext = () => {
    const basicFields = ["name", "email", "role", "department", "status"];
    form
      .validateFields(basicFields)
      .then((values) => {
        setFormData((prev) => ({ ...prev, ...values }));
        setActiveTab("business");
      })
      .catch((errorInfo) => {
        message.error("Please fill in all required basic information fields");
      });
  };

  // Update form values when switching between tabs
  useEffect(() => {
    form.setFieldsValue(formData);
  }, [activeTab, formData, form]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="text-center p-8">
            <Text>User not found</Text>
            <br />
            <Button
              type="primary"
              onClick={handleBack}
              style={{
                backgroundColor: "#e67324",
                borderColor: "#e67324",
                marginTop: 16,
              }}
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
            onClick={handleBack}
            className="mb-4 text-gray-600 hover:text-gray-800"
          >
            Back to User Management
          </Button>

          <div className="flex items-center space-x-4 mb-4">
            <Avatar
              size={64}
              icon={<UserOutlined />}
              style={{ backgroundColor: "#e67324" }}
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
          <Title level={4} className="mb-4">
            Current Information
          </Title>
          <Row gutter={[24, 16]}>
            <Col xs={24} sm={12} md={8}>
              <div>
                <Text strong className="text-gray-500">
                  Name:
                </Text>
                <br />
                <Text className="text-gray-900">{user.name}</Text>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div>
                <Text strong className="text-gray-500">
                  NIC:
                </Text>
                <br />
                <Text className="text-gray-900">{user.nic}</Text>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div>
                <Text strong className="text-gray-500">
                  Email:
                </Text>
                <br />
                <Text className="text-gray-900">{user.email}</Text>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div>
                <Text strong className="text-gray-500">
                  Contact Number:
                </Text>
                <br />
                <Text className="text-gray-900">{user.contactNumber}</Text>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div>
                <Text strong className="text-gray-500">
                  Business Status:
                </Text>
                <br />
                <Text className="text-gray-900">{user.businessStatus}</Text>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div>
                <Text strong className="text-gray-500">
                  Business:
                </Text>
                <br />
                <Text className="text-gray-900">{user.businessName}</Text>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Edit Form with Tabs */}
        <Card className="shadow-sm">
          <Title level={4} className="mb-4">
            Update Information
          </Title>

          {/* Approval Notice */}
          <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center space-x-2 text-orange-800">
              <ExclamationCircleOutlined />
              <span className="text-sm">
                Changes require administrator approval before taking effect.
              </span>
            </div>
          </div>

          <form
            form={form}
            layout="vertical"
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <Tabs
              activeKey={activeTab}
              onChange={handleTabChange}
              size="large"
              className="mb-6"
            >
              <TabPane
                tab={
                  <span>
                    <UserOutlined />
                    Basic Information
                  </span>
                }
                key="basic"
              >
                <BasicInfoEditForm user={user} />
                {/* <div className="flex justify-end mt-6">
                  <Button
                    type="primary"
                    size="large"
                    onClick={handleNext}
                    icon={<ArrowRightOutlined />}
                    style={{
                      backgroundColor: "#e67324",
                      borderColor: "#e67324",
                    }}
                  >
                    Next: Business Information
                  </Button>
                </div> */}
              </TabPane>

              <TabPane
                tab={
                  <span>
                    <UserOutlined />
                    Business Information
                  </span>
                }
                key="business"
              >
                {editRoleData === "exporter" && (
                  <ExporterEditForm roleData={roleData} isExisting={true} userId={id}/>
                )}
                {editRoleData === "entrepreneur" && (
                  <EntrepreneurEditForm roleData={roleData} isExisting={true}/>
                )}
                {editRoleData === "trader" && (
                  <TraderEditForm roleData={roleData} isExisting={true}/>
                )}
              </TabPane>
            </Tabs>

            <Divider />

            {/* Action Buttons */}
            {/* <div className="flex justify-end space-x-4">
              <Button size="large" onClick={handleBack} disabled={loading}>
                Cancel
              </Button>
              <Button
                type="primary"
                size="large"
                loading={loading}
                htmlType="submit"
                style={{ backgroundColor: "#e67324", borderColor: "#e67324" }}
              >
                {loading ? "Submitting..." : "Submit for Approval"}
              </Button>
            </div> */}
          </form>
        </Card>
      </div>
    </div>
  );
};

export default EditPage;
