import { createSlice } from '@reduxjs/toolkit';

const billingSlice = createSlice({
  name: 'billing',
  initialState: {
    baseRate: 8.50,
  },
  reducers: {
    setBaseRate: (state, action) => {
      state.baseRate = action.payload;
    }
  }
});

export const { setBaseRate } = billingSlice.actions;
export default billingSlice.reducer;
