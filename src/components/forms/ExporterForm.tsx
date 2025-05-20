
import React from "react";
import { Form, Input, Select, InputNumber, DatePicker, Upload, Button, Row, Col, Checkbox } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useFormContext } from "../../contexts/FormContext";

const { Option } = Select;

const certificateOptions = [
  { label: "ISO", value: 1 },
  { label: "GMP", value: 2 },
  { label: "Organic", value: 3 },
  { label: "Fair Trade", value: 4 },
  { label: "HACCP", value: 5 },
];

const marketRegionOptions = [
  { label: "North America", value: "north_america" },
  { label: "Europe", value: "europe" },
  { label: "Middle East", value: "middle_east" },
  { label: "Asia", value: "asia" },
  { label: "Australia", value: "australia" },
  { label: "Africa", value: "africa" },
];

const spiceExportOptions = [
  { label: "Cinnamon", value: "cinnamon" },
  { label: "Pepper", value: "pepper" },
  { label: "Cardamom", value: "cardamom" },
  { label: "Cloves", value: "cloves" },
  { label: "Nutmeg", value: "nutmeg" },
  { label: "Turmeric", value: "turmeric" },
];

const ExporterForm: React.FC = () => {
  const { updateFormData } = useFormContext();

  const handleChange = (_: any, allValues: any) => {
    updateFormData(allValues);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-xl font-medium text-earth-700 mb-6">Export Operation Information</h3>
      
      <Form layout="vertical" onValuesChange={handleChange}>
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Company Name"
              name="companyName"
              rules={[{ required: true, message: "Please enter company name" }]}
            >
              <Input placeholder="Global Spice Exports Ltd." />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Export License Number"
              name="exportLicense"
              rules={[{ required: true, message: "Please enter export license" }]}
            >
              <Input placeholder="EXP12345" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Years in Export Business"
              name="yearsExporting"
              rules={[{ required: true, message: "Please enter years in exports" }]}
            >
              <Select placeholder="Select years">
                <Option value="less_than_1">Less than 1 year</Option>
                <Option value="1_to_3">1 - 3 years</Option>
                <Option value="4_to_10">4 - 10 years</Option>
                <Option value="more_than_10">More than 10 years</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Annual Export Volume (Tons)"
              name="exportVolume"
              rules={[{ required: true, message: "Please enter export volume" }]}
            >
              <InputNumber min={1} className="w-full" placeholder="100" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24}>
            <Form.Item
              label="Export Spice Products"
              name="exportProducts"
              rules={[{ required: true, message: "Please select at least one product" }]}
            >
              <Select
                mode="multiple"
                placeholder="Select export products"
                options={spiceExportOptions}
                className="w-full"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24}>
            <Form.Item
              label="Target Export Markets"
              name="targetMarkets"
              rules={[{ required: true, message: "Please select at least one market" }]}
            >
              <Select
                mode="multiple"
                placeholder="Select target markets"
                options={marketRegionOptions}
                className="w-full"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24}>
            <Form.Item
              label="Export Certifications"
              name="exportCertifications"
              rules={[{ required: true, message: "Please select at least one certification" }]}
            >
              <Checkbox.Group options={certificateOptions} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Upload Export License"
              name="exportLicenseDoc"
              rules={[{ required: true, message: "Please upload export license" }]}
            >
              <Upload maxCount={1} accept=".pdf,.jpg,.png">
                <Button icon={<UploadOutlined />}>Upload License</Button>
              </Upload>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Upload Certification Documents"
              name="certificationDocs"
            >
              <Upload multiple accept=".pdf,.jpg,.png">
                <Button icon={<UploadOutlined />}>Upload Certificates</Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Export Processing Facility Address"
              name="facilityAddress"
              rules={[{ required: true, message: "Please enter facility address" }]}
            >
              <Input.TextArea rows={2} placeholder="123 Export Zone, Colombo" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default ExporterForm;
