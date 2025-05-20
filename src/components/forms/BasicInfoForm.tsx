
import React from "react";
import { Form, Input, DatePicker, Select, Col, Row } from "antd";
import { useFormContext } from "../../contexts/FormContext";

const { Option } = Select;

const BasicInfoForm: React.FC = () => {
  const { updateFormData } = useFormContext();

  const handleChange = (_: any, allValues: any) => {
    updateFormData(allValues);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-xl font-medium text-earth-700 mb-6">Basic Information</h3>
      <Form layout="vertical" onValuesChange={handleChange}>
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Full Name"
              name="fullName"
              rules={[{ required: true, message: "Please enter your full name" }]}
            >
              <Input placeholder="John Doe" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="National ID Number (NIC)"
              name="nic"
              rules={[
                { required: true, message: "Please enter your NIC" },
                { pattern: /^[0-9]{9}[vVxX]$|^[0-9]{12}$/, message: "Please enter a valid NIC number" }
              ]}
            >
              <Input placeholder="123456789V or 123456789012" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Date of Birth"
              name="dob"
              rules={[{ required: true, message: "Please select your date of birth" }]}
            >
              <DatePicker className="w-full" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Gender"
              name="gender"
              rules={[{ required: true, message: "Please select your gender" }]}
            >
              <Select placeholder="Select gender">
                <Option value="male">Male</Option>
                <Option value="female">Female</Option>
                <Option value="other">Other</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Address"
              name="address"
              rules={[{ required: true, message: "Please enter your address" }]}
            >
              <Input.TextArea rows={2} placeholder="123 Spice Road, Colombo" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Please enter a valid email" }
              ]}
            >
              <Input placeholder="john.doe@example.com" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Mobile Number"
              name="mobileNumber"
              rules={[
                { required: true, message: "Please enter your mobile number" },
                { pattern: /^[0-9]{10}$/, message: "Please enter a valid 10-digit mobile number" }
              ]}
            >
              <Input placeholder="0712345678" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default BasicInfoForm;
