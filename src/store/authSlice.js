import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient, { parseJwtFromCookie } from '../api/client';

export const loginAsync = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue, dispatch }) => {
    try {
      await apiClient.post('/auth/login', credentials);
      // After successful login, fetch the profile
      const user = await dispatch(checkAuthAsync()).unwrap();
      return user;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Login failed');
    }
  }
);

export const registerAsync = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const resp = await apiClient.post('/auth/register', userData);
      return resp.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Registration failed');
    }
  }
);

export const verifyInvite = createAsyncThunk(
  'auth/verifyInvite',
  async (code, { rejectWithValue }) => {
    try {
      const resp = await apiClient.get('/auth/verify', { params: { code } });
      return resp.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Invalid or expired invitation');
    }
  }
);

export const registerTenant = createAsyncThunk(
  'auth/registerTenant',
  async (data, { rejectWithValue }) => {
    try {
      const resp = await apiClient.post('/auth/register-tenant', data);
      return resp.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Registration failed');
    }
  }
);

export const checkAuthAsync = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/user/profile');
      // If backend returns a proper JSON user object, use it
      if (typeof response.data === 'object' && response.data !== null && response.data.email) {
        return {
          ...response.data,
          role: (response.data.role || '').toLowerCase(),
        };
      }
      // Otherwise, decode the JWT cookie to get user info
      const jwtUser = parseJwtFromCookie();
      if (jwtUser) return jwtUser;

      // Final fallback — we know the user is authenticated (200 response)
      return { email: 'user@powersync.com', role: 'landlord', fullname: 'User' };
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Not authenticated');
    }
  }
);

const initialState = {
  user: null, 
  loading: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
    },
    loginSync: (state, action) => {
      state.user = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(checkAuthAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuthAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(checkAuthAsync.rejected, (state) => {
        state.loading = false;
        state.user = null;
      });
  }
});

export const { logout, loginSync } = authSlice.actions;
export default authSlice.reducer;
