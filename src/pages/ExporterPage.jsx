import React, { useEffect, useState } from "react";
import { Steps, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import ExporterForm from "../components/forms/ExporterForm";
import { useFormContext } from "../contexts/FormContext";
import axiosInstance from "../api/axiosInstance";

const { Step } = Steps;

const ExporterPage = () => {
  const navigate = useNavigate();
  const { registrationType, role, formData } = useFormContext();
  console.log(registrationType);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    // Check if user has completed the registration type and role selection
    if (!registrationType || !role || role !== "exporter") {
      navigate("/select");
      message.warning("Please complete the registration selection first");
      return;
    }

    // Check if basic info is available (should have been filled in SelectPage)
    const hasBasicInfo = formData.fullName && formData.email && formData.mobileNumber && formData.nic;
    if (!hasBasicInfo) {
      navigate("/select");
      message.warning("Please complete your basic information first");
      return;
    }
  }, [registrationType, role, formData, navigate]);

  // Determine if this is for existing business or startup
  const isExistingBusiness = registrationType === "have-business";

  const steps = [
    {
      title: "Export Business Information",
      content: <ExporterForm  isExisting={isExistingBusiness} />,
    },
    {
      title: "Review & Submit",
      content: (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-medium text-earth-700 mb-6">
            Review Your Information
          </h3>
          
          <div className="space-y-6">
            {/* Basic Information Summary */}
            <div className="border-b pb-4">
              <h4 className="font-medium text-gray-700 mb-3">Personal Information</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="font-medium">Name:</span> {formData.fullName || 'N/A'}</div>
                <div><span className="font-medium">Email:</span> {formData.email || 'N/A'}</div>
                <div><span className="font-medium">Mobile:</span> {formData.mobileNumber || 'N/A'}</div>
                <div><span className="font-medium">NIC:</span> {formData.nic || 'N/A'}</div>
              </div>
            </div>

            {/* Registration Type Summary */}
            <div className="border-b pb-4">
              <h4 className="font-medium text-gray-700 mb-3">Registration Details</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Registration Type:</span> {" "}
                  {registrationType === "like-to-start" ? "Like to Start" : "Have a Business"}
                </div>
                <div><span className="font-medium">Role:</span> Exporter</div>
              </div>
            </div>

            {/* Export Information Summary */}
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Export Business Information</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {formData.businessName && (
                  <div><span className="font-medium">Business Name:</span> {formData.businessName}</div>
                )}
                {formData.businessRegNo && (
                  <div><span className="font-medium">Registration Number:</span> {formData.businessRegNo}</div>
                )}
                {formData.businessExperienceId && (
                  <div><span className="font-medium">Years of Experience:</span> {formData.businessExperienceId}</div>
                )}
                {formData.numberOfEmployeeId && (
                  <div><span className="font-medium">Number of Employees:</span> {formData.numberOfEmployeeId}</div>
                )}
                {formData.exportingCountries && formData.exportingCountries.length > 0 && (
                  <div><span className="font-medium">Export Countries:</span> {formData.exportingCountries.join(', ')}</div>
                )}
                {formData.exportStartMonth && formData.exportStartYear && (
                  <div><span className="font-medium">Export Start Date:</span> {formData.exportStartMonth} {formData.exportStartYear}</div>
                )}
                {formData.productRange && (
                  <div><span className="font-medium">Product Range:</span> {formData.productRange}</div>
                )}
                {formData.businessDescription && (
                  <div className="col-span-2"><span className="font-medium">Business Description:</span> {formData.businessDescription}</div>
                )}
              </div>
              
              {/* Products Summary */}
              {formData.products && formData.products.length > 0 && (
                <div className="mt-4">
                  <h5 className="font-medium text-gray-600 mb-2">Export Products:</h5>
                  <div className="space-y-1">
                    {formData.products.map((product, index) => (
                      <div key={index} className="text-sm">
                        Product ID: {product.productId}, Value: Rs.{product.value?.toLocaleString()}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-700">
              Please review all information carefully before submitting. 
              You can go back to make changes if needed.
            </p>
          </div>
        </div>
      ),
    },
  ];

  const next = () => {
    //Add validation based on the current step
    if (current === 0) {
      // Validate required export form fields
      if (!formData.businessName) {
        message.warning("Please enter business name");
        return;
      }
      if (!formData.businessExperienceId) {
        message.warning("Please select years of experience");
        return;
      }
      if (!formData.numberOfEmployeeId) {
        message.warning("Please select number of employees");
        return;
      }
    }
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const handleSubmit = async () => {
    try {
      // Format the final submission data according to API requirements
      const submissionData = {
        businessName: formData.businessName || null,
        businessRegNo: formData.businessRegNo || null,
        numberOfEmployeeId: formData.numberOfEmployeeId || null,
        businessExperienceId: formData.businessExperienceId || null,
        productRange: formData.productRange || null,
        businessDescription: formData.businessDescription || null,
        exportingCountries: formData.exportingCountries || null,
        exportStartMonth: formData.exportStartMonth || null,
        exportStartYear: formData.exportStartYear || null,
        certificateId: formData.certificateId || null,
        userId: formData.userId || null,
        products: formData.products || [],
        startDate: formData.startDate || null
      };
      
      console.log("Submitting data:", submissionData);
      
      // TODO: Replace with actual API call
      // const response = await submitExporterRegistration(submissionData);
      const response = await axiosInstance.post("/api/exporter/", submissionData);
      console.log("API response:", response);
      message.success("Exporter registration submitted successfully!");
      navigate("/reports");
    } catch (error) {
      console.error("Submission error:", error);
      message.error("Failed to submit registration. Please try again.");
    }
  };

  // Show loading or redirect message while checking prerequisites
  if (!registrationType || !role || role !== "exporter") {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="text-lg text-gray-600">Redirecting...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-earth-700">
          Exporter Registration
          {registrationType === "like-to-start" && (
            <span className="text-lg font-normal text-gray-600 ml-2">(Startup)</span>
          )}
          {registrationType === "have-business" && (
            <span className="text-lg font-normal text-gray-600 ml-2">(Existing Business)</span>
          )}
        </h1>
        <p className="text-gray-500">
          Complete the following steps to register your export operations
        </p>
      </div>

      <Steps current={current} className="mb-12">
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>

      <div className="mb-8">{steps[current].content}</div>

      <div className="flex justify-between mt-8">
        {current > 0 && (
          <Button onClick={prev}>Previous</Button>
        )}

        <div className="flex-1"></div>

        {current < steps.length - 1 && (
          <Button type="primary" onClick={next} className="bg-spice-500">
            Next
          </Button>
        )}

        {current === steps.length - 1 && (
          <Button type="primary" onClick={handleSubmit} className="bg-spice-500">
            Submit Registration
          </Button>
        )}
      </div>
    </div>
  );
};

export default ExporterPage;