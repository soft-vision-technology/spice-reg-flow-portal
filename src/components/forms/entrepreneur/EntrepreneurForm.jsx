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
  Checkbox,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useFormContext } from "../../../contexts/FormContext";
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
} from "../../../store/slices/utilsSlice";
import { useLocation } from "react-router-dom";
import TextArea from "antd/es/input/TextArea";

const { Option } = Select;

const EntrepreneurForm = (props) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { isExisting } = props;
  const { updateFormData } = useFormContext();
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
    setExportProducts([...exportProducts, { productId: null, details: "", isRaw: false, isProcessed: false }]);
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
      businessRegistrationNumber: values.businessRegNo || null,
      businessAddress: values.businessAddress || null,
      numberOfEmployees: values.numberOfEmployeeId || null,
      certifications: Array.isArray(values.certificateId) 
        ? values.certificateId 
        : values.certificateId ? [values.certificateId] : [],
      yearsExporting: values.businessExperienceId || null,
      businessExperience: values.businessExperience || null,
      registrationDate: values.registrationDate || null,
      userId: location?.state?.result
        ? parseInt(location?.state?.result)
        : null,
      products: exportProducts
        .filter((product) => product.productId && (product.details || product.details === ""))
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
                { required: false, message: "Please enter business name" },
              ]}
            >
              <Input placeholder="Spice Enterprises" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Business Registration Number"
              name="businessRegNo"
              rules={[
                {
                  required: false,
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
                { required: false, message: "Please enter business address" },
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
                    required: false,
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
                  { required: false, message: "Please select experience" },
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

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label={isExisting ? "Number of Employees" : "Expected Employees"}
              name="numberOfEmployeeId"
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
              label="Years in Export Business"
              name="businessExperienceId"
              rules={[
                { required: false, message: "Please select years in exports" },
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

export default EntrepreneurForm;