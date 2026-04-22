import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../api/client';

export const fetchMyApartments = createAsyncThunk(
  'property/fetchMyApartments',
  async (_, { rejectWithValue }) => {
    try {
      const resp = await apiClient.get('/properties/apartments/my-apartments');
      return resp.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch apartments');
    }
  }
);

export const fetchRooms = createAsyncThunk(
  'property/fetchRooms',
  async (apartmentId, { rejectWithValue }) => {
    try {
      const resp = await apiClient.get(`/properties/apartments/${apartmentId}/rooms`);
      return { apartmentId, rooms: resp.data };
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch rooms');
    }
  }
);

export const sendInvitation = createAsyncThunk(
  'property/sendInvitation',
  async ({ email, roomId }, { rejectWithValue }) => {
    try {
      const resp = await apiClient.post('/invitations/send', { email, roomId });
      return resp.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to send invitation');
    }
  }
);

const propertySlice = createSlice({
  name: 'property',
  initialState: {
    apartments: [],
    rooms: [],       // flattened rooms across all apartments
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyApartments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyApartments.fulfilled, (state, action) => {
        state.loading = false;
        state.apartments = action.payload;
      })
      .addCase(fetchMyApartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        const { apartmentId, rooms } = action.payload;
        // Remove existing rooms for this apartment and add fresh ones
        state.rooms = [
          ...state.rooms.filter(r => r._apartmentId !== apartmentId),
          ...rooms.map(r => ({ ...r, _apartmentId: apartmentId })),
        ];
      });
  }
});

export default propertySlice.reducer;
