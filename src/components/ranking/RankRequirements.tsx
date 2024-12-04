import React from 'react';
import { X, Shield, Users, TrendingUp, Star } from 'lucide-react';

interface RankRequirementsProps {
  rank: {
    rank: string;
    level: string;
    percentage: string;
    description: string;
    examples: string[];
    color: string;
    textColor: string;
    borderColor: string;
    bgColor: string;
  };
  onClose: () => void;
}

export function RankRequirements({ rank, onClose }: RankRequirementsProps) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-[#1A1B23]/95 border border-[#2A2B35]/50 rounded-xl w-full max-w-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${rank.bgColor} flex items-center justify-center
              border ${rank.borderColor}`}>
              <span className={`text-xl font-bold ${rank.textColor}`}>{rank.rank}</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">{rank.level} Requirements</h2>
              <p className="text-sm text-gray-400">Top {rank.percentage} of all users</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[#2A2B35]/50 text-gray-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Required Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: Shield, label: 'Political Power', required: '90+' },
              { icon: Users, label: 'Social Influence', required: '85+' },
              { icon: TrendingUp, label: 'Corporate Impact', required: '95+' }
            ].map((stat) => (
              <div key={stat.label} className="bg-[#2A2B35]/30 rounded-lg p-4 border border-[#2A2B35]/50">
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon className="w-4 h-4 text-[#4F46E5]" />
                  <span className="text-sm text-gray-400">{stat.label}</span>
                </div>
                <div className="text-lg font-bold text-white">{stat.required}</div>
              </div>
            ))}
          </div>

          {/* Examples */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-400">Example Positions</h3>
            <div className="grid grid-cols-2 gap-3">
              {rank.examples.map((example) => (
                <div
                  key={example}
                  className="flex items-center gap-2 p-3 rounded-lg bg-[#2A2B35]/30 
                    border border-[#2A2B35]/50"
                >
                  <Star className={`w-4 h-4 ${rank.textColor}`} />
                  <span className="text-sm text-gray-300">{example}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="bg-[#2A2B35]/30 rounded-lg p-4 border border-[#2A2B35]/50">
            <p className="text-sm text-gray-400">{rank.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}