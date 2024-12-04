import React from 'react';
import { Star, Clock, Trophy, Target, Sparkles } from 'lucide-react';

interface QuestCardProps {
  title: string;
  points: number;
  multiplier: number;
  rarity: 'common' | 'rare' | 'legendary';
  daysLeft: number;
  difficulty: 'E' | 'D' | 'C' | 'B' | 'A' | 'S';
  isNew?: boolean;
  isAccepted?: boolean;
  onAccept?: () => void;
}

const rarityConfig = {
  common: {
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    textColor: 'text-blue-400',
  },
  rare: {
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
    textColor: 'text-purple-400',
  },
  legendary: {
    bgColor: 'bg-[#D4AF37]/10',
    borderColor: 'border-[#D4AF37]/20',
    textColor: 'text-[#D4AF37]',
  },
};

const difficultyColors = {
  'S': 'text-red-400 border-red-500/30 bg-red-500/10',
  'A': 'text-[#D4AF37] border-[#D4AF37]/30 bg-[#D4AF37]/10',
  'B': 'text-purple-400 border-purple-500/30 bg-purple-500/10',
  'C': 'text-blue-400 border-blue-500/30 bg-blue-500/10',
  'D': 'text-green-400 border-green-500/30 bg-green-500/10',
  'E': 'text-gray-400 border-gray-500/30 bg-gray-500/10',
};

export function QuestCard({
  title,
  points,
  multiplier,
  rarity,
  daysLeft,
  difficulty,
  isNew = false,
  isAccepted = false,
  onAccept
}: QuestCardProps) {
  const rarityStyle = rarityConfig[rarity];

  return (
    <div className={`relative overflow-hidden rounded-lg border transition-all group
      bg-[#1A1B23]/95 backdrop-blur-sm ${isAccepted ? 'border-[#4F46E5]/30' : 'border-[#2A2B35]/50'}
      hover:border-[#4F46E5]/30`}>
      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`px-2 py-1 rounded text-xs font-bold ${difficultyColors[difficulty]}`}>
              {difficulty}
            </div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium text-white">{title}</h3>
              {isNew && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-blue-500/10 
                  text-blue-400 border border-blue-500/20 uppercase tracking-wide font-medium">
                  New
                </span>
              )}
            </div>
          </div>
          <div className={`px-2 py-1 rounded-lg text-[10px] font-medium uppercase tracking-wider
            ${rarityStyle.bgColor} ${rarityStyle.textColor} ${rarityStyle.borderColor} border
            flex items-center gap-1.5`}>
            {rarity === 'legendary' && <Sparkles className="w-3 h-3" />}
            {rarity}
          </div>
        </div>

        {/* Details */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Points */}
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-md bg-[#D4AF37]/10 flex items-center justify-center">
                <Star className="w-3 h-3 text-[#D4AF37]" />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium text-[#D4AF37]">{points}</span>
                <span className="text-[10px] text-gray-500 font-medium">XP</span>
              </div>
            </div>

            {/* Multiplier */}
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-md bg-[#4F46E5]/10 flex items-center justify-center">
                <Trophy className="w-3 h-3 text-[#4F46E5]" />
              </div>
              <span className="text-sm font-medium text-[#4F46E5]">{multiplier}x</span>
            </div>

            {/* Days Left */}
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-md bg-red-500/10 flex items-center justify-center">
                <Clock className="w-3 h-3 text-red-400" />
              </div>
              <span className="text-sm font-medium text-red-400">{daysLeft}d</span>
            </div>
          </div>

          {!isAccepted && (
            <button
              onClick={onAccept}
              className="px-3 py-1.5 rounded-lg bg-[#4F46E5]/10 text-[#4F46E5] text-xs
                hover:bg-[#4F46E5]/20 transition-all border border-[#4F46E5]/30
                flex items-center gap-1.5"
            >
              <Target className="w-3.5 h-3.5" />
              Accept Quest
            </button>
          )}
        </div>
      </div>

      {/* Progress Indicator (Only for accepted quests) */}
      {isAccepted && (
        <div className="h-0.5 bg-[#1A1B23]">
          <div 
            className="h-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED]
              transition-all duration-300 relative overflow-hidden"
            style={{ width: '60%' }}
          >
            <div 
              className="absolute inset-0 w-full h-full animate-shine"
              style={{
                background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.1) 50%, transparent)',
                transform: 'skewX(-20deg)',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}