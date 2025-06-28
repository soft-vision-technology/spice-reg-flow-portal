import React, { useState } from "react";
import { 
  Card, 
  List, 
  Button, 
  Typography, 
  Space, 
  Tag, 
  Empty, 
  Input, 
  Select, 
  Pagination,
  Divider,
  Badge,
  Row,
  Col
} from "antd";
import { 
  BellOutlined, 
  DeleteOutlined, 
  CheckOutlined, 
  SearchOutlined,
  FilterOutlined,
  InboxOutlined
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Registration Submitted",
      message: "A new spice supplier registration has been submitted for review. The application includes all required documents and is ready for verification.",
      time: "2 minutes ago",
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      read: false,
      type: "info",
      priority: "high"
    },
    {
      id: 2,
      title: "Document Verification Required",
      message: "Please verify the documents for ABC Spices Pvt Ltd. The business license and quality certificates need immediate attention.",
      time: "1 hour ago",
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      read: false,
      type: "warning",
      priority: "high"
    },
    {
      id: 3,
      title: "Registration Approved",
      message: "XYZ Trading Company registration has been approved successfully. All documentation has been verified and the company is now active in the system.",
      time: "3 hours ago",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      read: true,
      type: "success",
      priority: "medium"
    },
    {
      id: 4,
      title: "System Maintenance Scheduled",
      message: "Scheduled maintenance will occur on Sunday from 2:00 AM to 4:00 AM. The system will be temporarily unavailable during this time.",
      time: "1 day ago",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      read: true,
      type: "info",
      priority: "low"
    },
    {
      id: 5,
      title: "Payment Overdue",
      message: "Registration fee payment is overdue for DEF Exporters. Please follow up with the company for immediate payment.",
      time: "2 days ago",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      read: false,
      type: "error",
      priority: "high"
    },
    {
      id: 6,
      title: "Profile Updated",
      message: "GHI Spice Traders has updated their company profile information. Please review the changes for accuracy.",
      time: "3 days ago",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      read: true,
      type: "info",
      priority: "low"
    }
  ]);

  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const unreadCount = notifications.filter(n => !n.read).length;
  const totalCount = notifications.length;

  const getTypeColor = (type) => {
    switch (type) {
      case 'success': return 'success';
      case 'warning': return 'warning';
      case 'error': return 'error';
      default: return 'processing';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'blue';
      default: return 'default';
    }
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAsUnread = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: false }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setSelectedNotifications([]);
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
    setSelectedNotifications(prev => prev.filter(selectedId => selectedId !== id));
  };

  const deleteSelected = () => {
    setNotifications(prev => 
      prev.filter(notification => !selectedNotifications.includes(notification.id))
    );
    setSelectedNotifications([]);
  };

  const toggleSelection = (id) => {
    setSelectedNotifications(prev => 
      prev.includes(id) 
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  };

  const selectAll = () => {
    const filteredIds = filteredNotifications.map(n => n.id);
    setSelectedNotifications(filteredIds);
  };

  const clearSelection = () => {
    setSelectedNotifications([]);
  };

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || notification.type === filterType;
    const matchesStatus = filterStatus === "all" || 
                         (filterStatus === "read" && notification.read) ||
                         (filterStatus === "unread" && !notification.read);
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Paginate notifications
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedNotifications = filteredNotifications.slice(startIndex, startIndex + pageSize);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <BellOutlined className="text-2xl text-blue-600" />
              <Title level={2} className="mb-0">Notifications</Title>
            </div>
            <div className="flex items-center gap-4">
              <Badge count={unreadCount} className="mr-2">
                <InboxOutlined className="text-xl" />
              </Badge>
              <Text type="secondary">{totalCount} total notifications</Text>
            </div>
          </div>
          
          {/* Filters and Search */}
          <Card className="mb-4">
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} sm={12} md={8}>
                <Search
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  prefix={<SearchOutlined />}
                />
              </Col>
              <Col xs={12} sm={6} md={4}>
                <Select
                  value={filterType}
                  onChange={setFilterType}
                  style={{ width: '100%' }}
                  prefix={<FilterOutlined />}
                >
                  <Option value="all">All Types</Option>
                  <Option value="info">Info</Option>
                  <Option value="warning">Warning</Option>
                  <Option value="success">Success</Option>
                  <Option value="error">Error</Option>
                </Select>
              </Col>
              <Col xs={12} sm={6} md={4}>
                <Select
                  value={filterStatus}
                  onChange={setFilterStatus}
                  style={{ width: '100%' }}
                >
                  <Option value="all">All Status</Option>
                  <Option value="unread">Unread</Option>
                  <Option value="read">Read</Option>
                </Select>
              </Col>
              <Col xs={24} sm={24} md={8}>
                <Space wrap>
                  <Button 
                    onClick={markAllAsRead}
                    icon={<CheckOutlined />}
                    disabled={unreadCount === 0}
                  >
                    Mark All Read
                  </Button>
                  {selectedNotifications.length > 0 && (
                    <>
                      <Button 
                        onClick={deleteSelected}
                        icon={<DeleteOutlined />}
                        danger
                      >
                        Delete Selected ({selectedNotifications.length})
                      </Button>
                      <Button onClick={clearSelection}>
                        Clear Selection
                      </Button>
                    </>
                  )}
                  {selectedNotifications.length !== paginatedNotifications.length && paginatedNotifications.length > 0 && (
                    <Button onClick={selectAll}>
                      Select All
                    </Button>
                  )}
                </Space>
              </Col>
            </Row>
          </Card>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <Card>
            <Empty 
              description="No notifications found" 
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </Card>
        ) : (
          <>
            <List
              itemLayout="vertical"
              dataSource={paginatedNotifications}
              renderItem={(item) => (
                <Card 
                  className={`mb-4 transition-all duration-200 hover:shadow-md cursor-pointer ${
                    !item.read ? 'border-l-4 border-l-blue-500 bg-blue-50' : ''
                  } ${selectedNotifications.includes(item.id) ? 'ring-2 ring-blue-300' : ''}`}
                  onClick={() => toggleSelection(item.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <input
                          type="checkbox"
                          checked={selectedNotifications.includes(item.id)}
                          onChange={() => toggleSelection(item.id)}
                          className="cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <Title level={4} className={`mb-0 ${!item.read ? 'text-blue-700' : ''}`}>
                          {item.title}
                        </Title>
                        {!item.read && (
                          <Badge status="processing" />
                        )}
                        <Tag color={getTypeColor(item.type)} className="ml-auto">
                          {item.type}
                        </Tag>
                        <Tag color={getPriorityColor(item.priority)}>
                          {item.priority} priority
                        </Tag>
                      </div>
                      
                      <Text className="block mb-3 text-gray-700">
                        {item.message}
                      </Text>
                      
                      <Text type="secondary" className="text-sm">
                        {item.time} • {item.timestamp.toLocaleDateString()} at {item.timestamp.toLocaleTimeString()}
                      </Text>
                    </div>
                    
                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        size="small"
                        icon={item.read ? <BellOutlined /> : <CheckOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          item.read ? markAsUnread(item.id) : markAsRead(item.id);
                        }}
                      >
                        {item.read ? 'Mark Unread' : 'Mark Read'}
                      </Button>
                      <Button
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(item.id);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
            />
            
            {/* Pagination */}
            {filteredNotifications.length > pageSize && (
              <div className="flex justify-center mt-6">
                <Pagination
                  current={currentPage}
                  total={filteredNotifications.length}
                  pageSize={pageSize}
                  onChange={setCurrentPage}
                  showSizeChanger={false}
                  showQuickJumper
                  showTotal={(total, range) => 
                    `${range[0]}-${range[1]} of ${total} notifications`
                  }
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;