import React from 'react';
import { Shield, Star, TrendingUp, Brain, Zap, Heart } from 'lucide-react';
import { Character, CharacterStats } from '../../types/character';

interface CharacterCardProps {
  character: Character;
  isSelected: boolean;
  onSelect: () => void;
}

export function CharacterCard({ character, isSelected, onSelect }: CharacterCardProps) {
  const StatBar = ({ label, value }: { label: string; value: number }) => (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-400">{label}</span>
        <span className="text-[#4F46E5]">{value}</span>
      </div>
      <div className="h-1.5 bg-[#1A1B23] rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] rounded-full
            transition-all duration-300"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );

  return (
    <button
      onClick={onSelect}
      className={`w-full text-left p-4 rounded-xl border transition-all ${
        isSelected
          ? 'bg-[#4F46E5]/10 border-[#4F46E5]/30'
          : 'bg-[#1A1B23]/95 border-[#2A2B35]/50 hover:border-[#4F46E5]/20'
      }`}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-[#4F46E5]/20 
            to-[#7C3AED]/20 flex items-center justify-center border border-[#4F46E5]/20`}>
            <Shield className="w-6 h-6 text-[#4F46E5]" />
          </div>
          <div>
            <h3 className="font-bold text-white">{character.name}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              {character.traits.slice(0, 2).map((trait, index) => (
                <span key={index} className="text-xs text-gray-400">{trait}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Quote */}
        <blockquote className="text-sm text-gray-400 italic">"{character.quote}"</blockquote>

        {/* Stats */}
        <div className="space-y-2">
          <StatBar label="Leadership" value={character.stats.leadership} />
          <StatBar label="Charisma" value={character.stats.charisma} />
          <StatBar label="Intelligence" value={character.stats.intelligence} />
          <StatBar label="Strength" value={character.stats.strength} />
          <StatBar label="Willpower" value={character.stats.willpower} />
        </div>

        {/* Traits */}
        <div className="flex flex-wrap gap-2">
          {character.traits.map((trait, index) => (
            <span
              key={index}
              className="px-2 py-0.5 rounded-full text-xs bg-[#4F46E5]/10 text-[#4F46E5]"
            >
              {trait}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}