import React from 'react';
import { useFocusMode } from '../contexts/FocusModeContext';

export function FocusOverlay() {
  const { isFocusMode } = useFocusMode();

  if (!isFocusMode) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B0E] via-transparent to-[#0A0B0E]/50" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A0B0E] via-transparent to-[#0A0B0E]" />
      
      {/* Vignette Effect */}
      <div className="absolute inset-0" 
        style={{
          background: 'radial-gradient(circle at center, transparent 30%, rgba(10, 11, 14, 0.5) 100%)'
        }} 
      />
    </div>
  );
}