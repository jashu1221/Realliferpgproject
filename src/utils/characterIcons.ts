import { 
  Shield, 
  Crown, 
  Brain, 
  Rocket, 
  Hammer, 
  Sword,
  type LucideIcon 
} from 'lucide-react';
import { CharacterArchetype } from '../types/character';

export const getArchetypeIcon = (archetype: CharacterArchetype): LucideIcon => {
  const icons: Record<CharacterArchetype, LucideIcon> = {
    [CharacterArchetype.TYLER_DURDEN]: Shield,
    [CharacterArchetype.JAMES_BOND]: Crown,
    [CharacterArchetype.HARVEY_SPECTER]: Brain,
    [CharacterArchetype.ELON_MUSK]: Rocket,
    [CharacterArchetype.TONY_STARK]: Hammer,
    [CharacterArchetype.RAGNAR_LOTHBROK]: Sword
  };

  return icons[archetype] || Shield;
};

export const getArchetypeColor = (archetype: CharacterArchetype): string => {
  const colors: Record<CharacterArchetype, string> = {
    [CharacterArchetype.TYLER_DURDEN]: 'text-red-500',
    [CharacterArchetype.JAMES_BOND]: 'text-blue-500',
    [CharacterArchetype.HARVEY_SPECTER]: 'text-purple-500',
    [CharacterArchetype.ELON_MUSK]: 'text-green-500',
    [CharacterArchetype.TONY_STARK]: 'text-yellow-500',
    [CharacterArchetype.RAGNAR_LOTHBROK]: 'text-orange-500'
  };

  return colors[archetype] || 'text-gray-500';
};

export const getArchetypeDescription = (archetype: CharacterArchetype): string => {
  const descriptions: Record<CharacterArchetype, string> = {
    [CharacterArchetype.TYLER_DURDEN]: 'The charismatic anarchist who challenges societal norms',
    [CharacterArchetype.JAMES_BOND]: 'The sophisticated spy with deadly skills and charm',
    [CharacterArchetype.HARVEY_SPECTER]: 'The brilliant lawyer who never settles for less',
    [CharacterArchetype.ELON_MUSK]: 'The visionary entrepreneur pushing technological boundaries',
    [CharacterArchetype.TONY_STARK]: 'The genius billionaire with unmatched innovation',
    [CharacterArchetype.RAGNAR_LOTHBROK]: 'The legendary Viking leader with strategic brilliance'
  };

  return descriptions[archetype] || 'Unknown archetype';
};