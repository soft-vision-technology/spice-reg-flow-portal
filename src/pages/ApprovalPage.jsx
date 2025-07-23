import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  Typography,
  Table,
  Button,
  Input,
  Space,
  Spin,
  Alert,
  Row,
  Col,
  Tag,
  Divider,
  Form,
  message,
  Modal,
  Descriptions,
  List,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import axiosInstance from "../api/axiosInstance";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { confirm } = Modal;

const ApprovalPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [approval, setApproval] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentData, setCurrentData] = useState(null);
  const [currentLoading, setCurrentLoading] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axiosInstance
      .get(`/api/approval/get/${id}`)
      .then((res) => {
        setApproval(res.data?.newRequest);
        setRemarks(res.data?.newRequest?.remarks || "");
      })
      .catch(() => {
        setApproval(null);
        message.error("Failed to load approval request");
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (approval?.requestedUrl) {
      setCurrentLoading(true);
      axiosInstance
        .get(`/api/${approval.requestedUrl}`)
        .then((res) => setCurrentData(res.data))
        .catch(() => {
          setCurrentData(null);
          message.warning("Could not load current data");
        })
        .finally(() => setCurrentLoading(false));
    }
  }, [approval]);

  useEffect(() => {
    if (approval?.status === "approved") {
      form.setFieldsValue({ remarks: approval.remarks });
    } else {
      form.setFieldsValue({ remarks });
    }
    // eslint-disable-next-line
  }, [approval, remarks]);

  const getStatusTag = (status) => {
    const statusConfig = {
      pending: { color: "orange", icon: <ExclamationCircleOutlined /> },
      approved: { color: "green", icon: <CheckCircleOutlined /> },
      denied: { color: "red", icon: <CloseCircleOutlined /> },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <Tag color={config.color} icon={config.icon}>
        {status?.toUpperCase() || "PENDING"}
      </Tag>
    );
  };

  const handleApprove = async () => {
    if (!remarks.trim()) {
      message.error("Remarks are required");
      return;
    }

    confirm({
      title: "Are you sure you want to approve this request?",
      icon: <CheckCircleOutlined />,
      content:
        "This action will apply the requested changes and cannot be undone.",
      okText: "Yes, Approve",
      cancelText: "Cancel",
      onOk: async () => {
        setSubmitting(true);
        try {
          // 1. Patch the requestedUrl with the requested data
          await axiosInstance.patch(
            `/api/${approval.requestedUrl}`,
            approval.requestData
          );
          // 2. Update approval status
          await axiosInstance.patch(`/api/approval/update/${id}`, {
            remarks,
            status: "approved",
          });
          message.success("Request approved successfully");
          navigate("/user-management");
        } catch (err) {
          message.error("Failed to approve request");
        } finally {
          setSubmitting(false);
        }
      },
    });
  };

  const handleDeny = async () => {
    if (!remarks.trim()) {
      message.error("Remarks are required");
      return;
    }

    confirm({
      title: "Are you sure you want to deny this request?",
      icon: <CloseCircleOutlined />,
      content: "This action will reject the requested changes.",
      okText: "Yes, Deny",
      cancelText: "Cancel",
      onOk: async () => {
        setSubmitting(true);
        try {
          // Only update approval status, do not patch requestedUrl
          await axiosInstance.patch(`/api/approval/update/${id}`, {
            remarks,
            status: "denied",
          });
          message.success("Request denied");
          window.location.reload();
        } catch (err) {
          message.error("Failed to deny request");
        } finally {
          setSubmitting(false);
        }
      },
    });
  };

  const createComparisonColumns = () => [
    {
      title: "Field",
      dataIndex: "field",
      key: "field",
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Current Value",
      dataIndex: "currentValue",
      key: "currentValue",
      render: (value, record) =>
        record.key === "products" && Array.isArray(record.currentValue) ? (
          <List
            size="small"
            bordered
            dataSource={record.currentValue}
            renderItem={(item, idx) => (
              <List.Item>
                <div>
                  <b>Product ID:</b> {item.productId} &nbsp;
                  <b>Raw:</b> {item.isRaw ? "Yes" : "No"} &nbsp;
                  <b>Value Added:</b> {item.isProcessed ? "Yes" : "No"} &nbsp;
                  <b>Details:</b> {item.value}
                </div>
              </List.Item>
            )}
          />
        ) : (
          <Text type={value === "N/A" ? "secondary" : undefined}>{value}</Text>
        ),
    },
    {
      title: "Requested Value",
      dataIndex: "requestedValue",
      key: "requestedValue",
      render: (value, record) =>
        record.key === "products" && Array.isArray(record.requestedValue) ? (
          <List
            size="small"
            bordered
            dataSource={record.requestedValue}
            renderItem={(item, idx) => (
              <List.Item>
                <div>
                  <b>Product ID:</b> {item.productId} &nbsp;
                  <b>Raw:</b> {item.isRaw ? "Yes" : "No"} &nbsp;
                  <b>Value Added:</b> {item.isProcessed ? "Yes" : "No"} &nbsp;
                  <b>Details:</b> {item.value}
                </div>
              </List.Item>
            )}
          />
        ) : (
          <Text mark>{value}</Text>
        ),
    },
  ];

  // Update createComparisonData to pass arrays for products
  const createComparisonData = () => {
    const requestData = approval?.requestData || {};
    const data = [];

    Object.entries(requestData).forEach(([key, value]) => {
      if (key === "products" && Array.isArray(value)) {
        // Current products (from currentData.businessProducts)
        const currentProducts = Array.isArray(currentData?.businessProducts)
          ? currentData.businessProducts
          : [];

        data.push({
          key,
          field: "Export Products",
          currentValue: currentProducts,
          requestedValue: value,
        });
      } else {
        data.push({
          key,
          field: key,
          currentValue:
            currentData?.[key] !== undefined
              ? Array.isArray(currentData[key])
                ? currentData[key].join(", ")
                : String(currentData[key])
              : "N/A",
          requestedValue: Array.isArray(value) ? value.join(", ") : String(value),
        });
      }
    });

    return data;
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "100px 0" }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>
          <Text>Loading approval request...</Text>
        </div>
      </div>
    );
  }

  if (!approval) {
    return (
      <div style={{ textAlign: "center", padding: "100px 0" }}>
        <Alert
          message="No approval request found"
          description="The requested approval could not be found or you don't have permission to view it."
          type="warning"
          showIcon
          action={
            <Button onClick={() => navigate("/user-management")}>
              Go Back
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      <Space style={{ marginBottom: 24 }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/user-management")}
        >
          Back to User Management
        </Button>
      </Space>

      <Card>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div>
            <Title level={2} style={{ marginBottom: 8 }}>
              Approval Request
            </Title>
            <Descriptions>
              <Descriptions.Item label="Request Name">
                {approval.requestName}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                {getStatusTag(approval.status)}
              </Descriptions.Item>
            </Descriptions>
          </div>

          <Divider />

          <div>
            <Title level={3}>Requested Changes</Title>
            {currentLoading ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <Spin />
                <div style={{ marginTop: 8 }}>
                  <Text>Loading current data...</Text>
                </div>
              </div>
            ) : (
              <Table
                columns={createComparisonColumns()}
                dataSource={createComparisonData()}
                pagination={false}
                size="middle"
                bordered
              />
            )}
          </div>

          <Divider />

          <Form form={form} layout="vertical">
            <Form.Item
              label="Remarks"
              name="remarks"
              rules={[{ required: false, message: "Remarks are required" }]}
            >
              <TextArea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Please provide your remarks for this approval decision..."
                rows={4}
                disabled={
                  submitting ||
                  approval.status !== "pending" 
                }
              />
            </Form.Item>

            {approval.status !== "approved" && approval.status !== "denied" && (
              <Form.Item>
                <Space>
                  <Button
                    type="primary"
                    icon={<CheckCircleOutlined />}
                    onClick={handleApprove}
                    loading={submitting}
                    disabled={!remarks.trim()}
                  >
                    Approve
                  </Button>
                  <Button
                    danger
                    icon={<CloseCircleOutlined />}
                    onClick={handleDeny}
                    loading={submitting}
                    disabled={!remarks.trim()}
                  >
                    Deny
                  </Button>
                </Space>
              </Form.Item>
            )}
          </Form>
        </Space>
      </Card>
    </div>
  );
};

export default ApprovalPage;
