import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../api/client';

export const fetchUnpaidBills = createAsyncThunk(
  'billing/fetchUnpaid',
  async (_, { rejectWithValue }) => {
    try {
      const resp = await apiClient.get('/bills/unpaid');
      return resp.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch unpaid bills');
    }
  }
);

export const fetchBillsForRoom = createAsyncThunk(
  'billing/fetchBillsForRoom',
  async (roomId, { rejectWithValue }) => {
    try {
      const resp = await apiClient.get(`/bills/room/${roomId}`);
      return resp.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch room bills');
    }
  }
);

export const generateBills = createAsyncThunk(
  'billing/generateBills',
  async (month, { rejectWithValue }) => {
    try {
      const params = month ? { month } : {};
      const resp = await apiClient.post('/bills/generate', null, { params });
      return resp.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to generate bills');
    }
  }
);

const billingSlice = createSlice({
  name: 'billing',
  initialState: {
    baseRate: 8.50,
    unpaidBills: [],
    roomBills: [],
    loading: false,
    error: null,
  },
  reducers: {
    setBaseRate: (state, action) => {
      state.baseRate = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUnpaidBills.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUnpaidBills.fulfilled, (state, action) => {
        state.loading = false;
        state.unpaidBills = action.payload;
      })
      .addCase(fetchUnpaidBills.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchBillsForRoom.fulfilled, (state, action) => {
        state.roomBills = action.payload;
      })
      .addCase(generateBills.fulfilled, (state, action) => {
        // Optionally store the result
        if (action.payload.bills) {
          state.unpaidBills = [...state.unpaidBills, ...action.payload.bills];
        }
      });
  }
});

export const { setBaseRate } = billingSlice.actions;
export default billingSlice.reducer;
