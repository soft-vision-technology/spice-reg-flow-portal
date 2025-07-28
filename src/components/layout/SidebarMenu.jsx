import { Menu, Badge } from "antd";
import {
  FileDoneOutlined,
  TeamOutlined,
  FormOutlined,
  UserAddOutlined,
  NotificationOutlined,
  HomeOutlined,
  SettingOutlined,
  CodeFilled,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import { useFormContext } from "../../contexts/FormContext";
import {
  selectAuthUser,
  selectAuthInitialized,
  selectIsAdmin,
  initializeAuth,
} from "../../store/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

const SidebarMenu = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { role, status } = useFormContext();

  // Use optimized selectors
  const user = useSelector(selectAuthUser);
  const isInitialized = useSelector(selectAuthInitialized);
  const isAdmin = useSelector(selectIsAdmin);

  // Initialize auth on component mount
  useEffect(() => {
    if (!isInitialized) {
      dispatch(initializeAuth());
    }
  }, [dispatch, isInitialized]);

  // Show loading state while initializing
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-spice-500"></div>
      </div>
    );
  }

  // Don't render if no user (should not happen after login)
  if (!user) {
    return null;
  }

  const hasSelectedRole = role !== "";
  const hasSelectedStatus = status !== "";

  return (
    <Menu
      theme="light"
      mode="inline"
      selectedKeys={[location.pathname]}
      className="bg-sidebar border-r-0"
      style={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <Menu.Item key="/dashboard" icon={<HomeOutlined />}>
        <Link to="/dashboard">Dashboard</Link>
      </Menu.Item>

      <Menu.Item key="/select" icon={<FormOutlined />}>
        <Link to="/select">Registration</Link>
      </Menu.Item>

      <Menu.Item key="/user-management" icon={<TeamOutlined />}>
        <Link to="/user-management">Manage Members</Link>
      </Menu.Item>

      <Menu.Item key="/reports" icon={<FileDoneOutlined />}>
        <Link to="/reports">
          Reports
          <Badge count={0} className="ml-2" />
        </Link>
      </Menu.Item>

      {isAdmin && (
        <Menu.Item key="/create" icon={<UserAddOutlined />}>
          <Link to="/create">Register System User</Link>
        </Menu.Item>
      )}

      <Menu.Item key="/notifications" icon={<NotificationOutlined />}>
        <Link to="/notifications">Notifications</Link>
      </Menu.Item>

      {/* (remove in production) */}
      {process.env.NODE_ENV === "development" && (
        <Menu.Item
          key="/dev-env/page_"
          icon={<CodeFilled />}
          style={{
            marginBottom: 50,
            position: "absolute",
            bottom: 1,
          }}
        >
          <Link to="/dev-env/page_">dev_look</Link>
        </Menu.Item>
      )}

      {isAdmin && (
        <Menu.Item
          key="/settings"
          icon={<SettingOutlined />}
          style={{
            marginBottom: 5,
            position: "absolute",
            bottom: 0,
          }}
        >
          <Link to="/settings">Settings</Link>
        </Menu.Item>
      )}
    </Menu>
  );
};

export default SidebarMenu;
