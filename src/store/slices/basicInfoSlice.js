// src/features/basicInfo/basicInfoSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';


// Async thunk for saving basic information
export const saveBasicInfo = createAsyncThunk(
  'basicInfo/saveBasicInfo',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/api/users/', formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for fetching basic information
export const fetchBasicInfo = createAsyncThunk(
  'basicInfo/fetchBasicInfo',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/users/');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  data: {
    title: '',
    initials: '',
    fullName: '',
    nic: '',
    address: '',
    email: '',
    mobileNumber: '',
    province: null,
    district: null,
    dsDivision: '',
    gnDivision: ''
  },
  userId: null,
  loading: false,
  error: null,
  success: false
};

const basicInfoSlice = createSlice({
  name: 'basicInfo',
  initialState,
  reducers: {
    updateBasicInfo: (state, action) => {
      state.data = { ...state.data, ...action.payload };
    },
    resetBasicInfo: () => initialState
  },
  extraReducers: (builder) => {
    builder
      // Save Basic Info
      .addCase(saveBasicInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(saveBasicInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // state.data = action.payload;
        state.userId = action.payload;
      })
      .addCase(saveBasicInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      // Fetch Basic Info
      .addCase(fetchBasicInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBasicInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchBasicInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  }
});

export const { updateBasicInfo, resetBasicInfo } = basicInfoSlice.actions;
export default basicInfoSlice.reducer;