import React, { useState } from "react";
import { Layout } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import SidebarMenu from "./SidebarMenu"

const { Header, Content, Sider } = Layout;

const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(true);
  const location = useLocation();

  // Hide sidebar on home page
  const isHomePage = location.pathname === "/";

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
            <h1 className={`text-spice-500 font-bold ${collapsed ? 'text-xl' : 'text-2xl'}`}>
              {collapsed ? 'SC' : 'SpiceConnect'}
            </h1>
          </div>
          <div className="flex-1 overflow-y-auto">
            <SidebarMenu />
          </div>
        </Sider>
      )}
      <Layout className="flex flex-col h-full">
        {!isHomePage && (
          <Header className="p-0 bg-white border-b border-gray-200 flex items-center flex-shrink-0">
            <div onClick={toggle} className="px-6 h-16 flex items-center cursor-pointer">
              {collapsed ? <MenuUnfoldOutlined className="text-xl" /> : <MenuFoldOutlined className="text-xl" />}
            </div>
            <div className="flex-1 px-4">
              <h2 className="text-lg font-semibold text-earth-700">Spice Industry Registration Portal</h2>
            </div>
          </Header>
        )}
        <Content className={`flex-1 overflow-y-auto ${isHomePage ? "" : "p-6"}`}>
          <div>{children}</div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;