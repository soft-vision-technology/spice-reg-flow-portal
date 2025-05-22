import React from "react";
import { Button, message, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import BasicInfoForm from "../components/forms/BasicInfoForm";
import RoleSelectionCard from "../components/forms/RoleSelectionCard";
import { useFormContext } from "../contexts/FormContext";

const SelectPage = () => {
  const navigate = useNavigate();
  const { registrationType, role, formData } = useFormContext();

  const handleContinue = () => {
    // Check if basic info is filled
    const hasBasicInfo = formData.fullName && formData.email && formData.mobileNumber && formData.nic;
    
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

    // Navigate based on registration type and role combination
    if (registrationType === "like-to-start") {
      navigate("/like-to-start");
    } else if (registrationType === "have-business") {
      if (role === "entrepreneur") {
        navigate("/have-business");
      } else if (role === "exporter") {
        navigate("/export-form");
      } else if (role === "intermediary") {
        navigate("/intermediary-form");
      }
    }
  };

  // Check if all required fields are completed
  const hasBasicInfo = formData.fullName && formData.email && formData.mobileNumber && formData.nic;
  const hasRegistrationInfo = registrationType !== "" && role !== "";
  const canContinue = hasBasicInfo && hasRegistrationInfo;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-earth-700 text-center mb-2">
          Complete Your Registration
        </h1>
        <p className="text-gray-600 text-center">
          Please provide your information and select your registration preferences
        </p>
      </div>

      <Row gutter={32} className="mb-8">
        {/* Left Side - Registration Type & Role Selection */}
        <Col xs={24} lg={12}>
          <div className="h-full">
            <RoleSelectionCard />
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
          className="bg-spice-500 hover:bg-spice-600 px-12 py-2 h-12 text-lg"
        >
          Continue to Next Step
        </Button>
      </div>

      {/* Progress indicator */}
      <div className="mt-8 text-center">
        <div className="flex justify-center items-center space-x-4 text-sm text-gray-500">
        <div className={`flex items-center ${hasRegistrationInfo ? 'text-green-600' : 'text-gray-400'}`}>
            <span className={`w-4 h-4 rounded-full mr-2 ${hasRegistrationInfo ? 'bg-green-500' : 'bg-gray-300'}`}></span>
            Registration Type
          </div>
          <div className={`flex items-center ${hasBasicInfo ? 'text-green-600' : 'text-gray-400'}`}>
            <span className={`w-4 h-4 rounded-full mr-2 ${hasBasicInfo ? 'bg-green-500' : 'bg-gray-300'}`}></span>
            Basic Information
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectPage;