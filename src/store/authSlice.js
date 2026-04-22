import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Mock initial state: we can default to null so user has to login
  user: null, 
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      // action.payload is the user object { email, role, name }
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
