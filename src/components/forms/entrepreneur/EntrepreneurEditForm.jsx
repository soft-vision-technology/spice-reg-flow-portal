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
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../../api/axiosInstance";
import dayjs from "dayjs";
import { use } from "react";

const { Option } = Select;

const EntrepreneurEditForm = ({ roleData, isExisting }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { updateFormData } = useFormContext();
  const [form] = Form.useForm();
  const { id } = useParams();

  console.log("from the entre", id);
  const [exportProducts, setExportProducts] = useState([
    { productId: null, value: null },
  ]);

  // Store original data for comparison
  const [originalData, setOriginalData] = useState({});
  const [originalProducts, setOriginalProducts] = useState([]);

  const load = async () => {
    await dispatch(fetchCertificateOptions());
    await dispatch(fetchNumEmployeeOptions());
    await dispatch(fetchExperienceOptions());
    await dispatch(fetchProductOptions());
  };

  useEffect(() => {
    load();
  }, [dispatch]);

  useEffect(() => {
    if (!roleData) return;

    // Prepare initial form data
    const initialFormData = {
      businessName: roleData.businessName,
      businessRegistrationNumber: roleData.businessRegNo,
      businessAddress: roleData.businessAddress,
      numberOfEmployees:
        roleData.numberOfEmployee?.id?.toString() ||
        roleData.numberOfEmployeeId?.toString(),
      certifications: Array.isArray(roleData.certificate)
        ? roleData.certificate.map((c) => c.id?.toString())
        : roleData.certificateId
        ? [roleData.certificateId.toString()]
        : [],
      yearsExporting:
        roleData.businessExperience?.id?.toString() ||
        roleData.businessExperienceId?.toString(),
      registrationDate: roleData.registrationDate
        ? dayjs(roleData.registrationDate)
        : undefined,
      businessExperience:
        roleData.businessExperience?.id?.toString() ||
        roleData.businessExperienceId?.toString(),
    };

    // Set form fields
    form.setFieldsValue(initialFormData);

    // Store original data for comparison
    setOriginalData({
      businessName: roleData.businessName,
      businessRegistrationNumber: roleData.businessRegNo,
      businessAddress: roleData.businessAddress,
      numberOfEmployees:
        roleData.numberOfEmployee?.id?.toString() ||
        roleData.numberOfEmployeeId?.toString(),
      certifications: Array.isArray(roleData.certificate)
        ? roleData.certificate.map((c) => c.id?.toString())
        : roleData.certificateId
        ? [roleData.certificateId.toString()]
        : [],
      yearsExporting:
        roleData.businessExperience?.id?.toString() ||
        roleData.businessExperienceId?.toString(),
      registrationDate: roleData.registrationDate
        ? dayjs(roleData.registrationDate).format("YYYY-MM-DD")
        : undefined,
      businessExperience:
        roleData.businessExperience?.id?.toString() ||
        roleData.businessExperienceId?.toString(),
    });

    // Set export products
    const initialProducts = Array.isArray(roleData.businessProducts)
      ? roleData.businessProducts.map((bp) => ({
          productId: bp.productId?.toString() || bp.product?.id?.toString(),
          value: bp.value ? parseFloat(bp.value) : null,
        }))
      : [{ productId: null, value: null }];

    setExportProducts(initialProducts);
    setOriginalProducts(JSON.parse(JSON.stringify(initialProducts)));
  }, [roleData, form]);

  const handleChange = (changedValues, allValues) => {
    // Format the data according to API requirements
    const formattedData = {
      businessName: allValues.businessName || null,
      businessRegistrationNumber: allValues.businessRegistrationNumber || null,
      businessAddress: allValues.businessAddress || null,
      numberOfEmployees: allValues.numberOfEmployees || null,
      certifications: allValues.certifications || null,
      yearsExporting: allValues.yearsExporting || null,
      businessExperience: allValues.businessExperience || null,
      registrationDate: allValues.registrationDate
        ? dayjs(allValues.registrationDate).toISOString()
        : null,
      userId: location?.state?.result
        ? parseInt(location?.state?.result)
        : null,
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

  // Helper function to deep compare arrays
  const arraysEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return false;
    return arr1.every((item, index) => {
      if (typeof item === "object" && item !== null) {
        return JSON.stringify(item) === JSON.stringify(arr2[index]);
      }
      return item === arr2[index];
    });
  };

  // Helper function to get only changed fields
  const getChangedFields = (currentValues) => {
    const changedData = {};

    // Compare form fields
    Object.keys(currentValues).forEach((key) => {
      let currentValue = currentValues[key];
      let originalValue = originalData[key];

      // Handle date comparison
      if (key === "registrationDate") {
        currentValue = currentValue
          ? dayjs(currentValue).format("YYYY-MM-DD")
          : undefined;
      }

      // Handle array comparison (for certifications)
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
      changedData.products = exportProducts
        .filter((product) => product.productId && product.value)
        .map((product) => ({
          productId: parseInt(product.productId),
          value: parseFloat(product.value),
        }));
    }

    return changedData;
  };

  // Map form field names to API field names
  const mapFieldNames = (data) => {
    const fieldMapping = {
      businessRegistrationNumber: "businessRegNo",
      numberOfEmployees: "numberOfEmployeeId",
      certifications: "certificateIds",
      yearsExporting: "businessExperienceId",
      businessExperience: "businessExperienceId",
    };

    const mappedData = {};

    Object.keys(data).forEach((key) => {
      const apiKey = fieldMapping[key] || key;
      let value = data[key];

      // Handle specific transformations
      if (key === "numberOfEmployees" && value) {
        value = parseInt(value);
      } else if (key === "certifications" && Array.isArray(value)) {
        value = value.map((id) => parseInt(id));
      } else if (
        (key === "yearsExporting" || key === "businessExperience") &&
        value
      ) {
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

      // If no changes, don't submit
      if (Object.keys(changedFields).length === 0) {
        console.log("No changes detected");
        return;
      }

      // Map field names to API format
      const mappedChanges = mapFieldNames(changedFields);

      // Prepare approval request
      const approvalRequest = {
        type: "editData",
        requestName: `Entrepreneur: ${roleData?.user?.name}`,
        requestData: mappedChanges,
        requestedUrl: `entrepreneur/${roleData.id || location?.state?.result}`,
      };

      console.log("Submitting changes:", approvalRequest);

      if (!roleData?.id) {
        // Use all form values, not just changed fields
        const allValues = await form.validateFields();
        const mappedAll = mapFieldNames(allValues);

        const formattedData = {
          businessName: mappedAll.businessName || null,
          businessRegNo: mappedAll.businessRegNo || null,
          businessAddress: mappedAll.businessAddress || null,
          numberOfEmployeeId: mappedAll.numberOfEmployeeId
            ? parseInt(mappedAll.numberOfEmployeeId)
            : null,
          certificateId: Array.isArray(mappedAll.certificateIds)
            ? mappedAll.certificateIds.map((id) => parseInt(id))
            : [],
          businessExperienceId: mappedAll.businessExperienceId
            ? parseInt(mappedAll.businessExperienceId)
            : null,
          userId: id ? Number(id) : null,
          products: exportProducts
            .filter((product) => product.productId && product.value)
            .map((product) => ({
              productId: parseInt(product.productId),
              value: parseFloat(product.value),
            })),
        };

        const response = await axiosInstance.post(
          "/api/entreprenuer/",
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

      // Optionally show success message or redirect
      navigate("/user-management");
    } catch (error) {
      console.error("Failed to submit approval request:", error);
      throw new Error("Failed to submit form: " + error.message);
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

        <Button type="primary" onClick={handleSubmit} className="bg-spice-500">
          Submit Changes
        </Button>
      </Form>
    </div>
  );
};

export default EntrepreneurEditForm;
