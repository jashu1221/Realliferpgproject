import React from 'react';
import { Swords, Star, CheckCircle2, Calendar } from 'lucide-react';
import { Quest } from '../types';

interface QuestPanelProps {
  quests: Quest[];
  onComplete: (id: string) => void;
}

const difficultyColors = {
  'S': 'text-red-400 border-red-500/30 bg-red-500/10',
  'A': 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10',
  'B': 'text-purple-400 border-purple-500/30 bg-purple-500/10',
  'C': 'text-blue-400 border-blue-500/30 bg-blue-500/10',
  'D': 'text-green-400 border-green-500/30 bg-green-500/10',
  'E': 'text-gray-400 border-gray-500/30 bg-gray-500/10',
};

export function QuestPanel({ quests, onComplete }: QuestPanelProps) {
  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800/50">
      <div className="p-4 border-b border-gray-800/50">
        <h2 className="text-xl font-bold text-blue-400 flex items-center gap-2">
          <Swords className="w-5 h-5" />
          Active Quests
        </h2>
      </div>

      <div className="p-4 space-y-4">
        {quests.map((quest) => (
          <div
            key={quest.id}
            className={`relative overflow-hidden rounded-lg border transition-all ${
              quest.completed
                ? 'border-gray-800/30 opacity-50'
                : 'border-gray-800/50 hover:border-blue-500/30'
            }`}
          >
            <div className="p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`px-2 py-1 rounded text-sm font-bold ${difficultyColors[quest.difficulty]}`}>
                    {quest.difficulty}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white flex items-center gap-2">
                      {quest.title}
                      {quest.isNew && (
                        <span className="px-2 py-0.5 rounded-full text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30">
                          NEW
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-400">{quest.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-400">{quest.deadline}</span>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star className="w-4 h-4" />
                    <span>{quest.experience} XP</span>
                  </div>
                  <button
                    onClick={() => onComplete(quest.id)}
                    className={`p-2 rounded-full transition-all ${
                      quest.completed
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-gray-800 text-gray-400 hover:bg-green-500/10 hover:text-green-400'
                    }`}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}