import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// Thunks
export const fetchExperienceOptions = createAsyncThunk(
  "utils/fetchExperienceOptions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/experience");
        if (response.status !== 200) {
            throw new Error("Failed to fetch experience options.");
        }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch experience options.");
    }
  }
);

export const fetchCertificateOptions = createAsyncThunk(
  "utils/fetchCertificateOptions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/certificates");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch certificate options.");
    }
  }
);

export const fetchNumEmployeeOptions = createAsyncThunk(
  "utils/fetchNumEmployeeOptions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/number_of_employees");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch number of employee options.");
    }
  }
);

export const fetchProductOptions = createAsyncThunk(
  "utils/fetchProductOptions", 
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/products");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch product options.");
    }
  }
);

export const fetchProvince = createAsyncThunk(
  "utils/fetchProvince", 
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/province");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch province options.");
    }
  }
);

// Slice
const utilsSlice = createSlice({
  name: "utils",
  initialState: {
    experienceOptions: [],
    certificateOptions: [],
    numEmployeeOptions: [],
    productOptions: [],
    provinceOptions: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetUtilsState: (state) => {
      state.experienceOptions = [];
      state.certificateOptions = [];
      state.numEmployeeOptions = [];
      state.productOptions = [];
      state.provinceOptions = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Experience
      .addCase(fetchExperienceOptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExperienceOptions.fulfilled, (state, action) => {
        state.loading = false;
        state.experienceOptions = action.payload;
      })
      .addCase(fetchExperienceOptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Certificates
      .addCase(fetchCertificateOptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCertificateOptions.fulfilled, (state, action) => {
        state.loading = false;
        state.certificateOptions = action.payload;
      })
      .addCase(fetchCertificateOptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Number of Employees
      .addCase(fetchNumEmployeeOptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNumEmployeeOptions.fulfilled, (state, action) => {
        state.loading = false;
        state.numEmployeeOptions = action.payload;
      })
      .addCase(fetchNumEmployeeOptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Product Options
      .addCase(fetchProductOptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductOptions.fulfilled, (state, action) => {
        state.loading = false;
        state.productOptions = action.payload;
      })
      .addCase(fetchProductOptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchProvince.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProvince.fulfilled, (state, action) => {
        state.loading = false;
        state.provinceOptions = action.payload;
      })
      .addCase(fetchProvince.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Exports
export const { resetUtilsState } = utilsSlice.actions;

export const selectExperienceOptions = (state) => state.utils.experienceOptions;
export const selectCertificateOptions = (state) => state.utils.certificateOptions;
export const selectNumEmployeeOptions = (state) => state.utils.numEmployeeOptions;
export const selectProductOptions = (state) => state.utils.productOptions;
export const selectProvinceOptions = (state) => state.utils.provinceOptions;
export const selectUtilsLoading = (state) => state.utils.loading;
export const selectUtilsError = (state) => state.utils.error;

export default utilsSlice.reducer;
