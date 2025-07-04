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
import { useLocation, useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import axiosInstance from "../../../api/axiosInstance";

const TraderEditForm = ({ roleData, isExisting }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { updateFormData, formData } = useFormContext();
  const [form] = Form.useForm();
  const { id } = useParams();
  const [exportProducts, setExportProducts] = useState([
    { productId: null, value: null },
  ]);

  const [originalData, setOriginalData] = useState({});
  const [originalProducts, setOriginalProducts] = useState({});

  const load = async () => {
    await dispatch(fetchNumEmployeeOptions());
    await dispatch(fetchExperienceOptions());
    await dispatch(fetchProductOptions());
  };

  useEffect(() => {
    load();
  }, [dispatch]);

  useEffect(() => {
    if (!roleData) return;

    form.setFieldsValue({
      businessName: roleData.businessName,
      businessRegistrationNumber: roleData.businessRegNo,
      businessAddress: roleData.businessAddress,
      numberOfEmployees: roleData.numberOfEmployee?.id?.toString() || roleData.numberOfEmployeeId?.toString(),
      yearsTrading: roleData.businessExperience?.id?.toString() || roleData.businessExperienceId?.toString(),
      registrationDate: roleData.businessStartDate ? dayjs(roleData.businessStartDate) : undefined,
      additionalInfo: roleData.businessDescription || "",
    });

    setOriginalData({
      businessName: roleData.businessName,
      businessRegistrationNumber: roleData.businessRegNo,
      businessAddress: roleData.businessAddress,
      numberOfEmployees: roleData.numberOfEmployee?.id?.toString() || roleData.numberOfEmployeeId?.toString(),
      yearsTrading: roleData.businessExperience?.id?.toString() || roleData.businessExperienceId?.toString(),
      registrationDate: roleData.businessStartDate ? dayjs(roleData.businessStartDate).format("YYYY-MM-DD") : undefined,
      additionalInfo: roleData.businessDescription || "",
    });

    if (Array.isArray(roleData.businessProducts)) {
      const initialProducts = roleData.businessProducts.map((bp) => ({
        productId: bp.productId?.toString() || bp.product?.id?.toString(),
        value: bp.value ? parseFloat(bp.value) : null,
      }));
      setExportProducts(initialProducts);
      setOriginalProducts(JSON.parse(JSON.stringify(initialProducts)));
    }
  }, [roleData, form]);

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

  const arraysEqual = (arr1, arr2) => {
    if (!Array.isArray(arr1) || !Array.isArray(arr2)) return false;
    if (arr1.length !== arr2.length) return false;
    return arr1.every((item, index) => {
      if (typeof item === "object" && item !== null) {
        return JSON.stringify(item) === JSON.stringify(arr2[index]);
      }
      return item === arr2[index];
    });
  };

  const getChangedFields = (currentValues) => {
    const changedData = {};
    Object.keys(currentValues).forEach((key) => {
      let currentValue = currentValues[key];
      let originalValue = originalData[key];

      // Handle date comparison
      if (key === "registrationDate") {
        currentValue = currentValue ? dayjs(currentValue).format("YYYY-MM-DD") : undefined;
        originalValue = originalValue ? dayjs(originalValue).format("YYYY-MM-DD") : undefined;
      }

      // Handle array comparison
      if (Array.isArray(currentValue) && Array.isArray(originalValue)) {
        if (!arraysEqual(currentValue, originalValue)) {
          changedData[key] = currentValue;
        }
      } else if (currentValue !== originalValue) {
        changedData[key] = currentValue;
      }
    });

    // Compare products
    if (!arraysEqual(exportProducts, originalProducts)) {
      changedData.businessProducts = exportProducts
        .filter((product) => product.productId && product.value)
        .map((product) => ({
          productId: parseInt(product.productId),
          value: parseFloat(product.value),
        }));
    }

    return changedData;
  };

  const mapFieldNames = (data) => {
    const fieldMapping = {
      businessRegistrationNumber: "businessRegNo",
      numberOfEmployees: "numberOfEmployeeId",
      yearsTrading: "businessExperienceId",
      registrationDate: "businessStartDate",
      businessProducts: "businessProducts",
      additionalInfo: "businessDescription",
    };

    const mappedData = {};

    Object.keys(data).forEach((key) => {
      const apiKey = fieldMapping[key] || key;
      let value = data[key];

      // Handle specific transformations
      if (key === "numberOfEmployees" && value) {
        value = parseInt(value);
      } else if (key === "yearsTrading" && value) {
        value = parseInt(value);
      } else if (key === "registrationDate" && value) {
        value = dayjs(value).toISOString();
      }

      mappedData[apiKey] = value;
    });

    return mappedData;
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const changedFields = getChangedFields(values);

      if (Object.keys(changedFields).length === 0) {
        console.log("No changes detected");
        return;
      }

      const mappedChanges = mapFieldNames(changedFields);

      const approvalRequest = {
        type: "editData",
        requestName: `Intermediary Trader: ${roleData?.user?.name}`,
        requestData: mappedChanges,
        requestedUrl: `trader/${roleData.id || location?.state?.result}`,
      };

      console.log("Submitting changes:", approvalRequest);

      if (!roleData?.id) {
        // Use all form values for new trader
        const allValues = await form.validateFields();
        const mappedAll = mapFieldNames(allValues);

        const formattedData = {
          businessName: mappedAll.businessName || null,
          businessRegNo: mappedAll.businessRegNo || null,
          businessAddress: mappedAll.businessAddress || null,
          numberOfEmployeeId: mappedAll.numberOfEmployeeId || null,
          businessExperienceId: mappedAll.businessExperienceId || null,
          businessStartDate: mappedAll.businessStartDate || null,
          businessDescription: mappedAll.businessDescription || null,
          businessProducts: exportProducts
            .filter((product) => product.productId && product.value)
            .map((product) => ({
              productId: parseInt(product.productId),
              value: parseFloat(product.value),
            })),
          userId: id,
        };

        const response = await axiosInstance.post(
          "/api/trader/",
          formattedData
        );
        console.log(response.data);
        navigate("/user-management");
        alert("Success!");
        return response;
      }

      const response = await axiosInstance.post(
        "/api/approval/create",
        approvalRequest
      );
      navigate("/user-management");
      console.log("Approval request submitted successfully:", response.data);
    } catch (error) {
      console.error("Failed to submit approval request:", error);
      throw new Error("Failed to submit form: " + error.message);
    }
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
                { required: true, message: "Please enter business name" },
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
                  required: true,
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
                { required: true, message: "Please enter business address" },
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
                { required: true, message: "Please select years in trading" },
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
                { required: true, message: "Please select employee count" },
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
          <Col span={24}>
            <Form.Item label="Additional Information" name="additionalInfo">
              <Input.TextArea
                rows={4}
                placeholder="Any additional information about your trading business..."
              />
            </Form.Item>
          </Col>
          <Button type="primary" onClick={handleSubmit} className="bg-spice-500">
          Submit Changes
        </Button>
        </Row>
      </Form>
    </div>
  );
};

export default TraderEditForm;