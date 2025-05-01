import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Save, Settings, HelpCircle, Share2, FileVideo } from 'lucide-react';
import { RootState } from '../store';
import { setProjectName } from '../store/projectSlice';
import { showToast } from '../store/uiSlice';
import { Button } from './ui/button';

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const { projectName, mainVideo } = useSelector((state: RootState) => state.project);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(projectName);

  const handleSave = () => {
    // In a real app, this would save to a backend
    dispatch(showToast({
      message: 'Project saved successfully!',
      type: 'success'
    }));
  };

  const startEditingName = () => {
    setNameInput(projectName);
    setEditingName(true);
  };

  const saveName = () => {
    if (nameInput.trim()) {
      dispatch(setProjectName(nameInput.trim()));
    }
    setEditingName(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveName();
    }
  };

  return (
    <header className="bg-card border-b border-border p-4 flex items-center justify-between">
      <div className="flex items-center">
        <FileVideo className="h-6 w-6 text-primary mr-2" />
        
        {editingName ? (
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onBlur={saveName}
            onKeyDown={handleKeyDown}
            className="bg-background border border-input rounded-md px-2 py-1 text-lg font-semibold w-64"
            autoFocus
          />
        ) : (
          <h1 
            className="text-lg font-semibold cursor-pointer hover:text-primary"
            onClick={startEditingName}
            title="Click to edit project name"
          >
            {projectName}
          </h1>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="sm"
          disabled={!mainVideo}
          onClick={handleSave}
        >
          <Save className="h-4 w-4 mr-1" />
          Save
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
        >
          <Share2 className="h-4 w-4 mr-1" />
          Share
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
        >
          <HelpCircle className="h-5 w-5" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default Header;