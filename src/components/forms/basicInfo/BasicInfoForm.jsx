import { useEffect, useState } from "react";
import { Form, Input, Select, Col, Row, Dropdown, Button, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useFormContext } from "../../../contexts/FormContext";
import {
  selectProvinceOptions,
  fetchProvince,
  fetchSerialNumber,
  selectSerialOptions,
} from "../../../store/slices/utilsSlice";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../../../api/axiosInstance";

const { Option } = Select;

const BasicInfoForm = () => {
  const dispatch = useDispatch();
  const { updateFormData } = useFormContext();
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [lastSerialDigits, setLastSerialDigits] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    // Fetch provinces when the component mounts
    dispatch(fetchProvince());
    dispatch(fetchSerialNumber());
  }, [dispatch]);

  const provinces = useSelector(selectProvinceOptions);
  const serialNumbers = useSelector(selectSerialOptions);

  console.log("im here", serialNumbers);

  const handleProvinceChange = (value) => {
    setSelectedProvince(value);
  };

  // Find the selected province object
  const selectedProvinceObj = provinces.find(
    (province) => province.id === selectedProvince
  );

  // Get districts for the selected province, or empty array if none selected
  const districts = selectedProvinceObj ? selectedProvinceObj.districts : [];

  const handleChange = (_, allValues) => {
    updateFormData(allValues);
  };

  // Handle serial number selection from dropdown
  const handleSerialSelection = async (serial) => {
    try {
      // Fetch the last serial number for the selected prefix/suffix
      const response = await axiosInstance.get(`/api/serial_number/last/serial-number`, {
        params: {
          prefix: serial.prefix,
          suffix: serial.suffix
        }
      });
      
      const lastDigits = response.data.lastDigits || response.data;
      
      // Store last digits for placeholder display
      setLastSerialDigits(lastDigits);
      
      form.setFieldsValue({
        prefix: serial.prefix,
        suffix: serial.suffix,
      });
      
      // Trigger form change to update context
      const currentValues = form.getFieldsValue();
      updateFormData({
        ...currentValues,
        prefix: serial.prefix,
        suffix: serial.suffix,
      });
    } catch (error) {
      console.error('Failed to fetch last serial number:', error);
      setLastSerialDigits(null);
      // Still set prefix and suffix even if API fails
      form.setFieldsValue({
        prefix: serial.prefix,
        suffix: serial.suffix,
      });
      
      const currentValues = form.getFieldsValue();
      updateFormData({
        ...currentValues,
        prefix: serial.prefix,
        suffix: serial.suffix,
      });
    }
  };

  // Create dropdown menu items
  const serialMenuItems = serialNumbers.map((serial) => ({
    key: serial.id,
    label: (
      <div
        onClick={() => handleSerialSelection(serial)}
        style={{ padding: '8px 12px', cursor: 'pointer' }}
      >
        {serial.prefix}/{serial.suffix}
      </div>
    ),
  }));

  const serialDropdownMenu = {
    items: serialMenuItems,
  };

  const handleKeyDown = (e) => {
  if (e.key === "Enter") {
    e.preventDefault(); // Stop form submit

    const formElements = Array.from(
      e.currentTarget.querySelectorAll("input, textarea, select")
    ).filter(el => !el.disabled && el.type !== "hidden");

    const index = formElements.indexOf(e.target);
    if (index > -1 && index < formElements.length - 1) {
      formElements[index + 1].focus();
    }
  }
};

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
      <h3 className="text-lg sm:text-xl font-medium text-earth-700 mb-4 sm:mb-6">
        Basic Information
      </h3>
      <Form layout="vertical" onValuesChange={handleChange} form={form} onKeyDown={handleKeyDown}>
        {/* Title and Initials Row */}
        <Row gutter={[12, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: false, message: "Please select your title" }]}
            >
              <Select placeholder="Select title" size="large">
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
              <Input placeholder="Enter Initials" size="large" />
            </Form.Item>
          </Col>
        </Row>

        {/* Full Name and NIC Row */}
        <Row gutter={[12, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Full Name"
              name="fullName"
              rules={[
                { required: false, message: "Please enter your full name" },
              ]}
            >
              <Input placeholder="Enter Full Name" size="large" />
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
              <Input placeholder="Enter NIC" size="large" />
            </Form.Item>
          </Col>
        </Row>

        {/* Address Row - Full width */}
        <Row gutter={[12, 16]}>
          <Col span={24}>
            <Form.Item
              label="Address"
              name="address"
              rules={[{ required: false, message: "Please enter your address" }]}
            >
              <Input.TextArea
                rows={3}
                placeholder="Enter Address"
                className="resize-none"
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Email and Mobile Number Row */}
        <Row gutter={[12, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: false, message: "Please enter your email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input placeholder="Enter Email Address" size="large" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Mobile Number"
              name="mobileNumber"
              rules={[
                { required: false, message: "Please enter your mobile number" },
                // {
                //   pattern: /^[0-9]{10}$/,
                //   message: "Please enter a valid 10-digit mobile number",
                // },
              ]}
            >
              <Input placeholder="Enter Mobile Number" size="large" />
            </Form.Item>
          </Col>
        </Row>

        {/* Province and District Row */}
        <Row gutter={[12, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Province"
              name="province"
              rules={[
                { required: false, message: "Please select your province" },
              ]}
            >
              <Select
                placeholder="Select Province"
                onChange={handleProvinceChange}
                allowClear
                size="large"
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
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
                placeholder="Select District"
                disabled={!selectedProvince}
                size="large"
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {districts.map((district) => (
                  <Option key={district.id} value={district.id}>
                    {district.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* DS Division and GN Division Row */}
        <Row gutter={[12, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="DS Division"
              name="dsDivision"
              rules={[
                { required: false, message: "Please enter your DS Division" },
              ]}
            >
              <Input placeholder="Enter DS Division" size="large" />
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
              <Input placeholder="Enter GN Division" size="large" />
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={24}>
            <Form.Item
              label={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>Serial Number</span>
                  <Dropdown menu={serialDropdownMenu} trigger={['click']}>
                    <Button 
                      type="text" 
                      size="small"
                      style={{ padding: '2px 4px', minWidth: 'auto' }}
                    >
                      <DownOutlined />
                    </Button>
                  </Dropdown>
                </div>
              }
              rules={[
                {
                  required: false,
                  message: "Please Complete the Serial Number",
                },
              ]}
            >
              <Space.Compact compact>
                <Form.Item
                  name="prefix"
                  style={{ width: "70%" }}
                >
                  <Input
                    placeholder="Prefix"
                    size="large"
                    readOnly
                    style={{ backgroundColor: '#f5f5f5' }}
                  />
                </Form.Item>
                <Form.Item
                  name="suffix"
                  style={{ width: "70%" }}
                >
                  <Input
                    placeholder="Suffix"
                    size="large"
                    readOnly
                    style={{ backgroundColor: '#f5f5f5' }}
                  />
                </Form.Item>
                <Form.Item
                  name="serialNumber"
                  style={{ width: "70%" }}
                >
                  <Input 
                    placeholder={lastSerialDigits} 
                    size="large" 
                  />
                </Form.Item>
              </Space.Compact>
              {lastSerialDigits && (
                <div style={{ marginTop: '4px', fontSize: '12px', fontStyle: 'italic', fontWeight: 500 ,color: '#6b7280', textAlign: 'right' }}>
                  *last entered number {lastSerialDigits}
                </div>
              )}
            </Form.Item>
          </Col>
          {/* <Col xs={24} sm={12}>
            <div
              style={{
                display: "flex",
                gap: "24px",
                alignItems: "center",
                height: "100%",
              }}
            >
              <Form.Item
                name="isActive"
                valuePropName="checked"
                initialValue={true}
                style={{ marginBottom: 0 }}
              >
                <Checkbox size="large">Active</Checkbox>
              </Form.Item>
              <Form.Item
                name="isApproved"
                valuePropName="checked"
                initialValue={true}
                style={{ marginBottom: 0 }}
              >
                <Checkbox size="large">Approved</Checkbox>
              </Form.Item>
            </div>
          </Col> */}
        </Row>
      </Form>
    </div>
  );
};

export default BasicInfoForm;