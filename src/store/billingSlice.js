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

export const createPaymentOrder = createAsyncThunk(
  'billing/createPaymentOrder',
  async (billId, { rejectWithValue }) => {
    try {
      const resp = await apiClient.post('/payment/create-order', { billId });
      return resp.data; // expects { paymentSessionId, orderId }
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to create payment order');
    }
  }
);

const billingSlice = createSlice({
  name: 'billing',
  initialState: {
    unpaidBills: [],
    roomBills: [],
    loading: false,
    error: null,
  },
  reducers: {},
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

export default billingSlice.reducer;
