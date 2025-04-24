import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./productSlice";
import searchReducer from "./SearchSlice"; // Import the search reducer

const store = configureStore({
  reducer: {
    product: productReducer,
    search: searchReducer, // Add the search reducer
  },
});

export default store;