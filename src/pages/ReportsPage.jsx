import React, { useState, useMemo, useEffect } from "react";
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
  message,
  Tooltip,
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
  ReloadOutlined,
  MoneyCollectOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchExistingEntrepreneurs,
  fetchExistingExporters,
  fetchExistingTraders,
  fetchStartingEntrepreneurs,
  fetchStartingExporters,
  fetchStartingTraders,
} from "../store/slices/reportSlice";
import {
  fetchNumEmployeeOptions,
  fetchExperienceOptions,
  selectNumEmployeeOptions,
  selectExperienceOptions,
} from "../store/slices/utilsSlice";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { fetchItems } from "../store/slices/settingsSlice";
import gov_logo from "../assets/Emblem_of_Sri_Lanka.svg.png";
import spice_logo from "../assets/spiceLogo.png";

const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;

const ReportsPage = () => {
  const dispatch = useDispatch();

  const loading = useSelector((state) => state.report.loading);
  const error = useSelector((state) => state.report.error);

  const {
    existingExporters,
    startingExporters,
    existingEntrepreneurs,
    startingEntrepreneurs,
    existingTraders,
    startingTraders,
  } = useSelector((state) => state.report);

  const numberOfEmployeeOptions = useSelector(selectNumEmployeeOptions) || [];
  const experienceOptions = useSelector(selectExperienceOptions) || [];
  const selectAllCertificateTypes = useSelector(
    (state) => state.settings.certificateTypes
  );

  const [filters, setFilters] = useState({
    role: "all",
    businessStatus: "all",
    province: "all",
    district: "all",
    numberOfEmployees: "all",
    businessExperience: "all",
    product: "all",
    searchText: "",
    dateRange: null,
    certificates: null,
  });

  const [activeTab, setActiveTab] = useState("overview");

  const fetchData = async () => {
    await Promise.all([
      dispatch(fetchExistingEntrepreneurs()),
      dispatch(fetchStartingEntrepreneurs()),
      dispatch(fetchExistingExporters()),
      dispatch(fetchStartingExporters()),
      // dispatch(fetchStartingTraders()),
      dispatch(fetchExistingTraders()),
      dispatch(fetchNumEmployeeOptions()),
      dispatch(fetchExperienceOptions()),
      dispatch(fetchItems("certificates")),
    ]);
  };

  useEffect(() => {
    fetchData();
  }, [dispatch]);

  // Combine all data into one array
  const allData = useMemo(() => {
    const combinedData = [
      ...(existingEntrepreneurs || []),
      ...(startingEntrepreneurs || []),
      ...(existingExporters || []),
      ...(startingExporters || []),
      ...(existingTraders || []),
      ...(startingTraders || []),
    ];
    return combinedData;
  }, [
    existingEntrepreneurs,
    startingEntrepreneurs,
    existingExporters,
    startingExporters,
    existingTraders,
    startingTraders,
  ]);

  // Get unique filter options from the data
  const filterOptions = useMemo(() => {
    const provinces = [
      ...new Set(allData.map((item) => item.province?.name).filter(Boolean)),
    ];
    const districts = [
      ...new Set(allData.map((item) => item.district?.name).filter(Boolean)),
    ];
    const roles = [
      ...new Set(allData.map((item) => item.role?.name).filter(Boolean)),
    ];
    const businessStatuses = [
      ...new Set(allData.map((item) => item.businessStatus).filter(Boolean)),
    ];
    const products = [
      ...new Set(
        allData
          .flatMap((item) => {
            const businessData =
              item.exporter || item.entrepreneur || item.intermediaryTrader;
            return (
              businessData?.businessProducts?.map((bp) => bp.product?.name) ||
              []
            );
          })
          .filter(Boolean)
      ),
    ];
    const certificates = [
      ...new Set(
        allData
          .flatMap((item) => {
            const certificateData = item.exporter || item.entrepreneur;
            // console.log(certificateData?.certificateId)
            return certificateData?.certificateId || [];
          })
          .filter(Boolean)
      ),
    ];
    return {
      provinces,
      districts,
      roles,
      businessStatuses,
      products,
      certificates,
    };
  }, [allData]);

  const filteredData = useMemo(() => {
    return allData.filter((item) => {
      const matchesRole =
        filters.role === "all" || item.role?.name === filters.role;
      const matchesBusinessStatus =
        filters.businessStatus === "all" ||
        item.businessStatus === filters.businessStatus;
      const matchesProvince =
        filters.province === "all" || item.province?.name === filters.province;
      const matchesDistrict =
        filters.district === "all" || item.district?.name === filters.district;

      // Business-specific filters
      const businessData =
        item.exporter || item.entrepreneur || item.intermediaryTrader;
      const matchesEmployees =
        filters.numberOfEmployees === "all" ||
        businessData?.numberOfEmployee?.id?.toString() ===
          filters.numberOfEmployees;

      const matchesExperience =
        filters.businessExperience === "all" ||
        businessData?.businessExperience?.id?.toString() ===
          filters.businessExperience;

      // Product filter
      const matchesProduct =
        filters.product === "all" ||
        businessData?.businessProducts?.some(
          (bp) => bp.product?.name === filters.product
        );

      const matchesSearch =
        filters.searchText === "" ||
        item.name?.toLowerCase().includes(filters.searchText.toLowerCase()) ||
        item.email?.toLowerCase().includes(filters.searchText.toLowerCase()) ||
        item.nic?.toLowerCase().includes(filters.searchText.toLowerCase()) ||
        businessData?.businessName
          ?.toLowerCase()
          .includes(filters.searchText.toLowerCase());

      // Date range filter
      const matchesDateRange =
        !filters.dateRange ||
        (new Date(item.createdAt) >= filters.dateRange[0] &&
          new Date(item.createdAt) <= filters.dateRange[1]);

      const matchesCertificate =
        filters.certificates === null ||
        (Array.isArray(businessData?.certificateId)
          ? businessData.certificateId.includes(filters.certificates)
          : businessData?.certificateId === filters.certificates);

      return (
        matchesRole &&
        matchesBusinessStatus &&
        matchesProvince &&
        matchesDistrict &&
        matchesEmployees &&
        matchesExperience &&
        matchesProduct &&
        matchesSearch &&
        matchesDateRange &&
        matchesCertificate
      );
    });
  }, [allData, filters]);

  const stats = useMemo(() => {
    const total = filteredData.length;
    const entrepreneurs = filteredData.filter(
      (item) => item.role?.name === "Entrepreneur"
    ).length;
    const exporters = filteredData.filter(
      (item) => item.role?.name === "Exporter"
    ).length;
    const traders = filteredData.filter(
      (item) => item.role?.name === "IntermediaryTrader"
    ).length;
    const starting = filteredData.filter(
      (item) => item.businessStatus === "STARTING"
    ).length;
    const existing = filteredData.filter(
      (item) => item.businessStatus === "EXISTING"
    ).length;

    return { total, entrepreneurs, exporters, traders, starting, existing };
  }, [filteredData]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      role: "all",
      businessStatus: "all",
      province: "all",
      district: "all",
      numberOfEmployees: "all",
      businessExperience: "all",
      searchText: "",
      dateRange: null,
    });
  };
  const exportToExcel = (tabData = null, tabName = "All Data") => {
    try {
      // Use tabData if provided, otherwise use filteredData
      const dataToExport = tabData || filteredData;

      const exportData = dataToExport.map((item) => {
        const businessData =
          item.exporter || item.entrepreneur || item.intermediaryTrader;
        const products =
          businessData?.businessProducts
            ?.map((bp) => `${bp.product?.name}: ${bp.value || "No value"}`)
            .join(", ") || "N/A";

        return {
          "Serial No:": item.serialNumber || "N/A",
          Name: `${item.title || ""} ${item.name || ""}`.trim(),
          Initials: item.initials || "N/A",
          NIC: item.nic || "N/A",
          Role: item.role?.name || "N/A",
          "Business Status": item.businessStatus || "N/A",
          Province: item.province?.name || "N/A",
          District: item.district?.name || "N/A",
          "DS Division": item.dsDivision || "N/A",
          "GN Division": item.gnDivision || "N/A",
          "Contact Number": item.contactNumber || "N/A",
          Email: item.email || "N/A",
          Address: item.address || "N/A",
          "Business Name": businessData?.businessName || "N/A",
          "Business Reg No": businessData?.businessRegNo || "N/A",
          "Business Address": businessData?.businessAddress || "N/A",
          "Number of Employees": businessData?.numberOfEmployee?.name || "N/A",
          "Business Experience":
            businessData?.businessExperience?.name || "N/A",
          "Business Start Date": businessData?.businessStartDate
            ? new Date(businessData.businessStartDate).toLocaleDateString()
            : "N/A",
          "Business Description": businessData?.businessDescription || "N/A",
          Products: products,
          "Registration Date": item.createdAt
            ? new Date(item.createdAt).toLocaleDateString()
            : "N/A",
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(exportData);

      // Auto-size columns
      const colWidths = [];
      const headers = Object.keys(exportData[0] || {});
      headers.forEach((header, index) => {
        const maxLength = Math.max(
          header.length,
          ...exportData.map((row) => String(row[header] || "").length)
        );
        colWidths.push({ wch: Math.min(maxLength + 2, 50) });
      });
      worksheet["!cols"] = colWidths;

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, tabName);

      const fileName = `${tabName.toLowerCase().replace(/\s+/g, "_")}_${
        new Date().toISOString().split("T")[0]
      }.xlsx`;
      XLSX.writeFile(workbook, fileName);

      message.success(
        `Excel file exported successfully! (${exportData.length} records)`
      );
    } catch (error) {
      message.error("Failed to export Excel file");
      console.error("Export error:", error);
    }
  };

  const exportToPDF = (tabData = null, tabName = "All Data") => {
    try {
      // Use tabData if provided, otherwise use filteredData
      const dataToExport = tabData || filteredData;
      const doc = new jsPDF("l", "mm", "a4"); // Landscape orientation for better table fit

      doc.addImage(gov_logo, "PNG", 15, 10, 20, 25);
      doc.addImage(spice_logo, "PNG", 265, 10, 30, 30);

      // Add title
      doc.setFontSize(14);
      doc.setTextColor(41, 128, 185);
      doc.text(
        "කුළුබඩු හා ඒ ආශ්‍රිත නිෂ්පාදන අලෙවි මණ්ඩලය",
        doc.internal.pageSize.getWidth() / 2,
        18,
        { align: "center" }
      );
      doc.setFontSize(10);
      doc.text(
        "மசாலாவும் அது தொடர்பானது தயாரிப்புகள் சந்தைப்படுத்தல் வாரியம்",
        doc.internal.pageSize.getWidth() / 2,
        24,
        { align: "center" }
      );
      doc.setFontSize(12);
      doc.text(
        "Spices and Allied Products Marketing Board",
        doc.internal.pageSize.getWidth() / 2,
        30,
        { align: "center" }
      );

      doc.setFontSize(11);
      doc.text(
        "වැවිලි සහ ප්‍රජා යටිතල පහසුකම් අමාත්‍යංසය",
        doc.internal.pageSize.getWidth() / 2,
        36,
        { align: "center" }
      );
      doc.setFontSize(9);
      doc.text(
        "பெருந்தோட்ட மற்றும் சமூக உட்கட்டமைப்பு வசதிகள் அமைச்சர்",
        doc.internal.pageSize.getWidth() / 2,
        41,
        { align: "center" }
      );
      doc.setFontSize(10);
      doc.text(
        "Ministry of Plantation and Community Infrastructure",
        doc.internal.pageSize.getWidth() / 2,
        46,
        { align: "center" }
      );

      // Add summary stats for the current tab
      const tabStats = {
        total: dataToExport.length,
        entrepreneurs: dataToExport.filter(
          (item) => item.role?.name === "Entrepreneur"
        ).length,
        exporters: dataToExport.filter((item) => item.role?.name === "Exporter")
          .length,
        traders: dataToExport.filter(
          (item) => item.role?.name === "IntermediaryTrader"
        ).length,
        starting: dataToExport.filter(
          (item) => item.businessStatus === "STARTING"
        ).length,
        existing: dataToExport.filter(
          (item) => item.businessStatus === "EXISTING"
        ).length,
      };

      doc.setFontSize(10);
      let yPosition = 52;
      doc.text(`Total Records: ${tabStats.total}`, 20, yPosition);
      doc.text(`Entrepreneurs: ${tabStats.entrepreneurs}`, 80, yPosition);
      doc.text(`Exporters: ${tabStats.exporters}`, 140, yPosition);
      doc.text(`Traders: ${tabStats.traders}`, 190, yPosition);

      yPosition += 8;
      doc.text(`Starting: ${tabStats.starting}`, 20, yPosition);
      doc.text(`Existing: ${tabStats.existing}`, 80, yPosition);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 140, yPosition);

      // Prepare table data with more columns for landscape
      const tableData = dataToExport.map((item) => {
        const businessData =
          item.exporter || item.entrepreneur || item.intermediaryTrader;
        const products =
          businessData?.businessProducts
            ?.slice(0, 3)
            .map((bp) => bp.product?.name)
            .join(", ") || "N/A";

        return [
          item.serialNumber || "N/A",
          `${item.title || ""} ${item.name || ""}`.trim(),
          item.role?.name || "N/A",
          item.businessStatus || "N/A",
          `${item.district?.name || ""}, ${item.province?.name || ""}`
            .replace(", ,", "")
            .trim() || "N/A",
          businessData?.businessName || "N/A",
          businessData?.numberOfEmployee?.name || "N/A",
          businessData?.businessExperience?.name || "N/A",
          products.length > 50 ? products.substring(0, 47) + "..." : products,
          item.contactNumber || "N/A",
          item.createdAt
            ? new Date(item.createdAt).toLocaleDateString()
            : "N/A",
        ];
      });

      autoTable(doc, {
        head: [
          [
            "Serial No",
            "Name",
            "Role",
            "Status",
            "Location",
            "Business",
            "Employees",
            "Experience",
            "Products",
            "Contact",
            "Date",
          ],
        ],
        body: tableData,
        startY: yPosition + 15,
        styles: {
          fontSize: 7,
          cellPadding: 2,
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontSize: 8,
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        margin: { left: 10, right: 10 },
        columnStyles: {
          0: { cellWidth: 25 }, // Name
          1: { cellWidth: 20 }, // Role
          2: { cellWidth: 18 }, // Status
          3: { cellWidth: 30 }, // Location
          4: { cellWidth: 35 }, // Business
          5: { cellWidth: 20 }, // Employees
          6: { cellWidth: 20 }, // Experience
          7: { cellWidth: 40 }, // Products
          8: { cellWidth: 25 }, // Contact
          9: { cellWidth: 20 }, // Date
          10: { cellWidth: 20 },
        },
        didDrawPage: function (data) {
          // Add page numbers
          const pageCount = doc.internal.getNumberOfPages();
          const pageSize = doc.internal.pageSize;
          const pageHeight = pageSize.height
            ? pageSize.height
            : pageSize.getHeight();

          for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.text(
              `Page ${i} of ${pageCount}`,
              pageSize.width - 30,
              pageHeight - 10
            );
          }
        },
      });

      const fileName = `${tabName.toLowerCase().replace(/\s+/g, "_")}_${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      doc.save(fileName);

      message.success(
        `PDF file exported successfully! (${dataToExport.length} records)`
      );
    } catch (error) {
      message.error("Failed to export PDF file");
      console.error("Export error:", error);
    }
  };

  // Updated export menu with tab-specific options
  const getExportMenu = (currentTabData, currentTabName) => ({
    items: [
      {
        key: "excel-current",
        icon: <FileExcelOutlined />,
        label: `Export ${currentTabName} to Excel`,
        onClick: () => exportToExcel(currentTabData, currentTabName),
      },
      {
        key: "pdf-current",
        icon: <FilePdfOutlined />,
        label: `Export ${currentTabName} to PDF`,
        onClick: () => exportToPDF(currentTabData, currentTabName),
      },
      {
        type: "divider",
      },
      {
        key: "excel-all",
        icon: <FileExcelOutlined />,
        label: "Export All Data to Excel",
        onClick: () => exportToExcel(filteredData, "All Data"),
      },
      {
        key: "pdf-all",
        icon: <FilePdfOutlined />,
        label: "Export All Data to PDF",
        onClick: () => exportToPDF(filteredData, "All Data"),
      },
    ],
  });

  // Helper function to get current tab data and name
  const getCurrentTabInfo = () => {
    switch (activeTab) {
      case "entrepreneurs":
        return {
          data: getDataByRole("Entrepreneur"),
          name: "Entrepreneurs",
        };
      case "exporters":
        return {
          data: getDataByRole("Exporter"),
          name: "Exporters",
        };
      case "traders":
        return {
          data: getDataByRole("IntermediaryTrader"),
          name: "Traders",
        };
      case "starting":
        return {
          data: getDataByStatus("STARTING"),
          name: "Starting Businesses",
        };
      case "existing":
        return {
          data: getDataByStatus("EXISTING"),
          name: "Existing Businesses",
        };
      default:
        return {
          data: filteredData,
          name: "Overview",
        };
    }
  };

  const getColumns = (type) => {
    const baseColumns = [
      {
        title: "Serial No",
        dataIndex: "serialNumber",
        key: "serialNumber",
        sorter: (a, b) =>
          (a.serialNumber || "").localeCompare(b.serialNumber || ""),
        render: (serialNumber) => (
          <div>
            <div className="font-normal">{serialNumber}</div>
          </div>
        ),
        width: 120,
      },
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        sorter: (a, b) => (a.name || "").localeCompare(b.name || ""),
        render: (name, record) => (
          <div>
            <div className="font-medium">
              {record.title} {name}
            </div>
            <div className="text-sm text-gray-500">{record.initials}</div>
          </div>
        ),
        width: 200,
      },
      {
        title: "Role",
        dataIndex: ["role", "name"],
        key: "role",
        render: (role) => {
          const color =
            role === "Entrepreneur"
              ? "blue"
              : role === "Exporter"
              ? "green"
              : "orange";
          return <Tag color={color}>{role}</Tag>;
        },
        width: 120,
      },
      {
        title: "Business Status",
        dataIndex: "businessStatus",
        key: "businessStatus",
        render: (status) => (
          <Tag color={status === "EXISTING" ? "green" : "blue"}>{status}</Tag>
        ),
        width: 120,
      },
      {
        title: "Location",
        key: "location",
        render: (_, record) => (
          <div>
            <div>{record.district?.name}</div>
            <div className="text-sm text-gray-500">
              {record.certificate?.id}
            </div>
          </div>
        ),
        width: 150,
      },
      {
        title: "Contact",
        key: "contact",
        render: (_, record) => (
          <div>
            <div className="text-sm">{record.email}</div>
            <div className="text-sm text-gray-500">{record.contactNumber}</div>
          </div>
        ),
        width: 200,
      },
      {
        title: "NIC",
        dataIndex: "nic",
        key: "nic",
        width: 120,
      },
      {
        title: "Registration Date",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (date) => new Date(date).toLocaleDateString(),
        sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        width: 120,
      },
    ];

    // Add business-specific columns for detailed views
    if (
      [
        "entrepreneurs",
        "exporters",
        "traders",
        "starting",
        "existing",
      ].includes(type)
    ) {
      const businessColumns = [
        {
          title: "Business Name",
          key: "businessName",
          render: (_, record) => {
            const businessData =
              record.exporter ||
              record.entrepreneur ||
              record.intermediaryTrader;
            return businessData?.businessName || "N/A";
          },
          width: 150,
        },
        {
          title: "Employees",
          key: "employees",
          render: (_, record) => {
            const businessData =
              record.exporter ||
              record.entrepreneur ||
              record.intermediaryTrader;
            return businessData?.numberOfEmployee?.name || "N/A";
          },
          width: 120,
        },
        {
          title: "Experience",
          key: "experience",
          render: (_, record) => {
            const businessData =
              record.exporter ||
              record.entrepreneur ||
              record.intermediaryTrader;
            return businessData?.businessExperience?.name || "N/A";
          },
          width: 120,
        },
        {
          title: "Products",
          key: "products",
          render: (_, record) => {
            const businessData =
              record.exporter ||
              record.entrepreneur ||
              record.intermediaryTrader;
            const products =
              businessData?.businessProducts
                ?.slice(0, 2)
                .map((bp) => bp.product?.name) || [];
            const hasMore = businessData?.businessProducts?.length > 2;

            return (
              <div>
                {products.map((product, index) => (
                  <Tag key={index} size="small" className="mb-1">
                    {product}
                  </Tag>
                ))}
                {hasMore && (
                  <Tooltip
                    title={businessData.businessProducts
                      .map((bp) => bp.product?.name)
                      .join(", ")}
                  >
                    <Tag size="small">
                      +{businessData.businessProducts.length - 2} more
                    </Tag>
                  </Tooltip>
                )}
              </div>
            );
          },
          width: 150,
        },
      ];

      return [...baseColumns, ...businessColumns];
    }

    return baseColumns;
  };

  const getDataByRole = (role) => {
    return filteredData.filter((item) => item.role?.name === role);
  };

  const getDataByStatus = (status) => {
    return filteredData.filter((item) => item.businessStatus === status);
  };

  const exportMenu = {
    items: [
      {
        key: "excel",
        icon: <FileExcelOutlined />,
        label: "Export to Excel",
        onClick: exportToExcel,
      },
      {
        key: "pdf",
        icon: <FilePdfOutlined />,
        label: "Export to PDF",
        onClick: exportToPDF,
      },
    ],
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading reports...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-8">
        <div className="text-lg mb-2">Error loading reports</div>
        <div>{error}</div>
        <Button
          type="primary"
          onClick={fetchData}
          className="mt-4"
          icon={<ReloadOutlined />}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
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
            <Dropdown
              menu={getExportMenu(
                getCurrentTabInfo().data,
                getCurrentTabInfo().name
              )}
              trigger={["click"]}
            >
              <Button type="primary" icon={<DownloadOutlined />}>
                Export Data
              </Button>
            </Dropdown>
          </Space>
        </div>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select
              placeholder="Product"
              value={filters.product}
              onChange={(value) => handleFilterChange("product", value)}
              className="w-full"
              allowClear
            >
              <Option value="all">All Products</Option>
              {filterOptions.products.map((product) => (
                <Option key={product} value={product}>
                  {product}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select
              placeholder="Select Role"
              value={filters.role}
              onChange={(value) => handleFilterChange("role", value)}
              className="w-full"
            >
              <Option value="all">All Roles</Option>
              {filterOptions.roles.map((role) => (
                <Option key={role} value={role}>
                  {role}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select
              placeholder="Business Status"
              value={filters.businessStatus}
              onChange={(value) => handleFilterChange("businessStatus", value)}
              className="w-full"
            >
              <Option value="all">All Status</Option>
              {filterOptions.businessStatuses.map((status) => (
                <Option key={status} value={status}>
                  {status.charAt(0) + status.slice(1).toLowerCase()}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select
              placeholder="Province"
              value={filters.province}
              onChange={(value) => handleFilterChange("province", value)}
              className="w-full"
            >
              <Option value="all">All Provinces</Option>
              {filterOptions.provinces.map((province) => (
                <Option key={province} value={province}>
                  {province}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select
              placeholder="District"
              value={filters.district}
              onChange={(value) => handleFilterChange("district", value)}
              className="w-full"
            >
              <Option value="all">All Districts</Option>
              {filterOptions.districts.map((district) => (
                <Option key={district} value={district}>
                  {district}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select
              placeholder="Number of Employees"
              value={filters.numberOfEmployees}
              onChange={(value) =>
                handleFilterChange("numberOfEmployees", value)
              }
              className="w-full"
            >
              <Option value="all">All Employee Counts</Option>
              {numberOfEmployeeOptions?.map((emp) => (
                <Option key={emp.id} value={emp.id.toString()}>
                  {emp.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select
              placeholder="Business Experience"
              value={filters.businessExperience}
              onChange={(value) =>
                handleFilterChange("businessExperience", value)
              }
              className="w-full"
            >
              <Option value="all">All Experience Levels</Option>
              {experienceOptions?.map((exp) => (
                <Option key={exp.id} value={exp.id.toString()}>
                  {exp.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select
              placeholder="Certificate"
              value={filters.certificates}
              onChange={(value) => handleFilterChange("certificates", value)}
              className="w-full"
              allowClear
            >
              <Option value={null}>All Certificates</Option>
              {filterOptions.certificates.map((certId) => {
                const certType = selectAllCertificateTypes?.find(
                  (item) => item.id === certId
                );
                return (
                  <Option key={certId} value={certId}>
                    {certType?.name || `Certificate ${certId}`}
                  </Option>
                );
              })}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Input
              placeholder="Search by name, email, NIC..."
              prefix={<SearchOutlined />}
              value={filters.searchText}
              onChange={(e) => handleFilterChange("searchText", e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <RangePicker
              placeholder={["Start Date", "End Date"]}
              value={filters.dateRange}
              onChange={(dates) => handleFilterChange("dateRange", dates)}
              className="w-full"
            />
          </Col>
        </Row>
      </Card>

      {/* Tabbed Tables */}
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab} type="card">
          <TabPane tab={`Overview (${filteredData.length})`} key="overview">
            <Table
              columns={getColumns("overview")}
              dataSource={filteredData}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} items`,
              }}
              scroll={{ x: 1200 }}
              size="small"
            />
          </TabPane>

          <TabPane
            tab={`Entrepreneurs (${getDataByRole("Entrepreneur").length})`}
            key="entrepreneurs"
          >
            <Table
              columns={getColumns("entrepreneurs")}
              dataSource={getDataByRole("Entrepreneur")}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
              }}
              scroll={{ x: 1600 }}
              size="small"
            />
          </TabPane>

          <TabPane
            tab={`Exporters (${getDataByRole("Exporter").length})`}
            key="exporters"
          >
            <Table
              columns={getColumns("exporters")}
              dataSource={getDataByRole("Exporter")}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
              }}
              scroll={{ x: 1600 }}
              size="small"
            />
          </TabPane>

          <TabPane
            tab={`Traders (${getDataByRole("IntermediaryTrader").length})`}
            key="traders"
          >
            <Table
              columns={getColumns("traders")}
              dataSource={getDataByRole("IntermediaryTrader")}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
              }}
              scroll={{ x: 1600 }}
              size="small"
            />
          </TabPane>

          <TabPane
            tab={`Starting (${getDataByStatus("STARTING").length})`}
            key="starting"
          >
            <Table
              columns={getColumns("starting")}
              dataSource={getDataByStatus("STARTING")}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
              }}
              scroll={{ x: 1600 }}
              size="small"
            />
          </TabPane>

          <TabPane
            tab={`Existing (${getDataByStatus("EXISTING").length})`}
            key="existing"
          >
            <Table
              columns={getColumns("existing")}
              dataSource={getDataByStatus("EXISTING")}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
              }}
              scroll={{ x: 1600 }}
              size="small"
            />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default ReportsPage;
