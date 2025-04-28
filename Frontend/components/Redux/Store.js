import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./ProductSlice.js"
import searchReducer from "./SearchSlice.js"; // Import the search reducer

const store = configureStore({
  reducer: {
    product: productReducer,
    search: searchReducer, // Add the search reducer
  },
});

export default store;