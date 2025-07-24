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
import { useFormContext } from "../../../contexts/FormContext";
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
} from "../../../store/slices/utilsSlice";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { useLocation } from "react-router-dom";
import TextArea from "antd/es/input/TextArea";

const ExporterForm = ({ isExisting }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { updateFormData, formData } = useFormContext();
  const [form] = Form.useForm();
  const [exportProducts, setExportProducts] = useState([
    { productId: null, details: "", isRaw: false, isProcessed: false },
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
    setExportProducts([
      ...exportProducts,
      { productId: null, details: "", isRaw: false, isProcessed: false },
    ]);
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
    const formattedData = formatFormData(allValues);
    updateFormData(formattedData);
  };

  const formatFormData = (values) => {
    const formattedData = {
      businessName: values.businessName || null,
      businessRegNo: values.businessRegNo || null,
      numberOfEmployeeId: values.numberOfEmployees
        ? parseInt(values.numberOfEmployees)
        : null,
      businessExperienceId: values.businessExperienceId
        ? parseInt(values.businessExperienceId)
        : null,
      productRange: values.productRange || null,
      businessDescription: values.businessDescription || null,
      exportingCountries: values.exportingCountries || null,
      exportStartMonth: values.exportStartDate
        ? dayjs(values.exportStartDate).format("MMMM")
        : null,
      exportStartYear: values.exportStartDate
        ? dayjs(values.exportStartDate).format("YYYY")
        : null,
      certifications: Array.isArray(values.certificateId)
        ? values.certificateId
        : values.certificateId ? [values.certificateId] : [],
      startDate: values.exportStartDate
        ? dayjs(values.exportStartDate).toISOString()
        : null,
      userId: location?.state?.result,
      products: exportProducts
        .filter(
          (product) =>
            product.productId && (product.details || product.details === "")
        )
        .map((product) => ({
          productId: parseInt(product.productId),
          isRaw: product.isRaw,
          isProcessed: product.isProcessed,
          value: product.details || "",
        })),
    };
    return formattedData;
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
                { required: false, message: "Please enter business name" },
              ]}
            >
              <Input placeholder="Global Spice Exports Ltd." />
            </Form.Item>
          </Col>
          {isExisting && (
            <Col xs={24} sm={12}>
              <Form.Item
                label="Business Registration Number"
                name="businessRegNo"
                rules={[
                  {
                    required: false,
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
              name="businessExperienceId"
              rules={[
                { required: false, message: "Please enter years in exports" },
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
              rules={[
                { required: false, message: "Please enter started date" },
              ]}
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
                { required: false, message: "Please select employee count" },
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
              name="exportingCountries"
              rules={[
                { required: false, message: "Please select at least one" },
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
            <Form.Item label="Product Range" name="productRange">
              <Input placeholder="Describe your product range" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="Business Description" name="businessDescription">
              <Input.TextArea placeholder="Describe your business" rows={3} />
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
                        (product) => product.productId
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
                            options={formatSelects(productOptions).filter(
                              (option) =>
                                !exportProducts.some(
                                  (p, i) =>
                                    i !== index && p.productId === option.value
                                )
                            )}
                          />
                          <div className="mt-2 flex gap-4">
                            <Checkbox
                              checked={product.isRaw}
                              onChange={(e) =>
                                updateExportProduct(
                                  index,
                                  "isRaw",
                                  e.target.checked
                                )
                              }
                            >
                              Raw
                            </Checkbox>
                            <Checkbox
                              checked={product.isProcessed}
                              onChange={(e) =>
                                updateExportProduct(
                                  index,
                                  "isProcessed",
                                  e.target.checked
                                )
                              }
                            >
                              Value Added
                            </Checkbox>
                          </div>
                        </Col>
                        <Col xs={24} sm={12}>
                          <TextArea
                            placeholder="Enter details (optional)"
                            value={product.details}
                            onChange={(e) =>
                              updateExportProduct(
                                index,
                                "details",
                                e.target.value
                              )
                            }
                            className="w-full"
                            style={{ height: "65px", resize: "none" }}
                            maxLength={500}
                          />
                        </Col>
                        <Col xs={24} sm={2}>
                          <div className="flex flex-col gap-2 justify-center items-center">
                            {exportProducts.length > 1 && (
                              <Button
                                type="text"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => removeExportProduct(index)}
                                size="small"
                              />
                            )}
                            {index === exportProducts.length - 1 && (
                              <Button
                                type="dashed"
                                icon={<PlusOutlined />}
                                onClick={addExportProduct}
                                size="small"
                              />
                            )}
                          </div>
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
              label="Certifications"
              name="certificateId"
              rules={[
                {
                  required: false,
                  message: "Please select at least one certification",
                  type: "array",
                },
              ]}
            >
              <Checkbox.Group options={formatSelects(certificateOptions)} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default ExporterForm;
