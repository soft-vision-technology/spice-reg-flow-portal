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
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import axiosInstance from "../../api/axiosInstance";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { confirm } = Modal;

const ApprovalForEdit = ({ approval, currentData, currentLoading, approvalId, onSuccess }) => {
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
      title: "Are you sure you want to approve this edit request?",
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
          await axiosInstance.patch(`/api/approval/update/${approvalId}`, {
            remarks,
            status: "approved",
          });
          message.success("Edit request approved successfully");
          onSuccess();
        } catch (err) {
          message.error("Failed to approve edit request");
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
      title: "Are you sure you want to deny this edit request?",
      icon: <CloseCircleOutlined />,
      content: "This action will reject the requested changes.",
      okText: "Yes, Deny",
      cancelText: "Cancel",
      onOk: async () => {
        setSubmitting(true);
        try {
          // Only update approval status, do not patch requestedUrl
          await axiosInstance.patch(`/api/approval/update/${approvalId}`, {
            remarks,
            status: "denied",
          });
          message.success("Edit request denied");
          window.location.reload();
        } catch (err) {
          message.error("Failed to deny edit request");
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
      render: (value) => (
        <Text type={value === "N/A" ? "secondary" : undefined}>{value}</Text>
      ),
    },
    {
      title: "Requested Value",
      dataIndex: "requestedValue",
      key: "requestedValue",
      render: (value) => <Text mark>{value}</Text>,
    },
  ];

  const createComparisonData = () => {
    const requestData = approval?.requestData || {};
    return Object.entries(requestData).map(([key, value]) => ({
      key,
      field: key,
      currentValue:
        currentData?.[key] !== undefined ? String(currentData[key]) : "N/A",
      requestedValue: String(value),
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
          <Tag color="blue">Edit Request</Tag>
        </Descriptions.Item>
      </Descriptions>

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
          rules={[
            { required: false, message: "Remarks are required" },
            { min: 10, message: "Remarks must be at least 10 characters" },
          ]}
        >
          <TextArea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Please provide your remarks for this edit approval decision..."
            rows={4}
            disabled={submitting}
          />
        </Form.Item>

        {approval?.status !== "approved" && (
          <Form.Item>
            <Space>
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={handleApprove}
                loading={submitting}
                disabled={!remarks.trim()}
              >
                Approve Edit
              </Button>
              <Button
                danger
                icon={<CloseCircleOutlined />}
                onClick={handleDeny}
                loading={submitting}
                disabled={!remarks.trim()}
              >
                Deny Edit
              </Button>
            </Space>
          </Form.Item>
        )}
      </Form>
    </Space>
  );
};

export default ApprovalForEdit;