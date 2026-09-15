import React, { useEffect, useState } from "react";
import { Steps, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import ExporterForm from "../components/forms/exporter/ExporterForm";
import { useFormContext } from "../contexts/FormContext";
import axiosInstance from "../api/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { fetchCertificateOptions, fetchExperienceOptions, fetchNumEmployeeOptions, fetchProductOptions } from "../store/slices/utilsSlice";

const { Step } = Steps;

const ExporterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { registrationType, role, formData } = useFormContext();
  const [current, setCurrent] = useState(0);

  // Get lookup options from utilsSlice - Fixed selector names
  const numberOfEmployeeOptions = useSelector(
    (state) => state.utils.numEmployeeOptions  // Fixed: was numberOfEmployeeOptions
  );
  const experienceOptions = useSelector(
    (state) => state.utils.experienceOptions
  );
  const certificateOptions = useSelector(
    (state) => state.utils.certificateOptions
  );
  const productOptions = useSelector(
    (state) => state.utils.productOptions
  );

  useEffect(() => {
    // Check if user has completed the registration type and role selection
    if (!registrationType || !role || role !== "exporter") {
      navigate("/select");
      message.warning("Please complete the registration selection first");
      return;
    }

    // Check if basic info is available (should have been filled in SelectPage)
    const hasBasicInfo =
      formData.fullName && formData.mobileNumber && formData.nic;
    if (!hasBasicInfo) {
      navigate("/select");
      message.warning("Please complete your basic information first");
      return;
    }
  }, [registrationType, role, formData, navigate]);

  useEffect(() => {
    dispatch(fetchNumEmployeeOptions());
    dispatch(fetchExperienceOptions());
    dispatch(fetchCertificateOptions());
    dispatch(fetchProductOptions());
  }, [dispatch]);

  // Determine if this is for existing business or startup
  const isExistingBusiness = registrationType === "have-business";

  // Helper functions to map IDs to names
  const getOptionName = (options, id) => {
    const found = options.find((opt) => String(opt.id) === String(id));
    return found ? found.name : id;
  };

  const getProductName = (id) => {
    const found = productOptions.find((opt) => String(opt.id) === String(id));
    return found ? found.name : id;
  };

  const getCertificateNames = (certifications) => {
    if (!certifications) return "-";
    
    if (Array.isArray(certifications)) {
      return certifications
        .map((id) => getOptionName(certificateOptions, id))
        .join(", ");
    }
    
    return getOptionName(certificateOptions, certifications);
  };

  const getEmployeeCountName = (id) => {
    if (!id) return "-";
    return getOptionName(numberOfEmployeeOptions, id);
  };

  const getExperienceName = (id) => {
    if (!id) return "-";
    return getOptionName(experienceOptions, id);
  };

  const steps = [
    {
      title: "Export Business Information",
      content: <ExporterForm isExisting={isExistingBusiness} />,
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
                  <span className="font-medium">Role:</span> Exporter
                </div>
              </div>
            </div>

            {/* Export Information Summary */}
            <div>
              <h4 className="font-medium text-gray-700 mb-3">
                Export Business Information
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {formData.businessName && (
                  <div>
                    <span className="font-medium">Business Name:</span>{" "}
                    {formData.businessName}
                  </div>
                )}
                {formData.businessRegNo && (
                  <div>
                    <span className="font-medium">Registration Number:</span>{" "}
                    {formData.businessRegNo}
                  </div>
                )}
                {formData.businessExperienceId && (
                  <div>
                    <span className="font-medium">Years of Experience:</span>{" "}
                    {getExperienceName(formData.businessExperienceId)}
                  </div>
                )}
                {formData.numberOfEmployeeId && (
                  <div>
                    <span className="font-medium">Number of Employees:</span>{" "}
                    {getEmployeeCountName(formData.numberOfEmployeeId)}
                  </div>
                )}
                {formData.exportingCountries &&
                  formData.exportingCountries.length > 0 && (
                    <div>
                      <span className="font-medium">Export Countries:</span>{" "}
                      {formData.exportingCountries.join(", ")}
                    </div>
                  )}
                {formData.exportStartMonth && formData.exportStartYear && (
                  <div>
                    <span className="font-medium">Export Start Date:</span>{" "}
                    {formData.exportStartMonth} {formData.exportStartYear}
                  </div>
                )}
                {formData.productRange && (
                  <div>
                    <span className="font-medium">Product Range:</span>{" "}
                    {formData.productRange}
                  </div>
                )}
                {formData.certificateId && (
                  <div>
                    <span className="font-medium">Certifications:</span>{" "}
                    {getCertificateNames(formData.certificateId)}
                  </div>
                )}
                {formData.businessDescription && (
                  <div className="col-span-2">
                    <span className="font-medium">Business Description:</span>{" "}
                    {formData.businessDescription}
                  </div>
                )}
              </div>

              {/* Products Summary - Fixed to show product names */}
              {formData.products && formData.products.length > 0 && (
                <div className="mt-4">
                  <h5 className="font-medium text-gray-600 mb-2">
                    Export Products:
                  </h5>
                  <div className="space-y-2">
                    {formData.products.map((product, index) => (
                      <div key={index} className="text-sm bg-gray-50 p-2 rounded">
                        <div>
                          <strong>Product Name:</strong> {getProductName(product.productId)}
                        </div>
                        <div>
                          <strong>Value:</strong> {product.value ? `Rs. ${product.value.toLocaleString()}` : "-"}
                        </div>
                        {product.isRaw !== undefined && (
                          <div>
                            <strong>Type:</strong>{" "}
                            {product.isRaw && "Raw"} {product.isProcessed && "Value Added"}
                            {!product.isRaw && !product.isProcessed && "-"}
                          </div>
                        )}
                        {product.details && (
                          <div>
                            <strong>Details:</strong> {product.details}
                          </div>
                        )}
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
    //Add validation based on the current step
    if (current === 0) {
      // // Validate required export form fields
      // if (!formData.businessName) {
      //   message.warning("Please enter business name");
      //   return;
      // }
      // if (!formData.businessExperienceId) {
      //   message.warning("Please select years of experience");
      //   return;
      // }
      // if (!formData.numberOfEmployeeId) {
      //   message.warning("Please select number of employees");
      //   return;
      // }
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
        certificateId: Array.isArray(formData.certifications)
          ? formData.certifications.map(cert => parseInt(cert))
          : formData.certifications ? [parseInt(formData.certifications)] : [],
        userId: formData.userId || null,
        products: formData.products || [],
        startDate: formData.startDate || null,
      };

      console.log(formData);

      const response = await axiosInstance.post(
        "/api/exporter/",
        submissionData
      );
      message.success("Exporter registration submitted successfully!");
      setInterval(() => {
        navigate("/select" );
        window.location.reload();
      },2000);
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
            <span className="text-lg font-normal text-gray-600 ml-2">
              (Startup)
            </span>
          )}
          {registrationType === "have-business" && (
            <span className="text-lg font-normal text-gray-600 ml-2">
              (Existing Business)
            </span>
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

export default ExporterPage;