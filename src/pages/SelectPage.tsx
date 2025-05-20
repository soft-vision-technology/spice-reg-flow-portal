
import React from "react";
import { Steps, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import RoleSelectionCard from "../components/forms/RoleSelectionCard";
import { useFormContext } from "../contexts/FormContext";

const { Step } = Steps;

const SelectPage: React.FC = () => {
  const navigate = useNavigate();
  const { role, status } = useFormContext();
  const [current, setCurrent] = React.useState(0);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const handleContinue = () => {
    if (status === "starting") {
      navigate("/like-to-start");
    } else if (status === "existing") {
      if (role === "entrepreneur") {
        navigate("/have-business");
      } else if (role === "exporter") {
        navigate("/export-form");
      } else if (role === "intermediary") {
        navigate("/intermediary-form");
      }
    } else {
      message.error("Please select your role and status to continue.");
    }
  };

  const steps = [
    {
      title: "Role Selection",
      content: <RoleSelectionCard onContinue={handleContinue} />,
    },
    {
      title: "Basic Information",
      content: (
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-spice-500 mb-6">Ready to start the registration!</h2>
          <p className="text-gray-500 mb-8">
            We'll collect some basic information about you and your business in the next steps.
          </p>
          <Button type="primary" size="large" onClick={handleContinue} className="bg-spice-500">
            Continue to Registration
          </Button>
        </div>
      ),
    }
  ];

  // Determine if we should enable the next step
  const canProceedToSecondStep = role !== "" && status !== "";

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-12">
        <Steps current={current} className="mb-12">
          {steps.map((item) => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>

        <div className="p-4">{steps[current].content}</div>

        {current > 0 && (
          <div className="flex justify-center mt-8">
            <Button className="mr-2" onClick={prev}>
              Previous
            </Button>
          </div>
        )}

        {current === 0 && canProceedToSecondStep && (
          <div className="flex justify-center mt-8">
            <Button type="primary" onClick={next} className="bg-spice-500">
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectPage;
