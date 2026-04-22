import { configureStore } from '@reduxjs/toolkit';
import billingReducer from './billingSlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    billing: billingReducer,
    auth: authReducer,
  },
});
