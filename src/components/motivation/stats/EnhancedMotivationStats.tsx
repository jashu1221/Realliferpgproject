import React from 'react';
import { Star, Target, CheckCircle2, ListTodo } from 'lucide-react';
import { CountdownTimer } from './CountdownTimer';
import { ProgressBar } from './ProgressBar';
import { useProgress } from '../../../hooks/useProgress';

export function EnhancedMotivationStats() {
  const stats = useProgress();

  return (
    <div className="space-y-6">
      <CountdownTimer />

      <div className="bg-[#1A1B23]/95 border border-[#2A2B35]/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Today's Progress</h3>
          <div
            className="px-3 py-1.5 rounded-full text-sm bg-[#2C061F]/20 text-[#D89216] 
            border border-[#D89216]/30"
          >
            {Math.round(stats.dailyProgress)}% Complete
          </div>
        </div>

        <div className="space-y-6">
          {/* Overall Progress */}
          <ProgressBar
            value={Math.round(stats.dailyProgress)}
            max={100}
            label="Overall Progress"
            color="text-blue"
            size="lg"
          />

          {/* Individual Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-[#2C061F]" />
                <span className="text-sm font-medium text-gray-300">
                  Habits
                </span>
              </div>
              <ProgressBar
                value={stats.habits.completed}
                max={stats.habits.total}
                label="Daily Hits"
                color="text-blue"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-[#374045]" />
                <span className="text-sm font-medium text-gray-300">
                  Dailies
                </span>
              </div>
              <ProgressBar
                value={stats.dailies.completed}
                max={stats.dailies.total}
                label="Completed Tasks"
                color="text-blue"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <ListTodo className="w-4 h-4 text-[#D89216]" />
                <span className="text-sm font-medium text-gray-300">
                  To-dos
                </span>
              </div>
              <ProgressBar
                value={stats.todos.completed}
                max={stats.todos.total}
                label="Completed Tasks"
                color="text-blue"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-[#E1D89F]" />
                <span className="text-sm font-medium text-gray-300">
                  XP Progress
                </span>
              </div>
              <ProgressBar
                value={75}
                max={100}
                label="Level Progress"
                color="text-blue"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
