import React, { useState } from 'react';
import { 
  Brain, Heart, Users, Zap, Crown, Shield, Plus, Save, 
  ArrowLeft, Trash2, Edit2, Check, X 
} from 'lucide-react';

interface CharacterStats {
  personality: number;
  socialCharm: number;
  healthFitness: number;
  intelligence: number;
  discipline: number;
}

interface Character {
  id: string;
  name: string;
  icon: typeof Shield;
  stats: CharacterStats;
  archetype: string;
  description: string;
  keyTraits: string[];
  references: string[];
  quote: string;
}

const getRankFromStat = (value: number): string => {
  if (value === 10) return 'S';
  if (value >= 8) return 'A';
  if (value >= 6) return 'B';
  if (value >= 4) return 'C';
  if (value >= 2) return 'D';
  return 'E';
};

const getStatColor = (value: number): string => {
  if (value === 10) return 'text-red-400';
  if (value >= 8) return 'text-[#D4AF37]';
  if (value >= 6) return 'text-purple-400';
  if (value >= 4) return 'text-blue-400';
  if (value >= 2) return 'text-green-400';
  return 'text-gray-400';
};

const predefinedCharacters: Character[] = [
  {
    id: 'tyler',
    name: 'Tyler Durden',
    icon: Shield,
    stats: {
      personality: 10,
      socialCharm: 9,
      healthFitness: 9,
      intelligence: 8,
      discipline: 10
    },
    archetype: 'Alpha Revolutionary',
    description: `The embodiment of primal masculinity and anarchic freedom. Tyler represents the rejection of societal constraints and the embrace of authentic self-expression. He combines raw charisma with calculated intelligence, making him a natural leader who inspires others to break free from their mundane existence.`,
    keyTraits: [
      'Unshakeable confidence',
      'Natural leadership',
      'Physical prowess',
      'Psychological manipulation',
      'Zero fear of consequences'
    ],
    references: [
      'Fight Club',
      'Project Mayhem Leader',
      'Anti-consumerist Icon'
    ],
    quote: "You're not your job. You're not how much money you have in the bank."
  },
  {
    id: 'sigma',
    name: 'Sigma Wolf',
    icon: Crown,
    stats: {
      personality: 8,
      socialCharm: 7,
      healthFitness: 9,
      intelligence: 9,
      discipline: 10
    },
    archetype: 'Lone Wolf',
    description: `The ultimate self-made success archetype who operates outside traditional hierarchies. Combines high intelligence with strategic thinking and unwavering self-discipline. Values independence and personal achievement over social validation.`,
    keyTraits: [
      'Self-reliant',
      'Strategic mindset',
      'Emotional control',
      'Goal-oriented',
      'Independent thinking'
    ],
    references: [
      'John Wick',
      'Thomas Shelby',
      'Lone Wolf Mentality'
    ],
    quote: "I don't follow the path, I make it."
  }
];

export function CharacterEditor({ onClose, onSave, initialCharacter = null }: {
  onClose: () => void;
  onSave: (character: Character) => void;
  initialCharacter?: Character | null;
}) {
  const [character, setCharacter] = useState<Character>(initialCharacter || {
    id: Date.now().toString(),
    name: '',
    icon: Shield,
    stats: {
      personality: 5,
      socialCharm: 5,
      healthFitness: 5,
      intelligence: 5,
      discipline: 5
    },
    archetype: '',
    description: '',
    keyTraits: [],
    references: [],
    quote: ''
  });

  const [newTrait, setNewTrait] = useState('');
  const [newReference, setNewReference] = useState('');
  const [editMode, setEditMode] = useState(!initialCharacter);

  const handleStatChange = (stat: keyof CharacterStats, value: number) => {
    setCharacter(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        [stat]: Math.max(1, Math.min(10, value))
      }
    }));
  };

  const handleAddTrait = () => {
    if (newTrait && character.keyTraits.length < 5) {
      setCharacter(prev => ({
        ...prev,
        keyTraits: [...prev.keyTraits, newTrait]
      }));
      setNewTrait('');
    }
  };

  const handleAddReference = () => {
    if (newReference) {
      setCharacter(prev => ({
        ...prev,
        references: [...prev.references, newReference]
      }));
      setNewReference('');
    }
  };

  const handleSave = () => {
    onSave(character);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-[#1A1B23]/95 border border-[#2A2B35]/50 rounded-xl w-full max-w-4xl 
        max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#1A1B23]/95 border-b border-[#2A2B35]/50 p-6 
          flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-[#2A2B35]/50 text-gray-400 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold text-white">
              {editMode ? 'Edit Character' : 'Character Details'}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="px-4 py-2 rounded-lg bg-[#4F46E5]/10 text-[#4F46E5] 
                  hover:bg-[#4F46E5]/20 transition-all flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 rounded-lg bg-[#4F46E5] text-white 
                    hover:bg-[#4338CA] transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="p-2 rounded-lg hover:bg-[#2A2B35]/50 text-gray-400 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Basic Info */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Character Name</label>
                <input
                  type="text"
                  value={character.name}
                  onChange={(e) => setCharacter(prev => ({ ...prev, name: e.target.value }))}
                  disabled={!editMode}
                  className="w-full bg-[#2A2B35]/30 border border-[#2A2B35]/50 rounded-lg px-4 py-3
                    text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-[#4F46E5]/50
                    disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Enter character name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Archetype</label>
                <input
                  type="text"
                  value={character.archetype}
                  onChange={(e) => setCharacter(prev => ({ ...prev, archetype: e.target.value }))}
                  disabled={!editMode}
                  className="w-full bg-[#2A2B35]/30 border border-[#2A2B35]/50 rounded-lg px-4 py-3
                    text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-[#4F46E5]/50
                    disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="e.g., Alpha Leader, Strategic Mastermind"
                />
              </div>
            </div>
          </section>

          {/* Stats */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Character Stats</h3>
            <div className="grid grid-cols-2 gap-6">
              {Object.entries(character.stats).map(([stat, value]) => (
                <div key={stat} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-400 capitalize">
                      {stat.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${getStatColor(value)}`}>
                        Rank {getRankFromStat(value)}
                      </span>
                      <span className="text-sm text-gray-400">({value}/10)</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={value}
                    onChange={(e) => handleStatChange(stat as keyof CharacterStats, parseInt(e.target.value))}
                    disabled={!editMode}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Description */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Character Description</h3>
            <textarea
              value={character.description}
              onChange={(e) => setCharacter(prev => ({ ...prev, description: e.target.value }))}
              disabled={!editMode}
              rows={4}
              maxLength={500}
              className="w-full bg-[#2A2B35]/30 border border-[#2A2B35]/50 rounded-lg px-4 py-3
                text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-[#4F46E5]/50
                resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Describe your character's personality and motivations..."
            />
            <div className="text-xs text-gray-500 text-right">
              {character.description.length}/500 characters
            </div>
          </section>

          {/* Key Traits */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Key Traits</h3>
              <span className="text-sm text-gray-400">
                {character.keyTraits.length}/5 traits
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {character.keyTraits.map((trait, index) => (
                <div
                  key={index}
                  className="px-3 py-1.5 rounded-lg bg-[#2A2B35]/30 border border-[#2A2B35]/50
                    text-gray-300 text-sm flex items-center gap-2 group"
                >
                  <span>{trait}</span>
                  {editMode && (
                    <button
                      onClick={() => setCharacter(prev => ({
                        ...prev,
                        keyTraits: prev.keyTraits.filter((_, i) => i !== index)
                      }))}
                      className="text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100
                        transition-opacity"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
              {editMode && character.keyTraits.length < 5 && (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newTrait}
                    onChange={(e) => setNewTrait(e.target.value)}
                    placeholder="Add trait"
                    className="bg-[#2A2B35]/30 border border-[#2A2B35]/50 rounded-lg px-3 py-1.5
                      text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none 
                      focus:border-[#4F46E5]/50"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTrait()}
                  />
                  <button
                    onClick={handleAddTrait}
                    className="p-1.5 rounded-lg hover:bg-[#2A2B35]/50 text-[#4F46E5]"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* References */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Character References</h3>
            <div className="flex flex-wrap gap-2">
              {character.references.map((ref, index) => (
                <div
                  key={index}
                  className="px-3 py-1.5 rounded-lg bg-[#2A2B35]/30 border border-[#2A2B35]/50
                    text-gray-300 text-sm flex items-center gap-2 group"
                >
                  <span>{ref}</span>
                  {editMode && (
                    <button
                      onClick={() => setCharacter(prev => ({
                        ...prev,
                        references: prev.references.filter((_, i) => i !== index)
                      }))}
                      className="text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100
                        transition-opacity"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
              {editMode && (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newReference}
                    onChange={(e) => setNewReference(e.target.value)}
                    placeholder="Add reference"
                    className="bg-[#2A2B35]/30 border border-[#2A2B35]/50 rounded-lg px-3 py-1.5
                      text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none 
                      focus:border-[#4F46E5]/50"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddReference()}
                  />
                  <button
                    onClick={handleAddReference}
                    className="p-1.5 rounded-lg hover:bg-[#2A2B35]/50 text-[#4F46E5]"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Quote */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Signature Quote</h3>
            <input
              type="text"
              value={character.quote}
              onChange={(e) => setCharacter(prev => ({ ...prev, quote: e.target.value }))}
              disabled={!editMode}
              className="w-full bg-[#2A2B35]/30 border border-[#2A2B35]/50 rounded-lg px-4 py-3
                text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-[#4F46E5]/50
                disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Enter a memorable quote that defines your character..."
            />
          </section>
        </div>
      </div>
    </div>
  );
}