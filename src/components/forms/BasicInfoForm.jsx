import React, { useState } from "react";
import { Form, Input, Select, Col, Row } from "antd";
import { useFormContext } from "../../contexts/FormContext";
import { provinces, districts } from "../../constants/locations";
import { updateBasicInfo, saveBasicInfo, fetchBasicInfo } from "../../store/slices/basicInfoSlice";
import { useDispatch } from "react-redux";

const { Option } = Select;

const BasicInfoForm = () => {
  const dispatch = useDispatch();
  const { updateFormData } = useFormContext();
  const [selectedProvince, setSelectedProvince] = useState(null);

  const handleProvinceChange = (value) => {
    setSelectedProvince(value);
  };

  const filteredDistricts = districts.filter(
    (d) => d.province_id === selectedProvince
  );

  const handleChange = (_, allValues) => {
    updateFormData(allValues);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-xl font-medium text-earth-700 mb-6">
        Basic Information
      </h3>
      <Form layout="vertical" onValuesChange={handleChange}>
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: "Please select your title" }]}
            >
              <Select placeholder="Select title">
                <Option value="Mr.">Mr.</Option>
                <Option value="Ms.">Ms.</Option>
                <Option value="Mrs.">Mrs.</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Initials"
              name="initials"
              rules={[
                { required: false, message: "Please enter your initials" },
              ]}
            >
              <Input placeholder="T. N." />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Full Name"
              name="fullName"
              rules={[
                { required: true, message: "Please enter your full name" },
              ]}
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
                {
                  pattern: /^[0-9]{9}[vVxX]$|^[0-9]{12}$/,
                  message: "Please enter a valid NIC number",
                },
              ]}
            >
              <Input placeholder="123456789V or 123456789012" />
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
                { type: "email", message: "Please enter a valid email" },
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
                {
                  pattern: /^[0-9]{10}$/,
                  message: "Please enter a valid 10-digit mobile number",
                },
              ]}
            >
              <Input placeholder="0712345678" />
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Province"
              name="province"
              rules={[
                { required: false, message: "Please select your province" },
              ]}
            >
              <Select
                placeholder="Select province"
                onChange={handleProvinceChange}
                allowClear
              >
                {provinces.map((province) => (
                  <Option key={province.id} value={province.id}>
                    {province.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label="District"
              name="district"
              rules={[
                { required: false, message: "Please select your district" },
              ]}
            >
              <Select
                placeholder="Select district"
                disabled={!selectedProvince}
              >
                {filteredDistricts.map((district) => (
                  <Option key={district.id} value={district.id}>
                    {district.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item 
              label="DS Division" 
              name="dsDivision"
              rules={[
                { required: false, message: "Please enter your DS Division" },
              ]}
            >
              <Input placeholder="Gampaha" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item 
              label="GN Division" 
              name="gnDivision"
              rules={[
                { required: false, message: "Please enter your GN Division" },
              ]}
            >
              <Input placeholder="Ethgala" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default BasicInfoForm;