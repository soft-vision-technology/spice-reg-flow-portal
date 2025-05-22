import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/loginUser', // Fixed: changed from 'login/loginUser' to match slice name
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/api/auth/login', { email, password });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isModalOpen: false, // Fixed: changed from true to false (modal should be closed by default)
    email: '',
    password: '',
    rememberMe: false,
    loading: false,
    error: null,
    user: null
  },
  reducers: {
    showModal: (state) => {
      state.isModalOpen = true;
    },
    hideModal: (state) => {
      state.isModalOpen = false;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
      // Clear error when user starts typing
      if (state.error) {
        state.error = null;
      }
    },
    setPassword: (state, action) => {
      state.password = action.payload;
      // Clear error when user starts typing
      if (state.error) {
        state.error = null;
      }
    },
    setRememberMe: (state, action) => {
      state.rememberMe = action.payload;
    },
    resetLoginForm: (state) => {
      state.email = '';
      state.password = '';
      state.rememberMe = false;
      state.loading = false;
      state.error = null;
      state.isModalOpen = false; // Added: also close modal when resetting
    },
    // Added: action to clear error manually
    clearError: (state) => {
      state.error = null;
    },
    // Added: action to logout user
    logout: (state) => {
      state.user = null;
      state.email = '';
      state.password = '';
      state.rememberMe = false;
      state.error = null;
      state.isModalOpen = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isModalOpen = false;
        state.error = null; // Added: clear any previous errors
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null; // Added: clear user on login failure
      });
  }
});

export const {
  showModal,
  hideModal,
  setEmail,
  setPassword,
  setRememberMe,
  resetLoginForm,
  clearError,
  logout
} = authSlice.actions;

export default authSlice.reducer;