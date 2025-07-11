import React, { useState } from "react";
import {
  Typography,
  Table,
  Button,
  Input,
  Space,
  Spin,
  Tag,
  Divider,
  Form,
  message,
  Modal,
  Descriptions,
  Alert,
  Card,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  SafetyCertificateOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import axiosInstance from "../../api/axiosInstance";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { confirm } = Modal;

const ApprovalForCertificate = ({ approval, currentData, currentLoading, approvalId, onSuccess }) => {
  const [remarks, setRemarks] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

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
      title: "Are you sure you want to approve this certificate request?",
      icon: <SafetyCertificateOutlined />,
      content:
        "This action will approve the certificate generation/issuance request.",
      okText: "Yes, Approve",
      cancelText: "Cancel",
      onOk: async () => {
        setSubmitting(true);
        try {
          // 1. Process the certificate request (could be generating, issuing, etc.)
          await axiosInstance.post(
            `/api/${approval.requestedUrl}`,
            approval.requestData
          );
          // 2. Update approval status
          await axiosInstance.patch(`/api/approval/update/${approvalId}`, {
            remarks,
            status: "approved",
          });
          message.success("Certificate request approved successfully");
          onSuccess();
        } catch (err) {
          message.error("Failed to approve certificate request");
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
      title: "Are you sure you want to deny this certificate request?",
      icon: <CloseCircleOutlined />,
      content: "This action will reject the certificate request.",
      okText: "Yes, Deny",
      cancelText: "Cancel",
      onOk: async () => {
        setSubmitting(true);
        try {
          // Only update approval status, do not process certificate
          await axiosInstance.patch(`/api/approval/update/${approvalId}`, {
            remarks,
            status: "denied",
          });
          message.success("Certificate request denied");
          window.location.reload();
        } catch (err) {
          message.error("Failed to deny certificate request");
        } finally {
          setSubmitting(false);
        }
      },
    });
  };

  const createRequestColumns = () => [
    {
      title: "Field",
      dataIndex: "field",
      key: "field",
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      render: (value) => (
        <Text type={value === "N/A" ? "secondary" : undefined}>{value}</Text>
      ),
    },
  ];

  const createRequestData = () => {
    const requestData = approval?.requestData || {};
    return Object.entries(requestData).map(([key, value]) => ({
      key,
      field: key,
      value: value !== undefined ? String(value) : "N/A",
    }));
  };

  const createCurrentDataColumns = () => [
    {
      title: "Field",
      dataIndex: "field",
      key: "field",
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Current Value",
      dataIndex: "value",
      key: "value",
      render: (value) => (
        <Text type={value === "N/A" ? "secondary" : undefined}>{value}</Text>
      ),
    },
  ];

  const createCurrentDataTable = () => {
    if (!currentData) return [];
    
    return Object.entries(currentData).map(([key, value]) => ({
      key,
      field: key,
      value: value !== undefined ? String(value) : "N/A",
    }));
  };

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Descriptions>
        <Descriptions.Item label="Request Name">
          {approval.requestName}
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          {getStatusTag(approval.status)}
        </Descriptions.Item>
        <Descriptions.Item label="Type">
          <Tag color="purple">Certificate Request</Tag>
        </Descriptions.Item>
      </Descriptions>

      <Alert
        message="Certificate Request"
        description="This request is asking for permission to generate or issue a certificate. Please review the request details carefully."
        type="info"
        showIcon
        icon={<SafetyCertificateOutlined />}
      />

      <Divider />

      <div>
        <Title level={3}>Certificate Request Details</Title>
        <Table
          columns={createRequestColumns()}
          dataSource={createRequestData()}
          pagination={false}
          size="middle"
          bordered
        />
      </div>

      {currentData && (
        <>
          <Divider />
          <div>
            <Title level={3}>Related Record Information</Title>
            {currentLoading ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <Spin />
                <div style={{ marginTop: 8 }}>
                  <Text>Loading related data...</Text>
                </div>
              </div>
            ) : (
              <Table
                columns={createCurrentDataColumns()}
                dataSource={createCurrentDataTable()}
                pagination={false}
                size="middle"
                bordered
              />
            )}
          </div>
        </>
      )}

      <Divider />

      <Form form={form} layout="vertical">
        <Form.Item
          label="Remarks"
          name="remarks"
          rules={[
            { required: false, message: "Remarks are required" },
            { min: 10, message: "Remarks must be at least 10 characters" },
          ]}
        >
          <TextArea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Please provide your remarks for this certificate approval decision..."
            rows={4}
            disabled={submitting}
          />
        </Form.Item>

        {approval?.status !== "approved" && (
          <Form.Item>
            <Space>
              <Button
                type="primary"
                icon={<SafetyCertificateOutlined />}
                onClick={handleApprove}
                loading={submitting}
                disabled={!remarks.trim()}
              >
                Approve Certificate
              </Button>
              <Button
                danger
                icon={<CloseCircleOutlined />}
                onClick={handleDeny}
                loading={submitting}
                disabled={!remarks.trim()}
              >
                Deny Certificate
              </Button>
            </Space>
          </Form.Item>
        )}
      </Form>
    </Space>
  );
};

export default ApprovalForCertificate;