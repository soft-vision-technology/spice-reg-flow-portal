import React, { useState, useMemo } from "react";
import { 
  Tabs, 
  Table, 
  Card, 
  Select, 
  Button, 
  Space, 
  Row, 
  Col, 
  Statistic,
  Tag,
  Input,
  DatePicker,
  Dropdown,
  message
} from "antd";
import { 
  DownloadOutlined, 
  FilterOutlined, 
  UserOutlined,
  ShopOutlined,
  GlobalOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  SearchOutlined,
  ReloadOutlined
} from "@ant-design/icons";
import { useFormContext } from "../contexts/FormContext";

const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;

const mockData = [
  {
    id: 1,
    fullName: "John Doe",
    role: "entrepreneur",
    businessSize: "small",
    spiceType: "cinnamon",
    province: "Western",
    district: "Colombo",
    dsDivision: "Colombo",
    gnDivision: "Colombo 01",
    businessName: "Spice Masters Ltd",
    email: "john@spicemasters.com",
    mobile: "+94771234567",
    registrationDate: "2024-01-15",
    status: "active"
  },
  {
    id: 2,
    fullName: "Jane Smith",
    role: "exporter",
    businessSize: "medium",
    spiceType: "pepper",
    province: "Southern",
    district: "Galle",
    dsDiv: "Galle",
    gnDivision: "Galle Town",
    companyName: "Ceylon Exports Co.",
    email: "jane@ceylonexports.com",
    mobile: "+94771234568",
    registrationDate: "2024-02-20",
    status: "active"
  },
  {
    id: 3,
    fullName: "Mike Johnson",
    role: "intermediary",
    businessSize: "micro",
    spiceType: "cardamom",
    province: "Central",
    district: "Kandy",
    dsDiv: "Kandy",
    gnDivision: "Kandy City",
    tradingName: "Spice Link Trading",
    email: "mike@spicelink.com",
    mobile: "+94771234569",
    registrationDate: "2024-03-10",
    status: "pending"
  }
];

const ReportsPage = () => {
  const { formData } = useFormContext();
  
  const [filters, setFilters] = useState({
    role: 'all',
    businessSize: 'all',
    spiceType: 'all',
    province: 'all',
    district: 'all',
    dsDiv: 'all',
    gnDivision: 'all',
    status: 'all',
    searchText: '',
    dateRange: null
  });

  const [activeTab, setActiveTab] = useState('overview');

  const filterOptions = {
    roles: ['entrepreneur', 'exporter', 'intermediary'],
    businessSizes: ['micro', 'small', 'medium'],
    spiceTypes: ['cinnamon', 'pepper', 'cardamom', 'cloves', 'nutmeg'],
    provinces: ['Western', 'Central', 'Southern', 'Northern', 'Eastern', 'North Western', 'North Central', 'Uva', 'Sabaragamuwa'],
    districts: ['Colombo', 'Galle', 'Kandy', 'Jaffna', 'Batticaloa'],
    statuses: ['active', 'pending', 'inactive']
  };

  const filteredData = useMemo(() => {
    return mockData.filter(item => {
      const matchesRole = filters.role === 'all' || item.role === filters.role;
      const matchesSize = filters.businessSize === 'all' || item.businessSize === filters.businessSize;
      const matchesSpice = filters.spiceType === 'all' || item.spiceType === filters.spiceType;
      const matchesProvince = filters.province === 'all' || item.province === filters.province;
      const matchesDistrict = filters.district === 'all' || item.district === filters.district;
      const matchesStatus = filters.status === 'all' || item.status === filters.status;
      const matchesSearch = filters.searchText === '' || 
        item.fullName.toLowerCase().includes(filters.searchText.toLowerCase()) ||
        item.email.toLowerCase().includes(filters.searchText.toLowerCase());

      return matchesRole && matchesSize && matchesSpice && matchesProvince && 
             matchesDistrict && matchesStatus && matchesSearch;
    });
  }, [filters]);

  const stats = useMemo(() => {
    const total = filteredData.length;
    const entrepreneurs = filteredData.filter(item => item.role === 'entrepreneur').length;
    const exporters = filteredData.filter(item => item.role === 'exporter').length;
    const intermediaries = filteredData.filter(item => item.role === 'intermediary').length;
    const active = filteredData.filter(item => item.status === 'active').length;

    return { total, entrepreneurs, exporters, intermediaries, active };
  }, [filteredData]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      role: 'all',
      businessSize: 'all',
      spiceType: 'all',
      province: 'all',
      district: 'all',
      dsDiv: 'all',
      gnDivision: 'all',
      status: 'all',
      searchText: '',
      dateRange: null
    });
  };

  const exportToExcel = () => {
    message.success('Exporting to Excel...');
  };

  const exportToPDF = () => {
    message.success('Exporting to PDF...');
  };

  const getColumns = (type) => {
    const baseColumns = [
      {
        title: 'Name',
        dataIndex: 'fullName',
        key: 'fullName',
        sorter: (a, b) => a.fullName.localeCompare(b.fullName),
      },
      {
        title: 'Role',
        dataIndex: 'role',
        key: 'role',
        render: (role) => (
          <Tag color={role === 'entrepreneur' ? 'blue' : role === 'exporter' ? 'green' : 'orange'}>
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </Tag>
        ),
      },
      {
        title: 'Business Size',
        dataIndex: 'businessSize',
        key: 'businessSize',
        render: (size) => (
          <Tag color={size === 'micro' ? 'red' : size === 'small' ? 'orange' : 'green'}>
            {size.charAt(0).toUpperCase() + size.slice(1)}
          </Tag>
        ),
      },
      {
        title: 'Location',
        key: 'location',
        render: (_, record) => `${record.district}, ${record.province}`,
      },
      {
        title: 'Contact',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status) => (
          <Tag color={status === 'active' ? 'green' : status === 'pending' ? 'orange' : 'red'}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Tag>
        ),
      }
    ];

    if (type === 'entrepreneurs') {
      return [
        ...baseColumns,
        {
          title: 'Business Name',
          dataIndex: 'businessName',
          key: 'businessName',
        }
      ];
    } else if (type === 'exporters') {
      return [
        ...baseColumns,
        {
          title: 'Company Name',
          dataIndex: 'companyName',
          key: 'companyName',
        }
      ];
    } else if (type === 'intermediaries') {
      return [
        ...baseColumns,
        {
          title: 'Trading Name',
          dataIndex: 'tradingName',
          key: 'tradingName',
        }
      ];
    }

    return baseColumns;
  };

  const getDataByRole = (role) => {
    return filteredData.filter(item => item.role === role);
  };

  const exportMenu = {
    items: [
      {
        key: 'excel',
        icon: <FileExcelOutlined />,
        label: 'Export to Excel',
        onClick: exportToExcel,
      },
      {
        key: 'pdf',
        icon: <FilePdfOutlined />,
        label: 'Export to PDF',
        onClick: exportToPDF,
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      {/* Statistics Cards */}
      <Row gutter={16} className="mb-8">
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Registrations"
              value={stats.total}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Entrepreneurs"
              value={stats.entrepreneurs}
              prefix={<ShopOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Exporters"
              value={stats.exporters}
              prefix={<GlobalOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Active Users"
              value={stats.active}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <FilterOutlined className="mr-2" />
            Filters
          </h3>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={resetFilters}>
              Reset Filters
            </Button>
            <Dropdown menu={exportMenu} trigger={['click']}>
              <Button type="primary" icon={<DownloadOutlined />}>
                Export Data
              </Button>
            </Dropdown>
          </Space>
        </div>

        <Row gutter={16}>
          <Col span={4}>
            <Select
              placeholder="Role"
              value={filters.role}
              onChange={(value) => handleFilterChange('role', value)}
              className="w-full"
            >
              <Option value="all">All Roles</Option>
              {filterOptions.roles.map(role => (
                <Option key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="Business Size"
              value={filters.businessSize}
              onChange={(value) => handleFilterChange('businessSize', value)}
              className="w-full"
            >
              <Option value="all">All Sizes</Option>
              {filterOptions.businessSizes.map(size => (
                <Option key={size} value={size}>
                  {size.charAt(0).toUpperCase() + size.slice(1)}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="Spice Type"
              value={filters.spiceType}
              onChange={(value) => handleFilterChange('spiceType', value)}
              className="w-full"
            >
              <Option value="all">All Spices</Option>
              {filterOptions.spiceTypes.map(spice => (
                <Option key={spice} value={spice}>
                  {spice.charAt(0).toUpperCase() + spice.slice(1)}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="Province"
              value={filters.province}
              onChange={(value) => handleFilterChange('province', value)}
              className="w-full"
            >
              <Option value="all">All Provinces</Option>
              {filterOptions.provinces.map(province => (
                <Option key={province} value={province}>{province}</Option>
              ))}
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="District"
              value={filters.district}
              onChange={(value) => handleFilterChange('district', value)}
              className="w-full"
            >
              <Option value="all">All Districts</Option>
              {filterOptions.districts.map(district => (
                <Option key={district} value={district}>{district}</Option>
              ))}
            </Select>
          </Col>
          <Col span={4}>
            <Input
              placeholder="Search..."
              prefix={<SearchOutlined />}
              value={filters.searchText}
              onChange={(e) => handleFilterChange('searchText', e.target.value)}
            />
          </Col>
        </Row>
      </Card>

      {/* Tabbed Tables */}
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab={`Overview (${filteredData.length})`} key="overview">
            <Table
              columns={getColumns('overview')}
              dataSource={filteredData}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
              }}
              scroll={{ x: 800 }}
            />
          </TabPane>
          
          <TabPane tab={`Entrepreneurs (${getDataByRole('entrepreneur').length})`} key="entrepreneurs">
            <Table
              columns={getColumns('entrepreneurs')}
              dataSource={getDataByRole('entrepreneur')}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
              }}
              scroll={{ x: 800 }}
            />
          </TabPane>
          
          <TabPane tab={`Exporters (${getDataByRole('exporter').length})`} key="exporters">
            <Table
              columns={getColumns('exporters')}
              dataSource={getDataByRole('exporter')}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
              }}
              scroll={{ x: 800 }}
            />
          </TabPane>
          
          <TabPane tab={`Intermediaries (${getDataByRole('intermediary').length})`} key="intermediaries">
            <Table
              columns={getColumns('intermediaries')}
              dataSource={getDataByRole('intermediary')}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
              }}
              scroll={{ x: 800 }}
            />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default ReportsPage;