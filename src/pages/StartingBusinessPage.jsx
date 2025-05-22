import React, { useEffect } from "react";
import { Steps, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import BasicInfoForm from "../components/forms/BasicInfoForm";
import EntrepreneurForm from "../components/forms/EntrepreneurForm";
import { useFormContext } from "../contexts/FormContext";

const { Step } = Steps;

const StartingBusinessPage = () => {
  const navigate = useNavigate();
  const { registrationType, role, formData } = useFormContext();
  const [current, setCurrent] = React.useState(0);

  // Redirect if no role or status is selected
  useEffect(() => {
    if (role === "" || status === "") {
      navigate("/select");
      message.warning("Please select your role and status first");
    }
  }, [role, status, navigate]);

  const steps = [
    {
      title: "Personal Information",
      content: <BasicInfoForm />,
    },
    {
      title: "Business Plan",
      content: <EntrepreneurForm isExisting={false} />,
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
        <h1 className="text-2xl font-bold text-earth-700">New Business Registration</h1>
        <p className="text-gray-500">Complete the following steps to register your new business</p>
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
            Submit
          </Button>
        )}
      </div>
    </div>
  );
};

export default StartingBusinessPage;
