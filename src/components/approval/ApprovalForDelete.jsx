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
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import axiosInstance from "../../api/axiosInstance";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { confirm } = Modal;

const ApprovalForDelete = ({ approval, currentData, currentLoading, approvalId, onSuccess }) => {
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
      title: "Are you sure you want to approve this delete request?",
      icon: <DeleteOutlined />,
      content: (
        <div>
          <Alert
            message="WARNING: This action is irreversible!"
            description="Approving this request will permanently delete the record and cannot be undone."
            type="warning"
            showIcon
            style={{ marginBottom: 16 }}
          />
          <Text>Please confirm that you want to proceed with the deletion.</Text>
        </div>
      ),
      okText: "Yes, Approve Delete",
      cancelText: "Cancel",
      okType: "danger",
      onOk: async () => {
        setSubmitting(true);
        try {
          // 1. Delete the record using DELETE method
          await axiosInstance.delete(`/api/${approval.requestedUrl}`);
          // 2. Update approval status
          await axiosInstance.patch(`/api/approval/update/${approvalId}`, {
            remarks,
            status: "approved",
          });
          message.success("Delete request approved successfully");
          onSuccess();
        } catch (err) {
          message.error("Failed to approve delete request");
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
      title: "Are you sure you want to deny this delete request?",
      icon: <CloseCircleOutlined />,
      content: "This action will reject the deletion request.",
      okText: "Yes, Deny",
      cancelText: "Cancel",
      onOk: async () => {
        setSubmitting(true);
        try {
          // Only update approval status, do not delete the record
          await axiosInstance.patch(`/api/approval/update/${approvalId}`, {
            remarks,
            status: "denied",
          });
          message.success("Delete request denied");
          window.location.reload();
        } catch (err) {
          message.error("Failed to deny delete request");
        } finally {
          setSubmitting(false);
        }
      },
    });
  };

  const createRecordColumns = () => [
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

  const createRecordData = () => {
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
          <Tag color="red">Delete Request</Tag>
        </Descriptions.Item>
      </Descriptions>

      <Alert
        message="Delete Request"
        description="This request is asking for permission to permanently delete a record. Please review the record details carefully before making a decision."
        type="warning"
        showIcon
      />

      <Divider />

      <div>
        <Title level={3}>Record to be Deleted</Title>
        {currentLoading ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <Spin />
            <div style={{ marginTop: 8 }}>
              <Text>Loading record data...</Text>
            </div>
          </div>
        ) : currentData ? (
          <Table
            columns={createRecordColumns()}
            dataSource={createRecordData()}
            pagination={false}
            size="middle"
            bordered
          />
        ) : (
          <Alert
            message="Record not found"
            description="The record to be deleted could not be found. It may have already been deleted or moved."
            type="info"
            showIcon
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
            placeholder="Please provide your remarks for this delete approval decision..."
            rows={4}
            disabled={submitting}
          />
        </Form.Item>

        {approval?.status !== "approved" && (
          <Form.Item>
            <Space>
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                onClick={handleApprove}
                loading={submitting}
                disabled={!remarks.trim()}
              >
                Approve Delete
              </Button>
              <Button
                icon={<CloseCircleOutlined />}
                onClick={handleDeny}
                loading={submitting}
                disabled={!remarks.trim()}
              >
                Deny Delete
              </Button>
            </Space>
          </Form.Item>
        )}
      </Form>
    </Space>
  );
};

export default ApprovalForDelete;