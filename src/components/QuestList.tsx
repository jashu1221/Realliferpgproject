import React from 'react';
import { Quest } from '../types';
import { Star, CheckCircle } from 'lucide-react';

interface QuestListProps {
  quests: Quest[];
  onComplete: (id: string) => void;
}

const difficultyColors = {
  'E': 'text-gray-400',
  'D': 'text-green-400',
  'C': 'text-blue-400',
  'B': 'text-purple-400',
  'A': 'text-yellow-400',
  'S': 'text-red-400',
};

export function QuestList({ quests, onComplete }: QuestListProps) {
  return (
    <div className="space-y-4">
      {quests.map((quest) => (
        <div
          key={quest.id}
          className={`bg-gray-900 rounded-lg p-4 border border-gray-800 transition-all ${
            quest.completed ? 'opacity-50' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`text-lg font-bold ${difficultyColors[quest.difficulty]}`}>
                {quest.difficulty}
              </div>
              <div>
                <h3 className="text-white font-semibold flex items-center space-x-2">
                  {quest.title}
                  {quest.isNew && (
                    <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                      NEW
                    </span>
                  )}
                </h3>
                <p className="text-gray-400 text-sm">{quest.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 text-yellow-400">
                <Star size={16} />
                <span>{quest.experience} XP</span>
              </div>
              <button
                onClick={() => onComplete(quest.id)}
                className={`p-2 rounded-full transition-colors ${
                  quest.completed
                    ? 'text-green-400 bg-green-400/10'
                    : 'text-gray-400 hover:text-green-400 hover:bg-green-400/10'
                }`}
              >
                <CheckCircle size={20} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}