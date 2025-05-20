import React from "react";
import { Menu, Badge } from "antd";
import {
  HomeFilled,
  FormOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  UserOutlined,
  BankOutlined,
  ShopOutlined,
  GlobalOutlined,
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
      <Menu.Item key="/" icon={<HomeFilled />}>
        <Link to="/">Home</Link>
      </Menu.Item>

      <Menu.Item key="/select" icon={<UserOutlined />}>
        <Link to="/select">Registration</Link>
      </Menu.Item>

      {hasSelectedRole && hasSelectedStatus && (
        <Menu.SubMenu
          key="forms"
          icon={<FormOutlined />}
          title="Forms"
        >
          {status === "starting" && (
            <Menu.Item key="/like-to-start" icon={<FileTextOutlined />}>
              <Link to="/like-to-start">New Business</Link>
            </Menu.Item>
          )}

          {status === "existing" && role === "entrepreneur" && (
            <Menu.Item key="/have-business" icon={<BankOutlined />}>
              <Link to="/have-business">Existing Business</Link>
            </Menu.Item>
          )}

          {status === "existing" && role === "exporter" && (
            <Menu.Item key="/export-form" icon={<GlobalOutlined />}>
              <Link to="/export-form">Export Operations</Link>
            </Menu.Item>
          )}

          {status === "existing" && role === "intermediary" && (
            <Menu.Item key="/intermediary-form" icon={<ShopOutlined />}>
              <Link to="/intermediary-form">Trading Operations</Link>
            </Menu.Item>
          )}
        </Menu.SubMenu>
      )}

      <Menu.Item key="/reports" icon={<CheckCircleOutlined />}>
        <Link to="/reports">
          Reports
          <Badge count={0} className="ml-2" />
        </Link>
      </Menu.Item>
    </Menu>
  );
};

export default SidebarMenu;
