import React, { useEffect, useState } from "react";
import { Layout } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import SidebarMenu from "./SidebarMenu";
import LogoutButton from "../auth/LogoutButton";
import NotificationSection from "../custom/NotificationSection";
import logoFull from "../../assets/logoFull.png";
import logoIcon from "../../assets/logoIcon.png";
import { selectAuthUser } from "../../store/slices/authSlice";
import { useSelector } from "react-redux";

const { Header, Content, Sider } = Layout;

const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(true);
  const location = useLocation();
  const user = useSelector(selectAuthUser);

  const Admin = user?.userRole === 1;

  // Hide sidebar on home page
  const isHomePage = location.pathname === "/l";

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout className="h-screen overflow-hidden">
      {!isHomePage && (
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          className="bg-sidebar overflow-y-auto"
          width={250}
          breakpoint="lg"
          onBreakpoint={(broken) => {
            if (broken) {
              setCollapsed(true);
            }
          }}
        >
          <div className="p-4 h-16 flex items-center justify-center flex-shrink-0">
            <Link to="/dashboard">
              <img
                src={collapsed ? logoIcon : logoFull}
                alt="SpiceConnect Logo"
                className={`transition-all duration-300 ${
                  collapsed ? "w-12 h-10" : "w-32 h-12"
                }`}
              />
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto">
            <SidebarMenu />
          </div>
        </Sider>
      )}
      <Layout className="flex flex-col h-full">
        {!isHomePage && (
          <Header className="p-0 bg-white border-b border-gray-200 flex items-center flex-shrink-0">
            <div
              onClick={toggle}
              className="px-6 h-16 flex items-center cursor-pointer"
            >
              {collapsed ? (
                <MenuUnfoldOutlined className="text-xl" />
              ) : (
                <MenuFoldOutlined className="text-xl" />
              )}
            </div>
            <div className="flex-1 px-4">
              <h2 className="text-lg font-semibold text-earth-700">
                Registration Portal
              </h2>
            </div>
            <div className="text-xs text-gray-500 font-medium">
              Welcome back! {user.userId === 1 ? "Admin" : ""}✨
            </div>
            <div className="flex items-center gap-2 z-100">
              <NotificationSection />
              <div className="px-4">
                <LogoutButton />
              </div>
            </div>
          </Header>
        )}
        <Content className={"flex-1 overflow-y-auto"}>
          <>
            <div>{children}</div>
          </>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
