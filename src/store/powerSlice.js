import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../api/client';

export const fetchRoomUsage = createAsyncThunk(
  'power/fetchUsage',
  async (roomId, { rejectWithValue }) => {
    try {
      const resp = await apiClient.get(`/power/room/${roomId}/usage`);
      return resp.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch usage');
    }
  }
);

export const fetchMyBills = createAsyncThunk(
  'power/fetchMyBills',
  async (_, { rejectWithValue }) => {
    try {
      const resp = await apiClient.get('/bills/my-bills');
      return resp.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch bills');
    }
  }
);

export const fetchLatestPower = createAsyncThunk(
  'power/fetchLatest',
  async (roomId, { rejectWithValue }) => {
    try {
      const resp = await apiClient.get(`/power/room/${roomId}/latest`);
      return resp.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch latest power');
    }
  }
);

export const fetchPowerHistory = createAsyncThunk(
  'power/fetchHistory',
  async ({ roomId, startDate, endDate }, { rejectWithValue }) => {
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      const resp = await apiClient.get(`/power/room/${roomId}/history`, { params });
      return resp.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch power history');
    }
  }
);

const powerSlice = createSlice({
  name: 'power',
  initialState: {
    usage: null,
    myBills: [],
    latestPower: null,
    powerHistory: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoomUsage.fulfilled, (state, action) => {
        state.usage = action.payload;
      })
      .addCase(fetchMyBills.fulfilled, (state, action) => {
        state.myBills = action.payload;
      })
      .addCase(fetchLatestPower.fulfilled, (state, action) => {
        state.latestPower = action.payload;
      })
      .addCase(fetchPowerHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPowerHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.powerHistory = action.payload;
      })
      .addCase(fetchPowerHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default powerSlice.reducer;
