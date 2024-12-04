import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Plus, Star } from 'lucide-react';

interface HabitSuggestion {
  title: string;
  description: string;
  xp: number;
  difficulty: string;
}

interface LinkedHabit {
  title: string;
  progress: number;
  streak: number;
}

export function GoalSection() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const suggestedHabits: HabitSuggestion[] = [
    {
      title: 'Daily Code Review',
      description: 'Review and refactor code for 30 minutes',
      xp: 100,
      difficulty: 'Medium',
    },
    {
      title: 'Documentation Writing',
      description: 'Write technical documentation for 20 minutes',
      xp: 80,
      difficulty: 'Easy',
    },
    // Add more suggestions...
  ];

  const linkedHabits: LinkedHabit[] = [
    {
      title: 'System Design Practice',
      progress: 75,
      streak: 7,
    },
    {
      title: 'Algorithm Study',
      progress: 60,
      streak: 4,
    },
  ];

  const milestones = [
    { title: 'MVP Planning', completed: true },
    { title: 'Initial Development', completed: false },
    { title: 'Beta Testing', completed: false },
    { title: 'Launch', completed: false },
  ];

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="space-y-6 gpa">
      {/* Linked Habits */}
      <div className="card-dark">
        <button
          onClick={() => toggleSection('habits')}
          className="w-full flex items-center justify-between p-4"
        >
          <h3 className="text-lg font-semibold text-white">Linked Habits</h3>
          {expandedSection === 'habits' ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>

        {expandedSection === 'habits' && (
          <div className="p-4 pt-0 space-y-4">
            {linkedHabits.map((habit, index) => (
              <div
                key={index}
                className="bg-[#2A2B35]/30 rounded-lg p-3 border border-[#2A2B35]/50"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-medium">{habit.title}</h4>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-[#4F46E5]">{habit.streak} days</span>
                  </div>
                </div>
                <div className="h-1.5 bg-[#1A1B23] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] rounded-full"
                    style={{ width: `${habit.progress}%` }}
                  />
                </div>
              </div>
            ))}
            <button
              className="w-full p-2 rounded-lg border border-dashed border-[#4F46E5]/30 
              text-[#4F46E5] hover:bg-[#4F46E5]/10 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Link New Habit
            </button>
          </div>
        )}
      </div>

      {/* Suggested Habits */}
      <div className="card-dark">
        <button
          onClick={() => toggleSection('suggestions')}
          className="w-full flex items-center justify-between p-4"
        >
          <h3 className="text-lg font-semibold text-white">Suggested Habits</h3>
          {expandedSection === 'suggestions' ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>

        {expandedSection === 'suggestions' && (
          <div className="p-4 pt-0 space-y-4">
            {suggestedHabits.map((habit, index) => (
              <div
                key={index}
                className="bg-[#2A2B35]/30 rounded-lg p-3 border border-[#2A2B35]/50"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="text-white font-medium">{habit.title}</h4>
                    <p className="text-sm text-gray-400">{habit.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="px-2 py-1 rounded text-xs bg-[#4F46E5]/10 text-[#4F46E5]">
                      {habit.difficulty}
                    </div>
                    <div className="flex items-center gap-1 text-[#D4AF37]">
                      <Star className="w-4 h-4" />
                      <span className="text-sm">{habit.xp}</span>
                    </div>
                  </div>
                </div>
                <button
                  className="w-full mt-2 p-2 rounded-lg bg-[#4F46E5]/10 text-[#4F46E5] 
                  hover:bg-[#4F46E5]/20 transition-colors text-sm"
                >
                  Add to Habits
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Milestones */}
      <div className="card-dark">
        <button
          onClick={() => toggleSection('milestones')}
          className="w-full flex items-center justify-between p-4"
        >
          <h3 className="text-lg font-semibold text-white">Milestones</h3>
          {expandedSection === 'milestones' ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>

        {expandedSection === 'milestones' && (
          <div className="p-4 pt-0 space-y-3">
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                  milestone.completed
                    ? 'bg-[#4F46E5]/10 border-[#4F46E5]/30 text-[#4F46E5]'
                    : 'bg-[#2A2B35]/30 border-[#2A2B35]/50 text-gray-400'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    milestone.completed
                      ? 'border-[#4F46E5] text-[#4F46E5]'
                      : 'border-gray-400'
                  }`}
                >
                  {index + 1}
                </div>
                <span className="font-medium">{milestone.title}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
