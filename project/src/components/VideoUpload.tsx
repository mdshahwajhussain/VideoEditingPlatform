import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X, Film } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setMainVideo } from '../store/projectSlice';
import { showToast } from '../store/uiSlice';
import { Button } from './ui/button';
import { generateThumbnail } from '../lib/utils';
import type { VideoClip } from '../store/projectSlice';

const VideoUpload: React.FC = () => {
  const dispatch = useDispatch();
  const mainVideo = useSelector((state: RootState) => state.project.mainVideo);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    try {
      const videoFile = acceptedFiles[0];
      
      // Create a video element to get duration
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      video.onloadedmetadata = async () => {
        URL.revokeObjectURL(video.src);
        const duration = video.duration;
        
        // Generate a thumbnail
        const thumbnail = await generateThumbnail(videoFile);
        
        const videoClip: VideoClip = {
          id: Date.now().toString(),
          name: videoFile.name,
          startTime: 0,
          endTime: duration,
          duration,
          thumbnail,
          originalFile: videoFile
        };
        
        dispatch(setMainVideo(videoClip));
        dispatch(showToast({ 
          message: 'Video uploaded successfully!', 
          type: 'success' 
        }));
      };
      
      video.src = URL.createObjectURL(videoFile);
    } catch (error) {
      console.error('Error uploading video:', error);
      dispatch(showToast({ 
        message: 'Failed to upload video. Please try again.', 
        type: 'error' 
      }));
    }
  }, [dispatch]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi', '.webm']
    },
    maxFiles: 1,
    maxSize: 1024 * 1024 * 100, // 100MB max size
  });

  const handleRemoveVideo = () => {
    dispatch(setMainVideo(null as any));
  };

  return (
    <div className="p-4 bg-card rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Upload Video</h2>
      
      {!mainVideo ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
            ${isDragActive ? 'border-primary bg-secondary/20' : 'border-border hover:border-primary/50'}`}
        >
          <input {...getInputProps()} />
          <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground mb-1">
            {isDragActive ? 'Drop the video here' : 'Drag & drop a video file here'}
          </p>
          <p className="text-xs text-muted-foreground mb-4">
            Supports MP4, MOV, AVI, WEBM (max 100MB)
          </p>
          <Button variant="secondary" size="sm">
            Browse Files
          </Button>
        </div>
      ) : (
        <div className="relative">
          <div className="rounded-lg overflow-hidden aspect-video bg-secondary">
            {mainVideo.thumbnail ? (
              <img 
                src={mainVideo.thumbnail} 
                alt="Video thumbnail" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Film className="h-10 w-10 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="mt-2 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium truncate max-w-[200px]">{mainVideo.name}</p>
              <p className="text-xs text-muted-foreground">
                {Math.floor(mainVideo.duration / 60)}m {Math.floor(mainVideo.duration % 60)}s
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={handleRemoveVideo}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoUpload;