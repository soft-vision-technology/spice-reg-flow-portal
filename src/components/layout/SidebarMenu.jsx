import { Menu, Badge } from "antd";
import {
  UserOutlined,
  FileDoneOutlined,
  TeamOutlined,
  FormOutlined,
  UserAddOutlined,
  NotificationOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import { useFormContext } from "../../contexts/FormContext";

const SidebarMenu = () => {
  const location = useLocation();
  const { role, status } = useFormContext();

  const hasSelectedRole = role !== "";
  const hasSelectedStatus = status !== "";

  return (
    <Menu
      theme="light"
      mode="inline"
      selectedKeys={[location.pathname]}
      className="bg-sidebar border-r-0"
    >
      <Menu.Item key="/dashboard" icon={<HomeOutlined />}>
        <Link to="/dashboard">Dashboard</Link>
      </Menu.Item>

      <Menu.Item key="/select" icon={<FormOutlined />}>
        <Link to="/select">Registration</Link>
      </Menu.Item>

      <Menu.Item key="/members" icon={<TeamOutlined />}>
        <Link to="/members">Manage Members</Link>
      </Menu.Item>

      <Menu.Item key="/reports" icon={<FileDoneOutlined />}>
        <Link to="/reports">
          Reports
          <Badge count={0} className="ml-2" />
        </Link>
      </Menu.Item>

      <Menu.Item key="/create" icon={<UserAddOutlined />}>
        <Link to="/create">Register System User</Link>
      </Menu.Item>

      <Menu.Item key="/notifications" icon={<NotificationOutlined />}>
        <Link to="/notifications">
          Notifications
        </Link>
      </Menu.Item>
    </Menu>
  );
};

export default SidebarMenu;
