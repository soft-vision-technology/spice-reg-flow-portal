import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for login
export const loginUser = createAsyncThunk(
  'login/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/login', { email, password }); // Replace with your API
      return response.data; // Could include token, user info, etc.
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

const initialState = {
  isModalOpen: false,
  email: '',
  password: '',
  rememberMe: false,
  loading: false,
  error: null,
  user: null
};

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    showModal: (state) => {
      state.isModalOpen = true;
    },
    hideModal: (state) => {
      state.isModalOpen = false;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
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
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const {
  showModal,
  hideModal,
  setEmail,
  setPassword,
  setRememberMe,
  resetLoginForm
} = loginSlice.actions;

export default loginSlice.reducer;
