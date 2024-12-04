import React, { useState, useEffect } from 'react';
import { Sword, Star, Clock, Target, Plus, RefreshCw, Loader2, AlertCircle } from 'lucide-react';
import { generateQuests, type GeneratedQuest } from '../lib/openai/questGenerator';
import { useDailies } from '../hooks/useDailies';
import { useAuth } from '../contexts/AuthContext';

export function ActiveQuests() {
  const [quests, setQuests] = useState<GeneratedQuest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { createDaily } = useDailies();
  const { userProfile } = useAuth();

  const fetchQuests = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const context = userProfile ? {
        level: userProfile.level,
        interests: userProfile.settings?.interests || [],
        goals: userProfile.settings?.goals || []
      } : undefined;
      
      const newQuests = await generateQuests(context);
      setQuests(newQuests);
    } catch (err: any) {
      console.error('Error fetching quests:', err);
      setError('Failed to load quests. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuests();
  }, []);

  const handleAddToDaily = async (quest: GeneratedQuest) => {
    try {
      await createDaily({
        title: quest.title,
        description: quest.description,
        priority: quest.difficulty === 'S' || quest.difficulty === 'A' ? 'high' :
                 quest.difficulty === 'B' || quest.difficulty === 'C' ? 'medium' : 'low',
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        tags: ['quest'],
        status: 'active'
      });
    } catch (err) {
      console.error('Error adding quest to dailies:', err);
      setError('Failed to add quest to dailies. Please try again.');
    }
  };

  const difficultyColors = {
    'S': 'text-red-400 border-red-500/30 bg-red-500/10',
    'A': 'text-[#D4AF37] border-[#D4AF37]/30 bg-[#D4AF37]/10',
    'B': 'text-purple-400 border-purple-500/30 bg-purple-500/10',
    'C': 'text-blue-400 border-blue-500/30 bg-blue-500/10',
    'D': 'text-green-400 border-green-500/30 bg-green-500/10',
    'E': 'text-gray-400 border-gray-500/30 bg-gray-500/10'
  };

  if (error) {
    return (
      <div className="card-dark h-[200px] flex flex-col items-center justify-center text-red-400">
        <AlertCircle className="w-8 h-8 mb-2" />
        <p className="text-sm">{error}</p>
        <button
          onClick={fetchQuests}
          className="mt-4 px-4 py-2 rounded-lg bg-[#2A2B35]/50 text-gray-400 
            hover:bg-[#2A2B35] transition-colors flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="card-dark h-[200px] flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-[#4F46E5]/10 flex items-center justify-center">
            <Sword className="w-3.5 h-3.5 text-[#4F46E5]" />
          </div>
          <h3 className="text-sm font-medium text-gray-300">Active Quests</h3>
        </div>
        <button
          onClick={fetchQuests}
          disabled={isLoading}
          className="p-1.5 rounded-lg hover:bg-[#2A2B35]/50 text-gray-400 
            transition-all disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
        </button>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto pr-1 scrollbar-thin 
        scrollbar-thumb-[#2A2B35] scrollbar-track-transparent">
        {quests.map((quest, index) => (
          <div
            key={index}
            className="p-2.5 rounded-lg bg-[#1A1B23]/50 border border-[#2A2B35]/50 
              hover:border-[#4F46E5]/20 transition-all group"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <div className={`px-1.5 rounded text-[10px] font-bold ${difficultyColors[quest.difficulty]}`}>
                    {quest.difficulty}
                  </div>
                  <h4 className="text-xs font-medium text-gray-200 truncate">{quest.title}</h4>
                </div>
                <p className="text-[10px] text-gray-500 truncate mt-0.5">{quest.description}</p>
              </div>
              <button
                onClick={() => handleAddToDaily(quest)}
                className="p-1 rounded-lg hover:bg-[#2A2B35] text-gray-400 
                  opacity-0 group-hover:opacity-100 transition-all"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-[#D4AF37]" />
                <span className="text-[10px] font-medium text-[#D4AF37]">{quest.xp} XP</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-gray-400" />
                <span className="text-[10px] text-gray-400">{quest.daysLeft}d</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}