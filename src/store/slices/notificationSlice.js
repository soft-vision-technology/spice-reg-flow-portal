import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async () => {
    const res = await axiosInstance.get("/api/notification/get/unread");
    return res.data.map((n) => ({
      id: n.id,
      title: n.type,
      message: n.details,
      time: formatTime(n.createdAt),
      timestamp: new Date(n.createdAt),
      read: n.isRead,
      // Set priority and type based on requestApprovalId
      priority: n.requestApprovalId ? "high" : "low",
      type: n.requestApprovalId ? "approval" : "information",
      sendUrl: n.sendUrl,
      requestApprovalId: n.requestApprovalId,
      adminId: n.adminId,
      readTime: n.readTime,
    }));
  }
);

export const fetchReadNotifications = createAsyncThunk(
  "notifications/fetchReadNotifications",
  async () => {
    const res = await axiosInstance.get("/api/notification/get/read");
    return res.data.map((n) => ({
      id: n.id,
      title: n.type,
      message: n.details,
      time: formatTime(n.createdAt),
      timestamp: new Date(n.createdAt),
      read: n.isRead,
      priority: n.requestApprovalId ? "high" : "low",
      type: n.requestApprovalId ? "approval" : "information",
      sendUrl: n.sendUrl,
      requestApprovalId: n.requestApprovalId,
      adminId: n.adminId,
      readTime: n.readTime,
    }));
  }
);

export const markNotificationAsRead = createAsyncThunk(
  "notifications/markNotificationAsRead",
  async (notificationId) => {
    await axiosInstance.patch(`/api/notification/read/${notificationId}`);
    return notificationId;
  }
);

export const markAllNotificationAsRead = createAsyncThunk(
  "notifications/markAllNotificationAsRead",
  async () => {
    await axiosInstance.patch(`/api/notification/all/read`);
  }
);

function formatTime(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return `${diff} seconds ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
}

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    markAsRead: (state, action) => {
      state.items = state.items.map((n) =>
        n.id === action.payload ? { ...n, read: true } : n
      );
    },
    markAsUnread: (state, action) => {
      state.items = state.items.map((n) =>
        n.id === action.payload ? { ...n, read: false } : n
      );
    },
    markAllAsRead: (state) => {
      state.items = state.items.map((n) => ({ ...n, read: true }));
    },
    deleteNotification: (state, action) => {
      state.items = state.items.filter((n) => n.id !== action.payload);
    },
    clearAllNotifications: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchReadNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReadNotifications.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchReadNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  markAsRead,
  markAsUnread,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;