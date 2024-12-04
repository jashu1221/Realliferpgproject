import React, { useState, useRef, useEffect } from 'react';
import { Edit2, X, Check } from 'lucide-react';
import { TimeBlock } from './types';
import { formatTime } from './utils';

interface TimeBlockCardProps {
  block: TimeBlock;
  onUpdate: (id: string, title: string) => void;
  onDelete: (id: string) => void;
}

export function TimeBlockCard({ block, onUpdate, onDelete }: TimeBlockCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(block.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editTitle.trim()) {
      onUpdate(block.id, editTitle);
      setIsEditing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditTitle(block.title);
      setIsEditing(false);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isEditing) {
      setIsEditing(true);
    }
  };

  return (
    <div className="p-2" onClick={handleClick}>
      {isEditing ? (
        <div className="space-y-2">
          <input
            ref={inputRef}
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleKeyPress}
            onBlur={handleSave}
            className="w-full bg-[#1A1B23]/50 border border-[#2A2B35]/50 rounded px-2 py-1
              text-sm text-gray-200 focus:outline-none focus:border-[#4F46E5]/30"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setEditTitle(block.title);
                setIsEditing(false);
              }}
              className="p-1 rounded hover:bg-[#2A2B35] text-gray-400"
            >
              <X className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSave();
              }}
              className="p-1 rounded hover:bg-[#2A2B35] text-[#4F46E5]"
            >
              <Check className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-white font-medium">{block.title}</div>
            <div className="text-xs text-gray-400">
              {formatTime(block.startTime)} - {formatTime(block.endTime)}
            </div>
          </div>
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
                setEditTitle(block.title);
              }}
              className="p-1 rounded-lg hover:bg-[#2A2B35] text-gray-400"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(block.id);
              }}
              className="p-1 rounded-lg hover:bg-[#2A2B35] text-gray-400"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}