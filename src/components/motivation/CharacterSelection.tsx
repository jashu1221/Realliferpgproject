import React from 'react';
import { getArchetypeIcon, getArchetypeColor } from '../../utils/characterIcons';
import { PREDEFINED_CHARACTERS, CharacterArchetype } from '../../types/character';

interface CharacterSelectionProps {
  onSelect: (archetype: CharacterArchetype) => void;
  selectedArchetype: CharacterArchetype;
}

export function CharacterSelection({ onSelect, selectedArchetype }: CharacterSelectionProps) {
  return (
    <div className="grid grid-cols-3 gap-6 p-6">
      {Object.values(CharacterArchetype).map((archetype) => {
        const character = PREDEFINED_CHARACTERS[archetype];
        const Icon = getArchetypeIcon(archetype);
        const color = getArchetypeColor(archetype);

        return (
          <button
            key={archetype}
            onClick={() => onSelect(archetype)}
            className="text-left p-6 rounded-xl bg-[#1A1B23]/50 border border-[#2A2B35]/50
              hover:border-[#4F46E5]/30 transition-all group relative overflow-hidden"
          >
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#4F46E5]/5 to-[#7C3AED]/5 
              opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative space-y-4">
              {/* Icon */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 
                  to-purple-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all" />
                <div className="relative w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500/10 
                  to-purple-500/10 border border-indigo-500/20 flex items-center justify-center 
                  transform group-hover:scale-105 transition-all">
                  <Icon className={`w-8 h-8 ${color}`} />
                </div>
              </div>

              {/* Character Info */}
              <div>
                <h3 className="text-lg font-bold text-white">{character.name}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${color} 
                    border border-current bg-current/10`}>
                    {character.archetype}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-400 line-clamp-3">{character.description}</p>

              {/* Stats Preview */}
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(character.stats).slice(0, 4).map(([stat, value]) => (
                  <div key={stat} className="flex items-center justify-between text-xs p-2 
                    rounded-lg bg-gray-800/30 border border-gray-700/50">
                    <span className="text-gray-400 capitalize">{stat}</span>
                    <span className={`font-medium ${color}`}>{value}</span>
                  </div>
                ))}
              </div>

              {/* Quote */}
              <div className="relative mt-4 p-3 rounded-lg bg-gray-800/30 border border-gray-700/50">
                <p className="text-xs text-gray-500 italic line-clamp-2">"{character.quote}"</p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}