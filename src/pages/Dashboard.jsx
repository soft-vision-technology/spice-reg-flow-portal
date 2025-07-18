import { Button, Card, Statistic, Space, Typography, Row, Col, Progress, Tag } from "antd";
import { Link } from "react-router-dom";
import {
  GlobalOutlined,
  SafetyCertificateOutlined,
  BarChartOutlined,
  ArrowRightOutlined,
  UserOutlined,
  ShopOutlined,
  RiseOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { TrendingUp } from "lucide-react";

const { Title, Paragraph, Text } = Typography;

// Mock data for demonstration
const overviewData = [
  { name: "Approved", value: 342, color: "#10B981" },
  { name: "Pending", value: 127, color: "#F59E0B" },
  { name: "Under Review", value: 65, color: "#E67324" }
];

const timeSeriesData = [
  { month: "Jan", registrations: 45, approvals: 38 },
  { month: "Feb", registrations: 52, approvals: 42 },
  { month: "Mar", registrations: 67, approvals: 55 },
  { month: "Apr", registrations: 74, approvals: 61 },
  { month: "May", registrations: 89, approvals: 73 },
  { month: "Jun", registrations: 95, approvals: 78 }
];

const geoData = [
  { district: "Colombo", count: 145, percentage: 27 },
  { district: "Gampaha", count: 98, percentage: 18 },
  { district: "Kalutara", count: 87, percentage: 16 },
  { district: "Kandy", count: 76, percentage: 14 },
  { district: "Matale", count: 65, percentage: 12 },
  { district: "Others", count: 63, percentage: 13 }
];

const sectorData = [
  { sector: "Cinnamon", count: 156, growth: 12 },
  { sector: "Pepper", count: 134, growth: 8 },
  { sector: "Cardamom", count: 98, growth: 15 },
  { sector: "Cloves", count: 87, growth: 6 },
  { sector: "Nutmeg", count: 59, growth: 18 }
];

// Enhanced Chart Components
const RegistrationOverviewDonut = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const approvalRate = ((data.find(d => d.name === "Approved")?.value || 0) / total * 100).toFixed(1);
  
  return (
    <div className="relative">
      <div className="flex justify-center mb-4">
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#F3F4F6"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#10B981"
              strokeWidth="8"
              strokeDasharray={`${approvalRate * 2.51} 251`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#10B981]">{approvalRate}%</div>
              <div className="text-xs text-gray-500">Approved</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-700">{item.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-800">{item.value}</span>
              <span className="text-xs text-gray-500">
                ({((item.value / total) * 100).toFixed(1)}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const RegistrationsOverTimeArea = ({ data }) => {
  const maxValue = Math.max(...data.map(d => Math.max(d.registrations, d.approvals)));
  
  return (
    <div className="h-64">
      <div className="flex justify-end mb-4 gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#E67324]" />
          <span className="text-sm text-gray-600">Registrations</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#10B981]" />
          <span className="text-sm text-gray-600">Approvals</span>
        </div>
      </div>
      
      <div className="grid grid-cols-6 gap-2 h-48">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="flex-1 flex flex-col justify-end w-full gap-1">
              <div 
                className="bg-[#E67324] rounded-t opacity-80 min-h-[4px] transition-all duration-300 hover:opacity-100"
                style={{ height: `${(item.registrations / maxValue) * 100}%` }}
                title={`${item.registrations} registrations`}
              />
              <div 
                className="bg-[#10B981] rounded-t opacity-80 min-h-[4px] transition-all duration-300 hover:opacity-100"
                style={{ height: `${(item.approvals / maxValue) * 100}%` }}
                title={`${item.approvals} approvals`}
              />
            </div>
            <span className="text-xs text-gray-500 mt-2">{item.month}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const GeographicDistributionChart = ({ data }) => {
  const maxCount = Math.max(...data.map(d => d.count));
  
  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div key={index} className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">{item.district}</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-800">{item.count}</span>
              <span className="text-xs text-gray-500">({item.percentage}%)</span>
            </div>
          </div>
          <Progress 
            percent={item.percentage} 
            showInfo={false}
            strokeColor={{
              '0%': '#E67324',
              '100%': '#F59E0B'
            }}
            className="h-2"
          />
        </div>
      ))}
    </div>
  );
};

const SectorWiseBar = ({ data }) => {
  const maxCount = Math.max(...data.map(d => d.count));
  
  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div key={index} className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">{item.sector}</span>
            <div className="flex items-center gap-3">
              <Tag color={item.growth > 10 ? "green" : item.growth > 5 ? "orange" : "blue"}>
                <RiseOutlined /> {item.growth}%
              </Tag>
              <span className="text-sm font-semibold text-gray-800">{item.count}</span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-[#E67324] to-[#F59E0B] h-3 rounded-full transition-all duration-500"
              style={{ width: `${(item.count / maxCount) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

const RegistrationDashboard = (props) => {
  return (
    <div className="space-y-6">
      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="text-center border-l-4 border-l-[#E67324]">
          <Statistic
            title="Total Registrations"
            value={534}
            prefix={<UserOutlined className="text-[#E67324]" />}
            valueStyle={{ color: '#E67324', fontSize: '24px' }}
          />
          <div className="text-xs text-gray-500 mt-1">↗ 12% from last month</div>
        </Card>
        
        <Card className="text-center border-l-4 border-l-[#10B981]">
          <Statistic
            title="Active Exporters"
            value={128}
            prefix={<ShopOutlined className="text-[#10B981]" />}
            valueStyle={{ color: '#10B981', fontSize: '24px' }}
          />
          <div className="text-xs text-gray-500 mt-1">↗ 8% from last month</div>
        </Card>
        
        <Card className="text-center border-l-4 border-l-[#F59E0B]">
          <Statistic
            title="Pending Reviews"
            value={127}
            prefix={<ClockCircleOutlined className="text-[#F59E0B]" />}
            valueStyle={{ color: '#F59E0B', fontSize: '24px' }}
          />
          <div className="text-xs text-gray-500 mt-1">Avg. 5 days processing</div>
        </Card>
        
        <Card className="text-center border-l-4 border-l-[#6366F1]">
          <Statistic
            title="Export Countries"
            value={15}
            prefix={<GlobalOutlined className="text-[#6366F1]" />}
            valueStyle={{ color: '#6366F1', fontSize: '24px' }}
          />
          <div className="text-xs text-gray-500 mt-1">3 new markets</div>
        </Card>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Registration Overview */}
        <Card className="shadow-lg border-0">
          <div className="flex items-center justify-between mb-4">
            <Title level={4} className="!mb-0 text-gray-800">
              Registration Status
            </Title>
            <CheckCircleOutlined className="text-[#10B981] text-lg" />
          </div>
          <RegistrationOverviewDonut data={overviewData} />
        </Card>

        {/* Trends */}
        <Card className="shadow-lg border-0">
          <div className="flex items-center justify-between mb-4">
            <Title level={4} className="!mb-0 text-gray-800">
              Registration Trends
            </Title>
            <TrendingUp className="text-[#E67324] text-lg" />
          </div>
          <RegistrationsOverTimeArea data={timeSeriesData} />
        </Card>

        {/* Sector Performance */}
        <Card className="shadow-lg border-0">
          <div className="flex items-center justify-between mb-4">
            <Title level={4} className="!mb-0 text-gray-800">
              Sector Performance
            </Title>
            <BarChartOutlined className="text-[#F59E0B] text-lg" />
          </div>
          <SectorWiseBar data={sectorData} />
        </Card>
      </div>

      {/* Geographic Distribution - Full Width */}
      <Card className="shadow-lg border-0">
        <div className="flex items-center justify-between mb-6">
          <Title level={4} className="!mb-0 text-gray-800">
            Geographic Distribution
          </Title>
          <GlobalOutlined className="text-[#6366F1] text-lg" />
        </div>
        <GeographicDistributionChart data={geoData} />
      </Card>

      {/* Action Items */}
      <Card className="shadow-lg border-0 bg-gradient-to-r from-[#E67324]/5 to-[#F59E0B]/5">
        <div className="flex items-center justify-between">
          <div>
            <Title level={4} className="!mb-2 text-gray-800">
              Quick Actions
            </Title>
            <Text className="text-gray-600">
              Streamline your registration process with these common actions
            </Text>
          </div>
          <Space>
            <Button type="primary" style={{ backgroundColor: '#E67324', borderColor: '#E67324' }}>
              <Link to="/select">New Registration</Link>
            </Button>
            <Button type="outline" style={{ borderColor: '#E67324', color: '#E67324' }}>
              <Link to="/reports">View Reports</Link>
            </Button>
          </Space>
        </div>
      </Card>
    </div>
  );
};

const Mainpage = () => {
  const features = [
    {
      icon: <GlobalOutlined className="text-3xl text-[#E67324]" />,
      title: "Global Market Access",
      description: "Connect with verified international buyers across 15+ countries",
      metric: "15+ Countries"
    },
    {
      icon: <SafetyCertificateOutlined className="text-3xl text-[#10B981]" />,
      title: "Certification Support",
      description: "Fast-track GMP, HACCP, and ISO 22000 accreditation process",
      metric: "5-Day Processing"
    },
    {
      icon: <BarChartOutlined className="text-3xl text-[#F59E0B]" />,
      title: "Market Intelligence",
      description: "Real-time industry reports and export analytics",
      metric: "Live Analytics"
    },
  ];

  const stats = [
    { 
      title: "Registered Businesses", 
      value: 534, 
      change: "+12%",
      positive: true,
      icon: <UserOutlined />
    },
    { 
      title: "Active Exporters", 
      value: 128, 
      change: "+8%",
      positive: true,
      icon: <ShopOutlined />
    },
    { 
      title: "Export Countries", 
      value: 15, 
      change: "+3",
      positive: true,
      icon: <GlobalOutlined />
    },
    { 
      title: "Success Rate", 
      value: "94%", 
      change: "+2%",
      positive: true,
      icon: <CheckCircleOutlined />
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      {/* <div className="bg-gradient-to-br from-[#E67324]/10 via-white to-[#F59E0B]/10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Title level={1} className="!text-[#E67324] !mb-6 !text-4xl lg:!text-5xl">
              Sri Lanka Spice Export Hub
            </Title>
            <Paragraph className="text-xl text-gray-600 !mb-8 max-w-3xl mx-auto leading-relaxed">
              Your gateway to global spice markets. Join 500+ registered exporters 
              and expand your business with our comprehensive certification and market access platform.
            </Paragraph>
            <Space size="large" wrap>
              <Button
                type="primary"
                size="large"
                className="h-12 px-8 text-lg font-semibold"
                style={{ backgroundColor: "#E67324", borderColor: "#E67324" }}
              >
                <Link to="/select">Start Registration</Link>
              </Button>
              <Button
                size="large"
                className="h-12 px-8 text-lg font-semibold"
                style={{ borderColor: "#E67324", color: "#E67324" }}
              >
                <Link to="/reports">View Analytics</Link>
              </Button>
            </Space>
          </div>
        </div>
      </div> */}

      {/* Dashboard Section */}
      <div className="py-6 px-6">
        {/* <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Title level={2} className="!text-gray-800 !mb-4">
              Registration Analytics Dashboard
            </Title>
            <Paragraph className="text-lg text-gray-600">
              Real-time insights into spice export registrations and market trends
            </Paragraph>
          </div>
          <RegistrationDashboard />
        </div> */}
        <RegistrationDashboard />
      </div>

      {/* Features Section */}
      <div className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Title level={2} className="!text-[#E67324] !mb-4">
              Why Choose Our Platform?
            </Title>
            <Paragraph className="text-lg text-gray-600">
              Comprehensive support for your spice export journey
            </Paragraph>
          </div>
          <Row gutter={[32, 32]}>
            {features.map((feature, index) => (
              <Col xs={24} md={8} key={index}>
                <Card
                  className="h-full text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg"
                  bodyStyle={{ padding: "40px 24px" }}
                >
                  <div className="mb-6">{feature.icon}</div>
                  <Title level={4} className="!text-gray-800 !mb-4">
                    {feature.title}
                  </Title>
                  <Paragraph className="text-gray-600 !mb-4">
                    {feature.description}
                  </Paragraph>
                  <Tag color="orange" className="font-semibold">
                    {feature.metric}
                  </Tag>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="py-16 px-6 bg-gradient-to-r from-[#E67324]/5 to-[#F59E0B]/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Title level={2} className="!text-gray-800 !mb-4">
              Platform Performance
            </Title>
            <Paragraph className="text-lg text-gray-600">
              Growing community of successful spice exporters
            </Paragraph>
          </div>
          <Row gutter={[32, 32]}>
            {stats.map((stat, index) => (
              <Col xs={12} md={6} key={index}>
                <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="text-2xl text-[#E67324] mb-3">{stat.icon}</div>
                  <Statistic
                    value={stat.value}
                    valueStyle={{
                      color: "#E67324",
                      fontSize: "2rem",
                      fontWeight: "bold",
                    }}
                  />
                  <Text className="text-gray-600 block mb-2">{stat.title}</Text>
                  <Tag color={stat.positive ? "green" : "red"}>
                    {stat.change} this month
                  </Tag>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <Card
            className="text-center border-0 shadow-xl"
            style={{
              background: "linear-gradient(135deg, #E67324 0%, #F59E0B 100%)"
            }}
            bodyStyle={{ padding: "48px 32px" }}
          >
            <Title level={2} className="!text-white !mb-4">
              Ready to Expand Your Spice Business?
            </Title>
            <Paragraph className="text-white/90 !mb-8 text-lg">
              Join our growing community of successful spice exporters and access global markets
            </Paragraph>
            <Space size="large" wrap>
              <Button
                size="large"
                className="h-12 px-8 text-lg font-semibold bg-white text-[#E67324] border-white hover:bg-gray-50"
              >
                <Link to="/register">
                  Register Your Business <ArrowRightOutlined />
                </Link>
              </Button>
              <Button
                size="large"
                ghost
                className="h-12 px-8 text-lg font-semibold text-white border-white hover:bg-white/10"
              >
                <Link to="/contact">Contact Support</Link>
              </Button>
            </Space>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Mainpage;