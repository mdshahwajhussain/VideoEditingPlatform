import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Scissors, ChevronUp, ChevronDown, Music, Type } from 'lucide-react';
import { RootState } from '../store';
import { setCurrentTime, updateVideoClip, VideoClip } from '../store/projectSlice';
import { setTimelineZoom } from '../store/uiSlice';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { formatTime } from '../lib/utils';

const Timeline: React.FC = () => {
  const dispatch = useDispatch();
  const { mainVideo, videoClips, audioClips, subtitles, textOverlays, currentTime, totalDuration } = 
    useSelector((state: RootState) => state.project);
  const { timelineZoom } = useSelector((state: RootState) => state.ui);
  
  const timelineRef = useRef<HTMLDivElement>(null);
  const videoTrackRef = useRef<HTMLDivElement>(null);
  const [expandedTracks, setExpandedTracks] = useState<Set<string>>(new Set(['video', 'audio']));

  if (!mainVideo) {
    return (
      <div className="p-4 bg-card rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Timeline</h2>
        <div className="bg-muted/20 rounded-lg p-10 text-center">
          <p className="text-muted-foreground">Upload a video to start editing</p>
        </div>
      </div>
    );
  }

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const timelineWidth = rect.width;
    
    const clickTimePercentage = clickX / timelineWidth;
    const newTime = totalDuration * clickTimePercentage;
    
    dispatch(setCurrentTime(Math.max(0, Math.min(totalDuration, newTime))));
  };

  const handleZoomChange = (value: number[]) => {
    dispatch(setTimelineZoom(value[0]));
  };

  const handleTrackToggle = (trackId: string) => {
    setExpandedTracks(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(trackId)) {
        newExpanded.delete(trackId);
      } else {
        newExpanded.add(trackId);
      }
      return newExpanded;
    });
  };

  const handleSplitClip = (clip: VideoClip) => {
    // Don't split if current time is at start or end of clip
    if (currentTime <= clip.startTime || currentTime >= clip.endTime) return;
    
    // Create two clips from the split
    const firstClipDuration = currentTime - clip.startTime;
    const secondClipDuration = clip.endTime - currentTime;
    
    // Update the existing clip to be the first part
    dispatch(updateVideoClip({
      id: clip.id,
      changes: {
        endTime: currentTime,
        duration: firstClipDuration
      }
    }));
    
    // Second part would be created as a new clip in a real implementation
    console.log('Created second clip with duration:', secondClipDuration);
  };

  const timePercentage = (currentTime / totalDuration) * 100;
  
  return (
    <div className="p-4 bg-card rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Timeline</h2>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-muted-foreground">Zoom:</span>
          <Slider 
            className="w-24" 
            value={[timelineZoom]} 
            min={0.5} 
            max={3} 
            step={0.1}
            onValueChange={handleZoomChange}
          />
          <Button variant="outline" size="sm">
            <Scissors className="h-4 w-4 mr-1" />
            Split
          </Button>
        </div>
      </div>
      
      {/* Timeline ruler */}
      <div className="flex mb-1">
        <div className="w-28 flex-shrink-0"></div>
        <div className="h-6 relative flex-grow border-b border-border">
          {Array.from({ length: Math.ceil(totalDuration) }).map((_, i) => (
            <div 
              key={i} 
              className="absolute h-2 border-l border-border"
              style={{ 
                left: `${(i / totalDuration) * 100 * timelineZoom}%`,
                transform: 'translateX(-50%)'
              }}
            >
              <span className="absolute text-[10px] text-muted-foreground" style={{ left: 2 }}>
                {formatTime(i)}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Timeline tracks */}
      <div className="flex flex-col space-y-1">
        {/* Video track */}
        <div className="flex">
          <div className="w-28 flex-shrink-0 pr-2">
            <button
              onClick={() => handleTrackToggle('video')}
              className="flex items-center text-sm font-medium py-1 w-full hover:bg-accent rounded px-2"
            >
              {expandedTracks.has('video') ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
              Video
            </button>
          </div>
          <div 
            ref={timelineRef}
            className="relative flex-grow rounded-sm h-16 timeline-track bg-secondary/50"
            style={{ height: expandedTracks.has('video') ? '4rem' : '2rem' }}
            onClick={handleTimelineClick}
          >
            {/* Playhead */}
            <div 
              className="absolute top-0 bottom-0 w-0.5 bg-primary z-10"
              style={{ left: `${timePercentage}%` }}
            />
            
            {/* Video clips */}
            {videoClips.map(clip => {
              const startPercent = (clip.startTime / totalDuration) * 100 * timelineZoom;
              const widthPercent = (clip.duration / totalDuration) * 100 * timelineZoom;
              
              return (
                <div
                  key={clip.id}
                  className="absolute h-full bg-primary/20 border border-primary rounded timeline-item"
                  style={{
                    left: `${startPercent}%`,
                    width: `${widthPercent}%`,
                  }}
                >
                  {clip.thumbnail && (
                    <div className="h-full w-full flex items-center justify-center overflow-hidden">
                      <img 
                        src={clip.thumbnail} 
                        alt="" 
                        className="h-full object-cover opacity-50" 
                      />
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-1 py-0.5 text-[10px] truncate">
                    {clip.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Audio track */}
        <div className="flex">
          <div className="w-28 flex-shrink-0 pr-2">
            <button
              onClick={() => handleTrackToggle('audio')}
              className="flex items-center text-sm font-medium py-1 w-full hover:bg-accent rounded px-2"
            >
              {expandedTracks.has('audio') ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
              <Music className="h-4 w-4 mr-1" />
              Audio
            </button>
          </div>
          <div 
            className="relative flex-grow rounded-sm bg-secondary/50 timeline-track"
            style={{ height: expandedTracks.has('audio') ? '4rem' : '2rem' }}
            onClick={handleTimelineClick}
          >
            {/* Playhead */}
            <div 
              className="absolute top-0 bottom-0 w-0.5 bg-primary z-10"
              style={{ left: `${timePercentage}%` }}
            />
            
            {/* Audio clips */}
            {audioClips.map(clip => {
              const startPercent = (clip.startTime / totalDuration) * 100 * timelineZoom;
              const widthPercent = (clip.duration / totalDuration) * 100 * timelineZoom;
              
              return (
                <div
                  key={clip.id}
                  className="absolute h-full bg-accent/20 border border-accent rounded timeline-item audio-waveform"
                  style={{
                    left: `${startPercent}%`,
                    width: `${widthPercent}%`,
                    opacity: clip.isMuted ? 0.5 : 1
                  }}
                >
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-1 py-0.5 text-[10px] truncate">
                    {clip.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Text/Subtitles track */}
        <div className="flex">
          <div className="w-28 flex-shrink-0 pr-2">
            <button
              onClick={() => handleTrackToggle('text')}
              className="flex items-center text-sm font-medium py-1 w-full hover:bg-accent rounded px-2"
            >
              {expandedTracks.has('text') ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
              <Type className="h-4 w-4 mr-1" />
              Text
            </button>
          </div>
          <div 
            className="relative flex-grow rounded-sm bg-secondary/50 timeline-track"
            style={{ height: expandedTracks.has('text') ? '4rem' : '2rem' }}
            onClick={handleTimelineClick}
          >
            {/* Playhead */}
            <div 
              className="absolute top-0 bottom-0 w-0.5 bg-primary z-10"
              style={{ left: `${timePercentage}%` }}
            />
            
            {/* Text clips */}
            {[...subtitles, ...textOverlays].map(item => {
              const startPercent = (item.startTime / totalDuration) * 100 * timelineZoom;
              const widthPercent = ((item.endTime - item.startTime) / totalDuration) * 100 * timelineZoom;
              
              return (
                <div
                  key={item.id}
                  className="absolute h-full bg-destructive/20 border border-destructive rounded timeline-item"
                  style={{
                    left: `${startPercent}%`,
                    width: `${widthPercent}%`,
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center px-1 text-xs truncate">
                    {item.text}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Time indicator */}
      <div className="mt-2 text-xs text-right pr-2 text-muted-foreground">
        {formatTime(currentTime)} / {formatTime(totalDuration)}
      </div>
    </div>
  );
};

export default Timeline;