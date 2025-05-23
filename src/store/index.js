import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import basicInfoReducer from './slices/basicInfoSlice';
import entrepreneurReducer from './slices/entrepreneurSlice';
import utilsReducer from './slices/utilsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    basicInfo: basicInfoReducer,
    entrepreneur: entrepreneurReducer,
    utils: utilsReducer
  },
});
