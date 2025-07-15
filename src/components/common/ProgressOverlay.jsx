import React from "react";
import { Button, Spin, Typography } from "antd";
import { ArrowBigLeftDash } from "lucide-react";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

const ProgressOverlay = ({ message = "Loading..." }) => {
  const navigate = useNavigate();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-40 backdrop-blur-sm pointer-events-auto">
      <div className="flex flex-col items-center">
        <Spin size="large" />
        <Text className="mt-4 text-lg font-semibold text-gray-700">
          {message}
        </Text>
        <Button 
          className="flex mt-4 justify-center" 
          icon={<ArrowBigLeftDash />}
          type="primary"
          onClick={() => navigate('/select')}
        >
          Head Back
        </Button>
      </div>
    </div>
  );
};

export default ProgressOverlay;
