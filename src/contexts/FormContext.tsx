
import React, { createContext, useContext, useState } from "react";

// Define form types and data structures
export type UserRole = "entrepreneur" | "exporter" | "intermediary" | "";
export type BusinessStatus = "starting" | "existing" | "";

interface FormContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  status: BusinessStatus;
  setStatus: (status: BusinessStatus) => void;
  formData: Record<string, any>;
  updateFormData: (newData: Record<string, any>) => void;
  resetForm: () => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>("");
  const [status, setStatus] = useState<BusinessStatus>("");
  const [formData, setFormData] = useState<Record<string, any>>({});

  const updateFormData = (newData: Record<string, any>) => {
    setFormData(prevData => ({
      ...prevData,
      ...newData
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
