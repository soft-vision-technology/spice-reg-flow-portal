import React, { useEffect, useState } from "react";
import { Steps, Button, message } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import EntrepreneurForm from "../components/forms/entrepreneur/EntrepreneurForm";
import { useFormContext } from "../contexts/FormContext";
import axiosInstance from "../api/axiosInstance";

const { Step } = Steps;

const ExistingBusinessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { registrationType, role, formData } = useFormContext();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!registrationType || !role || role !=="entrepreneur") {
      navigate("/select");
      message.warning("Please complete the registration selection first");
      return;
    }

    const hasBasicInfo = formData.fullName && formData.mobileNumber && formData.nic;
        if (!hasBasicInfo) {
          navigate("/select");
          message.warning("Please complete your basic information first");
          return;
        }
  }, [registrationType, role, formData, navigate]);

  const isExistingBusiness = registrationType === "have-business";

  const steps = [
    {
      title: "Business Information",
      content: <EntrepreneurForm isExisting={isExistingBusiness} />,
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
              <h4 className="font-medium text-gray-700 mb-3">
                Personal Information
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Name:</span>{" "}
                  {formData.fullName || "-"}
                </div>
                <div>
                  <span className="font-medium">Email:</span>{" "}
                  {formData.email || "-"}
                </div>
                <div>
                  <span className="font-medium">Mobile:</span>{" "}
                  {formData.mobileNumber || "-"}
                </div>
                <div>
                  <span className="font-medium">NIC:</span>{" "}
                  {formData.nic || "-"}
                </div>
              </div>
            </div>

            {/* Registration Type Summary */}
            <div className="border-b pb-4">
              <h4 className="font-medium text-gray-700 mb-3">
                Registration Details
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Registration Type:</span>{" "}
                  {registrationType === "like-to-start"
                    ? "Like to Start"
                    : "Have a Business"}
                </div>
                <div>
                  <span className="font-medium">Role:</span> Entrepreneur
                </div>
              </div>
            </div>

            {/* Business Information Summary */}
            <div>
              <h4 className="font-medium text-gray-700 mb-3">
                Business Information
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {formData.businessName && (
                  <div>
                    <span className="font-medium">Business Name:</span>{" "}
                    {formData.businessName}
                  </div>
                )}
                {formData.businessRegistrationNumber && (
                  <div>
                    <span className="font-medium">Registration Number:</span>{" "}
                    {formData.businessRegistrationNumber}
                  </div>
                )}
                {formData.businessAddress && (
                  <div className="col-span-2">
                    <span className="font-medium">Business Address:</span>{" "}
                    {formData.businessAddress}
                  </div>
                )}
                {formData.numberOfEmployees && (
                  <div>
                    <span className="font-medium">Number of Employees:</span>{" "}
                    {formData.numberOfEmployees}
                  </div>
                )}
                {formData.yearsExporting && (
                  <div>
                    <span className="font-medium">
                      Years in Export Business:
                    </span>{" "}
                    {formData.yearsExporting}
                  </div>
                )}
                {formData.businessExperience && (
                  <div>
                    <span className="font-medium">Business Experience:</span>{" "}
                    {formData.businessExperience}
                  </div>
                )}
                {formData.certifications && (
                  <div>
                    <span className="font-medium">Certifications:</span>{" "}
                    {Array.isArray(formData.certifications) 
                      ? formData.certifications.join(", ")
                      : formData.certifications}
                  </div>
                )}
                {formData.additionalInfo && (
                  <div className="col-span-2">
                    <span className="font-medium">Additional Information:</span>{" "}
                    {formData.additionalInfo}
                  </div>
                )}
              </div>

              {/* Products Summary */}
              {formData.products && formData.products.length > 0 && (
                <div className="mt-4">
                  <h5 className="font-medium text-gray-600 mb-2">
                    Export Products:
                  </h5>
                  <div className="space-y-2">
                    {formData.products.map((product, index) => (
                      <div key={index} className="text-sm bg-gray-50 p-2 rounded">
                        <div><strong>Product Name:</strong> {product.productId}</div>
                        <div><strong>Particulars:</strong> ${product.value?.toLocaleString()}</div>
                        <div><strong>Type:</strong> {product.isRaw ? "Raw" : ""} {product.isProcessed ? "Value Added" : ""}</div>
                        {product.details && <div><strong>Details:</strong> {product.details}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-700">
              Please review all information carefully before submitting. You can
              go back to make changes if needed.
            </p>
          </div>
        </div>
      ),
    },
  ];

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const handleSubmit = async () => {
    try {
      const userId = location?.state?.result || formData.userId;

      if (!userId) {
        message.error(
          "User ID is missing. Please start the registration process again."
        );
        return;
      }

      // Format data according to Entrepreneur Prisma model
      const submissionData = {
        businessName: formData.businessName || null,
        businessRegNo: formData.businessRegistrationNumber || null,
        businessAddress: formData.businessAddress || null,
        numberOfEmployeeId: formData.numberOfEmployees 
          ? parseInt(formData.numberOfEmployees) 
          : null,
        certificateId: Array.isArray(formData.certifications)
          ? formData.certifications.map(cert => parseInt(cert))
          : formData.certifications ? [parseInt(formData.certifications)] : [],
        businessExperienceId: formData.yearsExporting 
          ? parseInt(formData.yearsExporting) 
          : null,
        userId: parseInt(userId),
        
        // Products array for BusinessProducts relationship
        products: (formData.products || [])
          .filter((product) => product.productId && product.value)
          .map((product) => ({
            productId: parseInt(product.productId),
            isRaw: product.isRaw || false,
            isProcessed: product.isProcessed || false,
            value: product.value || "",
          })),
      };

      console.log("Submitting data:", submissionData);

      const response = await axiosInstance.post("/api/entrepreneur/", submissionData);
      message.success("Entrepreneur registration submitted successfully!");
      navigate("/reports");
    } catch (error) {
      console.error("Submission error:", error);
      console.error("Error details:", error.response?.data);
      message.error(`Failed to submit registration: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-earth-700">
          Existing Business Registration
        </h1>
        <p className="text-gray-500">
          Complete the following steps to register your existing business
        </p>
      </div>

      <Steps current={current} className="mb-12">
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>

      <div className="mb-8">{steps[current].content}</div>

      <div className="flex justify-between mt-8">
        {current > 0 && <Button onClick={prev}>Previous</Button>}

        <div className="flex-1"></div>

        {current < steps.length - 1 && (
          <Button type="primary" onClick={next} className="bg-spice-500">
            Next
          </Button>
        )}

        {current === steps.length - 1 && (
          <Button
            type="primary"
            onClick={handleSubmit}
            className="bg-spice-500"
          >
            Submit Registration
          </Button>
        )}
      </div>
    </div>
  );
};

export default ExistingBusinessPage;