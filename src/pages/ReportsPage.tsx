
import React from "react";
import { Result, Button } from "antd";
import { Link } from "react-router-dom";
import FormSummary from "../components/common/FormSummary";
import { useFormContext } from "../contexts/FormContext";

const ReportsPage: React.FC = () => {
  const { formData } = useFormContext();
  
  // Check if there's form data to display
  const hasFormData = Object.keys(formData).length > 0;
  
  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      {hasFormData ? (
        <>
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-earth-700">Registration Summary</h1>
            <p className="text-gray-500">Review your submitted information</p>
          </div>
          
          <FormSummary />
          
          <div className="mt-8 text-center">
            <Link to="/">
              <Button type="primary" size="large" className="bg-spice-500">
                Return to Home
              </Button>
            </Link>
          </div>
        </>
      ) : (
        <Result
          status="info"
          title="No Registration Data Available"
          subTitle="You haven't completed any registration forms yet."
          extra={
            <Link to="/select">
              <Button type="primary" className="bg-spice-500">
                Start Registration
              </Button>
            </Link>
          }
        />
      )}
    </div>
  );
};

export default ReportsPage;
