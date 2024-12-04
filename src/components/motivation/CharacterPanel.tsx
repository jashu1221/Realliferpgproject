import React, { useState, useEffect } from 'react';
import { Shield, Star, ChevronRight, Target, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { CharacterSelection } from './CharacterSelection';
import { getArchetypeIcon, getArchetypeColor } from '../../utils/characterIcons';
import { CharacterArchetype } from '../../types/character';
import { useCharacter } from '../../hooks/useCharacter';

export function CharacterPanel() {
  const { 
    currentCharacter, 
    selectedCharacterIndex, 
    loading, 
    fetchSelectedCharacter,
    changeCharacter 
  } = useCharacter();
  const [showSelection, setShowSelection] = useState(false);

  useEffect(() => {
    fetchSelectedCharacter();
  }, [fetchSelectedCharacter]);

  if (loading || !currentCharacter) {
    return (
      <div className="bg-[#1A1B23]/95 border border-[#2A2B35]/50 rounded-xl p-6">
        <div className="animate-pulse flex space-x-4">
          <div className="w-14 h-14 bg-[#2A2B35]/50 rounded-xl"></div>
          <div className="flex-1 space-y-4">
            <div className="h-4 bg-[#2A2B35]/50 rounded w-3/4"></div>
            <div className="h-4 bg-[#2A2B35]/50 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  const ArchetypeIcon = getArchetypeIcon(currentCharacter.archetype);
  const archetypeColor = getArchetypeColor(currentCharacter.archetype);

  const handleCharacterSelect = async (archetype: CharacterArchetype) => {
    await changeCharacter(archetype);
    setShowSelection(false);
  };

  return (
    <div className="bg-[#1A1B23]/95 border border-[#2A2B35]/50 rounded-xl p-6 space-y-6">
      {/* Character Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-xl ${archetypeColor} bg-opacity-10 
            flex items-center justify-center border border-opacity-30`}>
            <ArchetypeIcon className={`w-7 h-7 ${archetypeColor}`} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{currentCharacter.name}</h2>
            <p className="text-sm text-gray-400">{currentCharacter.archetype}</p>
          </div>
        </div>
        <button
          onClick={() => setShowSelection(true)}
          className="p-2 rounded-lg bg-[#2A2B35]/30 text-gray-400 
            hover:bg-[#2A2B35]/50 transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Character Stats */}
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(currentCharacter.stats).map(([stat, value]) => (
          <div key={stat} className="bg-[#2A2B35]/30 rounded-lg p-4 border border-[#2A2B35]/50">
            <div className="text-sm text-gray-400 capitalize mb-2">
              {stat.replace(/([A-Z])/g, ' $1').trim()}
            </div>
            <div className="text-lg font-bold text-white">{value}</div>
          </div>
        ))}
      </div>

      {/* Character Description */}
      <div className="bg-[#2A2B35]/30 rounded-lg p-4 border border-[#2A2B35]/50">
        <p className="text-gray-400">{currentCharacter.description}</p>
      </div>

      {/* Character Traits */}
      <div>
        <h3 className="text-sm font-medium text-gray-400 mb-3">Character Traits</h3>
        <div className="flex flex-wrap gap-2">
          {currentCharacter.traits.map((trait, index) => (
            <div
              key={index}
              className={`px-3 py-1 rounded-full ${archetypeColor} bg-opacity-10 
                border border-opacity-30 text-sm`}
            >
              {trait}
            </div>
          ))}
        </div>
      </div>

      {/* Character Quote */}
      <div className="bg-[#2A2B35]/30 rounded-lg p-4 border border-[#2A2B35]/50">
        <blockquote className="text-gray-400 italic">"{currentCharacter.quote}"</blockquote>
      </div>

      <Dialog open={showSelection} onOpenChange={setShowSelection}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Select Your Character</DialogTitle>
          </DialogHeader>
          <CharacterSelection 
            onSelect={handleCharacterSelect}
            selectedArchetype={currentCharacter.archetype}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}