import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Select,
  InputNumber,
  DatePicker,
  Upload,
  Button,
  Row,
  Col,
  Checkbox,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useFormContext } from "../../contexts/FormContext";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCertificateOptions,
  fetchExperienceOptions,
  fetchNumEmployeeOptions,
  selectExperienceOptions,
  selectCertificateOptions,
  selectNumEmployeeOptions,
} from "../../store/slices/utilsSlice";
import { useLocation } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

const { Option } = Select;

const spiceProductOptions = [
  { label: "Cinnamon", value: "cinnamon" },
  { label: "Pepper", value: "pepper" },
  { label: "Cardamom", value: "cardamom" },
  { label: "Cloves", value: "cloves" },
  { label: "Nutmeg", value: "nutmeg" },
  { label: "Turmeric", value: "turmeric" },
];

const EntrepreneurForm = (props) => {
  const dispatch = useDispatch();
  const { isExisting } = props;
  const { updateFormData } = useFormContext();

 const location = useLocation();
  console.log(location?.state?.result);

  const load = async () => {
    await dispatch(fetchCertificateOptions());
    await dispatch(fetchNumEmployeeOptions());
    await dispatch(fetchExperienceOptions());
  }

  useEffect(() => {
    load()
  }, [dispatch]);

  const handleChange = (_, allValues) => {
    updateFormData(allValues);
  };

  const experienceOptions = useSelector(selectExperienceOptions) || [];
  const certificateOptions = useSelector(selectCertificateOptions) || [];
  const numberOfEmployeeOptions = useSelector(selectNumEmployeeOptions) || [];

const formatSelects = (data) => {
  return (data || [])
    .filter((item) => item?.id && item?.name)
    .map((item) => ({
      label: item.name.toString(),
      value: item.id.toString(), // enforce string
    }));
};

const [formData,setFormData] = useState(
  {
    businessName: "JMC Stores",
    businessRegNo: "BIS2556",
    businessAddress: " Walapane",
    numberOfEmployeeId: 2,
    certificateId: 3,
    businessExperienceId: 1,
    userId: location?.state?.result ,
    products: [
      {
        "productId": 2,
        "value": 200.0
      },
      {
        "productId": 3,
        "value": 420.10
      }
    ]
  }
)

const handleB = async() => {
  try {
    const response = await axiosInstance.post("/api/entrepreneur", formData);
    console.log(response)
  } catch (error) {
    console.log(error)
  }
}



  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-xl font-medium text-earth-700 mb-6">
        {isExisting
          ? "Existing Business Information"
          : "Business Startup Information"}
      </h3>

      <Form layout="vertical" onValuesChange={handleChange}>
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
              label="Business Type"
              name="businessType"
              rules={[
                { required: true, message: "Please select business type" },
              ]}
            >
             
            </Form.Item>
          </Col>
        </Row>

        {isExisting && (
          <Row gutter={16}>
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
          </Row>
        )}

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

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Business Experience"
              name="businessExperience"
              rules={[{ required: true, message: "Please select experience" }]}
            >
              <Select
                placeholder="Select experience level"
                options={formatSelects(experienceOptions)}
              />
            </Form.Item>
          </Col>
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
        </Row>

        <Row gutter={16}>
          <Col xs={24}>
            <Form.Item
              label="Spice Products"
              name="spiceProducts"
              rules={[
                {
                  required: true,
                  message: "Please select at least one product",
                },
              ]}
            >
              <Select
                mode="multiple"
                placeholder="Select spice products"
                options={spiceProductOptions}
                className="w-full"
              />
            </Form.Item>
          </Col>
        </Row>

        {isExisting && (
          <>
            <Row gutter={16}>
              <Col xs={24}>
                <Form.Item label="Certifications" name="certifications">
                  <Checkbox.Group options={formatSelects(certificateOptions)} />
                </Form.Item>
              </Col>
            </Row>


          </>
        )}

        {!isExisting && (
          <Row gutter={16}>
            <Col xs={24}>
              <Form.Item
                label="Expected Launch Date"
                name="expectedLaunchDate"
                rules={[
                  {
                    required: true,
                    message: "Please select expected launch date",
                  },
                ]}
              >
                <DatePicker className="w-full" />
              </Form.Item>
            </Col>
          </Row>
        )}

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="Additional Information" name="additionalInfo">
              <Input.TextArea
                rows={4}
                placeholder="Any additional information about your business..."
              />
            </Form.Item>
          </Col>
        </Row>

<button onClick={handleB}>
  s
</button>

      </Form>
    </div>
  );
};

export default EntrepreneurForm;
