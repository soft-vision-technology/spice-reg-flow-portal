import { useState } from "react";
import {
  Drawer,
  Button,
  Card,
  Radio,
  Space,
  Typography,
  Divider,
  Select,
  Checkbox,
  Row,
  Col,
  Avatar,
  message,
  Modal
} from "antd";
import {
  PrinterOutlined,
  ExpandOutlined,
  CompressOutlined,
  CloseOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { AwardIcon } from "lucide-react";

const { Title, Text } = Typography;
const { Option } = Select;

const CertificatePrintDrawer = ({ 
  visible, 
  onClose, 
  users = [], 
  onSubmitForApproval 
}) => {
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [previewEnlarged, setPreviewEnlarged] = useState(false);

  const certificateTypes = [
    {
      id: 'system-registration',
      title: 'System Registration Completed Certification',
      description: 'Certificate for completed system registration',
      icon: <FileTextOutlined style={{ fontSize: '24px', color: '#e67324' }} />
    },
    {
      id: 'gmq-certification',
      title: 'GMQ Certification',
      description: 'Good Manufacturing Quality certification',
      icon: <AwardIcon style={{ fontSize: '24px', color: '#52c41a' }} />
    }
  ];

  // Sample certificate templates
  const getCertificateTemplate = (type) => {
    const templates = {
      'system-registration': {
        title: 'SYSTEM REGISTRATION CERTIFICATE',
        subtitle: 'Spice Registration System - Sri Lanka',
        content: `This is to certify that the business entity has successfully completed the registration process in the Spice Registration System and is authorized to operate within the spice industry ecosystem.`,
        backgroundColor: '#f8f9fa',
        borderColor: '#e67324'
      },
      'gmq-certification': {
        title: 'GOOD MANUFACTURING QUALITY CERTIFICATE',
        subtitle: 'Quality Assurance Division',
        content: `This certificate confirms that the manufacturing processes and quality standards meet the requirements set forth by the Sri Lankan Spice Quality Standards and are compliant with international best practices.`,
        backgroundColor: '#f6ffed',
        borderColor: '#52c41a'
      }
    };
    return templates[type] || templates['system-registration'];
  };

  const handleCertificateSelect = (certificateId) => {
    setSelectedCertificate(certificateId);
    setSelectedUsers([]);
    setSelectAll(false);
  };

  const handleUserSelect = (userId, checked) => {
    if (checked) {
      setSelectedUsers(prev => [...prev, userId]);
    } else {
      setSelectedUsers(prev => prev.filter(id => id !== userId));
      setSelectAll(false);
    }
  };

  const handleSelectAll = (checked) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedUsers(users.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSubmit = () => {
    if (!selectedCertificate) {
      message.error('Please select a certificate type');
      return;
    }
    if (selectedUsers.length === 0) {
      message.error('Please select at least one user');
      return;
    }

    const selectedCertType = certificateTypes.find(cert => cert.id === selectedCertificate);
    
    message.info({
      content: `Print request for ${selectedUsers.length} certificate(s) submitted for approval`,
      icon: <ClockCircleOutlined style={{ color: '#e67324' }} />
    });

    // Simulate approval process
    setTimeout(() => {
      message.success({
        content: 'Certificate print request approved successfully',
        icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />
      });
    }, 3000);

    if (onSubmitForApproval) {
      onSubmitForApproval({
        certificateType: selectedCertType,
        userIds: selectedUsers,
        users: users.filter(user => selectedUsers.includes(user.id))
      });
    }

    // Reset form
    setSelectedCertificate(null);
    setSelectedUsers([]);
    setSelectAll(false);
    onClose();
  };

  const handleClose = () => {
    setSelectedCertificate(null);
    setSelectedUsers([]);
    setSelectAll(false);
    setPreviewEnlarged(false);
    onClose();
  };

  const renderCertificatePreview = () => {
    if (!selectedCertificate) return null;

    const template = getCertificateTemplate(selectedCertificate);
    
    return (
      <Card className="mt-4">
        <div className="flex justify-between items-center mb-4">
          <Title level={5}>Certificate Preview</Title>
          <Space>
            <Button 
              icon={previewEnlarged ? <CompressOutlined /> : <ExpandOutlined />}
              onClick={() => setPreviewEnlarged(!previewEnlarged)}
              size="small"
            >
              {previewEnlarged ? 'Minimize' : 'Enlarge'}
            </Button>
          </Space>
        </div>
        
        <div 
          className={`border-2 rounded-lg p-6 text-center transition-all duration-300 ${
            previewEnlarged ? 'transform scale-110' : ''
          }`}
          style={{ 
            backgroundColor: template.backgroundColor,
            borderColor: template.borderColor,
            minHeight: previewEnlarged ? '400px' : '300px'
          }}
        >
          <div className="mb-4">
            <img 
              src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMzAiIGZpbGw9IiNlNjczMjQiLz4KPHN2ZyB4PSIxNSIgeT0iMTUiIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJ3aGl0ZSI+CjxwYXRoIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyem0tMiAxNWwtNS01IDEuNDEtMS40MUwxMCAxNC4xN2w3LjU5LTcuNTlMMTkgOGwtOSA5eiIvPgo8L3N2Zz4KPC9zdmc+" 
              alt="Certificate Seal" 
              className="mx-auto mb-4"
            />
          </div>
          
          <Title level={3} className="mb-2" style={{ color: template.borderColor }}>
            {template.title}
          </Title>
          
          <Text className="text-gray-600 block mb-4">
            {template.subtitle}
          </Text>
          
          <Divider />
          
          <div className="my-6">
            <Text className="text-gray-800 text-base leading-relaxed">
              {template.content}
            </Text>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <Text className="text-sm text-gray-500">
              Certificate issued on: {new Date().toLocaleDateString()}
            </Text>
          </div>
        </div>
      </Card>
    );
  };

  const renderUserSelection = () => {
    if (!selectedCertificate) return null;

    return (
      <Card className="mt-4">
        <div className="flex justify-between items-center mb-4">
          <Title level={5}>Select Recipients</Title>
          <Checkbox 
            checked={selectAll}
            onChange={(e) => handleSelectAll(e.target.checked)}
          >
            Select All ({users.length})
          </Checkbox>
        </div>

        <div className="max-h-60 overflow-y-auto">
          <Row gutter={[8, 8]}>
            {users.map(user => (
              <Col span={24} key={user.id}>
                <Card size="small" className="hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar 
                        size={32} 
                        icon={<UserOutlined />} 
                        style={{ backgroundColor: '#e67324' }}
                      />
                      <div>
                        <div className="font-medium text-sm">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.businessName}</div>
                      </div>
                    </div>
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onChange={(e) => handleUserSelect(user.id, e.target.checked)}
                    />
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {selectedUsers.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <Text className="text-blue-800">
              <strong>{selectedUsers.length}</strong> user{selectedUsers.length !== 1 ? 's' : ''} selected for certificate printing
            </Text>
          </div>
        )}
      </Card>
    );
  };

  return (
    <>
      <Drawer
        title={
          <div className="flex items-center space-x-2">
            <PrinterOutlined style={{ color: '#e67324' }} />
            <span>Print Certificates</span>
          </div>
        }
        width={600}
        onClose={handleClose}
        open={visible}
        closeIcon={<CloseOutlined />}
        footer={
          <div className="flex justify-between">
            <Button onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={handleSubmit}
              disabled={!selectedCertificate || selectedUsers.length === 0}
              style={{ backgroundColor: '#e67324', borderColor: '#e67324' }}
            >
              Submit for Approval
            </Button>
          </div>
        }
      >
        <div className="space-y-6">
          {/* Certificate Type Selection */}
          <Card>
            <Title level={5} className="mb-4">Select Certificate Type</Title>
            <Radio.Group 
              value={selectedCertificate} 
              onChange={(e) => handleCertificateSelect(e.target.value)}
              className="w-full"
            >
              <Space direction="vertical" className="w-full">
                {certificateTypes.map(cert => (
                  <Radio key={cert.id} value={cert.id} className="w-full">
                    <Card 
                      size="small" 
                      className={`ml-2 cursor-pointer transition-all ${
                        selectedCertificate === cert.id 
                          ? 'border-orange-300 shadow-sm' 
                          : 'hover:border-gray-300'
                      }`}
                      bodyStyle={{ padding: '12px' }}
                    >
                      <div className="flex items-center space-x-3">
                        {cert.icon}
                        <div>
                          <div className="font-medium text-sm">{cert.title}</div>
                          <div className="text-xs text-gray-500">{cert.description}</div>
                        </div>
                      </div>
                    </Card>
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
          </Card>

          {/* Certificate Preview */}
          {renderCertificatePreview()}

          {/* User Selection */}
          {renderUserSelection()}
        </div>
      </Drawer>

      {/* Enlarged Preview Modal */}
      <Modal
        open={previewEnlarged}
        onCancel={() => setPreviewEnlarged(false)}
        footer={null}
        width={800}
        title="Certificate Preview - Enlarged"
        centered
      >
        {selectedCertificate && (
          <div 
            className="border-2 rounded-lg p-8 text-center"
            style={{ 
              backgroundColor: getCertificateTemplate(selectedCertificate).backgroundColor,
              borderColor: getCertificateTemplate(selectedCertificate).borderColor,
              minHeight: '500px'
            }}
          >
            <div className="mb-6">
              <img 
                src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMzAiIGZpbGw9IiNlNjczMjQiLz4KPHN2ZyB4PSIxNSIgeT0iMTUiIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJ3aGl0ZSI+CjxwYXRoIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyem0tMiAxNWwtNS01IDEuNDEtMS40MUwxMCAxNC4xN2w3LjU5LTcuNTlMMTkgOGwtOSA5eiIvPgo8L3N2Zz4KPC9zdmc+" 
                alt="Certificate Seal" 
                className="mx-auto mb-6"
              />
            </div>
            
            <Title level={2} className="mb-4" style={{ color: getCertificateTemplate(selectedCertificate).borderColor }}>
              {getCertificateTemplate(selectedCertificate).title}
            </Title>
            
            <Title level={4} className="text-gray-600 mb-6">
              {getCertificateTemplate(selectedCertificate).subtitle}
            </Title>
            
            <Divider />
            
            <div className="my-8">
              <Text className="text-gray-800 text-lg leading-relaxed">
                {getCertificateTemplate(selectedCertificate).content}
              </Text>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <Text className="text-gray-500">
                Certificate issued on: {new Date().toLocaleDateString()}
              </Text>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default CertificatePrintDrawer;