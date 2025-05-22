import React from "react";
import { Form, Input, Select, InputNumber, DatePicker, Upload, Button, Row, Col, Checkbox } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useFormContext } from "../../contexts/FormContext";



const { Option } = Select;

const businessExperienceOptions = [
  { label: "Less than 1 year", value: 1 },
  { label: "1-3 years", value: 2 },
  { label: "More than 3 years", value: 3 },
];

const numberOfEmployeeOptions = [
  { label: "1-10", value: 1 },
  { label: "11-50", value: 2 },
  { label: "51+", value: 3 },
];

const certificateOptions = [
  { label: "ISO", value: 1 },
  { label: "GMP", value: 2 },
  { label: "Organic", value: 3 },
];

const spiceProductOptions = [
  { label: "Cinnamon", value: "cinnamon" },
  { label: "Pepper", value: "pepper" },
  { label: "Cardamom", value: "cardamom" },
  { label: "Cloves", value: "cloves" },
  { label: "Nutmeg", value: "nutmeg" },
  { label: "Turmeric", value: "turmeric" },
];

const EntrepreneurForm = (props) => {
  const { isExisting } = props;
  const { updateFormData } = useFormContext();

  const handleChange = (_, allValues) => {
    updateFormData(allValues);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-xl font-medium text-earth-700 mb-6">
        {isExisting ? "Existing Business Information" : "Business Startup Information"}
      </h3>

      <Form layout="vertical" onValuesChange={handleChange}>
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Business Name"
              name="businessName"
              rules={[{ required: true, message: "Please enter business name" }]}
            >
              <Input placeholder="Spice Enterprises" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Business Type"
              name="businessType"
              rules={[{ required: true, message: "Please select business type" }]}
            >
              <Select placeholder="Select business type">
                <Option value="sole_proprietor">Sole Proprietorship</Option>
                <Option value="partnership">Partnership</Option>
                <Option value="ltd_company">Limited Company</Option>
                <Option value="corporation">Corporation</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {isExisting && (
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Business Registration Number"
                name="businessRegistrationNumber"
                rules={[{ required: true, message: "Please enter registration number" }]}
              >
                <Input placeholder="BRN123456" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Registration Date"
                name="registrationDate"
                rules={[{ required: true, message: "Please select registration date" }]}
              >
                <DatePicker className="w-full" />
              </Form.Item>
            </Col>
          </Row>
        )}

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Business Address"
              name="businessAddress"
              rules={[{ required: true, message: "Please enter business address" }]}
            >
              <Input.TextArea rows={2} placeholder="123 Spice Road, Industrial Zone, Colombo" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Business Experience"
              name="businessExperience"
              rules={[{ required: true, message: "Please select experience" }]}
            >
              <Select placeholder="Select experience level" options={businessExperienceOptions} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label={isExisting ? "Number of Employees" : "Expected Employees"}
              name="numberOfEmployees"
              rules={[{ required: true, message: "Please select employee count" }]}
            >
              <Select placeholder="Select count" options={numberOfEmployeeOptions} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24}>
            <Form.Item
              label="Spice Products"
              name="spiceProducts"
              rules={[{ required: true, message: "Please select at least one product" }]}
            >
              <Select
                mode="multiple"
                placeholder="Select spice products"
                options={spiceProductOptions}
                className="w-full"
              />
            </Form.Item>
          </Col>
        </Row>

        {isExisting && (
          <>
            <Row gutter={16}>
              <Col xs={24}>
                <Form.Item label="Certifications" name="certifications">
                  <Checkbox.Group options={certificateOptions} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24}>
                <Form.Item label="Upload Business Registration" name="businessRegistrationDoc">
                  <Upload maxCount={1} accept=".pdf,.jpg,.png">
                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                  </Upload>
                </Form.Item>
              </Col>
            </Row>
          </>
        )}

        {!isExisting && (
          <Row gutter={16}>
            <Col xs={24}>
              <Form.Item
                label="Expected Launch Date"
                name="expectedLaunchDate"
                rules={[{ required: true, message: "Please select expected launch date" }]}
              >
                <DatePicker className="w-full" />
              </Form.Item>
            </Col>
          </Row>
        )}

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="Additional Information" name="additionalInfo">
              <Input.TextArea rows={4} placeholder="Any additional information about your business..." />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default EntrepreneurForm;