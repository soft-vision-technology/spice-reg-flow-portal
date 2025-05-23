import React, { useState } from "react";
import { Button, message, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import BasicInfoForm from "../components/forms/BasicInfoForm";
import RoleSelectionCard from "../components/forms/RoleSelectionCard";
import { useFormContext } from "../contexts/FormContext";
import { saveBasicInfo } from "../store/slices/basicInfoSlice";

const SelectPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { registrationType, role, formData } = useFormContext();
  const { loading, error } = useSelector((state) => state.basicInfo);
const [roleId,setRoleId]=useState(3)

// console.log(roleId)

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

      // Dispatch the saveBasicInfo action
      const result = await dispatch(saveBasicInfo(basicInfoData)).unwrap();
      console.log(result)

      // Show success message
      message.success("Basic information saved successfully!");

      // Navigate based on registration type and role combination
      if (registrationType === "like-to-start") {
        navigate("/like-to-start", { userId: { result } });
      } else if (registrationType === "have-business") {
        if (role === "entrepreneur") {
          navigate("/have-business", { state: { result } });
        } else if (role === "exporter") {
          navigate("/export-form");
        } else if (role === "intermediary") {
          navigate("/intermediary-form");
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
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-earth-700 text-center mb-2">
          Complete Your Registration
        </h1>
        <p className="text-gray-600 text-center">
          Please provide your information and select your registration
          preferences
        </p>
      </div>

      <Row gutter={32} className="mb-8">
        {/* Left Side - Registration Type & Role Selection */}
        <Col xs={24} lg={12}>
          <div className="h-full">
            <RoleSelectionCard setRoleId={setRoleId} />
          </div>
        </Col>

        {/* Right Side - Basic Information Form */}
        <Col xs={24} lg={12}>
          <div className="h-full">
            <BasicInfoForm />
          </div>
        </Col>
      </Row>

      {/* Continue Button */}
      <div className="flex justify-center">
        <Button
          type="primary"
          size="large"
          onClick={handleContinue}
          disabled={!canContinue}
          loading={loading}
          className="bg-spice-500 hover:bg-spice-600 px-12 py-2 h-12 text-lg"
        >
          {loading ? "Saving..." : "Continue to Next Step"}
        </Button>
      </div>

      {/* Progress indicator */}
      <div className="mt-8 text-center">
        <div className="flex justify-center items-center space-x-4 text-sm text-gray-500">
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
            Registration Type
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
            Basic Information
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectPage;
