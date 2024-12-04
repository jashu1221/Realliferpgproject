export enum CharacterArchetype {
  TYLER_DURDEN = 'tyler_durden',
  JAMES_BOND = 'james_bond',
  HARVEY_SPECTER = 'harvey_specter',
  ELON_MUSK = 'elon_musk',
  TONY_STARK = 'tony_stark',
  RAGNAR_LOTHBROK = 'ragnar_lothbrok'
}

export interface CharacterStats {
  leadership: number;
  charisma: number;
  intelligence: number;
  strength: number;
  willpower: number;
}

export interface Character {
  archetype: CharacterArchetype;
  name: string;
  description: string;
  quote: string;
  stats: CharacterStats;
  traits: string[];
  strengths: string[];
  weaknesses: string[];
}

export const PREDEFINED_CHARACTERS: Record<CharacterArchetype, Character> = {
  [CharacterArchetype.TYLER_DURDEN]: {
    archetype: CharacterArchetype.TYLER_DURDEN,
    name: 'Tyler Durden',
    description: 'The charismatic anarchist who challenges societal norms and consumer culture. A natural leader who inspires others to break free from their mundane existence.',
    quote: "You're not your job. You're not how much money you have in the bank.",
    stats: {
      leadership: 95,
      charisma: 90,
      intelligence: 85,
      strength: 88,
      willpower: 98
    },
    traits: ['Charismatic', 'Revolutionary', 'Fearless', 'Anti-materialistic', 'Philosophical'],
    strengths: ['Natural leadership', 'Psychological manipulation', 'Physical prowess', 'Unshakeable confidence'],
    weaknesses: ['Destructive tendencies', 'Extreme ideology', 'Disregard for consequences']
  },
  [CharacterArchetype.JAMES_BOND]: {
    archetype: CharacterArchetype.JAMES_BOND,
    name: 'James Bond',
    description: 'The sophisticated spy who combines charm, intelligence, and deadly skills. A master of adaptation and survival in any situation.',
    quote: "The name's Bond. James Bond.",
    stats: {
      leadership: 85,
      charisma: 95,
      intelligence: 90,
      strength: 85,
      willpower: 88
    },
    traits: ['Sophisticated', 'Resourceful', 'Composed', 'Strategic', 'Charming'],
    strengths: ['Expert tactician', 'Social engineering', 'Combat skills', 'Quick thinking'],
    weaknesses: ['Trust issues', 'Emotional detachment', 'Risk-taking']
  },
  [CharacterArchetype.HARVEY_SPECTER]: {
    archetype: CharacterArchetype.HARVEY_SPECTER,
    name: 'Harvey Specter',
    description: 'The brilliant corporate lawyer who combines wit, charm, and unparalleled negotiation skills. Winner takes all mentality.',
    quote: "I don't have dreams, I have goals.",
    stats: {
      leadership: 92,
      charisma: 95,
      intelligence: 95,
      strength: 75,
      willpower: 90
    },
    traits: ['Confident', 'Ambitious', 'Loyal', 'Strategic', 'Competitive'],
    strengths: ['Negotiation mastery', 'Strategic thinking', 'Emotional intelligence', 'Leadership'],
    weaknesses: ['Pride', 'Trust issues', 'Perfectionism']
  },
  [CharacterArchetype.ELON_MUSK]: {
    archetype: CharacterArchetype.ELON_MUSK,
    name: 'Elon Musk',
    description: 'The visionary entrepreneur pushing the boundaries of technology and human potential. Focused on advancing humanity through innovation.',
    quote: "When something is important enough, you do it even if the odds are not in your favor.",
    stats: {
      leadership: 88,
      charisma: 85,
      intelligence: 98,
      strength: 70,
      willpower: 95
    },
    traits: ['Visionary', 'Innovative', 'Determined', 'Risk-taker', 'Workaholic'],
    strengths: ['Technical genius', 'Long-term thinking', 'Problem-solving', 'Resilience'],
    weaknesses: ['Controversial communication', 'Work-life balance', 'Overcommitment']
  },
  [CharacterArchetype.TONY_STARK]: {
    archetype: CharacterArchetype.TONY_STARK,
    name: 'Tony Stark',
    description: 'The genius billionaire playboy philanthropist. Combines exceptional intelligence with charisma and unwavering determination.',
    quote: "Sometimes you gotta run before you can walk.",
    stats: {
      leadership: 85,
      charisma: 92,
      intelligence: 98,
      strength: 80,
      willpower: 88
    },
    traits: ['Genius', 'Charismatic', 'Innovative', 'Witty', 'Philanthropic'],
    strengths: ['Technical brilliance', 'Resource management', 'Adaptability', 'Leadership'],
    weaknesses: ['Ego', 'PTSD', 'Control issues']
  },
  [CharacterArchetype.RAGNAR_LOTHBROK]: {
    archetype: CharacterArchetype.RAGNAR_LOTHBROK,
    name: 'Ragnar Lothbrok',
    description: 'The legendary Viking leader who combines warrior prowess with strategic brilliance. A visionary who challenges tradition.',
    quote: "Power is always dangerous. It attracts the worst and corrupts the best.",
    stats: {
      leadership: 95,
      charisma: 90,
      intelligence: 88,
      strength: 95,
      willpower: 92
    },
    traits: ['Ambitious', 'Strategic', 'Fearless', 'Curious', 'Revolutionary'],
    strengths: ['Battle tactics', 'Innovation', 'Leadership', 'Physical prowess'],
    weaknesses: ['Pride', 'Family conflicts', 'Restlessness']
  }
};