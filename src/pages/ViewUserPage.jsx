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
    <div className="max-w-3xl mx-auto mt-8">
        <Card title="User Details" bordered={false}>
        <Row gutter={16}>
          <Col span={12}>
            <div>
              <strong>Full Name:</strong> {user.name}
            </div>
          </Col>
          <Col span={12}>
            <div>
              <strong>Email:</strong> {user.email}
            </div>
          </Col>
        </Row>
        <Row gutter={16} className="mt-2">
          <Col span={12}>
            <div>
              <strong>Role:</strong>{" "}
              <Tag color="blue">{user.role?.name || user.role}</Tag>
            </div>
          </Col>
          <Col span={12}>
            <div>
              <strong>Status:</strong>{" "}
              <Tag color="green">{user.status || "Active"}</Tag>
            </div>
          </Col>
        </Row>
        <Row gutter={16} className="mt-2">
          <Col span={12}>
            <div>
              <strong>Business Name:</strong>{" "}
              {user.businessName ||
                user.entrepreneur?.businessName ||
                user.exporter?.businessName ||
                user.intermediaryTrader?.businessName ||
                "N/A"}
            </div>
          </Col>
          <Col span={12}>
            <div>
              <strong>Registration Date:</strong>{" "}
              {user.registrationDate ||
                (user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "N/A")}
            </div>
          </Col>
        </Row>
        {/* Add more fields as needed */}
        <Button
          className="mt-4"
          type="primary"
          onClick={() => navigate('/user-management')}
        >
          Back
        </Button>
      </Card>
    </div>
  );
};

export default ViewUserPage;
