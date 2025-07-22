import React, { useState } from "react";
import { Button, message, Row, Col, Tooltip } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import BasicInfoForm from "../components/forms/basicInfo/BasicInfoForm";
import RoleSelectionCard from "../components/common/RoleSelectionCard";
import { useFormContext } from "../contexts/FormContext";
import { saveBasicInfo } from "../store/slices/basicInfoSlice";
import { ImportOutlined } from "@ant-design/icons";

const SelectPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { registrationType, role, formData } = useFormContext();
  const { loading, error } = useSelector((state) => state.basicInfo);
  const [roleId, setRoleId] = useState(3);

  const handleImportData = () => {
    navigate("/import-data");
  };

  const handleContinue = async () => {
    // Enhanced debugging - log the raw formData first
    console.log("=== FORM DATA DEBUG ===");
    console.log("Raw formData:", formData);
    console.log("registrationType:", registrationType);
    console.log("role:", role);
    console.log("roleId:", roleId);

    // Enhanced validation - check all required fields
    const requiredFields = {
      fullName: formData.fullName,
      mobileNumber: formData.mobileNumber,
      nic: formData.nic,
      title: formData.title,
      address: formData.address,
    };

    // Check for missing required fields
    const missingFields = Object.keys(requiredFields).filter(
      (field) => !requiredFields[field]
    );

    if (missingFields.length > 0) {
      console.error("Missing required fields:", missingFields);
      message.error(
        `Please complete the following required fields: ${missingFields.join(", ")}`
      );
      return;
    }

    // Check serial number - combine all parts if they exist
    const serialNumber = formData.serialNumber || '';
    const prefix = formData.prefix || '';
    const suffix = formData.suffix || '';
    
    if (!serialNumber && (!prefix || !suffix)) {
      message.error("Please complete the serial number information.");
      return;
    }

    // Combine serial number parts
    const completeSerialNumber = prefix && suffix && serialNumber 
      ? `${prefix}/${suffix}/${serialNumber}`
      : serialNumber;

    console.log("Serial number parts:", { prefix, suffix, serialNumber, completeSerialNumber });

    if (!registrationType) {
      message.error("Please select your current situation.");
      return;
    }

    if (!role) {
      message.error("Please select how you'd like to be registered.");
      return;
    }

    try {
      // Prepare the data to send to API with enhanced structure
      const basicInfoData = {
        title: formData.title,
        initials: formData.initials || '',
        name: formData.fullName,
        nic: formData.nic,
        address: formData.address,
        email: formData.email,
        contactNumber: formData.mobileNumber,
        provinceId: formData.province || null,
        districtId: formData.district || null,
        dsDivision: formData.dsDivision || '',
        gnDivision: formData.gnDivision || '',
        businessStatus: registrationType === "have-business" ? "EXISTING" : "STARTING",
        roleId: roleId,
        isActive: false,
        isApproved: false,
        serialNumber: completeSerialNumber,
      };

      console.log("=== API DATA DEBUG ===");
      console.log("Data being sent to API:", basicInfoData);

      // Check for undefined/null values and warn
      Object.keys(basicInfoData).forEach(key => {
        if (basicInfoData[key] === undefined) {
          console.warn(`Warning: ${key} is undefined`);
        }
        if (basicInfoData[key] === null) {
          console.info(`Info: ${key} is null (might be intentional)`);
        }
      });

      // Dispatch the saveBasicInfo action
      console.log("Dispatching saveBasicInfo...");
      const result = await dispatch(saveBasicInfo(basicInfoData)).unwrap();
      
      console.log("API Response:", result);

      // Show success message
      message.success("Basic information saved successfully!");

      // Navigate based on registration type and role combination
      if (registrationType === "like-to-start") {
        navigate("/like-to-start", { state: { result } });
      } else if (registrationType === "have-business") {
        if (role === "entrepreneur") {
          navigate("/have-business", { state: { result } });
        } else if (role === "exporter") {
          navigate("/export-form", { state: { result } });
        } else if (role === "intermediary") {
          navigate("/intermediary-form", { state: { result } });
        } else {
          message.error("Unsupported role selected. Please contact admin.");
        }
      } else {
        message.error("Invalid registration type. Please contact admin.");
      }
    } catch (error) {
      // Enhanced error handling
      console.error("=== ERROR DEBUG ===");
      console.error("Full error object:", error);
      console.error("Error message:", error?.message);
      console.error("Error response:", error?.response);
      console.error("Error data:", error?.response?.data);
      
      // Show user-friendly error message
      let errorMessage = "Failed to save basic information. Please try again.";
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      message.error(errorMessage);
    }
  };

  // Enhanced validation check for continue button
  const hasBasicInfo = formData.fullName &&
                      formData.mobileNumber &&
                      formData.nic &&
                      formData.title &&
                      formData.address &&
                      (formData.serialNumber || (formData.prefix && formData.suffix));

  const hasRegistrationInfo = registrationType && role;
  const canContinue = hasBasicInfo && hasRegistrationInfo;

  // Debug logging for button state
  console.log("Button state debug:", {
    hasBasicInfo,
    hasRegistrationInfo,
    canContinue,
    loading
  });

  return (
    <div className="w-full max-w-7xl mx-auto py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
      {/* Import Data Button - Centered with responsive sizing */}
      <div className="flex justify-center mb-4 sm:mb-6">
          <Button
            type="default"
            size="large"
            icon={<ImportOutlined />}
            onClick={handleImportData}
            className="bg-blue-50 hover:bg-blue-100 border-blue-300 text-blue-600 px-4 sm:px-6 lg:px-8 py-2 h-10 sm:h-12 text-sm sm:text-base w-full sm:w-auto max-w-xs sm:max-w-none"
          >
            <span className="hidden sm:inline">Import Data from Excel</span>
            <span className="sm:hidden">Import Excel</span>
          </Button>
      </div>

      {/* Main Content Row - Responsive layout */}
      <Row gutter={[16, 24]} className="mb-6 sm:mb-8">
        {/* Role Selection Card - Full width on mobile, half on desktop */}
        <Col xs={24} lg={12} className="mb-6 lg:mb-0">
          <div className="h-full">
            <RoleSelectionCard setRoleId={setRoleId} />
          </div>
        </Col>

        {/* Basic Information Form - Full width on mobile, half on desktop */}
        <Col xs={24} lg={12}>
          <div className="h-full">
            <BasicInfoForm />
          </div>
        </Col>
      </Row>

      {/* Continue Button - Responsive sizing and positioning */}
      <div className="flex justify-center px-4 sm:px-0">
        <Tooltip 
          title={
            !canContinue 
              ? "Please complete all required information before continuing"
              : ""
          }
        >
          <Button
            type="primary"
            size="large"
            onClick={handleContinue}
            disabled={!canContinue}
            loading={loading}
            className="bg-spice-500 hover:bg-spice-600 disabled:bg-gray-300 disabled:cursor-not-allowed px-6 sm:px-8 lg:px-12 py-2 h-12 sm:h-14 text-base sm:text-lg w-full sm:w-auto max-w-sm sm:max-w-none"
          >
            {loading ? (
              "Saving..."
            ) : (
              <>
                <span className="hidden sm:inline">Continue to Next Step</span>
                <span className="sm:hidden">Continue</span>
              </>
            )}
          </Button>
        </Tooltip>
      </div>

      {/* Enhanced Progress indicator - Responsive layout */}
      <div className="mt-6 sm:mt-8 text-center px-4 sm:px-0">
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-6 text-sm text-gray-500">
          <div
            className={`flex items-center ${
              hasRegistrationInfo ? "text-green-600" : "text-gray-400"
            }`}
          >
            <span
              className={`w-4 h-4 rounded-full mr-2 ${
                hasRegistrationInfo ? "bg-green-500" : "bg-gray-300"
              }`}
            ></span>
            <span className="text-xs sm:text-sm">
              Registration Type {hasRegistrationInfo ? "✓" : ""}
            </span>
          </div>
          <div
            className={`flex items-center ${
              hasBasicInfo ? "text-green-600" : "text-gray-400"
            }`}
          >
            <span
              className={`w-4 h-4 rounded-full mr-2 ${
                hasBasicInfo ? "bg-green-500" : "bg-gray-300"
              }`}
            ></span>
            <span className="text-xs sm:text-sm">
              Basic Information {hasBasicInfo ? "✓" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Debug information (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-4 bg-gray-100 rounded text-xs">
          <details>
            <summary>Debug Info (Development Only)</summary>
            <pre>{JSON.stringify({ formData, registrationType, role, hasBasicInfo, hasRegistrationInfo }, null, 2)}</pre>
          </details>
        </div>
      )}
    </div>
  );
};

export default SelectPage;