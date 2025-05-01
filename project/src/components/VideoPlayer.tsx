import React, { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { RootState } from '../store';
import { setCurrentTime, setPlaybackState } from '../store/projectSlice';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { formatTime } from '../lib/utils';

const VideoPlayer: React.FC = () => {
  const dispatch = useDispatch();
  const { 
    mainVideo, 
    videoClips, 
    textOverlays, 
    subtitles, 
    imageOverlays,
    currentTime, 
    totalDuration,
    isPlaying 
  } = useSelector((state: RootState) => state.project);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Handle play/pause state
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(error => {
          console.error('Error playing video:', error);
          dispatch(setPlaybackState(false));
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, dispatch]);

  useEffect(() => {
    // Handle seeking when currentTime changes
    if (videoRef.current && Math.abs(videoRef.current.currentTime - currentTime) > 0.5) {
      videoRef.current.currentTime = currentTime;
    }
  }, [currentTime]);

  useEffect(() => {
    // Set up time update event
    const videoElement = videoRef.current;
    
    const handleTimeUpdate = () => {
      if (videoElement && !videoElement.paused) {
        dispatch(setCurrentTime(videoElement.currentTime));
      }
    };
    
    if (videoElement) {
      videoElement.addEventListener('timeupdate', handleTimeUpdate);
    }
    
    return () => {
      if (videoElement) {
        videoElement.removeEventListener('timeupdate', handleTimeUpdate);
      }
    };
  }, [dispatch]);

  const handlePlay = () => {
    dispatch(setPlaybackState(true));
  };

  const handlePause = () => {
    dispatch(setPlaybackState(false));
  };

  const handleSeek = (value: number[]) => {
    dispatch(setCurrentTime(value[0]));
  };

  const handleSkipForward = () => {
    const newTime = Math.min(currentTime + 5, totalDuration);
    dispatch(setCurrentTime(newTime));
  };

  const handleSkipBack = () => {
    const newTime = Math.max(currentTime - 5, 0);
    dispatch(setCurrentTime(newTime));
  };

  if (!mainVideo) {
    return (
      <div className="p-4 bg-card rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Preview</h2>
        <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
          <p className="text-white text-opacity-50">Upload a video to preview</p>
        </div>
      </div>
    );
  }

  // Get all active overlays at current time
  const activeTextOverlays = textOverlays.filter(
    overlay => currentTime >= overlay.startTime && currentTime <= overlay.endTime
  );
  
  const activeSubtitles = subtitles.filter(
    subtitle => currentTime >= subtitle.startTime && currentTime <= subtitle.endTime
  );
  
  const activeImageOverlays = imageOverlays.filter(
    overlay => currentTime >= overlay.startTime && currentTime <= overlay.endTime
  );

  return (
    <div className="p-4 bg-card rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Preview</h2>
      
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
        {/* Video */}
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          src={mainVideo.originalFile ? URL.createObjectURL(mainVideo.originalFile) : undefined}
          poster={mainVideo.thumbnail}
          onEnded={() => dispatch(setPlaybackState(false))}
        />
        
        {/* Image Overlays */}
        {activeImageOverlays.map(overlay => (
          <div 
            key={overlay.id}
            className="absolute pointer-events-none"
            style={{
              left: `${overlay.position.x * 100}%`,
              top: `${overlay.position.y * 100}%`,
              transform: `translate(-50%, -50%) scale(${overlay.scale}) rotate(${overlay.rotation}deg)`,
              opacity: overlay.opacity,
              maxWidth: '50%',
              maxHeight: '50%'
            }}
          >
            <img 
              src={overlay.imageUrl} 
              alt="" 
              className="w-full h-full object-contain"
            />
          </div>
        ))}
        
        {/* Text Overlays */}
        {activeTextOverlays.map(overlay => (
          <div 
            key={overlay.id}
            className="absolute pointer-events-none whitespace-nowrap px-2 py-1"
            style={{
              left: `${overlay.position.x * 100}%`,
              top: `${overlay.position.y * 100}%`,
              transform: `translate(-50%, -50%) rotate(${overlay.rotation}deg)`,
              color: overlay.fontColor,
              fontSize: `${overlay.fontSize}px`,
              textShadow: '1px 1px 2px rgba(0,0,0,0.7)'
            }}
          >
            {overlay.text}
          </div>
        ))}
        
        {/* Subtitles */}
        {activeSubtitles.map(subtitle => (
          <div 
            key={subtitle.id}
            className="absolute pointer-events-none text-center w-full px-4 py-1"
            style={{
              left: `${subtitle.position.x * 100}%`,
              bottom: `${(1 - subtitle.position.y) * 8}%`,
              transform: 'translateX(-50%)',
              color: subtitle.fontColor,
              fontSize: `${subtitle.fontSize}px`,
              textShadow: '1px 1px 2px rgba(0,0,0,0.7)'
            }}
          >
            {subtitle.text}
          </div>
        ))}
      </div>
      
      {/* Playback Controls */}
      <div className="mt-4">
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-xs text-muted-foreground w-12">
            {formatTime(currentTime)}
          </span>
          <Slider 
            value={[currentTime]} 
            max={totalDuration} 
            step={0.1}
            onValueChange={handleSeek}
            className="flex-grow"
          />
          <span className="text-xs text-muted-foreground w-12 text-right">
            {formatTime(totalDuration)}
          </span>
        </div>
        
        <div className="flex justify-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleSkipBack}
          >
            <SkipBack className="h-5 w-5" />
          </Button>
          
          {isPlaying ? (
            <Button 
              variant="secondary" 
              size="icon"
              onClick={handlePause}
            >
              <Pause className="h-5 w-5" />
            </Button>
          ) : (
            <Button 
              variant="secondary" 
              size="icon"
              onClick={handlePlay}
            >
              <Play className="h-5 w-5" />
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleSkipForward}
          >
            <SkipForward className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;