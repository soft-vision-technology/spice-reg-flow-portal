import React from "react";
import { Button, Typography, Card, Row, Col } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Title, Paragraph } = Typography;

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-spice-100 to-earth-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-24">
          <div className="text-center mb-16">
            <Title className="text-4xl md:text-5xl lg:text-6xl font-bold text-earth-700">
              Spice Industry Registration Portal
            </Title>
            <Paragraph className="text-xl text-earth-500 mt-6 max-w-3xl mx-auto">
              Register your spice business, export operations, or trading
              services in our comprehensive industry database to access
              resources and connect with stakeholders.
            </Paragraph>
            <Link to="/select">
              <Button
                type="primary"
                size="large"
                className="mt-8 h-12 px-8 text-lg bg-spice-500 hover:bg-spice-600"
              >
                Start Registration <RightOutlined />
              </Button>
            </Link>
          </div>

          <Row gutter={[24, 24]} className="mt-16">
            <Col xs={24} md={8}>
              <Card
                className="h-full border-0 shadow-md rounded-xl hover:shadow-lg transition-shadow"
                cover={
                  <div className="h-40 bg-gradient-to-br from-spice-400 to-spice-600 rounded-t-xl flex items-center justify-center">
                    <img
                      src="/src/assets/entrepreneurs.jpg"
                      alt="Spice exports illustration"
                      className="w-full h-40 object-cover rounded-t-xl"
                    />
                    <span className="text-4xl absolute top-2 left-2 z-10">
                      🌱
                    </span>
                  </div>
                }
              >
                <Title level={4} className="text-earth-700">
                  Entrepreneurs
                </Title>
                <Paragraph className="text-earth-500">
                  Starting a new spice business or already running one? Register
                  your venture to connect with buyers, exporters, and resources.
                </Paragraph>
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card
                className="h-full border-0 shadow-md rounded-xl hover:shadow-lg transition-shadow"
                cover={
                  <div className="h-40 bg-gradient-to-br from-earth-400 to-earth-600 rounded-t-xl relative">
                    <img
                      src="/src/assets/exporters.jpg"
                      alt="Spice exports illustration"
                      className="w-full h-40 object-cover rounded-t-xl"
                    />
                    <span className="text-4xl absolute top-2 left-2 z-10">
                      🌍
                    </span>
                  </div>
                }
              >
                <Title level={4} className="text-earth-700">
                  Exporters
                </Title>
                <Paragraph className="text-earth-500">
                  Selling Sri Lankan spices to the world? Register your export
                  operations to access trade resources and international
                  connections.
                </Paragraph>
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card
                className="h-full border-0 shadow-md rounded-xl hover:shadow-lg transition-shadow"
                cover={
                  <div className="h-40 bg-gradient-to-br from-leaf-400 to-leaf-600 rounded-t-xl flex items-center justify-center">
                    <img
                      src="/src/assets/traders.jpg"
                      alt="Spice exports illustration"
                      className="w-full h-40 object-cover rounded-t-xl"
                    />
                    <span className="text-4xl absolute top-2 left-2 z-10">
                      🤝
                    </span>
                  </div>
                }
              >
                <Title level={4} className="text-earth-700">
                  Intermediary Traders
                </Title>
                <Paragraph className="text-earth-500">
                  Connecting farmers with buyers? Register your trading
                  operations to strengthen your network and increase your market
                  reach.
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
