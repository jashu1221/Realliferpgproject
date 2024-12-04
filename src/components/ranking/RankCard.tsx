import React from 'react';
import { ChevronRight, Star, Shield, Users, TrendingUp } from 'lucide-react';

interface RankCardProps {
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
  isSelected: boolean;
  onClick: () => void;
}

export function RankCard({ rank, isSelected, onClick }: RankCardProps) {
  return (
    <button
      onClick={onClick}
      className={`relative overflow-hidden rounded-xl border transition-all transform
        hover:scale-[1.02] hover:-translate-y-1 duration-300 ${
        isSelected
          ? `${rank.bgColor} ${rank.borderColor} shadow-lg shadow-${rank.textColor}/20`
          : 'bg-[#1A1B23]/95 border-[#2A2B35]/50 hover:border-[#4F46E5]/30'
      } p-4 text-left group`}
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20 z-0" />
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500
        bg-gradient-to-r ${rank.color} blur-3xl`} style={{ opacity: '0.05' }} />
      
      {/* Shine Effect */}
      <div className="absolute inset-0 w-full h-full group-hover:animate-shine opacity-0 group-hover:opacity-100"
        style={{
          background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.1) 50%, transparent)',
          transform: 'skewX(-20deg)',
        }}
      />

      <div className="relative z-10 space-y-3">
        <div className="flex items-center justify-between">
          <div className={`w-8 h-8 rounded-lg ${rank.bgColor} flex items-center justify-center
            border ${rank.borderColor} transform group-hover:scale-110 transition-transform duration-300`}>
            <span className={`text-lg font-bold ${rank.textColor} group-hover:animate-pulse`}>
              {rank.rank}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Star className={`w-3 h-3 ${isSelected ? rank.textColor : ''} 
              transform group-hover:rotate-180 transition-transform duration-500`} />
            <span>{rank.percentage}</span>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-white group-hover:text-[#4F46E5] transition-colors">
            {rank.level}
          </h3>
          <p className="text-xs text-gray-400 mt-1 line-clamp-2">{rank.description}</p>
        </div>

        {/* Stats Preview */}
        <div className="grid grid-cols-3 gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {[
            { icon: Shield, value: '90+' },
            { icon: Users, value: '85+' },
            { icon: TrendingUp, value: '95+' }
          ].map((stat, index) => (
            <div key={index} className={`flex items-center gap-1 text-xs ${rank.textColor}`}
              style={{ animationDelay: `${index * 100}ms` }}>
              <stat.icon className="w-3 h-3" />
              <span>{stat.value}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Examples: {rank.examples[0]}</span>
          <ChevronRight className={`w-4 h-4 transition-all transform group-hover:translate-x-1 
            ${isSelected ? rank.textColor : 'text-gray-500'}`} />
        </div>
      </div>

      {/* Power Level Indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#1A1B23]">
        <div className={`h-full bg-gradient-to-r ${rank.color} transform scale-x-0 
          group-hover:scale-x-100 transition-transform duration-1000 origin-left`} />
      </div>
    </button>
  );
}