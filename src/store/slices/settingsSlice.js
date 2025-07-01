// settingsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// Fetch items by category
export const fetchItems = createAsyncThunk(
  "settings/fetchItems",
  async (category, { rejectWithValue }) => {
    try {
      let endpoint;
      switch (category) {
        case "certificates":
          endpoint = "/api/certificates";
          break;
        case "spices":
          endpoint = "/api/products";
          break;
        case "experience":
          endpoint = "/api/experience";
          break;
        case "employees":
          endpoint = "/api/number_of_employees";
          break;
        default:
          endpoint = "/api/products";
      }
      
      const response = await axiosInstance.get(endpoint);
      return { category, data: response.data };
    } catch (error) {
      return rejectWithValue({
        category,
        message: error.response?.data?.message || "Failed to fetch items",
      });
    }
  }
);

// Create new item
export const createItem = createAsyncThunk(
  "settings/createItem",
  async ({ category, itemData }, { rejectWithValue }) => {
    try {
      let endpoint;
      switch (category) {
        case "certificates":
          endpoint = "/api/certificates";
          break;
        case "spices":
          endpoint = "/api/products";
          break;
        case "experience":
          endpoint = "/api/experience";
          break;
        case "employees":
          endpoint = "/api/number_of_employees";
          break;
        default:
          endpoint = "/api/products";
      }
      
      const response = await axiosInstance.post(endpoint, itemData);
      return { category, data: response.data };
    } catch (error) {
      return rejectWithValue({
        category,
        message: error.response?.data?.message || "Failed to create item",
      });
    }
  }
);

// Update item
export const updateItem = createAsyncThunk(
  "settings/updateItem",
  async ({ category, id, itemData }, { rejectWithValue }) => {
    try {
      let endpoint;
      switch (category) {
        case "certificates":
          endpoint = `/api/certificates/${id}`;
          break;
        case "spices":
          endpoint = `/api/products/${id}`;
          break;
        case "experience":
          endpoint = `/api/experience/${id}`;
          break;
        case "employees":
          endpoint = `/api/number_of_employees/${id}`;
          break;
        default:
          endpoint = `/api/products/${id}`;
      }
      
      const response = await axiosInstance.patch(endpoint, itemData);
      return { category, data: response.data };
    } catch (error) {
      return rejectWithValue({
        category,
        message: error.response?.data?.message || "Failed to update item",
      });
    }
  }
);

// Delete item
export const deleteItem = createAsyncThunk(
  "settings/deleteItem",
  async ({ category, id }, { rejectWithValue }) => {
    try {
      let endpoint;
      switch (category) {
        case "certificates":
          endpoint = `/api/certificates/${id}`;
          break;
        case "spices":
          endpoint = `/api/products/${id}`;
          break;
        case "experience":
          endpoint = `/api/experience/${id}`;
          break;
        case "employees":
          endpoint = `/api/number_of_employees/${id}`;
          break;
        default:
          endpoint = `/api/products/${id}`;
      }
      
      await axiosInstance.delete(endpoint);
      return { category, id };
    } catch (error) {
      return rejectWithValue({
        category,
        message: error.response?.data?.message || "Failed to delete item",
      });
    }
  }
);

// Initial state
const initialState = {
  certificateTypes: [],
  spiceProducts: [],
  businessExperiences: [],
  employeeRanges: [],
  loading: {
    certificates: false,
    spices: false,
    experience: false,
    employees: false,
  },
  error: {
    certificates: null,
    spices: null,
    experience: null,
    employees: null,
  },
};

// Helper function to get state property name from category
const getCategoryStateKey = (category) => {
  switch (category) {
    case "certificates":
      return "certificateTypes";
    case "spices":
      return "spiceProducts";
    case "experience":
      return "businessExperiences";
    case "employees":
      return "employeeRanges";
    default:
      return null;
  }
};

// Settings slice
const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    // Clear error for a specific category
    clearError: (state, action) => {
      const { category } = action.payload;
      state.error[category] = null;
    },
    // Clear all errors
    clearAllErrors: (state) => {
      state.error = {
        certificates: null,
        spices: null,
        experience: null,
        employees: null,
      };
    },
    // Reset specific category data
    resetCategoryData: (state, action) => {
      const { category } = action.payload;
      const stateKey = getCategoryStateKey(category);
      if (stateKey) {
        state[stateKey] = [];
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch items
    builder
      .addCase(fetchItems.pending, (state, action) => {
        const { category } = action.meta.arg;
        state.loading[category] = true;
        state.error[category] = null;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        const { category, data } = action.payload;
        const stateKey = getCategoryStateKey(category);
        if (stateKey) {
          state[stateKey] = data;
        }
        state.loading[category] = false;
        state.error[category] = null;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        const { category, message } = action.payload;
        state.loading[category] = false;
        state.error[category] = message;
      });

    // Create item
    builder
      .addCase(createItem.pending, (state, action) => {
        const { category } = action.meta.arg;
        state.loading[category] = true;
        state.error[category] = null;
      })
      .addCase(createItem.fulfilled, (state, action) => {
        const { category, data } = action.payload;
        const stateKey = getCategoryStateKey(category);
        if (stateKey) {
          state[stateKey].push(data);
        }
        state.loading[category] = false;
        state.error[category] = null;
      })
      .addCase(createItem.rejected, (state, action) => {
        const { category, message } = action.payload;
        state.loading[category] = false;
        state.error[category] = message;
      });

    // Update item
    builder
      .addCase(updateItem.pending, (state, action) => {
        const { category } = action.meta.arg;
        state.loading[category] = true;
        state.error[category] = null;
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        const { category, data } = action.payload;
        const stateKey = getCategoryStateKey(category);
        if (stateKey) {
          const index = state[stateKey].findIndex(
            (item) => item.id === data.id
          );
          if (index !== -1) {
            state[stateKey][index] = data;
          }
        }
        state.loading[category] = false;
        state.error[category] = null;
      })
      .addCase(updateItem.rejected, (state, action) => {
        const { category, message } = action.payload;
        state.loading[category] = false;
        state.error[category] = message;
      });

    // Delete item
    builder
      .addCase(deleteItem.pending, (state, action) => {
        const { category } = action.meta.arg;
        state.loading[category] = true;
        state.error[category] = null;
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        const { category, id } = action.payload;
        const stateKey = getCategoryStateKey(category);
        if (stateKey) {
          state[stateKey] = state[stateKey].filter((item) => item.id !== id);
        }
        state.loading[category] = false;
        state.error[category] = null;
      })
      .addCase(deleteItem.rejected, (state, action) => {
        const { category, message } = action.payload;
        state.loading[category] = false;
        state.error[category] = message;
      });
  },
});

// Export actions
export const { clearError, clearAllErrors, resetCategoryData } =
  settingsSlice.actions;

// Selectors
export const selectCategoryData = (state, category) => {
  const stateKey = getCategoryStateKey(category);
  return stateKey ? state.settings[stateKey] : [];
};

export const selectCategoryLoading = (state, category) =>
  state.settings.loading[category];
export const selectCategoryError = (state, category) =>
  state.settings.error[category];

export const selectAllCertificateTypes = (state) =>
  state.settings.certificateTypes;
export const selectAllSpiceProducts = (state) => state.settings.spiceProducts;
export const selectAllBusinessExperiences = (state) =>
  state.settings.businessExperiences;
export const selectAllEmployeeRanges = (state) => state.settings.employeeRanges;

export const selectAllLoading = (state) => state.settings.loading;
export const selectAllErrors = (state) => state.settings.error;

// Export reducer
export default settingsSlice.reducer;