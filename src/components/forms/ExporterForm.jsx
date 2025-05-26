import React, { useEffect, useState } from "react";
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
  Card,
  DatePicker,
  Radio,
} from "antd";
import {
  UploadOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useFormContext } from "../../contexts/FormContext";
import countries from "country-json/src/country-by-name.json";
import {
  fetchCertificateOptions,
  fetchExperienceOptions,
  fetchNumEmployeeOptions,
  fetchProductOptions,
  selectExperienceOptions,
  selectCertificateOptions,
  selectNumEmployeeOptions,
  selectProductOptions,
} from "../../store/slices/utilsSlice";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { useLocation } from "react-router-dom";

const ExporterForm = ({ isExisting }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { updateFormData, formData } = useFormContext();
  const [form] = Form.useForm();
  const [exportProducts, setExportProducts] = useState([
    { productId: null, value: null },
  ]);

  const load = async () => {
    await dispatch(fetchCertificateOptions());
    await dispatch(fetchNumEmployeeOptions());
    await dispatch(fetchExperienceOptions());
    await dispatch(fetchProductOptions());
  };

  useEffect(() => {
    load();
  }, [dispatch]);

  const experienceOptions = useSelector(selectExperienceOptions) || [];
  const certificateOptions = useSelector(selectCertificateOptions) || [];
  const numberOfEmployeeOptions = useSelector(selectNumEmployeeOptions) || [];
  const productOptions = useSelector(selectProductOptions) || [];

  const formatSelects = (data) => {
    return (data || [])
      .filter((item) => item?.id && item?.name)
      .map((item) => ({
        label: item.name.toString(),
        value: item.id.toString(),
      }));
  };

  const addExportProduct = () => {
    setExportProducts([...exportProducts, { productId: null, value: null }]);
  };

  const removeExportProduct = (index) => {
    const newProducts = exportProducts.filter((_, i) => i !== index);
    setExportProducts(newProducts);
    updateFormData({ products: newProducts });
  };

  const updateExportProduct = (index, field, value) => {
    const newProducts = [...exportProducts];
    newProducts[index][field] = value;
    setExportProducts(newProducts);
    updateFormData({ products: newProducts });
  };

  const handleChange = (changedValues, allValues) => {
    // Format the data according to API requirements
    const formattedData = {
      businessName: allValues.businessName || null,
      businessRegNo: allValues.businessRegNumber || null,
      numberOfEmployeeId: allValues.numberOfEmployees ? parseInt(allValues.numberOfEmployees) : null,
      businessExperienceId: allValues.yearsExporting ? parseInt(allValues.yearsExporting) : null,
      productRange: allValues.productRange || null,
      businessDescription: allValues.businessDescription || null,
      exportingCountries: allValues.exportCountries || null,
      exportStartMonth: allValues.exportStartDate ? dayjs(allValues.exportStartDate).format('MMMM') : null,
      exportStartYear: allValues.exportStartDate ? dayjs(allValues.exportStartDate).format('YYYY') : null,
      certificateId: allValues.exportCertifications ? parseInt(allValues.exportCertifications) : null,
      startDate: allValues.exportStartDate ? dayjs(allValues.exportStartDate).toISOString() : null,
      products: exportProducts.filter(product => product.productId && product.value).map(product => ({
        productId: parseInt(product.productId),
        value: parseFloat(product.value)
      })),
      userId: location?.state?.result,
    };

    updateFormData(formattedData);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-xl font-medium text-earth-700 mb-6">
        Export Operation Information
      </h3>

      <Form 
        form={form}
        layout="vertical" 
        onValuesChange={handleChange}
        initialValues={formData}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Business Name"
              name="businessName"
              rules={[
                { required: true, message: "Please enter business name" },
              ]}
            >
              <Input placeholder="Global Spice Exports Ltd." />
            </Form.Item>
          </Col>
          {isExisting && (

          <Col xs={24} sm={12}>
            <Form.Item
              label="Business Registration Number"
              name="businessRegNumber"
              rules={[
                {
                  required: true,
                  message: "Please enter business registration number",
                },
              ]}
            >
              <Input placeholder="EXP12345" />
            </Form.Item>
          </Col>
          )}
          <Col xs={24} sm={12}>
            <Form.Item
              label="Years in Export Business"
              name="yearsExporting"
              rules={[
                { required: true, message: "Please enter years in exports" },
              ]}
            >
              <Select
                placeholder="Select years"
                options={formatSelects(experienceOptions)}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Started Date of Export Business"
              name="exportStartDate"
              rules={[{ required: true, message: "Please enter started date" }]}
            >
              <DatePicker
                format="YYYY-MM-DD"
                style={{ width: "100%" }}
                placeholder="Select date"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Number of Employees"
              name="numberOfEmployees"
              rules={[
                { required: true, message: "Please select employee count" },
              ]}
            >
              <Select
                placeholder="Select count"
                options={formatSelects(numberOfEmployeeOptions)}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Name of Country / Countries of Export"
              name="exportCountries"
              rules={[
                { required: true, message: "Please select at least one" },
              ]}
            >
              <Select
                mode="multiple"
                placeholder="Select target markets"
                options={countries.map((country) => ({
                  label: country.country,
                  value: country.country,
                }))}
                className="w-full"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Product Range"
              name="productRange"
            >
              <Input placeholder="Describe your product range" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Business Description"
              name="businessDescription"
            >
              <Input.TextArea 
                placeholder="Describe your business"
                rows={3}
              />
            </Form.Item>
          </Col>
        </Row>

{isExisting && (
        <Row gutter={16}>
          <Col xs={24}>
            <Form.Item
              label="Export Spice Products & Values"
              rules={[
                {
                  validator: () => {
                    const hasValidProduct = exportProducts.some(
                      (product) => product.productId && product.value
                    );
                    return hasValidProduct
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error(
                            "Please add at least one spice product with value"
                          )
                        );
                  },
                },
              ]}
            >
              <div className="space-y-4">
                {exportProducts.map((product, index) => (
                  <Card key={index} size="small" className="bg-gray-50">
                    <Row gutter={12} align="middle">
                      <Col xs={24} sm={10}>
                        <Select
                          placeholder="Select spice product"
                          value={product.productId}
                          onChange={(value) =>
                            updateExportProduct(index, "productId", value)
                          }
                          className="w-full"
                          showSearch
                          filterOption={(input, option) =>
                            option.label
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          options={formatSelects(productOptions)}
                        />
                      </Col>
                      <Col xs={24} sm={8}>
                        <InputNumber
                          placeholder="Enter value"
                          value={product.value}
                          onChange={(value) =>
                            updateExportProduct(index, "value", value)
                          }
                          min={0.01}
                          step={0.01}
                          className="w-full"
                          parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        />
                      </Col>
                      <Col xs={24} sm={6}>
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
                              size="small"
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
)}

        <Row gutter={16}>
          <Col xs={24}>
            <Form.Item
              label="Export Certifications"
              name="exportCertifications"
              rules={[
                {
                  required: true,
                  message: "Please select a certification",
                },
              ]}
            >
              <Radio.Group>
                {formatSelects(certificateOptions).map((opt) => (
                  <Radio key={opt.value} value={opt.value}>
                    {opt.label}
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default ExporterForm;