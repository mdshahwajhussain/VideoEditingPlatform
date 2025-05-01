import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Image, UploadCloud, Trash2, Move } from 'lucide-react';
import { RootState } from '../store';
import { addImageOverlay, deleteImageOverlay, updateImageOverlay } from '../store/projectSlice';
import { Button } from './ui/button';
import { Slider } from './ui/slider';

const ImageOverlayControls: React.FC = () => {
  const dispatch = useDispatch();
  const { mainVideo, imageOverlays, currentTime, totalDuration } = 
    useSelector((state: RootState) => state.project);
  
  const [imageUrl, setImageUrl] = useState('');
  const [opacity, setOpacity] = useState(1);
  const [scale, setScale] = useState(1);
  
  if (!mainVideo) {
    return (
      <div className="p-4 bg-card rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Image Overlays</h2>
        <div className="bg-muted/20 rounded-lg p-10 text-center">
          <p className="text-muted-foreground">Upload a video to add images</p>
        </div>
      </div>
    );
  }

  const handleAddImage = () => {
    if (!imageUrl.trim()) {
      // In a real app, we would handle file upload
      // For demo purposes, we'll use a placeholder
      const placeholderImages = [
        'https://images.pexels.com/photos/4975368/pexels-photo-4975368.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/5428826/pexels-photo-5428826.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/12883026/pexels-photo-12883026.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
      ];
      const randomImage = placeholderImages[Math.floor(Math.random() * placeholderImages.length)];
      
      dispatch(addImageOverlay({
        imageUrl: randomImage,
        startTime: currentTime,
        endTime: Math.min(currentTime + 5, totalDuration),
        position: { x: 0.5, y: 0.5 }, // Center by default
        scale: scale,
        opacity: opacity,
        rotation: 0
      }));
    } else {
      dispatch(addImageOverlay({
        imageUrl: imageUrl,
        startTime: currentTime,
        endTime: Math.min(currentTime + 5, totalDuration),
        position: { x: 0.5, y: 0.5 }, // Center by default
        scale: scale,
        opacity: opacity,
        rotation: 0
      }));
      setImageUrl('');
    }
  };

  return (
    <div className="p-4 bg-card rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Image Overlays</h2>
      
      <div className="space-y-4">
        <div>
          <div className="mb-3">
            <label className="text-xs text-muted-foreground block mb-1">Image URL (optional)</label>
            <input
              type="text"
              placeholder="Enter image URL or click 'Add' for a sample"
              className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-4 mb-3">
            <div className="flex-1">
              <label className="text-xs text-muted-foreground block mb-1">Opacity</label>
              <Slider 
                value={[opacity]} 
                min={0.1} 
                max={1} 
                step={0.1}
                onValueChange={(value) => setOpacity(value[0])}
              />
            </div>
            
            <div className="flex-1">
              <label className="text-xs text-muted-foreground block mb-1">Scale</label>
              <Slider 
                value={[scale]} 
                min={0.5} 
                max={2} 
                step={0.1}
                onValueChange={(value) => setScale(value[0])}
              />
            </div>
          </div>
          
          <Button onClick={handleAddImage} className="w-full mb-4">
            <Image className="h-4 w-4 mr-2" />
            Add Image at Current Time
          </Button>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">Image Overlays</h3>
          
          {imageOverlays.length === 0 ? (
            <div className="bg-muted/20 rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground">No image overlays added</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {imageOverlays.map(overlay => (
                <div 
                  key={overlay.id} 
                  className="p-2 bg-secondary/30 rounded-md flex items-center"
                >
                  <div className="h-10 w-10 bg-background rounded-sm mr-3 flex-shrink-0 overflow-hidden">
                    <img 
                      src={overlay.imageUrl} 
                      alt="" 
                      className="h-full w-full object-cover"
                      style={{ opacity: overlay.opacity }}
                    />
                  </div>
                  <div className="flex-grow">
                    <p className="text-xs text-muted-foreground">
                      {Math.floor(overlay.startTime)}s - {Math.floor(overlay.endTime)}s
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Scale: {overlay.scale.toFixed(1)} | Opacity: {overlay.opacity.toFixed(1)}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 text-muted-foreground hover:text-destructive flex-shrink-0"
                    onClick={() => dispatch(deleteImageOverlay(overlay.id))}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageOverlayControls;