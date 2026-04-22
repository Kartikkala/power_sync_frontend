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

export const createApartment = createAsyncThunk(
  'property/createApartment',
  async ({ name, address }, { rejectWithValue }) => {
    try {
      const resp = await apiClient.post('/properties/apartments', { name, address });
      return resp.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to create apartment');
    }
  }
);

export const updateApartment = createAsyncThunk(
  'property/updateApartment',
  async ({ id, name, address }, { rejectWithValue }) => {
    try {
      const resp = await apiClient.put(`/properties/apartments/${id}`, { name, address });
      return resp.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to update apartment');
    }
  }
);

export const deleteApartment = createAsyncThunk(
  'property/deleteApartment',
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/properties/apartments/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to delete apartment');
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

export const createRoom = createAsyncThunk(
  'property/createRoom',
  async ({ apartmentId, roomNumber, floorNo }, { rejectWithValue }) => {
    try {
      const resp = await apiClient.post(`/properties/apartments/${apartmentId}/rooms`, { roomNumber, floorNo });
      return { apartmentId, room: resp.data };
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to create room');
    }
  }
);

export const updateRoom = createAsyncThunk(
  'property/updateRoom',
  async ({ apartmentId, roomId, roomNumber, floorNo }, { rejectWithValue }) => {
    try {
      const resp = await apiClient.put(`/properties/apartments/${apartmentId}/rooms/${roomId}`, { roomNumber, floorNo });
      return resp.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to update room');
    }
  }
);

export const deleteRoom = createAsyncThunk(
  'property/deleteRoom',
  async ({ apartmentId, roomId }, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/properties/apartments/${apartmentId}/rooms/${roomId}`);
      return { apartmentId, roomId };
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to delete room');
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
    rooms: [],
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
      // Create apartment
      .addCase(createApartment.fulfilled, (state, action) => {
        state.apartments.push(action.payload);
      })
      // Update apartment
      .addCase(updateApartment.fulfilled, (state, action) => {
        const idx = state.apartments.findIndex(a => a.id === action.payload.id);
        if (idx !== -1) state.apartments[idx] = action.payload;
      })
      // Delete apartment
      .addCase(deleteApartment.fulfilled, (state, action) => {
        state.apartments = state.apartments.filter(a => a.id !== action.payload);
        state.rooms = state.rooms.filter(r => r._apartmentId !== action.payload);
      })
      // Fetch rooms
      .addCase(fetchRooms.fulfilled, (state, action) => {
        const { apartmentId, rooms } = action.payload;
        state.rooms = [
          ...state.rooms.filter(r => r._apartmentId !== apartmentId),
          ...rooms.map(r => ({ ...r, _apartmentId: apartmentId })),
        ];
      })
      // Create room
      .addCase(createRoom.fulfilled, (state, action) => {
        const { apartmentId, room } = action.payload;
        state.rooms.push({ ...room, _apartmentId: apartmentId });
      })
      // Update room
      .addCase(updateRoom.fulfilled, (state, action) => {
        const idx = state.rooms.findIndex(r => r.id === action.payload.id);
        if (idx !== -1) {
          const aptId = state.rooms[idx]._apartmentId;
          state.rooms[idx] = { ...action.payload, _apartmentId: aptId };
        }
      })
      // Delete room
      .addCase(deleteRoom.fulfilled, (state, action) => {
        state.rooms = state.rooms.filter(r => r.id !== action.payload.roomId);
      });
  }
});

export default propertySlice.reducer;
