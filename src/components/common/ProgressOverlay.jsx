import React, { useEffect, useState } from "react"; 
import { Button, Spin, Typography, Progress } from "antd"; 
import { ArrowBigLeftDash } from "lucide-react"; 
import { useNavigate } from "react-router-dom"; 
 
const { Text } = Typography; 
 
const ProgressOverlay = ({ 
  message = "Please wait while we process your request...", 
  durationHours = 0.01,        // total time for progress to complete 
  startTime = Date.now()    // time the process started 
}) => { 
  const navigate = useNavigate(); 
  const [percent, setPercent] = useState(0); 
  const [politeMessage, setPoliteMessage] = useState(message);
 
  useEffect(() => { 
    const durationMs = durationHours * 60 * 60 * 1000; 
 
    const updateProgress = () => { 
      const elapsed = Date.now() - startTime; 
      const newPercent = Math.min((elapsed / durationMs) * 100, 100); 
      setPercent(newPercent);
      
      // Update message based on progress for politeness
      if (newPercent >= 100) {
        setPoliteMessage("Almost done! Thank you for your patience.");
      } else if (newPercent >= 75) {
        setPoliteMessage("We're nearly finished, just a moment more...");
      } else if (newPercent >= 50) {
        setPoliteMessage("Thank you for waiting, we're halfway there!");
      } else if (newPercent >= 25) {
        setPoliteMessage("Processing your request, please bear with us...");
      } else {
        setPoliteMessage(message || "Please wait while we process your request...");
      }
    }; 
 
    updateProgress(); // initialize immediately 
    const interval = setInterval(updateProgress, 1000); // update every second 
 
    return () => clearInterval(interval); // clean up on unmount 
  }, [startTime, durationHours, message]); 
 
  return ( 
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-40 backdrop-blur-sm pointer-events-auto"> 
      <div className="flex flex-col items-center w-80 p-6 bg-white rounded-lg shadow-lg border"> 
        <Spin size="large" /> 
        <Text className="mt-4 text-lg font-semibold text-gray-700 text-center"> 
          {politeMessage} 
        </Text> 
 
        <Progress  
          className="mt-6 w-full"  
          percent={Math.round(percent)}  
          status={percent < 100 ? "active" : "success"}  
          showInfo  
        /> 
        
        <Text className="mt-2 text-sm text-gray-500 text-center">
          {percent < 100 
            ? "We appreciate your patience while we work on this for you."
            : "Thank you for waiting! Process completed successfully."
          }
        </Text>
 
        <Button  
          className="flex mt-6 justify-center items-center gap-2"  
          icon={<ArrowBigLeftDash />}  
          type="primary"  
          onClick={() => navigate("/select")}
          size="large"
        > 
          Go Back to Selection 
        </Button> 
      </div> 
    </div> 
  ); 
}; 
 
export default ProgressOverlay;