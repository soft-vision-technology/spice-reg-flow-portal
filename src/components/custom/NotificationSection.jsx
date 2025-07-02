import { useState, useEffect } from "react";
import { Badge, Dropdown, Button, Typography, Empty } from "antd";
import { BellOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
  fetchNotifications,
} from "../../store/slices/notificationSlice";

const { Text } = Typography;

const NotificationSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const notifications = useSelector((state) => state.notifications.items);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id) => {
    dispatch(markAsRead(id));
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  const handleDeleteNotification = (id) => {
    dispatch(deleteNotification(id));
  };

  const handleClearAllNotifications = () => {
    dispatch(clearAllNotifications());
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'success': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'error': return '#ef4444';
      default: return '#3b82f6';
    }
  };

  const notificationItems = (
    <div className="overflow-hidden flex flex-col bg-white rounded-lg shadow-lg border" style={{ width: 420 }}>
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <Text strong className="text-base text-gray-900">Notifications</Text>
        {notifications.length > 0 && (
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button
                type="text"
                size="small"
                onClick={handleMarkAllAsRead}
                className="text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 h-auto"
              >
                Mark all read
              </Button>
            )}
            <Button
              type="text"
              size="small"
              onClick={handleClearAllNotifications}
              icon={<DeleteOutlined />}
              className="text-xs text-gray-500 hover:text-red-600 hover:bg-red-50 px-2 py-1 h-auto"
            >
              Clear all
            </Button>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto" style={{ maxHeight: 480 }}>
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-6">
            <Empty
              description="No notifications"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </div>
        ) : (
          <div className="py-2">
            {notifications.map((item, index) => (
              <div
                key={item.id}
                className={`group relative px-5 py-4 cursor-pointer transition-all duration-200 border-l-3 hover:bg-gray-50 ${
                  !item.read 
                    ? 'bg-blue-25 border-l-blue-500' 
                    : 'border-l-transparent hover:border-l-gray-200'
                } ${index !== notifications.length - 1 ? 'border-b border-gray-100' : ''}`}
                style={{ 
                  borderLeftColor: !item.read ? getTypeColor(item.type) : 'transparent',
                }}
                onClick={(e) => {
                  if (e.target.closest('.delete-btn')) return;
                  handleMarkAsRead(item.id);
                }}
              >
                <Button
                  type="text"
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteNotification(item.id);
                  }}
                  className="delete-btn absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 w-6 h-6 flex items-center justify-center"
                />

                {/* Content */}
                <div className="pr-8">
                  {/* Header Row */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 flex-1">
                      {/* Unread Indicator Dot */}
                      {!item.read && (
                        <div 
                          className="w-2 h-2 rounded-full flex-shrink-0 mt-1"
                          style={{ backgroundColor: getTypeColor(item.type) }}
                        />
                      )}
                      
                      {/* Title */}
                      <Text 
                        strong 
                        className={`text-sm leading-5 ${
                          !item.read ? 'text-gray-900' : 'text-gray-700'
                        }`}
                      >
                        {item.title}
                      </Text>
                    </div>
                  </div>
                  
                  {/* Message */}
                  <div className={`${!item.read ? 'ml-4' : ''} mb-2`}>
                    <Text 
                      className={`text-sm leading-5 block ${
                        !item.read ? 'text-gray-700' : 'text-gray-600'
                      }`}
                    >
                      {item.message}
                    </Text>
                  </div>

                  {/* Timestamp */}
                  <div className={`${!item.read ? 'ml-4' : ''}`}>
                    <Text className="text-xs text-gray-500">
                      {item.time}
                    </Text>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50">
          <Button
            type="link"
            block
            className="text-sm text-blue-600 hover:text-blue-800 p-0 h-auto"
            onClick={() => {
              setDropdownOpen(false);
              navigate('/notifications');
            }}
          >
            View All Notifications
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <Dropdown
      dropdownRender={() => notificationItems}
      trigger={['click']}
      placement="bottomRight"
      overlayClassName="notification-dropdown"
      open={dropdownOpen}
      onOpenChange={setDropdownOpen}
    >
      <div className="cursor-pointer px-3 py-2 flex items-center hover:bg-gray-100 rounded-lg transition-colors">
        <Badge count={notifications.filter(n => !n.read).length} size="small" offset={[8, -8]}>
          <BellOutlined className="text-xl text-gray-600 hover:text-gray-800 transition-colors" />
        </Badge>
      </div>
    </Dropdown>
  );
};

export default NotificationSection;