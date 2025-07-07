import { Button, Card, Col, Row, Spin, Tag } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const ViewUserPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState(location.state?.user || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user && id) {
      setLoading(true);
      axiosInstance
        .get(`/api/users/${id}`)
        .then((res) => setUser(res.data))
        .catch(() => setUser(null))
        .finally(() => setLoading(false));
    }
  }, [user, id]);

  // Helper function to get business status color
  const getBusinessStatusColor = (status) => {
    switch (status) {
      case 'STARTING':
        return 'orange';
      case 'ACTIVE':
        return 'green';
      case 'INACTIVE':
        return 'red';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Spin size="large" />
      </div>
    );
  }

  if (!user) {
    return <div>No user data found for ID: {id}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <Card title="User Details" variant={false}>
        {/* Personal Information */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Personal Information</h3>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <div>
                <strong>Title:</strong> {user.title}
              </div>
            </Col>
            <Col span={12}>
              <div>
                <strong>Full Name:</strong> {user.name}
              </div>
            </Col>
          </Row>
          <Row gutter={[16, 16]} className="mt-3">
            <Col span={12}>
              <div>
                <strong>Initials:</strong> {user.initials}
              </div>
            </Col>
            <Col span={12}>
              <div>
                <strong>NIC Number:</strong> {user.nic}
              </div>
            </Col>
          </Row>
        </div>

        {/* Contact Information */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Contact Information</h3>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <div>
                <strong>Email:</strong> {user.email}
              </div>
            </Col>
            <Col span={12}>
              <div>
                <strong>Contact Number:</strong> {user.contactNumber}
              </div>
            </Col>
          </Row>
          <Row gutter={[16, 16]} className="mt-3">
            <Col span={24}>
              <div>
                <strong>Address:</strong> {user.address}
              </div>
            </Col>
          </Row>
        </div>

        {/* Location Information */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Location Information</h3>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <div>
                <strong>Province ID:</strong> {user.provinceId}
              </div>
            </Col>
            <Col span={12}>
              <div>
                <strong>District ID:</strong> {user.districtId}
              </div>
            </Col>
          </Row>
          <Row gutter={[16, 16]} className="mt-3">
            <Col span={12}>
              <div>
                <strong>DS Division:</strong> {user.dsDivision}
              </div>
            </Col>
            <Col span={12}>
              <div>
                <strong>GN Division:</strong> {user.gnDivision}
              </div>
            </Col>
          </Row>
        </div>

        {/* Business Information */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Business Information</h3>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <div>
                <strong>Role ID:</strong> {user.roleId}
              </div>
            </Col>
            <Col span={12}>
              <div>
                <strong>Business Status:</strong>{" "}
                <Tag color={getBusinessStatusColor(user.businessStatus)}>
                  {user.businessStatus}
                </Tag>
              </div>
            </Col>
          </Row>
          <Row gutter={[16, 16]} className="mt-3">
            <Col span={12}>
              <div>
                <strong>Registration Date:</strong>{" "}
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "N/A"}
              </div>
            </Col>
          </Row>
        </div>

        {/* Additional Business Details (if available) */}
        {(user.businessName || 
          user.entrepreneur?.businessName || 
          user.exporter?.businessName || 
          user.intermediaryTrader?.businessName) && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Additional Business Details</h3>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <div>
                  <strong>Business Name:</strong>{" "}
                  {user.businessName ||
                    user.entrepreneur?.businessName ||
                    user.exporter?.businessName ||
                    user.intermediaryTrader?.businessName ||
                    "N/A"}
                </div>
              </Col>
            </Row>
          </div>
        )}

        <Button
          className="mt-4"
          type="primary"
          onClick={() => navigate('/user-management')}
        >
          Back to User Management
        </Button>
      </Card>
    </div>
  );
};

export default ViewUserPage;