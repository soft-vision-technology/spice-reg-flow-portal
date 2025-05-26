import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/api/auth/login', { email, password });
      localStorage.setItem('token', response.data?.token);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isModalOpen: false, 
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
      if (state.error) {
        state.error = null;
      }
    },
    setPassword: (state, action) => {
      state.password = action.payload;
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
      state.isModalOpen = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.email = '';
      state.password = '';
      state.rememberMe = false;
      state.error = null;
      state.isModalOpen = false;
      state.loading = false;
      // Clear localStorage is handled in the component
    },
    // Add action to restore user from token (for page refresh)
    restoreUser: (state, action) => {
      state.user = action.payload;
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
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
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
  logout,
  restoreUser
} = authSlice.actions;

export default authSlice.reducer;