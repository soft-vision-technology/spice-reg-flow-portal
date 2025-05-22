import React, { useState } from "react";
import {
  Form,
  Input,
  Select,
  InputNumber,
  Upload,
  Button,
  Row,
  Col,
  Checkbox,
  Space,
  Card
} from "antd";
import { UploadOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useFormContext } from "../../contexts/FormContext";

const { Option } = Select;

const certificateOptions = [
  { label: "ISO", value: 1 },
  { label: "GMP", value: 2 },
  { label: "Organic", value: 3 },
  { label: "Fair Trade", value: 4 },
  { label: "HACCP", value: 5 }
];

const marketRegionOptions = [
  { label: "North America", value: "north_america" },
  { label: "Europe", value: "europe" },
  { label: "Middle East", value: "middle_east" },
  { label: "Asia", value: "asia" },
  { label: "Australia", value: "australia" },
  { label: "Africa", value: "africa" }
];

const spiceOptions = [
  { label: "Cinnamon", value: "cinnamon" },
  { label: "Pepper", value: "pepper" },
  { label: "Cardamom", value: "cardamom" },
  { label: "Cloves", value: "cloves" },
  { label: "Nutmeg", value: "nutmeg" },
  { label: "Turmeric", value: "turmeric" },
  { label: "Coriander", value: "coriander" },
  { label: "Cumin", value: "cumin" },
  { label: "Fennel", value: "fennel" },
  { label: "Ginger", value: "ginger" },
  { label: "Star Anise", value: "star_anise" },
  { label: "Mace", value: "mace" }
];

const unitOptions = [
  { label: "Kilograms (kg)", value: "kg" },
  { label: "Tons", value: "tons" },
  { label: "Pounds (lbs)", value: "lbs" },
  { label: "Metric Tons", value: "mt" }
];

const ExporterForm = () => {
  const { updateFormData } = useFormContext();
  const [exportProducts, setExportProducts] = useState([{ spice: "", quantity: "", unit: "kg" }]);
  const [customSpice, setCustomSpice] = useState("");

  const handleChange = (_, allValues) => {
    // Include export products in the form data
    const formDataWithProducts = {
      ...allValues,
      exportProducts: exportProducts
    };
    updateFormData(formDataWithProducts);
  };

  const addExportProduct = () => {
    setExportProducts([...exportProducts, { spice: "", quantity: "", unit: "kg" }]);
  };

  const removeExportProduct = (index) => {
    const newProducts = exportProducts.filter((_, i) => i !== index);
    setExportProducts(newProducts);
    // Update form data when products are removed
    updateFormData({ exportProducts: newProducts });
  };

  const updateExportProduct = (index, field, value) => {
    const newProducts = [...exportProducts];
    newProducts[index][field] = value;
    setExportProducts(newProducts);
    // Update form data when products are updated
    updateFormData({ exportProducts: newProducts });
  };

  const addCustomSpice = () => {
    if (customSpice && !spiceOptions.find(option => option.value === customSpice.toLowerCase().replace(/\s+/g, '_'))) {
      const newSpiceOption = {
        label: customSpice,
        value: customSpice.toLowerCase().replace(/\s+/g, '_')
      };
      spiceOptions.push(newSpiceOption);
      setCustomSpice("");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-xl font-medium text-earth-700 mb-6">Export Operation Information</h3>

      <Form layout="vertical" onValuesChange={handleChange}>
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Business Name"
              name="businessName"
              rules={[{ required: true, message: "Please enter business name" }]}
            >
              <Input placeholder="Global Spice Exports Ltd." />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Business Registration Number"
              name="businessRegNumber"
              rules={[{ required: true, message: "Please enter business registration number" }]}
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

        {/* Custom Spice Input */}
        <Row gutter={16}>
          <Col xs={24}>
            <Form.Item label="Add Custom Spice (Optional)">
              <Space.Compact style={{ display: 'flex' }}>
                <Input
                  placeholder="Enter custom spice name"
                  value={customSpice}
                  onChange={(e) => setCustomSpice(e.target.value)}
                  onPressEnter={addCustomSpice}
                />
                <Button type="primary" onClick={addCustomSpice} disabled={!customSpice}>
                  Add Spice
                </Button>
              </Space.Compact>
            </Form.Item>
          </Col>
        </Row>

        {/* Export Products with Quantities */}
        <Row gutter={16}>
          <Col xs={24}>
            <Form.Item
              label="Export Spice Products & Quantities"
              rules={[{ 
                validator: () => {
                  const hasValidProduct = exportProducts.some(product => product.spice && product.quantity);
                  return hasValidProduct ? Promise.resolve() : Promise.reject(new Error('Please add at least one spice product with quantity'));
                }
              }]}
            >
              <div className="space-y-4">
                {exportProducts.map((product, index) => (
                  <Card key={index} size="small" className="bg-gray-50">
                    <Row gutter={12} align="middle">
                      <Col xs={24} sm={8}>
                        <Select
                          placeholder="Select spice"
                          value={product.spice}
                          onChange={(value) => updateExportProduct(index, 'spice', value)}
                          className="w-full"
                          showSearch
                          filterOption={(input, option) =>
                            option.label.toLowerCase().includes(input.toLowerCase())
                          }
                          options={spiceOptions}
                        />
                      </Col>
                      <Col xs={24} sm={8}>
                        <InputNumber
                          placeholder="Value added"
                          value={product.quantity}
                          onChange={(value) => updateExportProduct(index, 'quantity', value)}
                          min={0.01}
                          step={0.01}
                          className="w-full"
                        />
                      </Col>
                      <Col xs={24} sm={8}>
                        <Space>
                          {index === exportProducts.length - 1 && (
                            <Button
                              type="dashed"
                              icon={<PlusOutlined />}
                              onClick={addExportProduct}
                              size="small"
                            >
                              Add
                            </Button>
                          )}
                          {exportProducts.length > 1 && (
                            <Button
                              type="text"
                              danger
                              icon={<DeleteOutlined />}
                              onClick={() => removeExportProduct(index)}
                              size="medium"
                            />
                          )}
                        </Space>
                      </Col>
                    </Row>
                  </Card>
                ))}
              </div>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24}>
            <Form.Item
              label="Name of Country / Countries of Export"
              name="exportCountries"
              rules={[{ required: true, message: "Please select at least one" }]}
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