import React, { useState, useEffect } from "react";
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
  Col,
} from "antd";
import {
  BellOutlined,
  DeleteOutlined,
  CheckOutlined,
  SearchOutlined,
  FilterOutlined,
  InboxOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchNotifications,
  markAsUnread,
  markNotificationAsRead,
  markAllNotificationAsRead,
  fetchReadNotifications,
} from "../store/slices/notificationSlice";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const NotificationsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const notifications = useSelector((state) => state.notifications.items);
  const loading = useSelector((state) => state.notifications.loading);
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  useEffect(() => {
    // Fetch notifications based on filterStatus
    if (filterStatus === "read") {
      dispatch(fetchReadNotifications());
    } else {
      dispatch(fetchNotifications());
    }
  }, [dispatch, filterStatus]);

  // Helper to format time (e.g., "2 minutes ago")
  function formatTime(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return `${diff} seconds ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  }

  const unreadCount = notifications.filter((n) => !n.read).length;
  const totalCount = notifications.length;

  const handleMarkAsRead = (id) => {
    dispatch(markNotificationAsRead(id)).then(() => {
      dispatch(fetchNotifications());
    });
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllNotificationAsRead()).then(() => {
      dispatch(fetchNotifications());
    });
  };

  const markAsUnreadHandler = (id) => {
    dispatch(markAsUnread(id));
  };

  const toggleSelection = (id) => {
    setSelectedNotifications((prev) =>
      prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id]
    );
  };

  const selectAll = () => {
    const filteredIds = filteredNotifications.map((n) => n.id);
    setSelectedNotifications(filteredIds);
  };

  const getNotificationTypeTag = (type) => {
    if (type.toLowerCase().includes("approval")) {
      return { color: "orange", text: "Approval" };
    }
    if (
      type.toLowerCase().includes("entrepreneur") ||
      type.toLowerCase().includes("user")
    ) {
      return { color: "green", text: "User Action" };
    }
    if (type.toLowerCase().includes("certificate")) {
      return { color: "purple", text: "Certificate" };
    }
    if (type.toLowerCase().includes("delete")) {
      return { color: "red", text: "Delete" };
    }
    return { color: "blue", text: "Info" };
  };

  const handleNotificationClick = (notification) => {
    // Mark as read if not already read
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }

    // Navigate to sendUrl
    if (notification.sendUrl) {
      // Extract the path from the full URL
      const url = new URL(notification.sendUrl);
      const path = url.pathname;
      window.location.replace(path);
    }
  };

  // Filter notifications
  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesType =
      filterType === "all" ||
      notification.type.toLowerCase() === filterType.toLowerCase();

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "read" && notification.read) ||
      (filterStatus === "unread" && !notification.read);

    return matchesSearch && matchesType && matchesStatus;
  });

  // Paginate notifications
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedNotifications = filteredNotifications.slice(
    startIndex,
    startIndex + pageSize
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
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
                  style={{ width: "100%" }}
                  prefix={<FilterOutlined />}
                >
                  <Option value="all">All Types</Option>
                  <Option value="approval">Approval</Option>
                  <Option value="information">Information</Option>
                </Select>
              </Col>
              <Col xs={12} sm={6} md={4}>
                <Select
                  value={filterStatus}
                  onChange={setFilterStatus}
                  style={{ width: "100%" }}
                >
                  <Option value="all">All Status</Option>
                  <Option value="unread">Unread</Option>
                  <Option value="read">Read</Option>
                </Select>
              </Col>
              <Col xs={24} sm={24} md={8}>
                <Space wrap>
                  <Button
                    onClick={handleMarkAllAsRead}
                    icon={<CheckOutlined />}
                    disabled={unreadCount === 0}
                  >
                    Mark All Read
                  </Button>
                  {selectedNotifications.length !==
                    paginatedNotifications.length &&
                    paginatedNotifications.length > 0 && (
                      <Button onClick={selectAll}>Select All</Button>
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
              renderItem={(item) => {
                const typeTag = getNotificationTypeTag(item.type);
                return (
                  <Card
                    className={`mb-4 transition-all duration-200 hover:shadow-md cursor-pointer ${
                      !item.read
                        ? "border-l-4 border-l-blue-500 bg-blue-50"
                        : ""
                    } ${
                      selectedNotifications.includes(item.id)
                        ? "ring-2 ring-blue-300"
                        : ""
                    }`}
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
                          <Title
                            level={4}
                            className={`mb-0 ${
                              !item.read ? "text-blue-700" : ""
                            }`}
                          >
                            {item.title}
                          </Title>
                          {!item.read && <Badge status="processing" />}
                          <Tag color={typeTag.color} className="ml-auto">
                            {typeTag.text}
                          </Tag>
                          <Tag
                            color={item.priority === "high" ? "red" : "blue"}
                          >
                            {item.priority} priority
                          </Tag>
                        </div>

                        <Text className="block mb-3 text-gray-700">
                          {item.message}
                        </Text>

                        <Text type="secondary" className="text-sm">
                          {item.time} • {item.timestamp.toLocaleDateString()} at{" "}
                          {item.timestamp.toLocaleTimeString()}
                        </Text>
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        <Button
                          size="small"
                          icon={<EyeOutlined />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNotificationClick(item);
                          }}
                        >
                          View
                        </Button>
                        <Button
                          size="small"
                          icon={
                            item.read ? <BellOutlined /> : <CheckOutlined />
                          }
                          onClick={(e) => {
                            e.stopPropagation();
                            item.read
                              ? markAsUnreadHandler(item.id)
                              : handleMarkAsRead(item.id);
                          }}
                        >
                          {item.read ? "Mark Unread" : "Mark Read"}
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              }}
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
