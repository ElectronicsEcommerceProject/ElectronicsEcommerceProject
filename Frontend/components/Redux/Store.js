import { configureStore } from '@reduxjs/toolkit';
import filterReducer from '../../components/Redux/filterSlice';

  const store = configureStore({
  reducer: {
    filters: filterReducer,
  },
});

export default store;
