import {
  Button,
  Card,
  Statistic,
  Space,
  Typography,
  Progress,
  Tag,
} from "antd";
import { Link } from "react-router-dom";
import {
  GlobalOutlined,
  BarChartOutlined,
  UserOutlined,
  ShopOutlined,
  RiseOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance"; // Adjust the import path as needed

const { Title, Paragraph, Text } = Typography;

// Mock data for demonstration
const timeSeriesData = [
  { month: "Jan", registrations: 45, approvals: 0 },
  { month: "Feb", registrations: 52, approvals: 42 },
  { month: "Mar", registrations: 67, approvals: 55 },
  { month: "Apr", registrations: 74, approvals: 61 },
  { month: "May", registrations: 89, approvals: 73 },
  { month: "Jun", registrations: 95, approvals: 78 },
];

// Enhanced Chart Components
const RegistrationOverviewDonut = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const approvalRate = total > 0 ? (
    ((data.find((d) => d.name === "Approved")?.value || 0) / total) * 100
  ).toFixed(1) : 0;

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
              <div className="text-2xl font-bold text-[#10B981]">
                {approvalRate}%
              </div>
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
                ({total > 0 ? ((item.value / total) * 100).toFixed(1) : 0}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const RegistrationsOverTimeArea = ({ data }) => {
  const maxValue = Math.max(
    ...data.map((d) => Math.max(d.registrations, d.approvals))
  );

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

const GeographicDistributionChart = ({ data, loading }) => {
  const maxCount = Math.max(...data.map((d) => d.userCount), 1);
  const chartHeight = 400;
  const chartWidth = 1400;
  const padding = 40;

  if (loading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-48 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-gray-500">No data available</div>
      </div>
    );
  }

  // Calculate points for the line
  const points = data.map((item, index) => ({
    x: (index / (data.length - 1)) * (chartWidth - 2 * padding) + padding,
    y: chartHeight - ((item.userCount / maxCount) * (chartHeight - 2 * padding) + padding),
    ...item
  }));

  // Create path for the line
  const pathData = points.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ');

  // Create area path
  const areaPath = pathData + 
    ` L ${points[points.length - 1].x} ${chartHeight - padding}` +
    ` L ${points[0].x} ${chartHeight - padding} Z`;

  return (
    <div className="space-y-4">
      <div className="w-full overflow-x-auto">
        <svg width={chartWidth} height={chartHeight} className="border border-gray-200 rounded-lg">
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Y-axis labels */}
          {[0, 1, 2, 3, 4, 5].map((tick) => {
            const value = Math.round((tick / 5) * maxCount);
            const y = chartHeight - padding - (tick / 5) * (chartHeight - 2 * padding);
            return (
              <g key={tick}>
                <line 
                  x1={padding - 5} 
                  y1={y} 
                  x2={padding} 
                  y2={y} 
                  stroke="#6b7280" 
                  strokeWidth="1"
                />
                <text 
                  x={padding - 10} 
                  y={y + 4} 
                  textAnchor="end" 
                  className="text-xs fill-gray-600"
                >
                  {value}
                </text>
              </g>
            );
          })}
          
          {/* Area fill */}
          <path
            d={areaPath}
            fill="url(#areaGradient)"
            opacity="0.3"
          />
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#E67324" stopOpacity="0.8"/>
              <stop offset="100%" stopColor="#E67324" stopOpacity="0.1"/>
            </linearGradient>
          </defs>
          
          {/* Line */}
          <path
            d={pathData}
            fill="none"
            stroke="#E67324"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Data points */}
          {points.map((point, index) => (
            <g key={index}>
              <circle
                cx={point.x}
                cy={point.y}
                r="4"
                fill="white"
                stroke="#E67324"
                strokeWidth="3"
                className="hover:r-8 transition-all cursor-pointer"
              />
              <title>{`${point.districtName}: ${point.userCount} users`}</title>
            </g>
          ))}
          
          {/* X-axis labels */}
          {points.map((point, index) => (
            <text
              key={index}
              x={point.x}
              y={chartHeight - padding + 20}
              textAnchor="middle"
              className="text-xs fill-gray-600"
            >
              {point.districtName}
            </text>
          ))}
        </svg>
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#E67324]" />
          <span className="text-sm text-gray-600">User Count by District</span>
        </div>
      </div>
      
      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-[#E67324]">
            {data.reduce((sum, item) => sum + item.userCount, 0)}
          </div>
          <div className="text-sm text-gray-600">Total Users</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-[#10B981]">
            {data.length}
          </div>
          <div className="text-sm text-gray-600">Districts</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-[#F59E0B]">
            {maxCount}
          </div>
          <div className="text-sm text-gray-600">Highest Count</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-[#6366F1]">
            {(data.reduce((sum, item) => sum + item.userCount, 0) / data.length).toFixed(1)}
          </div>
          <div className="text-sm text-gray-600">Average</div>
        </div>
      </div>
    </div>
  );
};

const SectorWiseBar = ({ data }) => {
  const maxCount = Math.max(...data.map((d) => d.count));

  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div key={index} className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">
              {item.sector}
            </span>
            <div className="flex items-center gap-3">
              <Tag
                color={
                  item.growth > 10
                    ? "green"
                    : item.growth > 5
                    ? "orange"
                    : "blue"
                }
              >
                <RiseOutlined /> {item.growth}%
              </Tag>
              <span className="text-sm font-semibold text-gray-800">
                {item.count}
              </span>
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

const RegistrationDashboard = () => {
  const [statCardData, setStatCardData] = useState({
    allRegisteredUsers: 0,
    pendingApprovals: 0,
    issuedCertificates: 0,
    totalProducts: 0,
  });
  const [districtData, setDistrictData] = useState([]);
  const [sectorData, setSectorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [districtLoading, setDistrictLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStatCardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axiosInstance.get("/api/system/card/stat_cards");
      
      if (response.status === 200) {
        setStatCardData(response.data);
      } else {
        throw new Error("Failed to fetch stat card data");
      }
    } catch (err) {
      console.error("Error fetching stat card data:", err);
      setError(err.response?.data?.message || "Failed to fetch stat card data");
    } finally {
      setLoading(false);
    }
  };

  const fetchDistrictData = async () => {
    try {
      setDistrictLoading(true);
      
      const response = await axiosInstance.get("/api/system/chart/district_users");
      
      if (response.status === 200) {
        setDistrictData(response.data);
      } else {
        throw new Error("Failed to fetch district data");
      }
    } catch (err) {
      console.error("Error fetching district data:", err);
      // Keep empty array on error so chart shows "No data available"
      setDistrictData([]);
    } finally {
      setDistrictLoading(false);
    }
  };

    const fetchSectorData = async () => {
      try {
        setLoading(true);

        const response = await axiosInstance.get('/api/system/chart/business_products');

        if (response.status === 200) {
        setSectorData(response.data);
      } else {
        throw new Error("Failed to fetch sector data");
      }
    } catch (err) {
      console.error("Error fetching sector data:", err);
      
      setSectorData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatCardData();
    fetchDistrictData();
    fetchSectorData();
  }, []);

  // Create overview data using the fetched API data
  const overviewData = [
    { 
      name: "Approved", 
      value: statCardData.issuedCertificates || 0, 
      color: "#10B981" 
    },
    { 
      name: "Pending", 
      value: statCardData.pendingApprovals || 0, 
      color: "#F59E0B" 
    },
  ];

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="text-center border-l-4 border-l-gray-300">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-300 rounded mb-2"></div>
                <div className="h-8 bg-gray-300 rounded"></div>
              </div>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="shadow-lg border-0">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-300 rounded mb-4"></div>
                <div className="h-48 bg-gray-300 rounded"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <Card className="text-center p-8">
          <div className="text-red-500 text-lg mb-2">Error loading dashboard data</div>
          <div className="text-gray-600 mb-4">{error}</div>
          <Button 
            onClick={() => {
              fetchStatCardData();
              fetchDistrictData();
              fetchSectorData();
            }}
            type="primary"
            style={{ backgroundColor: "#E67324", borderColor: "#E67324" }}
          >
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="text-center border-l-4 border-l-[#E67324] hover:shadow-lg transition-shadow">
          <Statistic
            title="Total Registrations"
            value={statCardData.allRegisteredUsers || 0}
            prefix={<UserOutlined className="text-[#E67324]" />}
            valueStyle={{ color: "#E67324", fontSize: "24px" }}
          />
          <div className="text-xs text-gray-500 mt-1">
            ↗ 12% from last month
          </div>
        </Card>

        <Card className="text-center border-l-4 border-l-[#10B981] hover:shadow-lg transition-shadow">
          <Statistic
            title="Issued Certificates"
            value={statCardData.issuedCertificates || 0}
            prefix={<ShopOutlined className="text-[#10B981]" />}
            valueStyle={{ color: "#10B981", fontSize: "24px" }}
          />
          <div className="text-xs text-gray-500 mt-1">
            ↗ 8% from last month
          </div>
        </Card>

        <Card className="text-center border-l-4 border-l-[#F59E0B] hover:shadow-lg transition-shadow">
          <Statistic
            title="Pending Approvals"
            value={statCardData.pendingApprovals || 0}
            prefix={<ClockCircleOutlined className="text-[#F59E0B]" />}
            valueStyle={{ color: "#F59E0B", fontSize: "24px" }}
          />
          <div className="text-xs text-gray-500 mt-1">
            Avg. 5 days processing
          </div>
        </Card>

        <Card className="text-center border-l-4 border-l-[#6366F1] hover:shadow-lg transition-shadow">
          <Statistic
            title="Total Products"
            value={statCardData.totalProducts || 0}
            prefix={<GlobalOutlined className="text-[#6366F1]" />}
            valueStyle={{ color: "#6366F1", fontSize: "24px" }}
          />
          <div className="text-xs text-gray-500 mt-1">
            3 new markets
          </div>
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
        <GeographicDistributionChart data={districtData} loading={districtLoading} />
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
            <Button
              type="primary"
              style={{ backgroundColor: "#E67324", borderColor: "#E67324" }}
            >
              <Link to="/select">New Registration</Link>
            </Button>
            <Button
              type="outline"
              style={{ borderColor: "#E67324", color: "#E67324" }}
            >
              <Link to="/reports">View Reports</Link>
            </Button>
          </Space>
        </div>
      </Card>

      {/* Refresh Button */}
      <div className="flex justify-end">
        <Button 
          onClick={() => {
            fetchStatCardData();
            fetchDistrictData();
          }}
          type="default"
          style={{ borderColor: "#E67324", color: "#E67324" }}
        >
          Refresh Data
        </Button>
      </div>
    </div>
  );
};

const Mainpage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Section */}
      <div className="py-6 px-6">
        <RegistrationDashboard />
      </div>
    </div>
  );
};

export default Mainpage;