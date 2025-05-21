import React from "react";
import {
  Form,
  Input,
  Select,
  InputNumber,
  Upload,
  Button,
  Row,
  Col
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useFormContext } from "../../contexts/FormContext";

const { Option } = Select;

const traderTypeOptions = [
  { label: "Collector", value: "collector" },
  { label: "Wholesaler", value: "wholesaler" },
  { label: "Distributor", value: "distributor" },
  { label: "Agent", value: "agent" }
];

const spiceTradeOptions = [
  { label: "Cinnamon", value: "cinnamon" },
  { label: "Pepper", value: "pepper" },
  { label: "Cardamom", value: "cardamom" },
  { label: "Cloves", value: "cloves" },
  { label: "Nutmeg", value: "nutmeg" },
  { label: "Turmeric", value: "turmeric" }
];

const IntermediaryForm = () => {
  const { updateFormData } = useFormContext();

  const handleChange = (_, allValues) => {
    updateFormData(allValues);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-xl font-medium text-earth-700 mb-6">
        Intermediary Trading Information
      </h3>

      <Form layout="vertical" onValuesChange={handleChange}>
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Trading Business Name"
              name="tradingName"
              rules={[
                { required: true, message: "Please enter trading business name" }
              ]}
            >
              <Input placeholder="Spice Trading Co." />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Trading License Number"
              name="tradingLicense"
              rules={[
                { required: true, message: "Please enter trading license" }
              ]}
            >
              <Input placeholder="TL12345" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Type of Trader"
              name="traderType"
              rules={[{ required: true, message: "Please select trader type" }]}
            >
              <Select
                mode="multiple"
                placeholder="Select trader type(s)"
                options={traderTypeOptions}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Years in Trading Business"
              name="yearsTrading"
              rules={[{ required: true, message: "Please select years in business" }]}
            >
              <Select placeholder="Select years">
                <Option value="less_than_1">Less than 1 year</Option>
                <Option value="1_to_3">1 - 3 years</Option>
                <Option value="4_to_10">4 - 10 years</Option>
                <Option value="more_than_10">More than 10 years</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24}>
            <Form.Item
              label="Spice Products Traded"
              name="tradedProducts"
              rules={[
                { required: true, message: "Please select at least one product" }
              ]}
            >
              <Select
                mode="multiple"
                placeholder="Select traded products"
                options={spiceTradeOptions}
                className="w-full"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Annual Trading Volume (Tons)"
              name="tradingVolume"
              rules={[
                { required: true, message: "Please enter trading volume" }
              ]}
            >
              <InputNumber min={1} className="w-full" placeholder="50" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Number of Farmers/Suppliers"
              name="supplierCount"
              rules={[
                { required: true, message: "Please enter supplier count" }
              ]}
            >
              <InputNumber min={1} className="w-full" placeholder="25" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24}>
            <Form.Item
              label="Primary Supplier Networks"
              name="supplierNetwork"
              rules={[
                { required: true, message: "Please enter supplier networks" }
              ]}
            >
              <Input.TextArea
                rows={2}
                placeholder="Describe your supplier network (e.g., Small-scale farmers in Central Province)"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24}>
            <Form.Item
              label="Primary Buyer Types"
              name="buyerTypes"
              rules={[
                { required: true, message: "Please enter buyer types" }
              ]}
            >
              <Select mode="multiple" placeholder="Select buyer types">
                <Option value="exporters">Exporters</Option>
                <Option value="processors">Processors</Option>
                <Option value="retailers">Retailers</Option>
                <Option value="wholesalers">Wholesalers</Option>
                <Option value="hotels">Hotels & Restaurants</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Upload Trading License"
              name="tradingLicenseDoc"
              rules={[
                { required: true, message: "Please upload trading license" }
              ]}
            >
              <Upload maxCount={1} accept=".pdf,.jpg,.png">
                <Button icon={<UploadOutlined />}>Upload License</Button>
              </Upload>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Storage Facility Capacity (tons)"
              name="storageCapacity"
            >
              <InputNumber min={0} className="w-full" placeholder="10" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Trading Facility Address"
              name="tradingAddress"
              rules={[
                { required: true, message: "Please enter trading address" }
              ]}
            >
              <Input.TextArea
                rows={2}
                placeholder="123 Trading Street, Market Area, Colombo"
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default IntermediaryForm;
