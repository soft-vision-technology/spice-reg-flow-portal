import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// Authentication thunk
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/api/auth/login", {
        email,
        password,
      });
      
      // Store in localStorage immediately
      const userData = response.data;
      localStorage.setItem("token", userData?.token);
      localStorage.setItem("user", JSON.stringify(userData.user));
      
      return userData;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    } 
  }
);

// Initialize user from localStorage thunk
export const initializeAuth = createAsyncThunk(
  "auth/initializeAuth",
  async (_, { rejectWithValue }) => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");
      
      if (storedUser && storedToken) {
        const userData = JSON.parse(storedUser);
        return { user: userData, token: storedToken };
      }
      
      return null;
    } catch (error) {
      // Clear corrupted data
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      return rejectWithValue("Failed to initialize auth");
    }
  }
);

// User management thunks
export const fetchUsers = createAsyncThunk(
  "auth/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/auth/get");
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);

export const createUser = createAsyncThunk(
  "auth/createUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/api/auth/register", userData);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create user"
      );
    }
  }
);

export const updateUser = createAsyncThunk(
  "auth/updateUser",
  async ({ userId, userData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `/api/auth/update/${userId}`,
        userData
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update user"
      );
    }
  }
);

export const deleteUser = createAsyncThunk(
  "auth/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/auth/delete/${userId}`);
      return userId;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete user"
      );
    }
  }
);

export const getUserById = createAsyncThunk(
  "auth/getUserById",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/users/${userId}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch user"
      );
    }
  }
);

// Change user status thunk
export const changeUserStatus = createAsyncThunk(
  "auth/changeUserStatus",
  async ({ userId, status }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `/api/users/${userId}/status`,
        { status }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to change user status"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    // Authentication state
    isModalOpen: false,
    email: "",
    password: "",
    rememberMe: false,
    loading: false,
    error: null,
    user: null,
    isInitialized: false, // Track if auth has been initialized

    // User management state
    users: [],
    usersLoading: false,
    usersError: null,
    selectedUser: null,

    // Operation states
    createUserLoading: false,
    createUserError: null,
    updateUserLoading: false,
    updateUserError: null,
    deleteUserLoading: false,
    deleteUserError: null,

    // Pagination and filters
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
    },
    filters: {
      role: null,
      status: null,
      search: "",
    },
  },
  reducers: {
    // Authentication reducers
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
      state.email = "";
      state.password = "";
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
      state.email = "";
      state.password = "";
      state.rememberMe = false;
      state.error = null;
      state.isModalOpen = false;
      state.loading = false;
      state.isInitialized = false;
      // Clear user management state on logout
      state.users = [];
      state.selectedUser = null;
      // Clear localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
    restoreUser: (state, action) => {
      state.user = action.payload;
      state.isInitialized = true;
    },
    setInitialized: (state, action) => {
      state.isInitialized = action.payload;
    },

    // User management reducers
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
    clearUsersError: (state) => {
      state.usersError = null;
    },
    clearCreateUserError: (state) => {
      state.createUserError = null;
    },
    clearUpdateUserError: (state) => {
      state.updateUserError = null;
    },
    clearDeleteUserError: (state) => {
      state.deleteUserError = null;
    },

    // Pagination and filters
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = {
        role: null,
        status: null,
        search: "",
      };
    },

    // Local user operations (for optimistic updates)
    updateUserLocally: (state, action) => {
      const { userId, userData } = action.payload;
      const userIndex = state.users.findIndex((user) => user.id === userId);
      if (userIndex !== -1) {
        state.users[userIndex] = { ...state.users[userIndex], ...userData };
      }
    },
    removeUserLocally: (state, action) => {
      const userId = action.payload;
      state.users = state.users.filter((user) => user.id !== userId);
    },
  },
  extraReducers: (builder) => {
    builder
      // Initialize auth
      .addCase(initializeAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isInitialized = true;
        if (action.payload) {
          state.user = action.payload.user;
        }
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.loading = false;
        state.isInitialized = true;
        state.user = null;
      })

      // Login user
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isModalOpen = false;
        state.error = null;
        state.isInitialized = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
        state.isInitialized = true;
      })

      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.usersLoading = true;
        state.usersError = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.users = action.payload.users || action.payload;
        state.pagination.total = action.payload.total || action.payload.length;
        state.usersError = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.usersLoading = false;
        state.usersError = action.payload;
      })

      // Create user
      .addCase(createUser.pending, (state) => {
        state.createUserLoading = true;
        state.createUserError = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.createUserLoading = false;
        state.users.push(action.payload);
        state.pagination.total += 1;
        state.createUserError = null;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.createUserLoading = false;
        state.createUserError = action.payload;
      })

      // Update user
      .addCase(updateUser.pending, (state) => {
        state.updateUserLoading = true;
        state.updateUserError = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.updateUserLoading = false;
        const updatedUser = action.payload;
        const userIndex = state.users.findIndex(
          (user) => user.id === updatedUser.id
        );
        if (userIndex !== -1) {
          state.users[userIndex] = updatedUser;
        }
        state.updateUserError = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.updateUserLoading = false;
        state.updateUserError = action.payload;
      })

      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.deleteUserLoading = true;
        state.deleteUserError = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.deleteUserLoading = false;
        const userId = action.payload;
        state.users = state.users.filter((user) => user.id !== userId);
        state.pagination.total -= 1;
        state.deleteUserError = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.deleteUserLoading = false;
        state.deleteUserError = action.payload;
      })

      // Get user by ID
      .addCase(getUserById.pending, (state) => {
        state.usersLoading = true;
        state.usersError = null;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.selectedUser = action.payload;
        state.usersError = null;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.usersLoading = false;
        state.usersError = action.payload;
      })

      // Change user status
      .addCase(changeUserStatus.pending, (state) => {
        state.updateUserLoading = true;
        state.updateUserError = null;
      })
      .addCase(changeUserStatus.fulfilled, (state, action) => {
        state.updateUserLoading = false;
        const updatedUser = action.payload;
        const userIndex = state.users.findIndex(
          (user) => user.id === updatedUser.id
        );
        if (userIndex !== -1) {
          state.users[userIndex] = updatedUser;
        }
        state.updateUserError = null;
      })
      .addCase(changeUserStatus.rejected, (state, action) => {
        state.updateUserLoading = false;
        state.updateUserError = action.payload;
      });
  },
});

export const {
  // Authentication actions
  showModal,
  hideModal,
  setEmail,
  setPassword,
  setRememberMe,
  resetLoginForm,
  clearError,
  logout,
  restoreUser,
  setInitialized,

  // User management actions
  setSelectedUser,
  clearSelectedUser,
  clearUsersError,
  clearCreateUserError,
  clearUpdateUserError,
  clearDeleteUserError,

  // Pagination and filters
  setPagination,
  setFilters,
  resetFilters,

  // Local operations
  updateUserLocally,
  removeUserLocally,
} = authSlice.actions;

export default authSlice.reducer;

// Enhanced selector to get user with fallback
export const selectAuthUser = (state) => {
  // Return Redux user if available
  if (state.auth && state.auth.user) {
    return state.auth.user;
  }
  
  // Fallback to localStorage only if Redux is not initialized
  if (!state.auth.isInitialized) {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
  }
  
  return null;
};

// Selector to check if auth is initialized
export const selectAuthInitialized = (state) => {
  return state.auth.isInitialized;
};

// Selector to get user role
export const selectUserRole = (state) => {
  const user = selectAuthUser(state);
  return user?.userRole || null;
};

// Selector to check if user is admin
export const selectIsAdmin = (state) => {
  const user = selectAuthUser(state);
  return user?.userRole === 1;
};