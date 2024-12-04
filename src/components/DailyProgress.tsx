import React from 'react';
import { TrendingUp, Target, CheckCircle2, ListTodo } from 'lucide-react';
import { useProgress } from '../hooks/useProgress';

export function DailyProgress() {
  const stats = useProgress();

  return (
    <div className="card-dark min-h-[200px] flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-300">Daily Progress</h3>
        <span
          className="px-2 py-0.5 rounded-full text-xs bg-[#4F46E5]/10 text-[#4F46E5] 
          border border-[#4F46E5]/20"
        >
          {Math.round(stats.dailyProgress)}% Complete
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 flex-1">
        {/* Daily Progress & Habits Combined */}
        <div className="space-y-3">
          {/* Daily Progress */}
          <div
            className="bg-[#1A1B23]/50 rounded-lg p-2.5 border border-[#2A2B35]/50
            hover:border-[#4F46E5]/20 transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-[#4F46E5]/10 flex items-center justify-center">
                  <TrendingUp className="w-3.5 h-3.5 text-[#4F46E5]" />
                </div>
                <span className="text-xs text-gray-400">Daily</span>
              </div>
              <div className="text-xs font-medium">
                <span className="text-[#4F46E5]">
                  {Math.round(stats.dailyProgress)}%
                </span>
              </div>
            </div>
            <div className="h-1.5 bg-[#1A1B23] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] rounded-full
                  transition-all duration-300 relative overflow-hidden group-hover:shadow-lg
                  group-hover:shadow-indigo-500/20"
                style={{ width: `${stats.dailyProgress}%` }}
              >
                <div
                  className="absolute inset-0 w-full h-full animate-shine"
                  style={{
                    background:
                      'linear-gradient(to right, transparent, rgba(255,255,255,0.1) 50%, transparent)',
                    transform: 'skewX(-20deg)',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Habits */}
          <div
            className="bg-[#1A1B23]/50 rounded-lg p-2.5 border border-[#2A2B35]/50
            hover:border-[#4F46E5]/20 transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-[#4F46E5]/10 flex items-center justify-center">
                  <Target className="w-3.5 h-3.5 text-[#4F46E5]" />
                </div>
                <span className="text-xs text-gray-400">Habits</span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <span className="text-[#4F46E5] font-medium">
                  {stats.habits.completed}
                </span>
                <span className="text-gray-500">/</span>
                <span className="text-gray-400">{stats.habits.total}</span>
              </div>
            </div>
            <div className="h-1.5 bg-[#1A1B23] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] rounded-full
                  transition-all duration-300 group-hover:shadow-lg group-hover:shadow-indigo-500/20"
                style={{ width: `${stats.habits.percentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Dailies & To-dos Combined */}
        <div className="space-y-3">
          {/* Dailies */}
          <div
            className="bg-[#1A1B23]/50 rounded-lg p-2.5 border border-[#2A2B35]/50
            hover:border-[#4F46E5]/20 transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-[#4F46E5]/10 flex items-center justify-center">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#4F46E5]" />
                </div>
                <span className="text-xs text-gray-400">Dailies</span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <span className="text-[#4F46E5] font-medium">
                  {stats.dailies.completed}
                </span>
                <span className="text-gray-500">/</span>
                <span className="text-gray-400">{stats.dailies.total}</span>
              </div>
            </div>
            <div className="h-1.5 bg-[#1A1B23] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] rounded-full
                  transition-all duration-300 group-hover:shadow-lg group-hover:shadow-indigo-500/20"
                style={{ width: `${stats.dailies.percentage}%` }}
              />
            </div>
          </div>

          {/* To-dos */}
          <div
            className="bg-[#1A1B23]/50 rounded-lg p-2.5 border border-[#2A2B35]/50
            hover:border-[#4F46E5]/20 transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-[#4F46E5]/10 flex items-center justify-center">
                  <ListTodo className="w-3.5 h-3.5 text-[#4F46E5]" />
                </div>
                <span className="text-xs text-gray-400">To-dos</span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <span className="text-gray-400">{stats.todos.total}</span>
              </div>
            </div>
            <div className="h-1.5 bg-[#1A1B23] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] rounded-full
                  transition-all duration-300 group-hover:shadow-lg group-hover:shadow-indigo-500/20"
                style={{ width: `${stats.todos.percentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
