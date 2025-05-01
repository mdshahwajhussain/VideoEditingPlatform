import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ActivePanel = 'upload' | 'timeline' | 'audio' | 'text' | 'image' | 'preview' | 'export';

interface UiState {
  activePanel: ActivePanel;
  showSettings: boolean;
  timelineZoom: number;
  isDragging: boolean;
  toastMessage: string | null;
  toastType: 'success' | 'error' | 'info' | null;
}

const initialState: UiState = {
  activePanel: 'upload',
  showSettings: false,
  timelineZoom: 1,
  isDragging: false,
  toastMessage: null,
  toastType: null,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActivePanel: (state, action: PayloadAction<ActivePanel>) => {
      state.activePanel = action.payload;
    },
    toggleSettings: (state) => {
      state.showSettings = !state.showSettings;
    },
    setTimelineZoom: (state, action: PayloadAction<number>) => {
      state.timelineZoom = action.payload;
    },
    setIsDragging: (state, action: PayloadAction<boolean>) => {
      state.isDragging = action.payload;
    },
    showToast: (state, action: PayloadAction<{ message: string; type: 'success' | 'error' | 'info' }>) => {
      state.toastMessage = action.payload.message;
      state.toastType = action.payload.type;
    },
    clearToast: (state) => {
      state.toastMessage = null;
      state.toastType = null;
    },
  },
});

export const {
  setActivePanel,
  toggleSettings,
  setTimelineZoom,
  setIsDragging,
  showToast,
  clearToast,
} = uiSlice.actions;

export default uiSlice.reducer;