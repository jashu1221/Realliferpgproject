import React, { useState } from 'react';
import { Plus, Target, Tags, Calendar, X, Check } from 'lucide-react';
import HabitModalSnooze from './HabitModalSnooze';

interface HitLevel {
  hits: number;
  title: string;
  difficulty: 'Show Up' | 'Easy' | 'Medium' | 'Hard';
}

interface HabitModalDetailsProps {
  hitLevels: HitLevel[];
  title: string;
  note: string;
  linkedGoals: string[];
  selectedTags: string[];
  priority: 'low' | 'medium' | 'high';
  difficulty: 'easy' | 'medium' | 'hard';
  frequency: 'daily' | 'weekly' | 'custom';
  snoozeUntil: string;
  snoozeReason: string;
  onUpdateHitLevels: (hitLevels: HitLevel[]) => void;
  onUpdateLinkedGoals: (goals: string[]) => void;
  onUpdateTags: (tags: string[]) => void;
  onUpdatePriority: (priority: 'low' | 'medium' | 'high') => void;
  onUpdateDifficulty: (difficulty: 'easy' | 'medium' | 'hard') => void;
  onUpdateFrequency: (frequency: 'daily' | 'weekly' | 'custom') => void;
  onUpdateSnooze: (until: string, reason?: string) => void;
}

export function HabitModalDetails({
  hitLevels,
  selectedTags,
  priority,
  difficulty,
  frequency,
  snoozeUntil,
  snoozeReason,
  onUpdateHitLevels,
  onUpdateTags,
  onUpdatePriority,
  onUpdateDifficulty,
  onUpdateFrequency,
  onUpdateSnooze
}: HabitModalDetailsProps) {
  const [newTag, setNewTag] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);
  const [showHitLevelForm, setShowHitLevelForm] = useState(false);
  const [newHitLevel, setNewHitLevel] = useState<HitLevel>({
    hits: 1,
    title: '',
    difficulty: 'Show Up'
  });

  const priorityColors = {
    low: 'bg-green-500/20 text-green-400 border-green-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    high: 'bg-red-500/20 text-red-400 border-red-500/30'
  };

  const difficultyColors = {
    easy: 'bg-green-500/20 text-green-400 border-green-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    hard: 'bg-red-500/20 text-red-400 border-red-500/30'
  };

  const frequencyColors = {
    daily: 'bg-[#4F46E5]/20 text-[#4F46E5] border-[#4F46E5]/30',
    weekly: 'bg-[#4F46E5]/20 text-[#4F46E5] border-[#4F46E5]/30',
    custom: 'bg-[#4F46E5]/20 text-[#4F46E5] border-[#4F46E5]/30'
  };

  const handleAddTag = () => {
    if (newTag && !selectedTags.includes(newTag)) {
      onUpdateTags([...selectedTags, newTag]);
      setNewTag('');
      setShowTagInput(false);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onUpdateTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTag();
    }
  };

  const handleAddHitLevel = () => {
    if (newHitLevel.title && hitLevels.length < 4) {
      onUpdateHitLevels([...hitLevels, { ...newHitLevel, hits: hitLevels.length + 1 }]);
      setNewHitLevel({
        hits: 1,
        title: '',
        difficulty: 'Show Up'
      });
      setShowHitLevelForm(false);
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
    <div className="space-y-6">
      {/* Priority & Difficulty */}
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm text-gray-400">Priority</label>
          <div className="flex gap-2">
            {(['low', 'medium', 'high'] as const).map((p) => (
              <button
                key={p}
                onClick={() => onUpdatePriority(p)}
                className={`flex-1 px-3 py-2 rounded-lg border capitalize transition-all ${
                  priority === p
                    ? priorityColors[p]
                    : 'border-[#2A2B35]/50 text-gray-400 hover:text-gray-300'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-400">Difficulty</label>
          <div className="flex gap-2">
            {(['easy', 'medium', 'hard'] as const).map((d) => (
              <button
                key={d}
                onClick={() => onUpdateDifficulty(d)}
                className={`flex-1 px-3 py-2 rounded-lg border capitalize transition-all ${
                  difficulty === d
                    ? difficultyColors[d]
                    : 'border-[#2A2B35]/50 text-gray-400 hover:text-gray-300'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Frequency */}
      <div className="space-y-2">
        <label className="text-sm text-gray-400">Frequency</label>
        <div className="flex gap-2">
          {(['daily', 'weekly', 'custom'] as const).map((f) => (
            <button
              key={f}
              onClick={() => onUpdateFrequency(f)}
              className={`flex-1 px-3 py-2 rounded-lg border capitalize transition-all ${
                frequency === f
                  ? frequencyColors[f]
                  : 'border-[#2A2B35]/50 text-gray-400 hover:text-gray-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Snooze */}
      <div className="space-y-3">
        <HabitModalSnooze
          snoozeUntil={snoozeUntil}
          snoozeReason={snoozeReason}
          onUpdateSnooze={onUpdateSnooze}
        />
      </div>

      {/* Tags */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-400 flex items-center gap-2">
            <Tags className="w-4 h-4 text-[#4F46E5]" />
            Tags
          </h3>
          <button
            onClick={() => setShowTagInput(true)}
            className="text-sm px-2 py-1 rounded-lg bg-[#4F46E5]/10 text-[#4F46E5] 
              hover:bg-[#4F46E5]/20 transition-all flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Add Tag
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <div
              key={tag}
              className="px-3 py-1 rounded-full border bg-[#4F46E5]/10 text-[#4F46E5] 
                border-[#4F46E5]/30 text-sm flex items-center gap-2 group"
            >
              <span>{tag}</span>
              <button
                onClick={() => handleRemoveTag(tag)}
                className="text-[#4F46E5] hover:text-[#4F46E5]/80"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          {showTagInput && (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="New tag"
                className="bg-[#2A2B35]/30 border border-[#2A2B35]/50 rounded-lg px-3 py-1.5
                  text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none 
                  focus:border-[#4F46E5]/50"
              />
              <button
                onClick={handleAddTag}
                className="p-1.5 rounded-lg hover:bg-[#2A2B35]/50 text-[#4F46E5]"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowTagInput(false)}
                className="p-1.5 rounded-lg hover:bg-[#2A2B35]/50 text-gray-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Hit Levels */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-400">Hit Levels</h3>
          {hitLevels.length < 4 && (
            <button
              onClick={() => setShowHitLevelForm(true)}
              className="text-sm px-2 py-1 rounded-lg bg-[#4F46E5]/10 text-[#4F46E5] 
                hover:bg-[#4F46E5]/20 transition-all flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Add Level
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          {hitLevels.map((level, index) => (
            <div
              key={index}
              className="p-2 rounded-lg bg-[#1A1B23]/50 border border-[#2A2B35]/50
                group hover:border-[#4F46E5]/30 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className={`px-2 py-0.5 rounded text-sm ${
                  difficultyColors[level.difficulty.toLowerCase() as 'easy' | 'medium' | 'hard']
                }`}>
                  {level.difficulty}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">{level.hits} Hit{level.hits > 1 ? 's' : ''}</span>
                  <button
                    onClick={() => handleRemoveHitLevel(index)}
                    className="p-1 rounded-lg hover:bg-[#2A2B35] text-gray-400 
                      opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-300 mt-1">{level.title}</p>
            </div>
          ))}
        </div>

        {showHitLevelForm && (
          <div className="p-4 rounded-lg bg-[#2A2B35]/30 border border-[#2A2B35]/50 space-y-3">
            <input
              type="text"
              value={newHitLevel.title}
              onChange={(e) => setNewHitLevel({ ...newHitLevel, title: e.target.value })}
              placeholder="Level description (e.g., '30 minutes')"
              className="w-full bg-[#1A1B23]/50 border border-[#2A2B35]/50 rounded-lg px-3 py-2
                text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none 
                focus:border-[#4F46E5]/50"
            />

            <div className="flex gap-2">
              {(['Show Up', 'Easy', 'Medium', 'Hard'] as const).map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() => setNewHitLevel({ ...newHitLevel, difficulty })}
                  className={`flex-1 px-3 py-2 rounded-lg border text-sm transition-all ${
                    newHitLevel.difficulty === difficulty
                      ? difficultyColors[difficulty.toLowerCase() as 'easy' | 'medium' | 'hard']
                      : 'border-[#2A2B35]/50 text-gray-400 hover:text-gray-300'
                  }`}
                >
                  {difficulty}
                </button>
              ))}
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowHitLevelForm(false)}
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
      </div>
    </div>
  );
}