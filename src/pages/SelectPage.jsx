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
    // Check if basic info is filled
    const hasBasicInfo =
      formData.fullName &&
      formData.email &&
      formData.mobileNumber &&
      formData.nic;

    if (!hasBasicInfo) {
      message.error("Please complete all required basic information fields.");
      return;
    }

    if (!registrationType) {
      message.error("Please select your current situation.");
      return;
    }

    if (!role) {
      message.error("Please select how you'd like to be registered.");
      return;
    }

    try {
      // Prepare the data to send to API
      const basicInfoData = {
        title: formData.title,
        initials: formData.initials,
        name: formData.fullName,
        nic: formData.nic,
        address: formData.address,
        email: formData.email,
        contactNumber: formData.mobileNumber,
        provinceId: formData.province,
        districtId: formData.district,
        dsDivision: formData.dsDivision,
        gnDivision: formData.gnDivision,
        // You might also want to include registration type and role
        businessStatus:
          registrationType === "have-business" ? "EXISTING" : "STARTING",
        roleId: roleId,
      };

      console.log(basicInfoData);

      // Dispatch the saveBasicInfo action
      const result = await dispatch(saveBasicInfo(basicInfoData)).unwrap();

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
      }
    } catch (error) {
      // Handle API errors
      console.error("Error saving basic info:", error);
      message.error(
        error?.message || "Failed to save basic information. Please try again."
      );
    }
  };

  // Check if all required fields are completed
  const hasBasicInfo =
    formData.fullName &&
    formData.email &&
    formData.mobileNumber &&
    formData.nic;
  const hasRegistrationInfo = registrationType !== "" && role !== "";
  const canContinue = hasBasicInfo && hasRegistrationInfo;

  return (
    <div className="w-full max-w-7xl mx-auto py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
      {/* Import Data Button - Centered with responsive sizing */}
      <div className="flex justify-center mb-4 sm:mb-6">
        <Tooltip title="Working Progress">
          <Button
            type="default"
            size="large"
            icon={<ImportOutlined />}
            onClick={handleImportData}
            disabled
            className="bg-blue-50 hover:bg-blue-100 border-blue-300 text-blue-600 px-4 sm:px-6 lg:px-8 py-2 h-10 sm:h-12 text-sm sm:text-base w-full sm:w-auto max-w-xs sm:max-w-none cursor-not-allowed"
          >
            <span className="hidden sm:inline">Import Data from Excel</span>
            <span className="sm:hidden">Import Excel</span>
          </Button>
        </Tooltip>
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
        <Button
          type="primary"
          size="large"
          onClick={handleContinue}
          disabled={!canContinue}
          loading={loading}
          className="bg-spice-500 hover:bg-spice-600 px-6 sm:px-8 lg:px-12 py-2 h-12 sm:h-14 text-base sm:text-lg w-full sm:w-auto max-w-sm sm:max-w-none"
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
      </div>

      {/* Progress indicator - Responsive layout */}
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
            <span className="text-xs sm:text-sm">Registration Type</span>
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
            <span className="text-xs sm:text-sm">Basic Information</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectPage;
