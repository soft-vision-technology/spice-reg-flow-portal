
import React from "react";
import { Card, Descriptions, Divider, Tag } from "antd";
import { useFormContext } from "../../contexts/FormContext";
import { CheckCircleOutlined } from "@ant-design/icons";

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

const capitalizeFirst = (text: string) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const FormSummary: React.FC = () => {
  const { role, status, formData } = useFormContext();

  return (
    <Card className="shadow-lg rounded-xl border-0 mt-8">
      <div className="text-center mb-8">
        <CheckCircleOutlined className="text-5xl text-green-500" />
        <h2 className="text-2xl font-bold mt-4 text-earth-700">Registration Summary</h2>
        <p className="text-gray-500">Thank you for completing your registration</p>
      </div>
      
      <Divider>Basic Information</Divider>
      <Descriptions bordered column={{ xxl: 3, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}>
        <Descriptions.Item label="Full Name">{formData.fullName}</Descriptions.Item>
        <Descriptions.Item label="NIC">{formData.nic}</Descriptions.Item>
        <Descriptions.Item label="Gender">{capitalizeFirst(formData.gender)}</Descriptions.Item>
        <Descriptions.Item label="Date of Birth">{formatDate(formData.dob)}</Descriptions.Item>
        <Descriptions.Item label="Email">{formData.email}</Descriptions.Item>
        <Descriptions.Item label="Mobile">{formData.mobileNumber}</Descriptions.Item>
        <Descriptions.Item label="Address" span={3}>{formData.address}</Descriptions.Item>
      </Descriptions>
      
      <Divider>Registration Details</Divider>
      <Descriptions bordered column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }}>
        <Descriptions.Item label="Role">
          <Tag color="orange" className="text-sm py-1 px-2">{capitalizeFirst(role)}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          <Tag color="green" className="text-sm py-1 px-2">{capitalizeFirst(status)}</Tag>
        </Descriptions.Item>
      </Descriptions>
      
      {/* Role-specific information */}
      {role === "entrepreneur" && (
        <>
          <Divider>Business Information</Divider>
          <Descriptions bordered column={{ xxl: 3, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}>
            <Descriptions.Item label="Business Name">{formData.businessName}</Descriptions.Item>
            <Descriptions.Item label="Business Type">{formData.businessType}</Descriptions.Item>
            <Descriptions.Item label="Registration Number">{formData.businessRegistrationNumber}</Descriptions.Item>
            <Descriptions.Item label="Experience">{formData.businessExperience}</Descriptions.Item>
            <Descriptions.Item label="Employees">{formData.numberOfEmployees}</Descriptions.Item>
            <Descriptions.Item label="Annual Revenue">{formData.annualRevenue}</Descriptions.Item>
            <Descriptions.Item label="Business Address" span={3}>{formData.businessAddress}</Descriptions.Item>
          </Descriptions>
        </>
      )}
      
      {role === "exporter" && (
        <>
          <Divider>Export Information</Divider>
          <Descriptions bordered column={{ xxl: 3, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}>
            <Descriptions.Item label="Company Name">{formData.companyName}</Descriptions.Item>
            <Descriptions.Item label="Export License">{formData.exportLicense}</Descriptions.Item>
            <Descriptions.Item label="Years Exporting">{formData.yearsExporting}</Descriptions.Item>
            <Descriptions.Item label="Export Volume">{formData.exportVolume}</Descriptions.Item>
            <Descriptions.Item label="Target Markets" span={2}>{formData.targetMarkets}</Descriptions.Item>
          </Descriptions>
        </>
      )}
      
      {role === "intermediary" && (
        <>
          <Divider>Trading Information</Divider>
          <Descriptions bordered column={{ xxl: 3, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}>
            <Descriptions.Item label="Trading Name">{formData.tradingName}</Descriptions.Item>
            <Descriptions.Item label="Trading License">{formData.tradingLicense}</Descriptions.Item>
            <Descriptions.Item label="Years Trading">{formData.yearsTrading}</Descriptions.Item>
            <Descriptions.Item label="Trading Volume">{formData.tradingVolume}</Descriptions.Item>
            <Descriptions.Item label="Supplier Network" span={2}>{formData.supplierNetwork}</Descriptions.Item>
          </Descriptions>
        </>
      )}
    </Card>
  );
};

export default FormSummary;
