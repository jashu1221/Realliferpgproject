import React, { useState } from 'react';
import { Plus, X, Target, Shield } from 'lucide-react';

interface HitLevel {
  hits: number;
  title: string;
  difficulty: 'Show Up' | 'Easy' | 'Medium' | 'Hard';
}

interface HitLevelsProps {
  hitLevels: HitLevel[];
  onUpdateHitLevels: (hitLevels: HitLevel[]) => void;
}

export function HitLevels({ hitLevels, onUpdateHitLevels }: HitLevelsProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHitLevel, setNewHitLevel] = useState<HitLevel>({
    hits: hitLevels.length + 1,
    title: '',
    difficulty: 'Show Up'
  });

  const difficultyColors = {
    'Show Up': 'bg-green-500/20 text-green-400 border-green-500/30',
    'Easy': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'Medium': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'Hard': 'bg-red-500/20 text-red-400 border-red-500/30'
  };

  const handleAddHitLevel = () => {
    if (newHitLevel.title && hitLevels.length < 4) {
      onUpdateHitLevels([...hitLevels, newHitLevel]);
      setNewHitLevel({
        hits: hitLevels.length + 2,
        title: '',
        difficulty: 'Show Up'
      });
      setShowAddForm(false);
    }
  };

  const handleRemoveHitLevel = (index: number) => {
    const updatedLevels = hitLevels.filter((_, i) => i !== index).map((level, i) => ({
      ...level,
      hits: i + 1
    }));
    onUpdateHitLevels(updatedLevels);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-400 flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#4F46E5]" />
          Hit Levels
        </h3>
        {hitLevels.length < 4 && (
          <button
            onClick={() => setShowAddForm(true)}
            className="text-sm px-2 py-1 rounded-lg bg-[#4F46E5]/10 text-[#4F46E5] 
              hover:bg-[#4F46E5]/20 transition-all flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Add Level
          </button>
        )}
      </div>

      <div className="space-y-2">
        {hitLevels.map((level, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-3 rounded-lg bg-[#2A2B35]/30 
              border border-[#2A2B35]/50 group hover:border-[#4F46E5]/30 transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-[#4F46E5]/10 flex items-center justify-center
              border border-[#4F46E5]/20">
              <span className="text-sm font-medium text-[#4F46E5]">{level.hits}</span>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-200">{level.title}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  difficultyColors[level.difficulty]
                } border`}>
                  {level.difficulty}
                </span>
              </div>
            </div>

            <button
              onClick={() => handleRemoveHitLevel(index)}
              className="p-1 rounded-lg hover:bg-[#2A2B35] text-gray-400 
                opacity-0 group-hover:opacity-100 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}

        {showAddForm && (
          <div className="p-4 rounded-lg bg-[#2A2B35]/30 border border-[#2A2B35]/50 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#4F46E5]/10 flex items-center justify-center
                border border-[#4F46E5]/20">
                <span className="text-sm font-medium text-[#4F46E5]">{newHitLevel.hits}</span>
              </div>
              
              <input
                type="text"
                value={newHitLevel.title}
                onChange={(e) => setNewHitLevel({ ...newHitLevel, title: e.target.value })}
                placeholder="Level description (e.g., '30 minutes')"
                className="flex-1 bg-[#1A1B23]/50 border border-[#2A2B35]/50 rounded-lg px-3 py-2
                  text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none 
                  focus:border-[#4F46E5]/50"
              />
            </div>

            <div className="flex gap-2">
              {(['Show Up', 'Easy', 'Medium', 'Hard'] as const).map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() => setNewHitLevel({ ...newHitLevel, difficulty })}
                  className={`flex-1 px-3 py-1.5 rounded-lg border text-sm transition-all ${
                    newHitLevel.difficulty === difficulty
                      ? difficultyColors[difficulty]
                      : 'border-[#2A2B35]/50 text-gray-400 hover:text-gray-300'
                  }`}
                >
                  {difficulty}
                </button>
              ))}
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 rounded-lg text-gray-400 
                  hover:bg-[#2A2B35]/50 transition-all text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleAddHitLevel}
                className="px-3 py-1.5 rounded-lg bg-[#4F46E5]/10 text-[#4F46E5] 
                  hover:bg-[#4F46E5]/20 transition-all text-sm"
              >
                Add Level
              </button>
            </div>
          </div>
        )}

        {hitLevels.length === 0 && !showAddForm && (
          <div className="text-center p-6 border border-dashed border-[#2A2B35]/50 rounded-lg">
            <Target className="w-8 h-8 text-gray-500 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No hit levels defined yet</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-2 text-sm text-[#4F46E5] hover:text-[#4F46E5]/80"
            >
              Add your first level
            </button>
          </div>
        )}
      </div>
    </div>
  );
}