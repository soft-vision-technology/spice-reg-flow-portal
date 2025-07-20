import { useEffect, useState } from "react";
import { Form, Input, Select, DatePicker, Button, Row, Col, Card, Checkbox } from "antd";
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
import TextArea from "antd/es/input/TextArea";

const { Option } = Select;

const EntrepreneurEditForm = ({ roleData, isExisting }) => {
  // ====== HOOKS ======
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { updateFormData } = useFormContext();
  const [form] = Form.useForm();
  const { id } = useParams();

  // ====== STATE ======
  const [exportProducts, setExportProducts] = useState([
    { productId: null, details: "", isRaw: false, isProcessed: false },
  ]);
  const [originalData, setOriginalData] = useState({});
  const [originalProducts, setOriginalProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // ====== SELECTORS ======
  const experienceOptions = useSelector(selectExperienceOptions) || [];
  const certificateOptions = useSelector(selectCertificateOptions) || [];
  const numberOfEmployeeOptions = useSelector(selectNumEmployeeOptions) || [];
  const productOptions = useSelector(selectProductOptions) || [];

  // ====== HELPER FUNCTIONS ======
  const formatSelects = (data) => {
    return (data || [])
      .filter((item) => item?.id && item?.name)
      .map((item) => ({
        label: item.name.toString(),
        value: item.id.toString(),
      }));
  };

  const arraysEqual = (arr1, arr2) => {
    if (!arr1 || !arr2 || arr1.length !== arr2.length) return false;
    return arr1.every((item, index) => {
      if (typeof item === "object" && item !== null) {
        return JSON.stringify(item) === JSON.stringify(arr2[index]);
      }
      return item === arr2[index];
    });
  };

  const mapFieldNames = (data) => {
    const fieldMapping = {
      businessRegNo: "businessRegNo",
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
        value = (value || []).map((v) => parseInt(v));
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

    // Compare products - Fixed the comparison logic
    if (!arraysEqual(exportProducts, originalProducts)) {
      changedData.products = exportProducts
        .filter((product) => product.productId)
        .map((product) => ({
          productId: parseInt(product.productId),
          isRaw: product.isRaw,
          isProcessed: product.isProcessed,
          value: product.details || "", // Fixed: was using parseFloat(product.value) but should be details
        }));
    }

    return changedData;
  };

  // ====== DATA LOADING ======
  const loadOptions = async () => {
    try {
      await Promise.all([
        dispatch(fetchCertificateOptions()),
        dispatch(fetchNumEmployeeOptions()),
        dispatch(fetchExperienceOptions()),
        dispatch(fetchProductOptions()),
      ]);
    } catch (error) {
      console.error("Failed to load options:", error);
    }
  };

  const initializeFormData = () => {
    if (!roleData) return;

    // Get certifications - handle both array format and object format
    let certifications = [];
    if (roleData.entrepreneur?.certificateId && Array.isArray(roleData.entrepreneur.certificateId)) {
      // From entrepreneur nested object (your current data structure)
      certifications = roleData.entrepreneur.certificateId.map(id => id.toString());
    } else if (roleData.certificateId && Array.isArray(roleData.certificateId)) {
      // Direct certificateId array
      certifications = roleData.certificateId.map(id => id.toString());
    } else if (roleData.certificate && Array.isArray(roleData.certificate)) {
      // Certificate objects with id
      certifications = roleData.certificate.map(c => c.id.toString());
    }

    // Prepare initial form data
    const initialFormData = {
      businessName: roleData.entrepreneur?.businessName || roleData.businessName || "",
      businessRegNo: roleData.entrepreneur?.businessRegNo || roleData.businessRegNo || "",
      businessAddress: roleData.entrepreneur?.businessAddress || roleData.businessAddress || "",
      numberOfEmployees: roleData.entrepreneur?.numberOfEmployeeId?.toString() || 
                        roleData.numberOfEmployee?.id?.toString() || 
                        roleData.numberOfEmployeeId?.toString() || "",
      certifications: certifications,
      yearsExporting: roleData.entrepreneur?.businessExperienceId?.toString() ||
                     roleData.businessExperience?.id?.toString() || 
                     roleData.businessExperienceId?.toString() || "",
      registrationDate: roleData.entrepreneur?.registrationDate || roleData.registrationDate
        ? dayjs(roleData.entrepreneur?.registrationDate || roleData.registrationDate)
        : undefined,
      businessExperience: roleData.entrepreneur?.businessExperienceId?.toString() ||
                         roleData.businessExperience?.id?.toString() || 
                         roleData.businessExperienceId?.toString() || "",
    };

    // Set form fields
    form.setFieldsValue(initialFormData);

    // Set form fields
    form.setFieldsValue(initialFormData);

    // Store original data for comparison
    setOriginalData({
      ...initialFormData,
      registrationDate: (roleData.entrepreneur?.registrationDate || roleData.registrationDate)
        ? dayjs(roleData.entrepreneur?.registrationDate || roleData.registrationDate).format("YYYY-MM-DD")
        : undefined,
    });

    // Set export products - check both entrepreneur.businessProducts and direct businessProducts
    const businessProducts = roleData.entrepreneur?.businessProducts || roleData.businessProducts;
    const initialProducts = Array.isArray(businessProducts)
      ? businessProducts.map((bp) => ({
          productId: bp.productId?.toString() || bp.product?.id?.toString() || null,
          isRaw: bp.isRaw || false,
          isProcessed: bp.isProcessed || false,
          details: bp.value || "",
        }))
      : [];

    const productsToSet = initialProducts.length > 0
      ? initialProducts
      : [{ productId: null, details: "", isRaw: false, isProcessed: false }];

    setExportProducts(productsToSet);
    setOriginalProducts(JSON.parse(JSON.stringify(initialProducts)));
  };

  // ====== PRODUCT HANDLERS ======
  const addExportProduct = () => {
    setExportProducts([
      ...exportProducts, 
      { productId: null, details: "", isRaw: false, isProcessed: false }
    ]);
  };

  const removeExportProduct = (index) => {
    if (exportProducts.length <= 1) return; // Prevent removing the last product
    
    const newProducts = exportProducts.filter((_, i) => i !== index);
    setExportProducts(newProducts);
    // Trigger form update
    handleFormChange();
  };

  const updateExportProduct = (index, field, value) => {
    const newProducts = [...exportProducts];
    newProducts[index][field] = value;
    setExportProducts(newProducts);
    // Trigger form update
    handleFormChange();
  };

  // ====== FORM HANDLERS ======
  const handleFormChange = () => {
    const currentValues = form.getFieldsValue();
    
    // Format the data according to API requirements
    const formattedData = {
      businessName: currentValues.businessName || null,
      businessRegNo: currentValues.businessRegNo || null,
      businessAddress: currentValues.businessAddress || null,
      numberOfEmployees: currentValues.numberOfEmployees || null,
      certifications: currentValues.certifications || [],
      yearsExporting: currentValues.yearsExporting || null,
      businessExperience: currentValues.businessExperience || null,
      registrationDate: currentValues.registrationDate
        ? dayjs(currentValues.registrationDate).toISOString()
        : null,
      userId: location?.state?.result
        ? parseInt(location?.state?.result)
        : null,
      products: exportProducts
        .filter((product) => product.productId)
        .map((product) => ({
          productId: parseInt(product.productId),
          isRaw: product.isRaw,
          isProcessed: product.isProcessed,
          value: product.details || "",
        })),
    };

    updateFormData(formattedData);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      if (!roleData) {
        // Creating new entrepreneur
        const mappedAll = mapFieldNames(values);

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
          registrationDate: values.registrationDate 
            ? dayjs(values.registrationDate).toISOString() 
            : null,
          userId: id ? Number(id) : null,
          products: exportProducts
            .filter((product) => product.productId)
            .map((product) => ({
              productId: parseInt(product.productId),
              isRaw: product.isRaw,
              isProcessed: product.isProcessed,
              value: product.details || "",
            })),
        };

        const response = await axiosInstance.post(
          "/api/entreprenuer/",
          formattedData
        );
        
        console.log("Created successfully:", response.data);
        alert("Success!");
        navigate("/user-management");
        return;
      }

      // Updating existing entrepreneur
      const changedFields = getChangedFields(values);

      // If no changes, don't submit
      if (Object.keys(changedFields).length === 0) {
        console.log("No changes detected");
        alert("No changes to save");
        return;
      }

      // Map field names to API format
      const mappedChanges = mapFieldNames(changedFields);

      // Prepare approval request
      const approvalRequest = {
        type: "editData",
        requestName: `Entrepreneur: ${roleData?.user?.name || 'Unknown'}`,
        requestData: mappedChanges,
        requestedUrl: `entrepreneur/${roleData.id}`,
      };

      console.log("Submitting changes:", approvalRequest);

      const response = await axiosInstance.post(
        "/api/approval/create",
        approvalRequest
      );
      
      console.log("Approval request submitted successfully:", response.data);
      alert("Changes submitted for approval!");
      navigate("/user-management");
      
    } catch (error) {
      console.error("Failed to submit:", error);
      alert("Failed to submit form: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  // ====== EFFECTS ======
  useEffect(() => {
    loadOptions();
  }, [dispatch]);

  useEffect(() => {
    initializeFormData();
  }, [roleData, form]);

  // ====== RENDER ======
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-xl font-medium text-earth-700 mb-6">
        {isExisting
          ? "Existing Business Information"
          : "Business Startup Information"}
      </h3>

      <Form form={form} layout="vertical" onValuesChange={handleFormChange}>
        {/* Basic Information */}
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

        {/* Registration and Experience (only for new businesses) */}
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

        {/* Export Products */}
        <Row gutter={16}>
          <Col xs={24}>
            <Form.Item
              label="Export Spice Products & Details"
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
                            "Please add at least one spice product"
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

        {/* Employee and Export Experience */}
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label={isExisting ? "Number of Employees" : "Expected Employees"}
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
        </Row>

        {/* Certifications */}
        <Row gutter={16}>
          <Col xs={24}>
            <Form.Item label="Certifications" name="certifications">
              <Checkbox.Group options={formatSelects(certificateOptions)} />
            </Form.Item>
          </Col>
        </Row>

        {/* Submit Button */}
        <Row>
          <Col>
            <Button 
              type="primary" 
              onClick={handleSubmit} 
              className="bg-spice-500"
              loading={loading}
            >
              {roleData ? "Submit Changes" : "Create Business"}
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default EntrepreneurEditForm;