import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Download, UploadCloud, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { RootState } from '../store';
import { startExport, updateExportProgress, completeExport, exportError, resetExport } from '../store/projectSlice';
import { Button } from './ui/button';
import { simulateProcessing } from '../lib/utils';

const ExportControls: React.FC = () => {
  const dispatch = useDispatch();
  const { mainVideo, exportStatus, exportProgress, exportUrl } = useSelector((state: RootState) => state.project);
  const [exportQuality, setExportQuality] = useState('high');
  const [exportFormat, setExportFormat] = useState('mp4');

  if (!mainVideo) {
    return (
      <div className="p-4 bg-card rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Export Video</h2>
        <div className="bg-muted/20 rounded-lg p-10 text-center">
          <p className="text-muted-foreground">Upload a video to export</p>
        </div>
      </div>
    );
  }

  const handleExport = async () => {
    dispatch(startExport());
    
    try {
      // Simulate export progress
      for (let progress = 0; progress <= 100; progress += 10) {
        dispatch(updateExportProgress(progress));
        // Slow down the render process for demonstration
        await simulateProcessing(null, 500);
      }
      
      // Simulate a finished export URL
      dispatch(completeExport('https://example.com/exported-video.mp4'));
    } catch (error) {
      console.error('Export error:', error);
      dispatch(exportError());
    }
  };

  const handleReset = () => {
    dispatch(resetExport());
  };

  return (
    <div className="p-4 bg-card rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Export Video</h2>
      
      <div className="space-y-4">
        {exportStatus === 'idle' && (
          <>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Format</label>
                <select
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm"
                >
                  <option value="mp4">MP4</option>
                  <option value="webm">WebM</option>
                  <option value="mov">MOV</option>
                </select>
              </div>
              
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Quality</label>
                <select
                  value={exportQuality}
                  onChange={(e) => setExportQuality(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm"
                >
                  <option value="low">Low (480p)</option>
                  <option value="medium">Medium (720p)</option>
                  <option value="high">High (1080p)</option>
                  <option value="ultra">Ultra HD (4K)</option>
                </select>
              </div>
            </div>
            
            <Button onClick={handleExport} className="w-full">
              <UploadCloud className="h-4 w-4 mr-2" />
              Render Video
            </Button>
            
            <p className="text-xs text-muted-foreground text-center mt-2">
              This is a demo. No actual rendering will occur.
            </p>
          </>
        )}
        
        {exportStatus === 'rendering' && (
          <div className="space-y-3">
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="font-medium">Rendering in progress...</span>
            </div>
            
            <div className="w-full bg-secondary rounded-full h-2.5">
              <div 
                className="bg-primary h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${exportProgress}%` }}
              ></div>
            </div>
            
            <p className="text-sm text-center text-muted-foreground">
              {exportProgress}% complete
            </p>
          </div>
        )}
        
        {exportStatus === 'complete' && (
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2 text-green-500">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">Rendering complete!</span>
            </div>
            
            <Button variant="outline" className="w-full" onClick={() => window.open(exportUrl!, '_blank')}>
              <Download className="h-4 w-4 mr-2" />
              Download Video
            </Button>
            
            <Button variant="ghost" onClick={handleReset} className="w-full">
              Start New Export
            </Button>
          </div>
        )}
        
        {exportStatus === 'error' && (
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2 text-destructive">
              <XCircle className="h-5 w-5" />
              <span className="font-medium">Rendering failed</span>
            </div>
            
            <p className="text-sm text-center text-muted-foreground">
              There was an error while rendering your video. Please try again.
            </p>
            
            <Button variant="outline" onClick={handleReset} className="w-full">
              Try Again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExportControls;