import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import CartService from "../ShowAllCartItems/CartService";

// Async thunk for adding item to cart
export const addToCartAsync = createAsyncThunk(
  "cart/addToCartAsync",
  async ({ productId, variantId, quantity, price, productData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found. Please login.");
      }
      
      const response = await CartService.addToCart(productId, quantity, token);
      
      // Return the product data along with the response for state management
      return {
        ...response,
        productData: {
          productId,
          variantId,
          quantity,
          price,
          ...productData
        }
      };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to add to cart");
    }
  }
);

// Async thunk for fetching cart items
export const fetchCartAsync = createAsyncThunk(
  "cart/fetchCartAsync",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found. Please login.");
      }
      
      const cartItems = await CartService.getAllCartItems(token);
      return Array.isArray(cartItems) ? cartItems : [];
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch cart items");
    }
  }
);

// Async thunk for updating cart item quantity
export const updateCartItemAsync = createAsyncThunk(
  "cart/updateCartItemAsync",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found. Please login.");
      }
      
      const response = await CartService.updateCartItem(productId, quantity, token);
      return { productId, quantity, ...response };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update cart item");
    }
  }
);

// Async thunk for removing item from cart
export const removeFromCartAsync = createAsyncThunk(
  "cart/removeFromCartAsync",
  async (productId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found. Please login.");
      }
      
      const response = await CartService.removeFromCart(productId, token);
      return { productId, ...response };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to remove from cart");
    }
  }
);

const initialState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  loading: false,
  error: null,
  addingToCart: false,
  updatingItem: null,
  removingItem: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
    },
    clearError: (state) => {
      state.error = null;
    },
    // Local state management for immediate UI updates
    updateLocalQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find(item => item.product_id === productId);
      if (item) {
        item.quantity = quantity;
        // Recalculate totals
        state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
        state.totalPrice = state.items.reduce((sum, item) => sum + (item.Product?.price || 0) * item.quantity, 0);
      }
    },
    removeLocalItem: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter(item => item.product_id !== productId);
      // Recalculate totals
      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalPrice = state.items.reduce((sum, item) => sum + (item.Product?.price || 0) * item.quantity, 0);
    },
  },
  extraReducers: (builder) => {
    builder
      // Add to cart
      .addCase(addToCartAsync.pending, (state) => {
        state.addingToCart = true;
        state.error = null;
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.addingToCart = false;
        // Increment total items count for immediate UI feedback
        state.totalItems += action.payload.productData.quantity;
      })
      .addCase(addToCartAsync.rejected, (state, action) => {
        state.addingToCart = false;
        state.error = action.payload;
      })
      
      // Fetch cart
      .addCase(fetchCartAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        // Calculate totals
        state.totalItems = action.payload.reduce((sum, item) => sum + item.quantity, 0);
        state.totalPrice = action.payload.reduce((sum, item) => sum + (item.Product?.price || 0) * item.quantity, 0);
      })
      .addCase(fetchCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.items = [];
        state.totalItems = 0;
        state.totalPrice = 0;
      })
      
      // Update cart item
      .addCase(updateCartItemAsync.pending, (state, action) => {
        state.updatingItem = action.meta.arg.productId;
        state.error = null;
      })
      .addCase(updateCartItemAsync.fulfilled, (state, action) => {
        state.updatingItem = null;
        const { productId, quantity } = action.payload;
        const item = state.items.find(item => item.product_id === productId);
        if (item) {
          item.quantity = quantity;
          // Recalculate totals
          state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
          state.totalPrice = state.items.reduce((sum, item) => sum + (item.Product?.price || 0) * item.quantity, 0);
        }
      })
      .addCase(updateCartItemAsync.rejected, (state, action) => {
        state.updatingItem = null;
        state.error = action.payload;
      })
      
      // Remove from cart
      .addCase(removeFromCartAsync.pending, (state, action) => {
        state.removingItem = action.meta.arg;
        state.error = null;
      })
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        state.removingItem = null;
        const { productId } = action.payload;
        state.items = state.items.filter(item => item.product_id !== productId);
        // Recalculate totals
        state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
        state.totalPrice = state.items.reduce((sum, item) => sum + (item.Product?.price || 0) * item.quantity, 0);
      })
      .addCase(removeFromCartAsync.rejected, (state, action) => {
        state.removingItem = null;
        state.error = action.payload;
      });
  },
});

export const { clearCart, clearError, updateLocalQuantity, removeLocalItem } = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotalItems = (state) => state.cart.totalItems;
export const selectCartTotalPrice = (state) => state.cart.totalPrice;
export const selectCartLoading = (state) => state.cart.loading;
export const selectCartError = (state) => state.cart.error;
export const selectAddingToCart = (state) => state.cart.addingToCart;
export const selectUpdatingItem = (state) => state.cart.updatingItem;
export const selectRemovingItem = (state) => state.cart.removingItem;

export default cartSlice.reducer;
