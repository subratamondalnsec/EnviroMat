import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: [],
  addToCard: [],
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setOrders(state, action) {
      state.orders = action.payload;
    },
    setAddToCard(state, action) {
      state.addToCard = action.payload;
    },
    setOrderLoading(state, action) {
      state.loading = action.payload;
    },
    setOrderError(state, action) {
      state.error = action.payload;
    },
    clearOrderError(state) {
      state.error = null;
    },
  },
});

export const {
  setOrders,
  setAddToCard,
  setOrderLoading,
  setOrderError,
  clearOrderError,
} = orderSlice.actions;

export default orderSlice.reducer;
