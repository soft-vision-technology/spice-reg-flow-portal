import React, { useEffect, useState, useMemo } from "react";
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
  Badge,
  Tooltip,
  Row,
  Col,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  WarningOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { confirm } = Modal;

const ApprovalForDelete = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [approval, setApproval] = useState(null);
  const [currentData, setCurrentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingRecord, setLoadingRecord] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [form] = Form.useForm();

  // Enhanced error handling with retry mechanism
  const [retryCount, setRetryCount] = useState(0);
  const [hasError, setHasError] = useState(false);

  console.log("delete", id);
  console.log("deleteapproval", approval);

  useEffect(() => {
    if (!id) return;
    fetchApprovalData();
  }, [id, retryCount]);

  const fetchApprovalData = async () => {
    try {
      setLoading(true);
      setHasError(false);
      
      const { data } = await axiosInstance.get(`/api/approval/get/${id}`);
      setApproval(data?.newRequest);

      console.log("john",data?.newRequest);
      
      // Fetch the actual record data that's being requested for deletion
      if (data?.newRequest?.requestedUrl) {
        setLoadingRecord(true);
        try {
          const recordResponse = await axiosInstance.get(`/api/${data.newRequest.requestedUrl}`);
          setCurrentData(recordResponse.data);
        } catch (recordError) {
          console.error("Failed to load record data:", recordError);
          setCurrentData(null);
          message.warning("Record data could not be loaded. The record may have already been deleted.");
        } finally {
          setLoadingRecord(false);
        }
      }
    } catch (e) {
      console.error("Failed to load approval request:", e);
      setHasError(true);
      message.error("Failed to load approval request");
    } finally {
      setLoading(false);
    }
  };

  const onSuccess = () => {
    message.success("Operation completed successfully", 3);
    navigate("/approvals");
  };

  // Enhanced status configuration with more visual feedback
  const getStatusConfig = (status) => {
    const configs = {
      pending: { 
        color: "orange", 
        icon: <ClockCircleOutlined />, 
        text: "Pending Review",
        description: "Awaiting approval decision"
      },
      approved: { 
        color: "green", 
        icon: <CheckCircleOutlined />, 
        text: "Approved",
        description: "Request has been approved"
      },
      denied: { 
        color: "red", 
        icon: <CloseCircleOutlined />, 
        text: "Denied",
        description: "Request has been denied"
      },
    };
    return configs[status] || configs.pending;
  };

  const getStatusTag = (status) => {
    const config = getStatusConfig(status);
    return (
      <Tooltip title={config.description}>
        <Tag color={config.color} icon={config.icon} style={{ fontSize: '14px', padding: '4px 8px' }}>
          {config.text}
        </Tag>
      </Tooltip>
    );
  };

  // Enhanced confirmation modal with better UX
  const handleApprove = async () => {
    if (!remarks.trim()) {
      message.error("Remarks are required to proceed");
      form.scrollToField('remarks');
      return;
    }

    confirm({
      title: "Confirm Delete Approval",
      icon: <WarningOutlined style={{ color: '#ff4d4f' }} />,
      width: 520,
      content: (
        <div style={{ marginTop: 16 }}>
          <Alert
            message="⚠️ IRREVERSIBLE ACTION"
            description="This will permanently delete the record and cannot be undone. Please ensure you have reviewed all details carefully."
            type="warning"
            showIcon
            style={{ marginBottom: 16 }}
          />
          <div style={{ padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '6px' }}>
            <Text strong>Your remarks:</Text>
            <Paragraph style={{ marginTop: 8, marginBottom: 0 }}>{remarks}</Paragraph>
          </div>
        </div>
      ),
      okText: "Yes, Approve Deletion",
      cancelText: "Cancel",
      okType: "danger",
      okButtonProps: { size: 'large' },
      cancelButtonProps: { size: 'large' },
      onOk: async () => {
        setSubmitting(true);
        try {
          await axiosInstance.delete(`/api/${approval.requestedUrl}`);
          await axiosInstance.patch(`/api/approval/update/${id}`, {
            remarks,
            status: "approved",
          });
          message.success("Delete request approved and record deleted successfully");
          onSuccess();
        } catch (err) {
          console.error("Approval error:", err);
          message.error("Failed to approve delete request. Please try again.");
        } finally {
          setSubmitting(false);
        }
      },
    });
  };

  const handleDeny = async () => {
    if (!remarks.trim()) {
      message.error("Remarks are required to proceed");
      form.scrollToField('remarks');
      return;
    }

    confirm({
      title: "Confirm Delete Denial",
      icon: <InfoCircleOutlined style={{ color: '#1890ff' }} />,
      width: 480,
      content: (
        <div style={{ marginTop: 16 }}>
          <Text>This will reject the deletion request and preserve the record.</Text>
          <div style={{ padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '6px', marginTop: 12 }}>
            <Text strong>Your remarks:</Text>
            <Paragraph style={{ marginTop: 8, marginBottom: 0 }}>{remarks}</Paragraph>
          </div>
        </div>
      ),
      okText: "Yes, Deny Request",
      cancelText: "Cancel",
      okButtonProps: { size: 'large' },
      cancelButtonProps: { size: 'large' },
      onOk: async () => {
        setSubmitting(true);
        try {
          await axiosInstance.patch(`/api/approval/update/${id}`, {
            remarks,
            status: "denied",
          });
          message.success("Delete request denied successfully");
          window.location.reload();
        } catch (err) {
          console.error("Denial error:", err);
          message.error("Failed to deny delete request. Please try again.");
        } finally {
          setSubmitting(false);
        }
      },
    });
  };

  // Enhanced table columns with better formatting
  const createRecordColumns = () => [
    {
      title: "Field",
      dataIndex: "field",
      key: "field",
      width: '30%',
      render: (text) => (
        <Text strong style={{ color: '#1890ff' }}>
          {text.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
        </Text>
      ),
    },
    {
      title: "Current Value",
      dataIndex: "value",
      key: "value",
      render: (value) => (
        <div style={{ wordBreak: 'break-word' }}>
          {value === "N/A" ? (
            <Text type="secondary" italic>No data available</Text>
          ) : (
            <Text>{value}</Text>
          )}
        </div>
      ),
    },
  ];

  const createRecordData = useMemo(() => {
    if (!currentData) return [];
    
    return Object.entries(currentData)
      .filter(([key, value]) => !key.startsWith('_') && key !== 'id') // Filter out internal fields
      .map(([key, value]) => ({
        key,
        field: key,
        value: value !== undefined && value !== null ? String(value) : "N/A",
      }));
  }, [currentData]);

  // Enhanced loading states
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>
          <Text type="secondary">Loading approval details...</Text>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <Alert
        message="Failed to Load Approval"
        description="There was an error loading the approval request. Please try again."
        type="error"
        showIcon
        action={
          <Button size="small" onClick={() => setRetryCount(prev => prev + 1)}>
            Retry
          </Button>
        }
      />
    );
  }

  if (!approval) {
    return (
      <Alert
        message="Approval Not Found"
        description="The requested approval could not be found. It may have been moved or deleted."
        type="warning"
        showIcon
      />
    );
  }

  const isProcessed = approval.status === "approved" || approval.status === "denied";

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px' }}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        
        {/* Header Section */}
        <Card>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Request Name">
                  <Text strong style={{ fontSize: '16px' }}>{approval.requestName}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                  {getStatusTag(approval.status)}
                </Descriptions.Item>
                <Descriptions.Item label="Request Type">
                  <Tag color="red" icon={<DeleteOutlined />}>Delete Request</Tag>
                </Descriptions.Item>
              </Descriptions>
            </Col>
            <Col xs={24} md={12}>
              <div style={{ textAlign: 'right' }}>
                <Badge 
                  status={approval.status === 'pending' ? 'processing' : 
                         approval.status === 'approved' ? 'success' : 'error'} 
                  text={`Request ${approval.status || 'pending'}`}
                  style={{ fontSize: '14px' }}
                />
              </div>
            </Col>
          </Row>
        </Card>

        {/* Warning Alert */}
        <Alert
          message="⚠️ Deletion Request Review"
          description="This request requires your approval to permanently delete a record. Once approved, this action cannot be undone. Please review all details carefully."
          type="warning"
          showIcon
          icon={<ExclamationCircleOutlined />}
          style={{ borderRadius: '8px' }}
        />

        <Divider style={{ margin: '24px 0' }} />

        {/* Record Preview Section */}
        <Card 
          title={
            <Space>
              <EyeOutlined />
              <span>Record to be Deleted</span>
              {!previewMode && (
                <Button 
                  type="link" 
                  size="small" 
                  onClick={() => setPreviewMode(true)}
                  style={{ padding: 0 }}
                >
                  View Details
                </Button>
              )}
            </Space>
          }
          extra={
            currentData && (
              <Text type="secondary">
                {Object.keys(currentData).length} fields
              </Text>
            )
          }
        >
          {loadingRecord ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <Spin />
              <div style={{ marginTop: 12 }}>
                <Text type="secondary">Loading record data...</Text>
              </div>
            </div>
          ) : currentData ? (
            <Table
              columns={createRecordColumns()}
              dataSource={createRecordData}
              pagination={false}
              size="small"
              bordered
              style={{ marginTop: 16 }}
              scroll={{ x: 400 }}
            />
          ) : (
            <Alert
              message="Record Not Found"
              description="The record to be deleted could not be found. It may have already been deleted or moved."
              type="info"
              showIcon
              style={{ borderRadius: '6px' }}
            />
          )}
        </Card>

        <Divider style={{ margin: '24px 0' }} />

        {/* Decision Section */}
        <Card title={<Space><UserOutlined />Decision & Remarks</Space>}>
          <Form form={form} layout="vertical">
            <Form.Item
              label={
                <Space>
                  <span>Remarks</span>
                  <Tooltip title="Provide detailed reasoning for your decision">
                    <InfoCircleOutlined style={{ color: '#1890ff' }} />
                  </Tooltip>
                </Space>
              }
              name="remarks"
              rules={[
                { required: true, message: "Remarks are required for this decision" },
                { min: 10, message: "Please provide at least 10 characters of explanation" },
              ]}
            >
              <TextArea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Please provide detailed reasoning for your approval/denial decision. This will be logged for audit purposes..."
                rows={4}
                disabled={submitting || isProcessed}
                style={{ fontSize: '14px' }}
                showCount
                maxLength={500}
              />
            </Form.Item>

            {!isProcessed && (
              <Form.Item>
                <Space size="middle">
                  <Button
                    type="primary"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={handleApprove}
                    loading={submitting}
                    disabled={!remarks.trim() || submitting}
                    size="large"
                  >
                    Approve Delete
                  </Button>
                  <Button
                    icon={<CloseCircleOutlined />}
                    onClick={handleDeny}
                    loading={submitting}
                    disabled={!remarks.trim() || submitting}
                    size="large"
                  >
                    Deny Request
                  </Button>
                </Space>
              </Form.Item>
            )}

            {isProcessed && (
              <Alert
                message={`Request ${approval.status === 'approved' ? 'Approved' : 'Denied'}`}
                description={`This request has already been ${approval.status}. No further action is required.`}
                type={approval.status === 'approved' ? 'success' : 'info'}
                showIcon
                style={{ marginTop: 16 }}
              />
            )}
          </Form>
        </Card>
      </Space>
    </div>
  );
};

export default ApprovalForDelete;