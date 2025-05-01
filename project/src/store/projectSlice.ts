import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';

export interface VideoClip {
  id: string;
  name: string;
  startTime: number;
  endTime: number;
  duration: number;
  thumbnail: string;
  originalFile?: File;
}

export interface AudioClip {
  id: string;
  name: string;
  startTime: number;
  duration: number;
  waveform: number[];
  isMuted: boolean;
}

export interface Subtitle {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
  fontSize: number;
  fontColor: string;
  position: { x: number; y: number };
}

export interface TextOverlay {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
  fontSize: number;
  fontColor: string;
  position: { x: number; y: number };
  rotation: number;
}

export interface ImageOverlay {
  id: string;
  imageUrl: string;
  startTime: number;
  endTime: number;
  position: { x: number; y: number };
  scale: number;
  opacity: number;
  rotation: number;
}

interface ProjectState {
  projectName: string;
  totalDuration: number;
  currentTime: number;
  isPlaying: boolean;
  mainVideo: VideoClip | null;
  audioClips: AudioClip[];
  videoClips: VideoClip[];
  subtitles: Subtitle[];
  textOverlays: TextOverlay[];
  imageOverlays: ImageOverlay[];
  exportStatus: 'idle' | 'rendering' | 'complete' | 'error';
  exportProgress: number;
  exportUrl: string | null;
}

const initialState: ProjectState = {
  projectName: 'Untitled Project',
  totalDuration: 0,
  currentTime: 0,
  isPlaying: false,
  mainVideo: null,
  audioClips: [],
  videoClips: [],
  subtitles: [],
  textOverlays: [],
  imageOverlays: [],
  exportStatus: 'idle',
  exportProgress: 0,
  exportUrl: null,
};

export const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setProjectName: (state, action: PayloadAction<string>) => {
      state.projectName = action.payload;
    },
    setMainVideo: (state, action: PayloadAction<VideoClip>) => {
      state.mainVideo = action.payload;
      state.totalDuration = action.payload.duration;
    },
    addVideoClip: (state, action: PayloadAction<VideoClip>) => {
      state.videoClips.push(action.payload);
    },
    updateVideoClip: (state, action: PayloadAction<{ id: string; changes: Partial<VideoClip> }>) => {
      const clipIndex = state.videoClips.findIndex(clip => clip.id === action.payload.id);
      if (clipIndex !== -1) {
        state.videoClips[clipIndex] = { ...state.videoClips[clipIndex], ...action.payload.changes };
      }
    },
    deleteVideoClip: (state, action: PayloadAction<string>) => {
      state.videoClips = state.videoClips.filter(clip => clip.id !== action.payload);
    },
    addAudioClip: (state, action: PayloadAction<Omit<AudioClip, 'id'>>) => {
      state.audioClips.push({
        id: nanoid(),
        ...action.payload
      });
    },
    updateAudioClip: (state, action: PayloadAction<{ id: string; changes: Partial<AudioClip> }>) => {
      const clipIndex = state.audioClips.findIndex(clip => clip.id === action.payload.id);
      if (clipIndex !== -1) {
        state.audioClips[clipIndex] = { ...state.audioClips[clipIndex], ...action.payload.changes };
      }
    },
    deleteAudioClip: (state, action: PayloadAction<string>) => {
      state.audioClips = state.audioClips.filter(clip => clip.id !== action.payload);
    },
    addSubtitle: (state, action: PayloadAction<Omit<Subtitle, 'id'>>) => {
      state.subtitles.push({
        id: nanoid(),
        ...action.payload
      });
    },
    updateSubtitle: (state, action: PayloadAction<{ id: string; changes: Partial<Subtitle> }>) => {
      const index = state.subtitles.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.subtitles[index] = { ...state.subtitles[index], ...action.payload.changes };
      }
    },
    deleteSubtitle: (state, action: PayloadAction<string>) => {
      state.subtitles = state.subtitles.filter(item => item.id !== action.payload);
    },
    addTextOverlay: (state, action: PayloadAction<Omit<TextOverlay, 'id'>>) => {
      state.textOverlays.push({
        id: nanoid(),
        ...action.payload
      });
    },
    updateTextOverlay: (state, action: PayloadAction<{ id: string; changes: Partial<TextOverlay> }>) => {
      const index = state.textOverlays.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.textOverlays[index] = { ...state.textOverlays[index], ...action.payload.changes };
      }
    },
    deleteTextOverlay: (state, action: PayloadAction<string>) => {
      state.textOverlays = state.textOverlays.filter(item => item.id !== action.payload);
    },
    addImageOverlay: (state, action: PayloadAction<Omit<ImageOverlay, 'id'>>) => {
      state.imageOverlays.push({
        id: nanoid(),
        ...action.payload
      });
    },
    updateImageOverlay: (state, action: PayloadAction<{ id: string; changes: Partial<ImageOverlay> }>) => {
      const index = state.imageOverlays.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.imageOverlays[index] = { ...state.imageOverlays[index], ...action.payload.changes };
      }
    },
    deleteImageOverlay: (state, action: PayloadAction<string>) => {
      state.imageOverlays = state.imageOverlays.filter(item => item.id !== action.payload);
    },
    setCurrentTime: (state, action: PayloadAction<number>) => {
      state.currentTime = action.payload;
    },
    togglePlayback: (state) => {
      state.isPlaying = !state.isPlaying;
    },
    setPlaybackState: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    startExport: (state) => {
      state.exportStatus = 'rendering';
      state.exportProgress = 0;
      state.exportUrl = null;
    },
    updateExportProgress: (state, action: PayloadAction<number>) => {
      state.exportProgress = action.payload;
    },
    completeExport: (state, action: PayloadAction<string>) => {
      state.exportStatus = 'complete';
      state.exportProgress = 100;
      state.exportUrl = action.payload;
    },
    exportError: (state) => {
      state.exportStatus = 'error';
    },
    resetExport: (state) => {
      state.exportStatus = 'idle';
      state.exportProgress = 0;
      state.exportUrl = null;
    },
  },
});

export const {
  setProjectName,
  setMainVideo,
  addVideoClip,
  updateVideoClip,
  deleteVideoClip,
  addAudioClip,
  updateAudioClip,
  deleteAudioClip,
  addSubtitle,
  updateSubtitle,
  deleteSubtitle,
  addTextOverlay,
  updateTextOverlay,
  deleteTextOverlay,
  addImageOverlay,
  updateImageOverlay,
  deleteImageOverlay,
  setCurrentTime,
  togglePlayback,
  setPlaybackState,
  startExport,
  updateExportProgress,
  completeExport,
  exportError,
  resetExport,
} = projectSlice.actions;

export default projectSlice.reducer;