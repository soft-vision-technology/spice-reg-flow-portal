import React, { useEffect, useState } from "react";
import { Form, Input, Select, Col, Row } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useFormContext } from "../../../contexts/FormContext";
import { fetchProvince, selectProvinceOptions } from "../../../store/slices/utilsSlice";

const { Option } = Select;

const BasicInfoEdit = ({ user }) => {
  const dispatch = useDispatch();
  const { updateFormData } = useFormContext();
  const provinces = useSelector(selectProvinceOptions);

  const [form] = Form.useForm();               // 1️⃣ grab a form instance
  const [selectedProvince, setSelectedProvince] = useState(null);

  /* fetch lookup tables on mount */
  useEffect(() => {
    dispatch(fetchProvince());
  }, [dispatch]);

  /* hydrate when the user payload shows up */
  useEffect(() => {
    if (!user) return;                          // may be undefined on first render

    form.setFieldsValue({
      title:        user.title,
      initials:     user.initials?.trim(),
      fullName:     user.name,                  // API -> form name mismatch
      nic:          user.nic,
      address:      user.address,
      email:        user.email,
      mobileNumber: user.contactNumber,
      province:     user.provinceId,
      district:     user.districtId,
      dsDivision:   user.dsDivision,
      gnDivision:   user.gnDivision,
    });

    setSelectedProvince(user.provinceId);       // keep district dropdown enabled
  }, [user, form]);

  /* cascaded district list */
  const handleProvinceChange = (value) => setSelectedProvince(value);
  const selectedProvinceObj = provinces.find((p) => p.id === selectedProvince);
  const districts = selectedProvinceObj ? selectedProvinceObj.districts : [];

  /* bubble every change up to whatever parent/Redux you’ve got */
  const handleChange = (_, allValues) => updateFormData(allValues);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-xl font-medium text-earth-700 mb-6">Basic Information</h3>

      <Form
        form={form}                   // <-- tie the instance in
        layout="vertical"
        onValuesChange={handleChange}
      >
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
            <Form.Item label="Initials" name="initials">
              <Input placeholder="T. N." />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Full Name"
              name="fullName"
              rules={[{ required: true, message: "Please enter your full name" }]}
            >
              <Input placeholder="John Doe" />
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
                  message: "Please enter a valid 10‑digit mobile number",
                },
              ]}
            >
              <Input placeholder="0712345678" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item label="Province" name="province">
              <Select
                placeholder="Select province"
                onChange={handleProvinceChange}
                allowClear
              >
                {provinces.map((prov) => (
                  <Option key={prov.id} value={prov.id}>
                    {prov.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item label="District" name="district">
              <Select placeholder="Select district" disabled={!selectedProvince}>
                {districts.map((dist) => (
                  <Option key={dist.id} value={dist.id}>
                    {dist.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item label="DS Division" name="dsDivision">
              <Input placeholder="Gampaha" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item label="GN Division" name="gnDivision">
              <Input placeholder="Ethgala" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default BasicInfoEdit;
