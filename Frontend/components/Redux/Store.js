import { configureStore } from "@reduxjs/toolkit";
import { filterSlice, cartSlice } from '../index.js';

const store = configureStore({
  reducer: {
    filters: filterSlice,
    cart: cartSlice,
  },
});

export default store;
