import React from "react";
import { Card, Radio, Space, Button } from "antd";
import { UserOutlined, GlobalOutlined, ShopOutlined, RocketOutlined, BuildOutlined } from "@ant-design/icons";
import { useFormContext } from "../../contexts/FormContext";

const RoleSelectionCard = ({ onContinue,setRoleId }) => {
  const { registrationType, setRegistrationType, role, setRole } = useFormContext();

  const handleRegistrationTypeChange = (e) => {
    const newType = e.target.value;
    setRegistrationType(newType);
    
    
    // Reset role when registration type changes
    setRole("");
    
    // If "Like to start" is selected, automatically set role to "exporter"
    if (newType === "like-to-start") {
      setRole("exporter");
      setRoleId(3)
    }
  };

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setRole(newRole);

    // Set roleId based on selected role
    switch (newRole) {
      case "exporter":
        setRoleId(3);
        break;
      case "intermediary":
        setRoleId(2);
        break;
      case "entrepreneur":
        setRoleId(1);
        break;
      default:
        setRoleId(2)
    }

  };

  const isRegistrationTypeSelected = registrationType !== "";
  const isRoleSelected = role !== "";
  
  const canContinue = isRegistrationTypeSelected && 
    (registrationType === "like-to-start" || 
     (registrationType === "have-business" && isRoleSelected));

  return (
    <Card className="shadow-md rounded-lg border-0 max-w-lg mx-auto">
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-medium text-earth-700 mb-4">
            What's your current situation?
          </h3>
          <Radio.Group 
            onChange={handleRegistrationTypeChange} 
            value={registrationType} 
            className="w-full"
          >
            <Space direction="vertical" className="w-full">
              <Radio value="like-to-start" className="p-3 border rounded-md w-full">
                <div className="flex items-center">
                  <RocketOutlined className="text-spice-500 mr-3 text-xl" />
                  <div>
                    <div className="font-medium">Like to Start</div>
                    <div className="text-sm text-gray-500">
                      Planning to enter the spice industry
                    </div>
                  </div>
                </div>
              </Radio>
              <Radio value="have-business" className="p-3 border rounded-md w-full">
                <div className="flex items-center">
                  <BuildOutlined className="text-spice-500 mr-3 text-xl" />
                  <div>
                    <div className="font-medium">Have a Business</div>
                    <div className="text-sm text-gray-500">
                      Already operating in the spice industry
                    </div>
                  </div>
                </div>
              </Radio>
            </Space>
          </Radio.Group>
        </div>

        {registrationType === "have-business" && (
          <div>
            <h3 className="text-lg font-medium text-earth-700 mb-4">
              What type of business do you have?
            </h3>
            <Radio.Group onChange={handleRoleChange} value={role} className="w-full">
              <Space direction="vertical" className="w-full">
                <Radio value="entrepreneur" className="p-3 border rounded-md w-full">
                  <div className="flex items-center">
                    <UserOutlined className="text-spice-500 mr-3 text-xl" />
                    <div>
                      <div className="font-medium">Entrepreneur</div>
                      <div className="text-sm text-gray-500">
                        Running or starting a spice business
                      </div>
                    </div>
                  </div>
                </Radio>
                <Radio value="exporter" className="p-3 border rounded-md w-full">
                  <div className="flex items-center">
                    <GlobalOutlined className="text-spice-500 mr-3 text-xl" />
                    <div>
                      <div className="font-medium">Exporter</div>
                      <div className="text-sm text-gray-500">
                        Exporting spices internationally
                      </div>
                    </div>
                  </div>
                </Radio>
                <Radio value="intermediary" className="p-3 border rounded-md w-full">
                  <div className="flex items-center">
                    <ShopOutlined className="text-spice-500 mr-3 text-xl" />
                    <div>
                      <div className="font-medium">Intermediary Trader</div>
                      <div className="text-sm text-gray-500">
                        Trading between producers and buyers
                      </div>
                    </div>
                  </div>
                </Radio>
              </Space>
            </Radio.Group>
          </div>
        )}

        {registrationType && role && (
          <div className="p-4 bg-green-50 rounded-md border border-green-200">
            <div className="flex items-center">
              <div className="text-green-600 mr-3">✓</div>
              <div>
                <div className="font-medium text-green-800">
                  Registration: {registrationType === "like-to-start" ? "Like to Start" : "Have a Business"}
                </div>
                <div className="text-sm text-green-700">
                  Role: {role === "entrepreneur" ? "Entrepreneur" : 
                         role === "exporter" ? "Exporter" : "Intermediary Trader"}
                </div>
              </div>
            </div>
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

        {/* Add DebugInfo component before the end of the card */}
        {/* <DebugInfo /> */}
      </div>
    </Card>
  );
};

export default RoleSelectionCard;