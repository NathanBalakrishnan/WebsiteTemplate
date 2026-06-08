import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import templateReducer from './slices/templateSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    templates: templateReducer,
  },
});