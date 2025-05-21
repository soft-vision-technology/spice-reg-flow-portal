import React, { createContext, useContext, useState } from "react";

const FormContext = createContext(undefined);

export const FormProvider = ({ children }) => {
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [formData, setFormData] = useState({});

  const updateFormData = (newData) => {
    setFormData((prevData) => ({
      ...prevData,
      ...newData,
    }));
  };

  const resetForm = () => {
    setRole("");
    setStatus("");
    setFormData({});
  };

  return (
    <FormContext.Provider value={{ role, setRole, status, setStatus, formData, updateFormData, resetForm }}>
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
