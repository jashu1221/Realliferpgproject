import React, { useState } from 'react';
import { Plus, Target, X } from 'lucide-react';

interface HitLevel {
  hits: number;
  description: string;
  difficulty: 'Show Up' | 'Easy' | 'Medium' | 'Hard';
}

interface Alternative {
  title: string;
  hitLevels: HitLevel[];
}

interface HabitModalAlternativesProps {
  alternatives: Alternative[];
  onUpdateAlternatives: (alternatives: Alternative[]) => void;
}

export function HabitModalAlternatives({
  alternatives,
  onUpdateAlternatives
}: HabitModalAlternativesProps) {
  const [newAlternative, setNewAlternative] = useState('');
  const [showAlternativeForm, setShowAlternativeForm] = useState(false);
  const [editingAlternative, setEditingAlternative] = useState<number | null>(null);
  const [newHitLevel, setNewHitLevel] = useState({
    hits: 1,
    description: '',
    difficulty: 'Show Up' as const
  });

  const difficultyColors = {
    'Show Up': 'bg-green-500/20 text-green-400 border-green-500/30',
    'Easy': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'Medium': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'Hard': 'bg-red-500/20 text-red-400 border-red-500/30'
  };

  const handleAddAlternative = () => {
    if (newAlternative.trim()) {
      onUpdateAlternatives([
        ...alternatives,
        {
          title: newAlternative,
          hitLevels: []
        }
      ]);
      setNewAlternative('');
      setShowAlternativeForm(false);
    }
  };

  const handleAddHitLevel = (alternativeIndex: number) => {
    if (newHitLevel.description) {
      const updatedAlternatives = [...alternatives];
      const alternative = updatedAlternatives[alternativeIndex];
      
      if (alternative.hitLevels.length < 4) {
        alternative.hitLevels.push({
          ...newHitLevel,
          hits: alternative.hitLevels.length + 1
        });
        onUpdateAlternatives(updatedAlternatives);
        setNewHitLevel({
          hits: 1,
          description: '',
          difficulty: 'Show Up'
        });
      }
    }
  };

  const handleRemoveAlternative = (index: number) => {
    onUpdateAlternatives(alternatives.filter((_, i) => i !== index));
  };

  const handleRemoveHitLevel = (alternativeIndex: number, hitLevelIndex: number) => {
    const updatedAlternatives = [...alternatives];
    updatedAlternatives[alternativeIndex].hitLevels.splice(hitLevelIndex, 1);
    onUpdateAlternatives(updatedAlternatives);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Alternative Ways to Complete</h3>
        <button
          onClick={() => setShowAlternativeForm(true)}
          className="px-3 py-1.5 rounded-lg bg-[#4F46E5]/10 text-[#4F46E5] 
            hover:bg-[#4F46E5]/20 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Alternative
        </button>
      </div>

      <div className="space-y-4">
        {alternatives.map((alt, altIndex) => (
          <div
            key={altIndex}
            className="p-4 rounded-lg bg-[#2A2B35]/30 border border-[#2A2B35]/50 space-y-4"
          >
            <div className="flex items-center justify-between">
              <input
                type="text"
                value={alt.title}
                onChange={(e) => {
                  const newAlternatives = [...alternatives];
                  newAlternatives[altIndex].title = e.target.value;
                  onUpdateAlternatives(newAlternatives);
                }}
                className="flex-1 bg-transparent text-white text-lg font-medium focus:outline-none
                  border-b border-transparent hover:border-[#4F46E5]/30 focus:border-[#4F46E5]
                  transition-colors px-2 py-1"
                placeholder="Alternative title"
              />
              <button
                onClick={() => handleRemoveAlternative(altIndex)}
                className="p-1.5 rounded-lg hover:bg-[#2A2B35] text-gray-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {alt.hitLevels.map((level, levelIndex) => (
                <div
                  key={levelIndex}
                  className="p-2 rounded-lg bg-[#1A1B23]/50 border border-[#2A2B35]/50
                    group hover:border-[#4F46E5]/30 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded text-sm ${difficultyColors[level.difficulty]}`}>
                      {level.difficulty}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">{level.hits} Hit{level.hits > 1 ? 's' : ''}</span>
                      <button
                        onClick={() => handleRemoveHitLevel(altIndex, levelIndex)}
                        className="p-1 rounded-lg hover:bg-[#2A2B35] text-gray-400 
                          opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 mt-1">{level.description}</p>
                </div>
              ))}
            </div>

            {alt.hitLevels.length < 4 && (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <select
                    value={newHitLevel.difficulty}
                    onChange={(e) => setNewHitLevel({
                      ...newHitLevel,
                      difficulty: e.target.value as HitLevel['difficulty']
                    })}
                    className="bg-[#1A1B23]/50 border border-[#2A2B35]/50 rounded-lg px-2 py-1
                      text-sm text-gray-300 focus:outline-none focus:border-[#4F46E5]/30"
                  >
                    {['Show Up', 'Easy', 'Medium', 'Hard'].map((diff) => (
                      <option key={diff} value={diff}>{diff}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={newHitLevel.description}
                    onChange={(e) => setNewHitLevel({
                      ...newHitLevel,
                      description: e.target.value
                    })}
                    placeholder="Description (e.g., '30 minutes')"
                    className="flex-1 bg-[#1A1B23]/50 border border-[#2A2B35]/50 rounded-lg px-2 py-1
                      text-sm text-gray-300 focus:outline-none focus:border-[#4F46E5]/30"
                  />
                  <button
                    onClick={() => handleAddHitLevel(altIndex)}
                    className="px-3 py-1 rounded-lg bg-[#4F46E5]/10 text-[#4F46E5]
                      hover:bg-[#4F46E5]/20 transition-all flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {showAlternativeForm && (
          <div className="p-4 rounded-lg bg-[#2A2B35]/30 border border-[#2A2B35]/50 space-y-3">
            <input
              type="text"
              value={newAlternative}
              onChange={(e) => setNewAlternative(e.target.value)}
              placeholder="Alternative title"
              className="w-full bg-[#1A1B23]/50 border border-[#2A2B35]/50 rounded-lg px-3 py-2
                text-gray-300 focus:outline-none focus:border-[#4F46E5]/30"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAlternativeForm(false)}
                className="px-3 py-1.5 rounded-lg text-gray-400 
                  hover:bg-[#2A2B35]/50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAlternative}
                className="px-3 py-1.5 rounded-lg bg-[#4F46E5]/10 text-[#4F46E5]
                  hover:bg-[#4F46E5]/20 transition-all"
              >
                Add Alternative
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}