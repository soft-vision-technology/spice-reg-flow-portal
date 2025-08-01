import { useEffect, useState } from "react";
import { Form, Input, Select, Button, Row, Col, Checkbox, Card, DatePicker } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
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
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../../api/axiosInstance";
import TextArea from "antd/es/input/TextArea";

const ExporterEditForm = ({ roleData, isExisting }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { updateFormData, formData } = useFormContext();
  const [form] = Form.useForm();
  const { id } = useParams();
  const [exportProducts, setExportProducts] = useState([
    { id: null, productId: null, details: "", isRaw: false, isProcessed: false },
  ]);

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

    // Set form fields
    form.setFieldsValue({
      businessName: roleData.businessName,
      businessRegNumber: roleData.businessRegNo,
      productRange: roleData.productRange,
      numberOfEmployeeId:
        roleData.numberOfEmployee?.id?.toString() ||
        roleData.numberOfEmployeeId?.toString(),
      yearsExporting:
        roleData.businessExperience?.id?.toString() ||
        roleData.businessExperienceId?.toString(),
      exportingCountries: roleData.exportingCountries || [],
      exportStartDate: roleData.startDate
        ? dayjs(roleData.startDate)
        : undefined,
      businessDescription: roleData.businessDescription,
      certifications: Array.isArray(roleData.certificateId)
        ? roleData?.certificateId?.map((c) => c?.toString())
        : roleData.certificateId,
    });

    // Store original data for comparison
    setOriginalData({
      businessName: roleData.businessName,
      businessRegNumber: roleData.businessRegNo,
      productRange: roleData.productRange,
      numberOfEmployeeId:
        roleData.numberOfEmployee?.id?.toString() ||
        roleData.numberOfEmployeeId?.toString(),
      yearsExporting:
        roleData.businessExperience?.id?.toString() ||
        roleData.businessExperienceId?.toString(),
      exportingCountries: roleData.exportingCountries || [],
      exportStartDate: roleData.startDate
        ? dayjs(roleData.startDate).format("YYYY-MM-DD")
        : undefined,
      businessDescription: roleData.businessDescription,
      certifications: Array.isArray(roleData.certificateId)
        ? roleData?.certificateId?.map((c) => c?.toString())
        : roleData.certificateId || [],
    });

    // Set export products
    const initialProducts = Array.isArray(roleData.businessProducts)
      ? roleData.businessProducts.map((bp) => ({
        id: bp.id || null,
          productId:
            bp.productId?.toString() || bp.product?.id?.toString() || null,
          isRaw: bp.isRaw || false,
          isProcessed: bp.isProcessed || false,
          details: bp.value || "",
        }))
      : [];

    setExportProducts(
      initialProducts.length > 0
        ? initialProducts
        : [{id:null, productId: null, details: "", isRaw: false, isProcessed: false }]
    );
    setOriginalProducts(JSON.parse(JSON.stringify(initialProducts)));
  }, [roleData, form]);

  const handleChange = (changedValues, allValues) => {
    // Format the data according to API requirements
    const formattedData = {
      businessName: allValues.businessName || null,
      businessRegNo: allValues.businessRegNumber || null,
      numberOfEmployeeId: allValues.numberOfEmployeeId
        ? parseInt(allValues.numberOfEmployeeId)
        : null,
      businessExperienceId: allValues.yearsExporting
        ? parseInt(allValues.yearsExporting)
        : null,
      productRange: allValues.productRange || null,
      businessDescription: allValues.businessDescription || null,
      exportingCountries: allValues.exportingCountries || null,
      exportStartMonth: allValues.exportStartDate
        ? dayjs(allValues.exportStartDate).format("MMMM")
        : null,
      exportStartYear: allValues.exportStartDate
        ? dayjs(allValues.exportStartDate).format("YYYY")
        : null,
      certificateId: allValues.exportCertifications
        ? parseInt(allValues.exportCertifications)
        : null,
      startDate: allValues.exportStartDate
        ? dayjs(allValues.exportStartDate).toISOString()
        : null,
      products: exportProducts
        .filter((product) => product.productId)
        .map((product) => ({
          id: product.id,
          productId: parseInt(product.productId),
          isRaw: product.isRaw,
          isProcessed: product.isProcessed,
          value: product.details || "",
        })),
      userId: location?.state?.result,
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
    setExportProducts([...exportProducts, { productId: null, details: "", isRaw: false, isProcessed: false  }]);
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
      if (key === "exportStartDate") {
        currentValue = currentValue
          ? dayjs(currentValue).format("YYYY-MM-DD")
          : undefined;
        originalValue = originalValue
          ? dayjs(originalValue).format("YYYY-MM-DD")
          : undefined;
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
      changedData.products = exportProducts
        .filter((product) => product.productId)
        .map((product) => ({
          id: product.id || null,
          productId: parseInt(product.productId),
          isRaw: product.isRaw,
          isProcessed: product.isProcessed,
          value: product.details || "",
        }));
    }

    return changedData;
  };

  const mapFieldNames = (data) => {
    const fieldMapping = {
      businessRegNumber: "businessRegNo",
      numberOfEmployeeId: "numberOfEmployeeId",
      certifications: "certificateId",
      yearsExporting: "businessExperienceId",
      exportStartDate: "startDate",
      exportingCountries: "exportingCountries",
      // businessProducts: "businessProducts",
    };

    const mappedData = {};

    Object.keys(data).forEach((key) => {
      const apiKey = fieldMapping[key] || key;
      let value = data[key];

      // Handle specific transformations
      if (key === "numberOfEmployeeId" && value) {
        value = parseInt(value);
      } else if (key === "certifications" && Array.isArray(value)) {
        value = value.map((id) => parseInt(id));
      } else if (key === "yearsExporting" && value) {
        value = parseInt(value);
      } else if (key === "exportStartDate" && value) {
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

      if (!roleData) {
        // Use all form values for new exporter
        const allValues = await form.validateFields();
        const mappedAll = mapFieldNames(allValues);

        const formattedData = {
          businessName: mappedAll.businessName || null,
          businessRegNo: mappedAll.businessRegNo || null,
          yearsExporting: mappedAll.businessExperienceId || null,
          startDate: mappedAll.startDate || null,
          numberOfEmployeeId: mappedAll.numberOfEmployeeId || null,
          exportingCountries: mappedAll.exportingCountries || null,
          productRange: mappedAll.productRange || null,
          businessDescription: mappedAll.businessDescription || null,
          products: exportProducts
            .filter((product) => product.productId)
            .map((product) => ({
              id: product.id || null,
              productId: parseInt(product.productId),
              isRaw: product.isRaw,
              isProcessed: product.isProcessed,
              value: product.details || "",
            })),
          certificateId: mappedAll.certificateId || [],
          userId: id ? parseInt(id) : null,
        };

        const response = await axiosInstance.post(
          "/api/exporter/",
          formattedData
        );
        console.log(response.data);
        navigate("/user-management");
        alert("Success!");
        return response;
      }

      const approvalRequest = {
        type: "editData",
        requestName: `Exporter: ${roleData?.user?.name}`,
        requestData: mappedChanges,
        requestedUrl: `exporter/${roleData.id}`,
      };

      console.log("Submitting changes:", approvalRequest);

      const response = await axiosInstance.post(
        "/api/approval/create",
        approvalRequest
      );

      navigate("/user-management");
      alert("Success!");

      console.log("Approval request submitted successfully:", response.data);
    } catch (error) {
      console.error("Failed to submit approval request:", error);
      throw new Error("Failed to submit form: " + error.message);
    }
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
                name="businessRegNumber"
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
              name="yearsExporting"
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
            <Form.Item label="Certifications" name="certifications">
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

export default ExporterEditForm;
