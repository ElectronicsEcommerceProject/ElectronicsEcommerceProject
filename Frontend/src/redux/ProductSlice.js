import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
  cartCount: 0,
  wishlistCount: 0,
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    // addToCart: (state) => {
    //   state.cartCount += 1;
    // },
    // addToWishlist: (state) => {
    //   state.wishlistCount += 1;
    // },
    addToCart: (state, action) => {
      state.cartCount += action.payload;
    },
    addToWishlist: (state, action) => {
      state.wishlistCount += action.payload;
    },
  },
});

export const { setProducts, addToCart, addToWishlist } = productSlice.actions;
export default productSlice.reducer;