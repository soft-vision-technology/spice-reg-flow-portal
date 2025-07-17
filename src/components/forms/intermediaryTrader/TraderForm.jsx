import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Select,
  InputNumber,
  DatePicker,
  Button,
  Row,
  Col,
  Card,
  Space,
  Checkbox,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useFormContext } from "../../../contexts/FormContext";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchExperienceOptions,
  fetchNumEmployeeOptions,
  fetchProductOptions,
  selectExperienceOptions,
  selectNumEmployeeOptions,
  selectProductOptions,
} from "../../../store/slices/utilsSlice";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";
import TextArea from "antd/es/input/TextArea";

const TraderForm = ({ isExisting }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { updateFormData, formData } = useFormContext();
  const [form] = Form.useForm();
  const [exportProducts, setExportProducts] = useState([
    { productId: null, value: null },
  ]);

  const load = async () => {
    await dispatch(fetchNumEmployeeOptions());
    await dispatch(fetchExperienceOptions());
    await dispatch(fetchProductOptions());
  };

  useEffect(() => {
    load();
  }, [dispatch]);

  const experienceOptions = useSelector(selectExperienceOptions) || [];
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
      businessRegNo: allValues.businessRegistrationNumber || null,
      businessAddress: allValues.businessAddress || null,
      numberOfEmployeeId: allValues.numberOfEmployees
        ? parseInt(allValues.numberOfEmployees)
        : null,
      businessExperienceId: allValues.yearsTrading
        ? parseInt(allValues.yearsTrading)
        : null,
      registrationDate: allValues.registrationDate
        ? dayjs(allValues.registrationDate).toISOString()
        : null,
      additionalInfo: allValues.additionalInfo || null,
      userId: location?.state?.result,
      products: exportProducts
        .filter((product) => product.productId && product.value)
        .map((product) => ({
          productId: parseInt(product.productId),
          value: parseFloat(product.value),
        })),
    };

    updateFormData(formattedData);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-xl font-medium text-earth-700 mb-6">
        Trading Business Information
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
              <Input placeholder="Spice Trading Enterprises" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Business Registration Number"
              name="businessRegistrationNumber"
              rules={[
                {
                  required: false,
                  message: "Please enter registration number",
                },
              ]}
            >
              <Input placeholder="TRD12345" />
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
                rows={3}
                placeholder="123 Trading Street, Commercial Zone, Colombo"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24}>
            <Form.Item
              label="Trading Spice Products & Values"
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
                            checked={product.raw}
                            onChange={(e) =>
                              updateExportProduct(
                                index,
                                "raw",
                                e.target.checked
                              )
                            }
                          >
                            Raw
                          </Checkbox>
                          <Checkbox
                            checked={product.valueAdded}
                            onChange={(e) =>
                              updateExportProduct(
                                index,
                                "valueAdded",
                                e.target.checked
                              )
                            }
                          >
                            Value Added
                          </Checkbox>
                        </div>
                      </Col>
                      <Col xs={24} sm={8}>
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
                      <Col xs={24} sm={6}>
                        <div className="flex flex-col gap-2">
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
                label="Registration Date"
                name="registrationDate"
                rules={[
                  {
                    required: false,
                    message: "Please select registration date",
                  },
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
              label="Years in Trading Business"
              name="yearsTrading"
              rules={[
                { required: false, message: "Please select years in trading" },
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
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="Additional Information" name="additionalInfo">
              <Input.TextArea
                rows={4}
                placeholder="Any additional information about your trading business..."
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default TraderForm;