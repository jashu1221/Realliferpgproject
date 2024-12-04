import React from 'react';
import { Trophy, Crown, Star, TrendingUp, Shield } from 'lucide-react';

const topRankers = [
  {
    name: 'Rajesh K.',
    rank: 'S',
    title: 'Supreme Leader',
    xp: 50000,
    avatar: '👑',
    color: 'from-red-500 to-orange-500',
    textColor: 'text-red-400',
    borderColor: 'border-red-500/30',
    bgColor: 'bg-red-500/10'
  },
  {
    name: 'Priya M.',
    rank: 'A+',
    title: 'Corporate Titan',
    xp: 45000,
    avatar: '⭐',
    color: 'from-[#D4AF37] to-yellow-500',
    textColor: 'text-[#D4AF37]',
    borderColor: 'border-[#D4AF37]/30',
    bgColor: 'bg-[#D4AF37]/10'
  },
  {
    name: 'Amit S.',
    rank: 'A',
    title: 'Policy Maker',
    xp: 40000,
    avatar: '🏆',
    color: 'from-purple-500 to-pink-500',
    textColor: 'text-purple-400',
    borderColor: 'border-purple-500/30',
    bgColor: 'bg-purple-500/10'
  }
];

export function RankLeaderboard() {
  return (
    <div className="bg-[#1A1B23]/95 border border-[#2A2B35]/50 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-[#D4AF37] animate-pulse" />
          Top Influencers
        </h3>
        <button className="text-sm text-[#4F46E5] hover:text-[#4F46E5]/80 transition-colors">
          View All
        </button>
      </div>

      <div className="space-y-3">
        {topRankers.map((ranker, index) => (
          <div
            key={ranker.name}
            className={`relative overflow-hidden flex items-center gap-3 p-3 rounded-lg 
              border group hover:scale-[1.02] transform transition-all duration-300
              ${ranker.bgColor} ${ranker.borderColor}`}
          >
            {/* Animated Background */}
            <div className={`absolute inset-0 bg-gradient-to-r ${ranker.color} opacity-0 
              group-hover:opacity-5 transition-opacity duration-500 blur-xl`} />
            
            {/* Shine Effect */}
            <div className="absolute inset-0 w-full h-full opacity-0 group-hover:animate-shine"
              style={{
                background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.1) 50%, transparent)',
                transform: 'skewX(-20deg)',
              }}
            />

            <div className={`w-10 h-10 rounded-lg ${ranker.bgColor} flex items-center justify-center
              text-xl transform group-hover:scale-110 transition-transform duration-300
              border ${ranker.borderColor}`}>
              {ranker.avatar}
            </div>

            <div className="flex-1 min-w-0 relative z-10">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white truncate">{ranker.name}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${ranker.bgColor} 
                  ${ranker.textColor} ${ranker.borderColor}`}>
                  {ranker.rank}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-400">{ranker.title}</span>
                <div className="flex items-center gap-1 text-xs text-[#D4AF37]">
                  <Star className="w-3 h-3" />
                  <span>{ranker.xp.toLocaleString()} XP</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className={`text-2xl font-bold transform group-hover:scale-110 
                transition-transform duration-300 ${
                index === 0 
                  ? 'text-[#FFD700]' 
                  : index === 1 
                  ? 'text-[#C0C0C0]' 
                  : 'text-[#CD7F32]'
              }`}>
                #{index + 1}
              </div>
              <TrendingUp className={`w-4 h-4 transform group-hover:translate-y-[-2px]
                transition-transform duration-300 ${
                index === 0 ? 'text-green-400' : 'text-gray-400'
              }`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}