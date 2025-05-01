import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Type, Text, AlignLeft, Trash2 } from 'lucide-react';
import { RootState } from '../store';
import { addSubtitle, addTextOverlay, deleteSubtitle, deleteTextOverlay, Subtitle, TextOverlay } from '../store/projectSlice';
import { Button } from './ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';

const TextOverlayControls: React.FC = () => {
  const dispatch = useDispatch();
  const { mainVideo, subtitles, textOverlays, currentTime, totalDuration } = 
    useSelector((state: RootState) => state.project);
  
  const [activeTab, setActiveTab] = useState('subtitles');
  const [subtitleText, setSubtitleText] = useState('');
  const [overlayText, setOverlayText] = useState('');
  const [textColor, setTextColor] = useState('#ffffff');
  const [fontSize, setFontSize] = useState(16);

  if (!mainVideo) {
    return (
      <div className="p-4 bg-card rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Text & Subtitles</h2>
        <div className="bg-muted/20 rounded-lg p-10 text-center">
          <p className="text-muted-foreground">Upload a video to add text</p>
        </div>
      </div>
    );
  }

  const handleAddSubtitle = () => {
    if (!subtitleText.trim()) return;
    
    const subtitle: Omit<Subtitle, 'id'> = {
      text: subtitleText,
      startTime: currentTime,
      endTime: Math.min(currentTime + 5, totalDuration), // Default 5 seconds duration
      fontSize: fontSize,
      fontColor: textColor,
      position: { x: 0.5, y: 0.9 } // Bottom center by default
    };
    
    dispatch(addSubtitle(subtitle));
    setSubtitleText('');
  };

  const handleAddTextOverlay = () => {
    if (!overlayText.trim()) return;
    
    const textOverlay: Omit<TextOverlay, 'id'> = {
      text: overlayText,
      startTime: currentTime,
      endTime: Math.min(currentTime + 5, totalDuration), // Default 5 seconds duration
      fontSize: fontSize,
      fontColor: textColor,
      position: { x: 0.5, y: 0.5 }, // Center by default
      rotation: 0
    };
    
    dispatch(addTextOverlay(textOverlay));
    setOverlayText('');
  };

  return (
    <div className="p-4 bg-card rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Text & Subtitles</h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full mb-4">
          <TabsTrigger value="subtitles" className="flex-1">
            <Text className="h-4 w-4 mr-1" />
            Subtitles
          </TabsTrigger>
          <TabsTrigger value="textOverlay" className="flex-1">
            <Type className="h-4 w-4 mr-1" />
            Text Overlay
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="subtitles">
          <div className="space-y-4">
            <div>
              <textarea
                placeholder="Enter subtitle text..."
                className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm resize-none"
                rows={2}
                value={subtitleText}
                onChange={(e) => setSubtitleText(e.target.value)}
              />
              
              <div className="flex space-x-2 mt-2">
                <div className="flex-grow">
                  <label className="text-xs text-muted-foreground">Font Color</label>
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-full h-8 rounded cursor-pointer"
                  />
                </div>
                
                <div className="flex-grow">
                  <label className="text-xs text-muted-foreground">Font Size</label>
                  <select
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full h-8 bg-background border border-input rounded-md text-sm"
                  >
                    <option value={12}>Small</option>
                    <option value={16}>Medium</option>
                    <option value={24}>Large</option>
                    <option value={32}>X-Large</option>
                  </select>
                </div>
              </div>
              
              <Button onClick={handleAddSubtitle} className="w-full mt-2">
                Add Subtitle at Current Time
              </Button>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Subtitles</h3>
              
              {subtitles.length === 0 ? (
                <div className="bg-muted/20 rounded-lg p-4 text-center">
                  <p className="text-sm text-muted-foreground">No subtitles added</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {subtitles.map(subtitle => (
                    <div 
                      key={subtitle.id} 
                      className="p-2 bg-secondary/30 rounded-md flex justify-between items-center"
                    >
                      <div className="flex-grow">
                        <p className="text-sm truncate" style={{ color: subtitle.fontColor }}>
                          {subtitle.text}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {Math.floor(subtitle.startTime)}s - {Math.floor(subtitle.endTime)}s
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 text-muted-foreground hover:text-destructive flex-shrink-0"
                        onClick={() => dispatch(deleteSubtitle(subtitle.id))}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="textOverlay">
          <div className="space-y-4">
            <div>
              <textarea
                placeholder="Enter text overlay..."
                className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm resize-none"
                rows={2}
                value={overlayText}
                onChange={(e) => setOverlayText(e.target.value)}
              />
              
              <div className="flex space-x-2 mt-2">
                <div className="flex-grow">
                  <label className="text-xs text-muted-foreground">Font Color</label>
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-full h-8 rounded cursor-pointer"
                  />
                </div>
                
                <div className="flex-grow">
                  <label className="text-xs text-muted-foreground">Font Size</label>
                  <select
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full h-8 bg-background border border-input rounded-md text-sm"
                  >
                    <option value={12}>Small</option>
                    <option value={16}>Medium</option>
                    <option value={24}>Large</option>
                    <option value={32}>X-Large</option>
                  </select>
                </div>
              </div>
              
              <Button onClick={handleAddTextOverlay} className="w-full mt-2">
                Add Text at Current Time
              </Button>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Text Overlays</h3>
              
              {textOverlays.length === 0 ? (
                <div className="bg-muted/20 rounded-lg p-4 text-center">
                  <p className="text-sm text-muted-foreground">No text overlays added</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {textOverlays.map(overlay => (
                    <div 
                      key={overlay.id} 
                      className="p-2 bg-secondary/30 rounded-md flex justify-between items-center"
                    >
                      <div className="flex-grow">
                        <p className="text-sm truncate" style={{ color: overlay.fontColor }}>
                          {overlay.text}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {Math.floor(overlay.startTime)}s - {Math.floor(overlay.endTime)}s
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 text-muted-foreground hover:text-destructive flex-shrink-0"
                        onClick={() => dispatch(deleteTextOverlay(overlay.id))}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TextOverlayControls;