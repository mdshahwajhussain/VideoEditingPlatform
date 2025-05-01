import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Volume2, VolumeX, Trash2, Plus } from 'lucide-react';
import { RootState } from '../store';
import { addAudioClip, updateAudioClip, deleteAudioClip } from '../store/projectSlice';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { generateMockAudioWaveform } from '../lib/utils';

const AudioControls: React.FC = () => {
  const dispatch = useDispatch();
  const { mainVideo, audioClips, totalDuration } = useSelector((state: RootState) => state.project);
  const [audioName, setAudioName] = useState('');

  if (!mainVideo) {
    return (
      <div className="p-4 bg-card rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Audio Controls</h2>
        <div className="bg-muted/20 rounded-lg p-10 text-center">
          <p className="text-muted-foreground">Upload a video to manage audio</p>
        </div>
      </div>
    );
  }

  const handleAddAudio = () => {
    // In a real implementation, we would handle file upload here
    const mockAudioDuration = Math.floor(Math.random() * totalDuration * 0.75);
    const mockStartTime = Math.floor(Math.random() * (totalDuration - mockAudioDuration));
    
    dispatch(addAudioClip({
      name: audioName || `Background Music ${audioClips.length + 1}`,
      startTime: mockStartTime,
      duration: mockAudioDuration,
      waveform: generateMockAudioWaveform(mockAudioDuration),
      isMuted: false
    }));
    
    setAudioName('');
  };

  const toggleMute = (id: string, isMuted: boolean) => {
    dispatch(updateAudioClip({
      id,
      changes: { isMuted: !isMuted }
    }));
  };

  const handleDeleteAudio = (id: string) => {
    dispatch(deleteAudioClip(id));
  };

  return (
    <div className="p-4 bg-card rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Audio Controls</h2>
      
      <div className="mb-4">
        <div className="flex space-x-2 mb-4">
          <input
            type="text"
            placeholder="Audio Track Name"
            className="flex-grow px-3 py-2 bg-background border border-input rounded-md text-sm"
            value={audioName}
            onChange={(e) => setAudioName(e.target.value)}
          />
          <Button onClick={handleAddAudio}>
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground mb-2">
          Note: In this demo, audio is simulated. In a real implementation, you would upload audio files.
        </div>
      </div>
      
      {audioClips.length === 0 ? (
        <div className="bg-muted/20 rounded-lg p-6 text-center">
          <p className="text-muted-foreground">No audio tracks added</p>
          <p className="text-xs text-muted-foreground mt-1">Add background music or voice tracks</p>
        </div>
      ) : (
        <div className="space-y-4">
          {audioClips.map(clip => (
            <div key={clip.id} className="p-3 bg-secondary/30 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-sm">{clip.name}</span>
                <div className="flex space-x-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7"
                    onClick={() => toggleMute(clip.id, clip.isMuted)}
                  >
                    {clip.isMuted ? (
                      <VolumeX className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    onClick={() => handleDeleteAudio(clip.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="relative h-8 bg-background rounded-sm overflow-hidden audio-waveform">
                {/* Simple visualizer mockup */}
                <div className="absolute inset-0 flex items-end justify-around">
                  {clip.waveform.map((value, index) => (
                    <div
                      key={index}
                      className="w-1 bg-primary/50 rounded-t"
                      style={{ 
                        height: `${value * 100}%`,
                        opacity: clip.isMuted ? 0.3 : 0.8
                      }}
                    />
                  ))}
                </div>
              </div>
              
              <div className="mt-2">
                <Slider 
                  disabled={clip.isMuted}
                  value={[0.8]} 
                  min={0} 
                  max={1} 
                  step={0.01}
                  className={clip.isMuted ? "opacity-50" : ""}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AudioControls;