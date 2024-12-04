import React, { useState } from 'react';
import { Target, Plus, Star, ChevronDown, ChevronUp, X } from 'lucide-react';

interface Goal {
  id: string;
  title: string;
  category: string;
  emoji?: string;
  progress?: number;
  priority: 'low' | 'medium' | 'high';
}

interface LinkedGoalsProps {
  selectedGoals: string[];
  onUpdateGoals: (goals: string[]) => void;
}

const priorityColors = {
  low: 'bg-green-500/10 text-green-400 border-green-500/30',
  medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  high: 'bg-red-500/10 text-red-400 border-red-500/30'
};

const availableGoals: Goal[] = [
  {
    id: '1',
    title: 'Master System Design',
    category: 'Technical',
    emoji: '🚀',
    progress: 45,
    priority: 'high'
  },
  {
    id: '2',
    title: 'Build Portfolio Projects',
    category: 'Career',
    emoji: '💼',
    progress: 30,
    priority: 'medium'
  },
  {
    id: '3',
    title: 'Learn Cloud Architecture',
    category: 'Technical',
    emoji: '☁️',
    progress: 60,
    priority: 'high'
  },
  {
    id: '4',
    title: 'Improve Problem Solving',
    category: 'Skills',
    emoji: '🧩',
    progress: 75,
    priority: 'medium'
  }
];

export function LinkedGoals({ selectedGoals, onUpdateGoals }: LinkedGoalsProps) {
  const [showGoalsList, setShowGoalsList] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'technical' | 'career' | 'skills'>('all');

  const filteredGoals = availableGoals.filter(goal => {
    const matchesSearch = goal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         goal.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || goal.category.toLowerCase() === filter;
    return matchesSearch && matchesFilter;
  });

  const handleToggleGoal = (goalId: string) => {
    if (selectedGoals.includes(goalId)) {
      onUpdateGoals(selectedGoals.filter(id => id !== goalId));
    } else {
      onUpdateGoals([...selectedGoals, goalId]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Target className="w-5 h-5 text-[#4F46E5]" />
          Linked Goals
        </h3>
        <button
          onClick={() => setShowGoalsList(!showGoalsList)}
          className="text-sm px-3 py-1.5 rounded-lg bg-[#4F46E5]/10 text-[#4F46E5] 
            hover:bg-[#4F46E5]/20 transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Link Goals
        </button>
      </div>

      {/* Selected Goals Display */}
      <div className="flex flex-wrap gap-2">
        {selectedGoals.length > 0 ? (
          availableGoals
            .filter(goal => selectedGoals.includes(goal.id))
            .map(goal => (
              <div
                key={goal.id}
                className="group relative flex items-center gap-2 px-3 py-2 rounded-lg
                  bg-[#2A2B35]/30 border border-[#2A2B35]/50 hover:border-[#4F46E5]/30
                  transition-all"
              >
                <span className="text-lg">{goal.emoji}</span>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-200">{goal.title}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">{goal.category}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColors[goal.priority]}`}>
                      {goal.priority}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleGoal(goal.id)}
                  className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500/20 
                    text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))
        ) : (
          <p className="text-sm text-gray-400 py-2">No goals linked yet</p>
        )}
      </div>

      {/* Goals Selection Modal */}
      {showGoalsList && (
        <div className="mt-4 p-4 rounded-lg bg-[#2A2B35]/30 border border-[#2A2B35]/50 space-y-4">
          {/* Search and Filter */}
          <div className="flex gap-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search goals..."
              className="flex-1 bg-[#1A1B23]/50 border border-[#2A2B35]/50 rounded-lg px-3 py-2
                text-sm text-gray-300 focus:outline-none focus:border-[#4F46E5]/30
                placeholder:text-gray-500"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as typeof filter)}
              className="bg-[#1A1B23]/50 border border-[#2A2B35]/50 rounded-lg px-3 py-2
                text-sm text-gray-300 focus:outline-none focus:border-[#4F46E5]/30"
            >
              <option value="all">All Categories</option>
              <option value="technical">Technical</option>
              <option value="career">Career</option>
              <option value="skills">Skills</option>
            </select>
          </div>

          {/* Goals List */}
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
            {filteredGoals.map(goal => (
              <div
                key={goal.id}
                onClick={() => handleToggleGoal(goal.id)}
                className={`flex items-center gap-4 p-3 rounded-lg border cursor-pointer
                  transition-all ${
                  selectedGoals.includes(goal.id)
                    ? 'bg-[#4F46E5]/10 border-[#4F46E5]/30'
                    : 'bg-[#1A1B23]/50 border-[#2A2B35]/50 hover:border-[#4F46E5]/20'
                }`}
              >
                {/* Goal Icon */}
                <div className="w-10 h-10 rounded-lg bg-[#2A2B35]/30 flex items-center justify-center">
                  <span className="text-xl">{goal.emoji}</span>
                </div>

                {/* Goal Info */}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium text-gray-200">{goal.title}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">{goal.category}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColors[goal.priority]}`}>
                          {goal.priority}
                        </span>
                      </div>
                    </div>
                    {goal.progress !== undefined && (
                      <div className="flex items-center gap-1 text-xs text-[#4F46E5]">
                        <Star className="w-3.5 h-3.5" />
                        <span>{goal.progress}%</span>
                      </div>
                    )}
                  </div>

                  {/* Progress Bar */}
                  {goal.progress !== undefined && (
                    <div className="mt-2 h-1.5 bg-[#1A1B23] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] rounded-full
                          transition-all duration-300"
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Selection Indicator */}
                <div className={`w-5 h-5 rounded-full border transition-all flex items-center 
                  justify-center ${
                  selectedGoals.includes(goal.id)
                    ? 'bg-[#4F46E5]/20 border-[#4F46E5] text-[#4F46E5]'
                    : 'border-[#2A2B35]/50'
                }`}>
                  {selectedGoals.includes(goal.id) && (
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-2 border-t border-[#2A2B35]/50">
            <button
              onClick={() => setShowGoalsList(false)}
              className="px-3 py-1.5 rounded-lg text-sm text-gray-400 
                hover:bg-[#2A2B35]/50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={() => setShowGoalsList(false)}
              className="px-3 py-1.5 rounded-lg text-sm bg-[#4F46E5]/10 text-[#4F46E5]
                hover:bg-[#4F46E5]/20 transition-all"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}