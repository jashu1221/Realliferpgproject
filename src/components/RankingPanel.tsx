import React from 'react';
import { Crown, TrendingUp } from 'lucide-react';
import { UserStats } from '../types';

interface RankingPanelProps {
  stats: UserStats;
}

export function RankingPanel({ stats }: RankingPanelProps) {
  const rankPercentage = ((stats.totalPlayers - stats.ranking) / stats.totalPlayers) * 100;

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800/50 overflow-hidden">
      <div className="p-4 border-b border-gray-800/50">
        <h2 className="text-xl font-bold text-blue-400 flex items-center gap-2">
          <Crown className="w-5 h-5" />
          Global Ranking
        </h2>
      </div>

      <div className="p-4">
        <div className="text-center mb-4">
          <div className="text-4xl font-bold text-yellow-400">#{stats.ranking}</div>
          <div className="text-gray-400">of {stats.totalPlayers} players</div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-400">
            <span>Top {rankPercentage.toFixed(1)}%</span>
            <span className="flex items-center gap-1 text-green-400">
              <TrendingUp className="w-4 h-4" />
              +5 positions
            </span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full transition-all"
              style={{ width: `${rankPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}