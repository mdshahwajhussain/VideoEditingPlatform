import { configureStore } from '@reduxjs/toolkit';
import projectReducer from './projectSlice';
import uiReducer from './uiSlice';

export const store = configureStore({
  reducer: {
    project: projectReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;