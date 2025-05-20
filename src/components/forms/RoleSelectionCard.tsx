
import React from "react";
import { Card, Radio, Space, Button } from "antd";
import { UserOutlined, GlobalOutlined, ShopOutlined } from "@ant-design/icons";
import { useFormContext, UserRole, BusinessStatus } from "../../contexts/FormContext";

interface RoleSelectionCardProps {
  onContinue?: () => void;
}

const RoleSelectionCard: React.FC<RoleSelectionCardProps> = ({ onContinue }) => {
  const { role, setRole, status, setStatus } = useFormContext();

  const handleRoleChange = (e: any) => {
    setRole(e.target.value);
  };

  const handleStatusChange = (e: any) => {
    setStatus(e.target.value);
  };

  const isIndustrySelected = role !== "";
  const isStatusSelected = status !== "";
  const canContinue = isIndustrySelected && isStatusSelected;

  return (
    <Card className="shadow-md rounded-lg border-0 max-w-lg mx-auto">
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-medium text-earth-700 mb-4">Are you in the spice industry?</h3>
          <Radio.Group
            onChange={handleRoleChange}
            value={role}
            className="w-full"
          >
            <Space direction="vertical" className="w-full">
              <Radio value="entrepreneur" className="p-3 border rounded-md w-full">
                <div className="flex items-center">
                  <UserOutlined className="text-spice-500 mr-3 text-xl" />
                  <div>
                    <div className="font-medium">Entrepreneur</div>
                    <div className="text-sm text-gray-500">Running or starting a spice business</div>
                  </div>
                </div>
              </Radio>
              <Radio value="exporter" className="p-3 border rounded-md w-full">
                <div className="flex items-center">
                  <GlobalOutlined className="text-spice-500 mr-3 text-xl" />
                  <div>
                    <div className="font-medium">Exporter</div>
                    <div className="text-sm text-gray-500">Exporting spices internationally</div>
                  </div>
                </div>
              </Radio>
              <Radio value="intermediary" className="p-3 border rounded-md w-full">
                <div className="flex items-center">
                  <ShopOutlined className="text-spice-500 mr-3 text-xl" />
                  <div>
                    <div className="font-medium">Intermediary Trader</div>
                    <div className="text-sm text-gray-500">Trading between producers and buyers</div>
                  </div>
                </div>
              </Radio>
            </Space>
          </Radio.Group>
        </div>

        {isIndustrySelected && (
          <div>
            <h3 className="text-lg font-medium text-earth-700 mb-4">What is your current status?</h3>
            <Radio.Group
              onChange={handleStatusChange}
              value={status}
              className="w-full"
            >
              <Space direction="vertical" className="w-full">
                <Radio value="starting" className="p-3 border rounded-md w-full">
                  <div>
                    <div className="font-medium">Starting</div>
                    <div className="text-sm text-gray-500">Planning to enter the spice industry</div>
                  </div>
                </Radio>
                <Radio value="existing" className="p-3 border rounded-md w-full">
                  <div>
                    <div className="font-medium">Existing</div>
                    <div className="text-sm text-gray-500">Already operating in the spice industry</div>
                  </div>
                </Radio>
              </Space>
            </Radio.Group>
          </div>
        )}

        {onContinue && (
          <Button 
            type="primary" 
            size="large" 
            disabled={!canContinue}
            onClick={onContinue}
            className="w-full bg-spice-500 hover:bg-spice-600"
          >
            Continue
          </Button>
        )}
      </div>
    </Card>
  );
};

export default RoleSelectionCard;
