import React, { useState } from 'react';
import { CharacterCard } from './CharacterCard';
import {
  Character,
  CharacterArchetype,
  PREDEFINED_CHARACTERS,
} from '../../types/character';

interface CharacterSelectionProps {
  onSelect?: () => void;
}

export function CharacterSelection({ onSelect }: CharacterSelectionProps) {
  const [selectedArchetype, setSelectedArchetype] =
    useState<CharacterArchetype | null>(null);

  const handleSelect = async (archetype: CharacterArchetype) => {
    try {
      const characterData = PREDEFINED_CHARACTERS[archetype];
      setSelectedArchetype(archetype);
      onSelect?.();
    } catch (error) {
      console.error('Error selecting character:', error);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {Object.values(CharacterArchetype).map((archetype) => (
        <CharacterCard
          key={archetype}
          character={PREDEFINED_CHARACTERS[archetype] as Character}
          isSelected={selectedArchetype === archetype}
          onSelect={() => handleSelect(archetype)}
        />
      ))}
    </div>
  );
}
