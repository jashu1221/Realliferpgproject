import React from 'react';
import { Volume2, VolumeX, Send } from 'lucide-react';

interface ChatControlsProps {
  input: string;
  isProcessing: boolean;
  voiceEnabled: boolean;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onToggleVoice: () => void;
  placeholder?: string;
}

export function ChatControls({
  input,
  isProcessing,
  voiceEnabled,
  onInputChange,
  onSend,
  onToggleVoice,
  placeholder
}: ChatControlsProps) {
  return (
    <div className="flex gap-2">
      <button
        onClick={onToggleVoice}
        className={`p-2 rounded-lg transition-colors ${
          voiceEnabled 
            ? 'bg-[#4F46E5]/10 text-[#4F46E5]' 
            : 'bg-[#2A2B35]/30 text-gray-400'
        }`}
        title={voiceEnabled ? 'Disable voice' : 'Enable voice'}
      >
        {voiceEnabled ? (
          <Volume2 className="w-5 h-5" />
        ) : (
          <VolumeX className="w-5 h-5" />
        )}
      </button>

      <input
        type="text"
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && onSend()}
        placeholder={placeholder}
        className="flex-1 bg-[#2A2B35]/50 border border-[#2A2B35]/50 rounded-lg px-4 py-2
          text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-[#4F46E5]/50"
      />

      <button
        onClick={onSend}
        disabled={isProcessing}
        className="p-2 rounded-lg bg-[#4F46E5] text-white hover:bg-[#4338CA] transition-colors
          transform hover:scale-105 hover:shadow-lg hover:shadow-[#4F46E5]/20 disabled:opacity-50
          disabled:cursor-not-allowed"
      >
        <Send className="w-5 h-5" />
      </button>
    </div>
  );
}