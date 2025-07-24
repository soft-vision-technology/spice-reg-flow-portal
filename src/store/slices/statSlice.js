import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// Async thunk to fetch stat card data
export const StatCard = createAsyncThunk(
  "statCard/fetchStatCard",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/system/card/stat_cards");

      console.log("📦 StatCard Response:", response);

      if (response.status !== 200) {
        throw new Error("Failed to fetch stat card data.");
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch stat card data."
      );
    }
  }
);

// Slice
const statSlice = createSlice({
  name: "statCard",
  initialState: {
    data: {}, // Initialize as empty object
    loading: false,
    error: null,
  },
  reducers: {
    // Add a reducer to clear error state
    clearError: (state) => {
      state.error = null;
    },
    // Add a reducer to reset state
    resetState: (state) => {
      state.data = {};
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(StatCard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(StatCard.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload || {}; // Ensure data is always an object
        state.error = null;
      })
      .addCase(StatCard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred";
        // Keep existing data on error instead of clearing it
      });
  },
});

// Export actions
export const { clearError, resetState } = statSlice.actions;

// Improved selectors with null checks
export const selectStatCardData = (state) => {
  // Add null checks for nested state access
  return state?.statCard?.data || {};
};

export const selectStatCardLoading = (state) => {
  return state?.statCard?.loading || false;
};

export const selectStatCardError = (state) => {
  return state?.statCard?.error || null;
};

// Additional helper selectors
export const selectStatCardStatus = (state) => {
  const loading = selectStatCardLoading(state);
  const error = selectStatCardError(state);
  const data = selectStatCardData(state);
  
  return {
    loading,
    error,
    hasData: Object.keys(data).length > 0,
    isEmpty: Object.keys(data).length === 0 && !loading && !error,
  };
};

export default statSlice.reducer;