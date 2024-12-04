import React from 'react';
import { Clock, Plus } from 'lucide-react';
import { TimeBlock } from '../types';

interface TimeBlockingPanelProps {
  timeBlocks: TimeBlock[];
}

const categoryColors = {
  health: 'bg-green-500/20 text-green-400 border-green-500/30',
  study: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  work: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  default: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

export function TimeBlockingPanel({ timeBlocks }: TimeBlockingPanelProps) {
  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800/50">
      <div className="p-4 border-b border-gray-800/50 flex justify-between items-center">
        <h2 className="text-xl font-bold text-blue-400 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Time Blocking
        </h2>
        <button className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4">
        <div className="grid gap-2">
          {timeBlocks.map((block) => (
            <div
              key={block.id}
              className={`p-3 rounded-lg border ${
                categoryColors[block.category as keyof typeof categoryColors] || categoryColors.default
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">{block.title}</span>
                <span className="text-sm">
                  {block.startTime} - {block.endTime}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}