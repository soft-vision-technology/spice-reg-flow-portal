import { Menu, Badge } from "antd";
import {
  FileDoneOutlined,
  TeamOutlined,
  FormOutlined,
  UserAddOutlined,
  NotificationOutlined,
  HomeOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import { useFormContext } from "../../contexts/FormContext";
import { selectAuthUser } from "../../store/slices/authSlice";
import { useSelector } from "react-redux";



const SidebarMenu = () => {
  const user = useSelector(selectAuthUser);
  const location = useLocation();
  const { role, status } = useFormContext();

  // Wait for user to be loaded
  if (!user) return null; // or a spinner

  const hasSelectedRole = role !== "";
  const hasSelectedStatus = status !== "";

  const isAdmin = user?.userRole === 1;

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
        <Link to="/notifications">
          Notifications
        </Link>
      </Menu.Item>
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
