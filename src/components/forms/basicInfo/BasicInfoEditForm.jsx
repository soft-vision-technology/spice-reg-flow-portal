import React, { useEffect, useState } from "react";
import { Form, Input, Select, Col, Row, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useFormContext } from "../../../contexts/FormContext";
import { fetchProvince, selectProvinceOptions } from "../../../store/slices/utilsSlice";
import axiosInstance from "../../../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const BasicInfoEditForm = ({ user }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { updateFormData } = useFormContext();
  const provinces = useSelector(selectProvinceOptions);

  const [form] = Form.useForm();
  const [selectedProvince, setSelectedProvince] = useState(null);
  
  // Store original data for comparison
  const [originalData, setOriginalData] = useState({});

  /* fetch lookup tables on mount */
  useEffect(() => {
    dispatch(fetchProvince());
  }, [dispatch]);

  /* hydrate when the user payload shows up */
  useEffect(() => {
    if (!user) return;

    const initialFormData = {
      title: user.title,
      initials: user.initials?.trim(),
      fullName: user.name,
      nic: user.nic,
      address: user.address,
      email: user.email,
      mobileNumber: user.contactNumber,
      province: user.provinceId,
      district: user.districtId,
      dsDivision: user.dsDivision,
      gnDivision: user.gnDivision,
    };

    // Set form fields
    form.setFieldsValue(initialFormData);

    // Store original data for comparison
    setOriginalData({
      title: user.title,
      initials: user.initials?.trim(),
      fullName: user.name,
      nic: user.nic,
      address: user.address,
      email: user.email,
      mobileNumber: user.contactNumber,
      province: user.provinceId,
      district: user.districtId,
      dsDivision: user.dsDivision,
      gnDivision: user.gnDivision,
    });

    setSelectedProvince(user.provinceId);
  }, [user, form]);

  /* cascaded district list */
  const handleProvinceChange = (value) => setSelectedProvince(value);
  const selectedProvinceObj = provinces.find((p) => p.id === selectedProvince);
  const districts = selectedProvinceObj ? selectedProvinceObj.districts : [];

  /* bubble every change up to whatever parent/Redux you've got */
  const handleChange = (_, allValues) => updateFormData(allValues);

  // Helper function to get only changed fields
  const getChangedFields = (currentValues) => {
    const changedData = {};
    
    // Compare form fields
    Object.keys(currentValues).forEach(key => {
      const currentValue = currentValues[key];
      const originalValue = originalData[key];
      
      if (currentValue !== originalValue) {
        changedData[key] = currentValue;
      }
    });

    return changedData;
  };

  // Map form field names to API field names
  const mapFieldNames = (data) => {
    const fieldMapping = {
      fullName: 'name',
      mobileNumber: 'contactNumber',
      province: 'provinceId',
      district: 'districtId'
    };

    const mappedData = {};
    
    Object.keys(data).forEach(key => {
      const apiKey = fieldMapping[key] || key;
      let value = data[key];
      
      // Handle specific transformations
      if ((key === 'province' || key === 'district') && value) {
        value = parseInt(value);
      }
      
      mappedData[apiKey] = value;
    });

    return mappedData;
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const changedFields = getChangedFields(values);
      
      // If no changes, don't submit
      if (Object.keys(changedFields).length === 0) {
        console.log('No changes detected');
        return;
      }

      // Map field names to API format
      const mappedChanges = mapFieldNames(changedFields);

      // Prepare approval request
      const approvalRequest = {
        type: "editData",
        requestName: `User: ${user.name}`,
        requestData: mappedChanges,
        requestedUrl: `users/${user.id}`
      };

      console.log('Submitting changes:', approvalRequest);

      const response = await axiosInstance.post(
        "/api/approval/create",
        approvalRequest
      );

      console.log('Approval request submitted successfully:', response.data);
      
      // Optionally show success message or redirect
      navigate('/user-management');
      alert("Success!");
      
    } catch (error) {
      console.error('Failed to submit approval request:', error);
      throw new Error("Failed to submit form: " + error.message);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-xl font-medium text-earth-700 mb-6">Basic Information</h3>

      <Form
        form={form}
        layout="vertical"
        onValuesChange={handleChange}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: false, message: "Please select your title" }]}
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
              rules={[{ required: false, message: "Please enter your full name" }]}
            >
              <Input placeholder="John Doe" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label="National ID Number (NIC)"
              name="nic"
              rules={[
                { required: false, message: "Please enter your NIC" },
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
              rules={[{ required: false, message: "Please enter your address" }]}
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
                { required: false, message: "Please enter your email" },
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
                { required: false, message: "Please enter your mobile number" },
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

        <Row gutter={16}>
          <Col span={24}>
            <Button type="primary" onClick={handleSubmit} className="bg-spice-500">
              Submit Changes
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default BasicInfoEditForm;