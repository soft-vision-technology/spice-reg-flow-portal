// store/slices/entrepreneurSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// Async thunk to submit entrepreneur form
export const submitEntrepreneurForm = createAsyncThunk(
  "entrepreneur/submitForm",
  async (formData, { rejectWithValue }) => {
    try {
      const dataToSend = new FormData();

      for (const key in formData) {
        if (Array.isArray(formData[key])) {
          // Handle arrays (like spiceProducts or certifications)
          formData[key].forEach((item) => dataToSend.append(`${key}[]`, item));
        } else if (formData[key] instanceof File) {
          dataToSend.append(key, formData[key]);
        } else {
          dataToSend.append(key, formData[key]);
        }
      }

      const response = await axiosInstance.post("/api/entrepreneur", dataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Submission failed.");
    }
  }
);

const entrepreneurSlice = createSlice({
  name: "entrepreneur",
  initialState: {
    loading: false,
    error: null,
    success: false,
    data: null,
  },
  reducers: {
    resetEntrepreneurFormState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitEntrepreneurForm.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(submitEntrepreneurForm.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.data = action.payload;
      })
      .addCase(submitEntrepreneurForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to submit form.";
      });
  },
});

export const { resetEntrepreneurFormState } = entrepreneurSlice.actions;

export default entrepreneurSlice.reducer;
