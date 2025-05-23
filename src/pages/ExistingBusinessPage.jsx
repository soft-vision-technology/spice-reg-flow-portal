import React, { useEffect, useState } from "react";
import { Steps, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import EntrepreneurForm from "../components/forms/EntrepreneurForm";
import { useFormContext } from "../contexts/FormContext";

const { Step } = Steps;

const ExistingBusinessPage = () => {
  const navigate = useNavigate();
  const { registrationType, role, formData } = useFormContext();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!registrationType || !role || role !=="entrepreneur") {
      navigate("/select");
      message.warning("Please complete the registration selection first");
      return;
    }

    const hasBasicInfo = formData.fullName && formData.email && formData.mobileNumber && formData.nic;
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
  ];

  const next = () => {
    if (current === 0 && (!formData.fullName || !formData.nic)) {
      message.warning("Please fill out the required fields");
      return;
    }
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const handleSubmit = () => {
    // TODO: API call to submit the data
    message.success("Registration submitted successfully!");
    navigate("/reports");
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-earth-700">Existing Business Registration</h1>
        <p className="text-gray-500">Complete the following steps to register your existing business</p>
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
          {/* <Button type="primary" onClick={next} className="bg-spice-500">
            Next
          </Button> */}
        )}

        {/* {current === steps.length - 1 && (
          <Button type="primary" onClick={handleSubmit} className="bg-spice-500">
            Submit
          </Button>
        )} */}
      </div>
    </div>
  );
};

export default ExistingBusinessPage;
