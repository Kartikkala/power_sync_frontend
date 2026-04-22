import { configureStore } from '@reduxjs/toolkit';
import billingReducer from './billingSlice';
import authReducer from './authSlice';
import powerReducer from './powerSlice';
import propertyReducer from './propertySlice';

export const store = configureStore({
  reducer: {
    billing: billingReducer,
    auth: authReducer,
    power: powerReducer,
    property: propertyReducer,
  },
});
