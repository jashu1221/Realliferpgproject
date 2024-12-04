import React from 'react';
import { ArrowRight, Star } from 'lucide-react';

interface RankProgressProps {
  currentXP: number;
  requiredXP: number;
  currentRank: string;
  nextRank: string;
}

export function RankProgress({ currentXP, requiredXP, currentRank, nextRank }: RankProgressProps) {
  const progress = (currentXP / requiredXP) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="text-[#4F46E5] font-medium animate-pulse">{currentRank}</span>
            <Star className="w-4 h-4 text-[#4F46E5]" />
          </div>
          <ArrowRight className="w-4 h-4 text-gray-500 animate-bounce" />
          <div className="flex items-center gap-1">
            <span className="text-[#D4AF37] font-medium">{nextRank}</span>
            <Star className="w-4 h-4 text-[#D4AF37]" />
          </div>
        </div>
        <span className="text-gray-400">
          {currentXP.toLocaleString()} / {requiredXP.toLocaleString()} XP
        </span>
      </div>

      <div className="h-3 bg-[#1A1B23] rounded-full overflow-hidden relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-25">
          <div className="w-full h-full bg-[#2A2B35]"
            style={{
              backgroundImage: 'linear-gradient(45deg, #2A2B35 25%, transparent 25%, transparent 75%, #2A2B35 75%, #2A2B35), linear-gradient(45deg, #2A2B35 25%, transparent 25%, transparent 75%, #2A2B35 75%, #2A2B35)',
              backgroundSize: '6px 6px',
              backgroundPosition: '0 0, 3px 3px'
            }}
          />
        </div>

        {/* Progress Bar */}
        <div 
          className="h-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] rounded-full
            transition-all duration-1000 relative overflow-hidden"
          style={{ width: `${progress}%` }}
        >
          {/* Shine Effect */}
          <div 
            className="absolute inset-0 w-full h-full animate-shine"
            style={{
              background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.2) 50%, transparent)',
              transform: 'skewX(-20deg)',
            }}
          />

          {/* Pulse Effect */}
          <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/50 animate-pulse" />
        </div>

        {/* Level Markers */}
        {[25, 50, 75].map((marker) => (
          <div
            key={marker}
            className="absolute top-0 bottom-0 w-px bg-[#2A2B35]/50"
            style={{ left: `${marker}%` }}
          >
            <div className={`absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full 
              ${progress >= marker ? 'bg-[#4F46E5]' : 'bg-[#2A2B35]'} 
              transition-colors duration-500`} 
              style={{ left: '-3px' }} 
            />
          </div>
        ))}
      </div>

      {/* Milestone Markers */}
      <div className="flex justify-between px-1 text-xs">
        {['Regional', 'State', 'National', 'Supreme'].map((milestone, index) => (
          <div key={milestone} 
            className={`transition-colors duration-500 ${
              progress >= index * 33.33 ? 'text-[#4F46E5]' : 'text-gray-500'
            }`}>
            {milestone}
          </div>
        ))}
      </div>
    </div>
  );
}