import React from 'react';
import { CheckCircle2, Repeat, Zap, Trophy } from 'lucide-react';
import { Habit } from '../types';

interface DailyPanelProps {
  habits: Habit[];
}

export function DailyPanel({ habits }: DailyPanelProps) {
  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800/50 overflow-hidden">
      <div className="p-4 border-b border-gray-800/50">
        <h2 className="text-xl font-bold text-blue-400 flex items-center gap-2">
          <Repeat className="w-5 h-5" />
          Daily Routines
        </h2>
      </div>

      <div className="p-4 space-y-4">
        {habits.map((habit) => (
          <div
            key={habit.id}
            className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30 hover:border-blue-500/30 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  className={`p-2 rounded-full transition-all ${
                    habit.completed
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-gray-800 text-gray-400 hover:bg-blue-500/10 hover:text-blue-400'
                  }`}
                >
                  <CheckCircle2 className="w-5 h-5" />
                </button>
                <div>
                  <h3 className="font-semibold text-white">{habit.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span>{habit.streak} day streak</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className={`w-5 h-5 ${habit.completed ? 'text-yellow-400' : 'text-gray-600'}`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}