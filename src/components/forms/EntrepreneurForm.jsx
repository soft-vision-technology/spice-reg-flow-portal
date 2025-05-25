import { useEffect, useState } from "react";
import {
  Form,
  Input,
  Select,
  InputNumber,
  DatePicker,
  Button,
  Row,
  Col,
  Radio,
  Card,
  Space,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useFormContext } from "../../contexts/FormContext";
import { useDispatch, useSelector } from "react-redux";
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
import { useLocation } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

const { Option } = Select;

const EntrepreneurForm = (props) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { isExisting } = props;
  const { updateFormData } = useFormContext();
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

  const handleChange = (_, allValues) => {
    updateFormData(allValues);
  };

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

  console.log(location?.state?.result)

  // Format form data to match API structure
  const formatFormData = (values) => {
    const formattedData = {
      businessName: values.businessName || null,
      businessRegNo: values.businessRegistrationNumber || null,
      businessAddress: values.businessAddress || null,
      numberOfEmployeeId: values.numberOfEmployees
        ? parseInt(values.numberOfEmployees)
        : null,
      certificateId: values.certifications
        ? parseInt(values.certifications)
        : null,
      businessExperienceId: values.yearsExporting ? parseInt(values.yearsExporting) : null,
      userId: location?.state?.result,
      products: exportProducts
        .filter((product) => product.productId && product.value)
        .map((product) => ({
          productId: Number(product.productId),
          value: parseFloat(product.value),
        })),
    };

    return formattedData;
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formattedData = formatFormData(values);

      console.log("Formatted data to send:", formattedData);

      const response = await axiosInstance.post(
        "/api/entrepreneur",
        formattedData
      );
      console.log("Response:", response);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-xl font-medium text-earth-700 mb-6">
        {isExisting
          ? "Existing Business Information"
          : "Business Startup Information"}
      </h3>

      <Form form={form} layout="vertical" onValuesChange={handleChange}>
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Business Name"
              name="businessName"
              rules={[
                { required: true, message: "Please enter business name" },
              ]}
            >
              <Input placeholder="Spice Enterprises" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Business Registration Number"
              name="businessRegistrationNumber"
              rules={[
                {
                  required: true,
                  message: "Please enter registration number",
                },
              ]}
            >
              <Input placeholder="BRN123456" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Business Address"
              name="businessAddress"
              rules={[
                { required: true, message: "Please enter business address" },
              ]}
            >
              <Input.TextArea
                rows={2}
                placeholder="123 Spice Road, Industrial Zone, Colombo"
              />
            </Form.Item>
          </Col>
        </Row>

        {!isExisting && (
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Registration Date"
                name="registrationDate"
                rules={[
                  {
                    required: true,
                    message: "Please select registration date",
                  },
                ]}
              >
                <DatePicker className="w-full" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Business Experience"
                name="businessExperience"
                rules={[
                  { required: true, message: "Please select experience" },
                ]}
              >
                <Select
                  placeholder="Select experience level"
                  options={formatSelects(experienceOptions)}
                />
              </Form.Item>
            </Col>
          </Row>
        )}

        <Row gutter={16}>
          <Col xs={24}>
            <Form.Item
              label="Export Spice Products & Values (in USD)"
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
                          placeholder="Export value (USD)"
                          value={product.value}
                          onChange={(value) =>
                            updateExportProduct(index, "value", value)
                          }
                          min={0.01}
                          step={0.01}
                          className="w-full"
                          formatter={(value) =>
                            `Rs. ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
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

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label={isExisting ? "Number of Employees" : "Expected Employees"}
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
        </Row>

        <Row gutter={16}>
          <Col xs={24}>
            <Form.Item
              label="Certifications"
              name="certifications"
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

        <Button type="primary" onClick={handleSubmit} className="bg-spice-500">
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default EntrepreneurForm;
