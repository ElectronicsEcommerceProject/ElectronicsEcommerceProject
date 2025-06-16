import { configureStore } from "@reduxjs/toolkit";
import filterReducer from "../../components/Redux/filterSlice";
import cartReducer from "../../components/Redux/cartSlice";

const store = configureStore({
  reducer: {
    filters: filterReducer,
    cart: cartReducer,
  },
});

export default store;
