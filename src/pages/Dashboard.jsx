import { Button, Card, Statistic, Space, Typography } from "antd";
import { Link } from "react-router-dom";
import {
  GlobalOutlined,
  BarChartOutlined,
  UserOutlined,
  ShopOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  FileDoneOutlined,
} from "@ant-design/icons";
import { TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import {
  GeographicDistributionChart,
  RegistrationOverviewDonut,
  RegistrationsOverTimeArea,
  SectorWiseBar,
} from "../components/charts";
import DashboardStatCard from "../components/cards/DashboardStatCard";

const { Title, Paragraph, Text } = Typography;

const RegistrationDashboard = () => {
  const [statCardData, setStatCardData] = useState({});
  const [registrationStatus, setRegistrationStatus] = useState({});
  const [timeSeriesData, setTimeSeriesData] = useState([]);
  const [sectorData, setSectorData] = useState([]);
  const [districtData, setDistrictData] = useState([]);
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

      const response = await axiosInstance.get(
        "/api/system/chart/district_users"
      );

      if (response.status === 200) {
        setDistrictData(response.data);
      } else {
        throw new Error("Failed to fetch district data");
      }
    } catch (err) {
      console.error("Error fetching district data:", err);
      setDistrictData([]);
    } finally {
      setDistrictLoading(false);
    }
  };

  const fetchSectorData = async () => {
    try {
      setLoading(true);

      const response = await axiosInstance.get(
        "/api/system/chart/business_products"
      );

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

  const fetchRegistrationTrends = async () => {
    try {
      setLoading(true);

      const response = await axiosInstance.get(
        "/api/system/chart/monthly_registered"
      );

      if (response.status === 200) {
        // Extract the monthlyApprovedUsers array from the response
        setTimeSeriesData(response.data.monthlyApprovedUsers || []);
      } else {
        throw new Error("Failed to fetch time series data");
      }
    } catch (err) {
      console.error("Error fetching time series data:", err);
      setTimeSeriesData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchRegistrationStatus = async () => {
    try {
      setLoading(true);

      const response = await axiosInstance.get(
        "/api/system/chart/active_users"
      );

      if (response.status === 200) {
        setRegistrationStatus(response.data);
      } else {
        throw new Error("Failed to fetch registration status data");
      }
    } catch (err) {
      console.error("Error fetching registration status data:", err);
      setRegistrationStatus([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatCardData();
    fetchDistrictData();
    fetchSectorData();
    fetchRegistrationTrends();
    fetchRegistrationStatus();
  }, []);

  // Create overview data using the fetched API data
  const registrationStatusData = [
    {
      name: "Approved",
      value: registrationStatus.activeUsers || 0,
      color: "#10B981",
    },
    {
      name: "Pending",
      value: registrationStatus.pendingUsers || 0,
      color: "#F59E0B",
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
          <div className="text-red-500 text-lg mb-2">
            Error loading dashboard data
          </div>
          <div className="text-gray-600 mb-4">{error}</div>
          <Button
            onClick={() => {
              fetchStatCardData();
              fetchDistrictData();
              fetchSectorData();
              fetchRegistrationTrends();
              fetchRegistrationStatus();
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <DashboardStatCard
          title="Total Registrations"
          value={statCardData.allRegisteredUsers}
          icon={<UserOutlined />}
          color="#E67324"
        />
        <DashboardStatCard
          title="Issued Certificates"
          value={statCardData.issuedCertificates}
          icon={<FileDoneOutlined />}
          color="#10B981"
        />
        <DashboardStatCard
          title="Pending Approvals"
          value={statCardData.pendingApprovals}
          icon={<ClockCircleOutlined />}
          color="#F59E0B"
        />
        <DashboardStatCard
          title="Total Products"
          value={statCardData.totalProducts}
          icon={<GlobalOutlined />}
          color="#6366F1"
        />
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Registration Overview */}
        <Card className="shadow-lg border-0">
          <div className="flex items-center justify-between">
            <h5 className="flex text-lg font-semibold text-earth-700 justify-center mt-2 mb-2">
              Registration Status
            </h5>
            <CheckCircleOutlined className="text-[#10B981] text-lg" />
          </div>
          <RegistrationOverviewDonut data={registrationStatusData} />
        </Card>

        {/* Trends */}
        <Card className="shadow-lg border-0">
          <div className="flex items-center justify-between">
            <h5 className="flex text-lg font-semibold text-earth-700 justify-center mt-2 mb-2">
              Registration Trends
            </h5>
            <TrendingUp className="text-[#E67324] text-lg" />
          </div>
          <RegistrationsOverTimeArea data={timeSeriesData} />
        </Card>

        {/* Sector Performance */}
        <Card className="shadow-lg border-0">
          <div className="flex items-center justify-between">
            <h5 className="flex text-lg font-semibold text-earth-700 justify-center mt-2 mb-2">
              Sector Performance
            </h5>
            <BarChartOutlined className="text-[#F59E0B] text-lg" />
          </div>
          <SectorWiseBar data={sectorData} />
        </Card>
      </div>

      {/* Geographic Distribution - Full Width */}
      <Card className="shadow-lg border-0">
        <div className="flex items-center justify-between mb-6">
          <h5 className="flex text-lg font-semibold text-earth-700 justify-center mt-2 mb-2">
            Geographic Distribution
          </h5>
          <GlobalOutlined className="text-[#6366F1] text-lg" />
        </div>
        <GeographicDistributionChart
          data={districtData}
          loading={districtLoading}
        />
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
    </div>
  );
};

const Mainpage = () => {
  return (
    <div className="min-h-screen bg-spice-100/10">
      {/* Dashboard Section */}
      <div className="py-6 px-6">
        <RegistrationDashboard />
      </div>
    </div>
  );
};

export default Mainpage;
