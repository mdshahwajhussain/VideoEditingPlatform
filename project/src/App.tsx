import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Header from './components/Header';
import VideoUpload from './components/VideoUpload';
import Timeline from './components/Timeline';
import VideoPlayer from './components/VideoPlayer';
import AudioControls from './components/AudioControls';
import TextOverlayControls from './components/TextOverlayControls';
import ImageOverlayControls from './components/ImageOverlayControls';
import ExportControls from './components/ExportControls';
import ToastNotification from './components/ToastNotification';

function App() {
  return (
    <Provider store={store}>
      <DndProvider backend={HTML5Backend}>
        <div className="min-h-screen bg-background flex flex-col">
          <Header />
          
          <main className="flex-1 p-4 overflow-hidden flex flex-col">
            <div className="grid grid-cols-12 gap-4 h-full">
              {/* Left sidebar - Upload and Timeline */}
              <div className="col-span-3 space-y-4 overflow-y-auto">
                <VideoUpload />
                <ExportControls />
              </div>
              
              {/* Center - Video Preview and Timeline */}
              <div className="col-span-6 flex flex-col space-y-4">
                <VideoPlayer />
                <Timeline />
              </div>
              
              {/* Right sidebar - Controls */}
              <div className="col-span-3 space-y-4 overflow-y-auto">
                <AudioControls />
                <TextOverlayControls />
                <ImageOverlayControls />
              </div>
            </div>
          </main>
          
          <ToastNotification />
        </div>
      </DndProvider>
    </Provider>
  );
}

export default App;