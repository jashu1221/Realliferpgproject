import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, Crown, Brain, Target, ChevronRight, Star, 
  Zap, Trophy, Flame, ArrowRight 
} from 'lucide-react';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0B0E] text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#4F46E5]/10 to-transparent" />
        <div className="absolute inset-0" 
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1533134486753-c833f0ed4866?q=80&w=3270&auto=format&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.1
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B0E] via-transparent to-transparent" />

        {/* Content */}
        <div className="relative container mx-auto px-4 py-24 sm:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="flex items-center justify-center gap-2 text-sm font-medium">
              <div className="px-3 py-1 rounded-full bg-[#4F46E5]/10 text-[#4F46E5] border border-[#4F46E5]/30">
                Level Up Your Life
              </div>
            </div>

            <h1 className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-white to-gray-400 
              bg-clip-text text-transparent">
              Transform Your Life Into An Epic Journey
            </h1>

            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
              Turn your daily life into an immersive RPG experience. Level up, gain stats, 
              complete quests, and become the legendary version of yourself.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup" 
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] 
                  hover:from-[#4338CA] hover:to-[#6D28D9] text-white font-medium transition-all
                  flex items-center justify-center gap-2 group"
              >
                Start Your Journey
                <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/login"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#2A2B35]/50 text-white 
                  hover:bg-[#2A2B35] font-medium transition-all border border-[#2A2B35]"
              >
                Continue Quest
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: Shield,
              title: 'Level Up System',
              description: 'Gain experience points and level up as you complete tasks and overcome challenges.'
            },
            {
              icon: Brain,
              title: 'Skill Trees',
              description: 'Develop your character with unique skill trees across different life aspects.'
            },
            {
              icon: Target,
              title: 'Quest System',
              description: 'Transform your goals into epic quests with rewards and progression tracking.'
            },
            {
              icon: Trophy,
              title: 'Achievement System',
              description: 'Unlock achievements and titles as you reach milestones in your journey.'
            },
            {
              icon: Flame,
              title: 'Daily Challenges',
              description: 'Face daily challenges to maintain streaks and earn bonus rewards.'
            },
            {
              icon: Crown,
              title: 'Rank System',
              description: 'Climb through ranks from E to S as you prove your worth and dedication.'
            }
          ].map((feature, index) => (
            <div key={index} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#4F46E5]/10 to-[#7C3AED]/10 
                rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative p-6 rounded-xl border border-[#2A2B35]/50 
                hover:border-[#4F46E5]/30 transition-all">
                <div className="w-12 h-12 rounded-lg bg-[#4F46E5]/10 flex items-center justify-center
                  border border-[#4F46E5]/20 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-[#4F46E5]" />
                </div>
                
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Your Character Stats</h2>
            <p className="text-gray-400">Track and improve your real-life attributes</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { name: 'Strength', value: 75, color: 'from-red-500 to-orange-500' },
              { name: 'Intelligence', value: 85, color: 'from-blue-500 to-cyan-500' },
              { name: 'Charisma', value: 60, color: 'from-purple-500 to-pink-500' },
              { name: 'Discipline', value: 90, color: 'from-[#4F46E5] to-[#7C3AED]' },
              { name: 'Vitality', value: 70, color: 'from-green-500 to-emerald-500' }
            ].map((stat) => (
              <div key={stat.name} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#4F46E5]/5 to-[#7C3AED]/5 
                  rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative p-4 rounded-xl border border-[#2A2B35]/50 
                  hover:border-[#4F46E5]/30 transition-all text-center">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-[#2A2B35]/50 
                    to-[#1A1B23]/50 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent 
                      group-hover:animate-shine" />
                    <span className="text-xl font-bold bg-gradient-to-r bg-clip-text text-transparent
                      ${stat.color}">{stat.value}</span>
                  </div>
                  <div className="text-sm font-medium text-gray-300">{stat.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl sm:text-4xl font-bold">Ready to Begin Your Legend?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Join thousands of others who are transforming their lives through our unique RPG system.
            Your journey to greatness starts here.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup" 
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] 
                hover:from-[#4338CA] hover:to-[#6D28D9] text-white font-medium transition-all
                flex items-center justify-center gap-2 group"
            >
              Create Your Character
              <ChevronRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}