import React, { createContext, useContext, useState } from "react";

const FormContext = createContext(undefined);

export const FormProvider = ({ children }) => {
  const [registrationType, setRegistrationType] = useState(""); // "like-to-start" or "have-business"
  const [role, setRole] = useState("");
  const [status, setStatus] = useState(""); // Keep this for backward compatibility if needed
  const [formData, setFormData] = useState({});

  const updateFormData = (newData) => {
    setFormData((prevData) => ({
      ...prevData,
      ...newData,
    }));
  };

  const resetForm = () => {
    setRegistrationType("");
    setRole("");
    setStatus("");
    setFormData({});
  };

  return (
    <FormContext.Provider 
      value={{ 
        registrationType, 
        setRegistrationType,
        role, 
        setRole, 
        status, 
        setStatus, 
        formData, 
        updateFormData, 
        resetForm 
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
};