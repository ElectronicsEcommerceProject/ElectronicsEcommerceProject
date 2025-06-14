import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchTerm: "",
  selectedCategories: [],
  selectedBrands: [],
  selectedPriceRange: "",
  customMinPrice: 100,
  customMaxPrice: 100000, // Increased from 20000 to 100000 to accommodate higher-priced products
  selectedRating: "",
  selectedDiscounts: [],
  inStockOnly: true,
  newArrivals: "",
  sortOption: "popularity", // Default to popular first
};

const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setSelectedCategories: (state, action) => {
      state.selectedCategories = action.payload;
    },
    setSelectedBrands: (state, action) => {
      state.selectedBrands = action.payload;
    },
    setPriceRange: (state, action) => {
      state.selectedPriceRange = action.payload;
    },
    setCustomPrice: (state, action) => {
      state.customMinPrice = action.payload.min;
      state.customMaxPrice = action.payload.max;
    },
    setRating: (state, action) => {
      state.selectedRating = action.payload;
    },
    setDiscounts: (state, action) => {
      state.selectedDiscounts = action.payload;
    },
    setInStockOnly: (state, action) => {
      state.inStockOnly = action.payload;
    },
    setNewArrivals: (state, action) => {
      state.newArrivals = action.payload;
    },
    setSortOption: (state, action) => {
      state.sortOption = action.payload;
    },
    resetFilters: () => initialState,
  },
});

export const {
  setSearchTerm,
  setSelectedCategories,
  setSelectedBrands,
  setPriceRange,
  setCustomPrice,
  setRating,
  setDiscounts,
  setInStockOnly,
  setNewArrivals,
  setSortOption,
  resetFilters,
} = filterSlice.actions;

export default filterSlice.reducer;
