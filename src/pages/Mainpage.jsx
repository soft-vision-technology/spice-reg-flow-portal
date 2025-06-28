import React from "react";
import { Button, Card, Statistic, Space, Typography, Row, Col } from "antd";
import { Link } from "react-router-dom";
import {
  GlobalOutlined,
  SafetyCertificateOutlined,
  BarChartOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { RegistrationDashboard } from "../components/charts/RegistrationCharts";
import { overviewData, timeSeriesData, geoData, demoData, sectorData, approvalData, regTimeData, docData, funnelData } from "../hooks/mockData";

const { Title, Paragraph, Text } = Typography;

const Mainpage = () => {
  const features = [
    {
      icon: <GlobalOutlined className="text-2xl text-[#E67324]" />,
      title: "Global Exposure",
      description: "Connect with international buyers worldwide",
    },
    {
      icon: <SafetyCertificateOutlined className="text-2xl text-[#E67324]" />,
      title: "Certification Support",
      description: "Get GMP, HACCP, and ISO 22000 accreditation",
    },
    {
      icon: <BarChartOutlined className="text-2xl text-[#E67324]" />,
      title: "Market Insights",
      description: "Industry reports and analytics",
    },
  ];

  const spices = [
    { name: "Ceylon Cinnamon", emoji: "🌶️" },
    { name: "Black Pepper", emoji: "⚫" },
    { name: "Curry Leaves", emoji: "🌿" },
    { name: "Cardamom", emoji: "🌱" },
  ];

  const stats = [
    { title: "Registered Businesses", value: 534 },
    { title: "Active Exporters", value: 128 },
    { title: "Export Countries", value: 15 },
    { title: "Product Varieties", value: 42 },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-[#FFEDD5] to-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Title level={1} className="!text-[#E67324] !mb-6">
            Sri Lanka Spice Export Registration
          </Title>
          <Paragraph className="text-lg text-gray-600 !mb-8 max-w-2xl mx-auto">
            A comprehensive platform for spice entrepreneurs, exporters, and
            traders to register and grow their businesses globally
          </Paragraph>
          <Space size="large" wrap>
            <Button
              type="primary"
              size="large"
              style={{ backgroundColor: "#E67324", borderColor: "#E67324" }}
            >
              <Link to="/select">Register Now</Link>
            </Button>
            <Button
              size="large"
              ghost
              style={{ borderColor: "#E67324", color: "#E67324" }}
            >
              <Link to="/reports">View Reports</Link>
            </Button>
          </Space>
        </div>
      </div>

      {/* Dashboard Section */}
      <div className="py-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <Title level={2} className="text-center !text-[#E67324] !mb-12">
            Registration Analytics Dashboard
          </Title>
          <RegistrationDashboard
            overview={overviewData}
            timeSeries={timeSeriesData}
            geo={geoData}
            demographics={demoData}
            sectors={sectorData}
            approval={approvalData}
            regTime={regTimeData}
            docs={docData}
            funnel={funnelData}
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <Title level={2} className="text-center !text-[#E67324] !mb-12">
            Why Register with Us?
          </Title>
          <Row gutter={[32, 32]}>
            {features.map((feature, index) => (
              <Col xs={24} md={8} key={index}>
                <Card
                  className="h-full text-center border-[#FFEDD5] hover:shadow-md transition-shadow"
                  bodyStyle={{ padding: "32px 24px" }}
                >
                  <div className="mb-4">{feature.icon}</div>
                  <Title level={4} className="!text-gray-800 !mb-3">
                    {feature.title}
                  </Title>
                  <Text className="text-gray-600">{feature.description}</Text>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* Spices Section */}
      <div className="py-16 px-6 bg-[#FFEDD5]/30">
        <div className="max-w-5xl mx-auto">
          <Title level={2} className="text-center !text-[#E67324] !mb-12">
            Featured Spice Products
          </Title>
          <Row gutter={[24, 24]}>
            {spices.map((spice, index) => (
              <Col xs={12} md={6} key={index}>
                <div className="text-center p-6 bg-white rounded-lg">
                  <div className="text-4xl mb-4">{spice.emoji}</div>
                  <Title level={5} className="!text-gray-800 !mb-0">
                    {spice.name}
                  </Title>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="py-16 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <Title level={2} className="text-center !text-[#E67324] !mb-12">
            Our Statistics
          </Title>
          <Row gutter={[32, 32]}>
            {stats.map((stat, index) => (
              <Col xs={12} md={6} key={index}>
                <div className="text-center">
                  <Statistic
                    value={stat.value}
                    valueStyle={{
                      color: "#E67324",
                      fontSize: "2.5rem",
                      fontWeight: "bold",
                    }}
                  />
                  <Text className="text-gray-600">{stat.title}</Text>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <Card
            className="text-center bg-gradient-to-r from-[#E67324] to-[#E67324]/80"
            bodyStyle={{ padding: "48px 32px" }}
          >
            <Title level={2} className="!text-white !mb-4">
              Ready to Join the Spice Export Network?
            </Title>
            <Paragraph className="text-white/90 !mb-8 text-lg">
              Register today and take your spice business to the next level
            </Paragraph>
            <Button
              size="large"
              className="bg-white text-[#E67324] border-white hover:bg-gray-50"
            >
              <Link to="/register">
                Register Your Business <ArrowRightOutlined />
              </Link>
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Mainpage;