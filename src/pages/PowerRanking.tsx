import React, { useState } from 'react';
import { Crown, Star, TrendingUp, Users, Shield, Target, ChevronDown, ChevronUp, Trophy, Sparkles } from 'lucide-react';
import { RankCard } from '../components/ranking/RankCard';
import { RankProgress } from '../components/ranking/RankProgress';
import { RankRequirements } from '../components/ranking/RankRequirements';
import { RankLeaderboard } from '../components/ranking/RankLeaderboard';

const powerRanks = [
  {
    rank: 'S',
    level: 'Supreme',
    percentage: '0.0001%',
    description: 'Supreme National Influence',
    examples: ['Prime Minister', 'Chief Ministers', 'Conglomerate Leaders'],
    color: 'from-red-500 to-orange-500',
    textColor: 'text-red-400',
    borderColor: 'border-red-500/30',
    bgColor: 'bg-red-500/10'
  },
  {
    rank: 'A+',
    level: 'Upper A',
    percentage: '0.0009%',
    description: 'Very High-Level Political or Corporate Power',
    examples: ['Cabinet Ministers', 'Multinational CEOs', 'Top Officials'],
    color: 'from-[#D4AF37] to-yellow-500',
    textColor: 'text-[#D4AF37]',
    borderColor: 'border-[#D4AF37]/30',
    bgColor: 'bg-[#D4AF37]/10'
  },
  // ... other ranks
];

export function PowerRanking() {
  const [selectedRank, setSelectedRank] = useState(powerRanks[0]);
  const [showRequirements, setShowRequirements] = useState(false);

  const currentRank = {
    rank: 'B+',
    level: 'Upper B',
    progress: 75,
    nextMilestone: 'Regional Policy Impact',
    requiredXP: 15000,
    currentXP: 11250
  };

  return (
    <div className="min-h-screen bg-[#0A0B0E] p-6 space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4F46E5]/20 to-[#7C3AED]/20 
            flex items-center justify-center border border-[#4F46E5]/20">
            <Crown className="w-6 h-6 text-[#4F46E5]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 
              bg-clip-text text-transparent">
              Power Rankings
            </h1>
            <p className="text-sm text-gray-400">Your journey to supreme influence</p>
          </div>
        </div>
        <button 
          onClick={() => setShowRequirements(!showRequirements)}
          className="px-4 py-2 rounded-lg bg-[#4F46E5]/10 text-[#4F46E5] 
            hover:bg-[#4F46E5]/20 transition-all flex items-center gap-2
            border border-[#4F46E5]/30"
        >
          <Target className="w-4 h-4" />
          View Requirements
        </button>
      </div>

      {/* Current Rank Overview */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <div className="bg-[#1A1B23]/95 border border-[#2A2B35]/50 rounded-xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#4F46E5]/20 to-[#7C3AED]/20 
                  flex items-center justify-center border border-[#4F46E5]/20">
                  <span className="text-2xl font-bold text-[#4F46E5]">{currentRank.rank}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-white">{currentRank.level}</h2>
                    <span className="px-2 py-0.5 rounded-full text-xs bg-[#4F46E5]/10 
                      text-[#4F46E5] border border-[#4F46E5]/30">
                      Current Rank
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">Next Milestone: {currentRank.nextMilestone}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#4F46E5]">{currentRank.progress}%</div>
                  <div className="text-xs text-gray-400">Progress</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#D4AF37]">
                    {currentRank.currentXP.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-400">Current XP</div>
                </div>
              </div>
            </div>

            <RankProgress 
              currentXP={currentRank.currentXP} 
              requiredXP={currentRank.requiredXP}
              currentRank={currentRank.rank}
              nextRank="A"
            />

            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Shield, label: 'Political Power', value: '72/100' },
                { icon: Users, label: 'Social Influence', value: '85/100' },
                { icon: TrendingUp, label: 'Corporate Impact', value: '68/100' }
              ].map((stat) => (
                <div key={stat.label} className="bg-[#2A2B35]/30 rounded-lg p-4 border border-[#2A2B35]/50">
                  <div className="flex items-center gap-2 mb-2">
                    <stat.icon className="w-4 h-4 text-[#4F46E5]" />
                    <span className="text-sm text-gray-400">{stat.label}</span>
                  </div>
                  <div className="text-lg font-bold text-white">{stat.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <RankLeaderboard />
        </div>
      </div>

      {/* Rank Cards Grid */}
      <div className="grid grid-cols-4 gap-4">
        {powerRanks.map((rank) => (
          <RankCard
            key={rank.rank}
            rank={rank}
            isSelected={selectedRank.rank === rank.rank}
            onClick={() => setSelectedRank(rank)}
          />
        ))}
      </div>

      {/* Requirements Modal */}
      {showRequirements && (
        <RankRequirements
          rank={selectedRank}
          onClose={() => setShowRequirements(false)}
        />
      )}
    </div>
  );
}