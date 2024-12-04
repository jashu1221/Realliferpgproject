import React, { useState } from 'react';
import {
  SkipForward,
  Trophy,
  Flame,
  Target,
  Minus,
  Plus,
  AlarmClock,
  Trash2,
} from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from './ui/dialog';
import { HabitModal } from './HabitModal';
import { useDraggable } from '@dnd-kit/core';
import { useHabits } from '../hooks/useHabits';
import { useCoins } from '../hooks/useCoins';

interface HitLevel {
  hits: number;
  title: string;
  difficulty: string;
}

interface HabitCardProps {
  id: string;
  title: string;
  note?: string; // maps to description
  maxHits?: number;
  currentHits: number;
  totalHits: number;
  currentStreak?: number;
  hitLevels?: HitLevel[];
  tags?: string[];
  status?: 'active' | 'snoozed' | 'archived';
  snoozeUntil?: string;
  snoozeReason?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export function HabitCard({
  id,
  title: initialTitle,
  note: initialNote = 'Build a consistent routine',
  maxHits = 4,
  currentHits = 0,
  currentStreak = 0,
  totalHits = 0,
  hitLevels = [
    { hits: 1, title: 'Show up', difficulty: 'Show Up' },
    { hits: 2, title: '30 minutes', difficulty: 'Easy' },
    { hits: 3, title: '1 hour', difficulty: 'Medium' },
    { hits: 4, title: '2 hours', difficulty: 'Hard' },
  ],
  tags = [],
  difficulty,
}: HabitCardProps) {
  const [showHitLevels, setShowHitLevels] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { incrementHitLevelForHabit, decrementHitLevelForHabit, deleteHabit } =
    useHabits();

  const { awardCoins } = useCoins();

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `habit-${id}`,
    data: {
      type: 'habit',
      title: initialTitle,
      duration: 60,
    },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        cursor: 'grabbing',
      }
    : undefined;

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteHabit(id);
    } catch (error) {
      console.error('Error deleting habit:', error);
    }
  };

  const handleIncrement = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentHits < maxHits) {
      try {
        await incrementHitLevelForHabit(id);
        await awardCoins('habit', id, difficulty);
      } catch (error) {
        console.error('Error incrementing hit level:', error);
      }
    }
  };

  const handleDecrement = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentHits > 0) {
      try {
        await decrementHitLevelForHabit(id);
      } catch (error) {
        console.error('Error decrementing hit level:', error);
      }
    }
  };

  const getCurrentHitLevelInfo = () => {
    if (currentHits === 0) return null;
    const hitLevel = hitLevels[currentHits - 1];
    return hitLevel ? `${hitLevel.difficulty} - ${hitLevel.title}` : null;
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <div
          ref={setNodeRef}
          style={style}
          className="bg-[#1A1B23] border border-[#2A2B35]/50 rounded-xl p-4 
            hover:border-[#4F46E5]/30 transition-all cursor-pointer group"
          onClick={() => setIsModalOpen(true)}
        >
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-white font-medium">{initialTitle}</h3>
                <p className="text-sm text-gray-400">{initialNote}</p>
                {tags && tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 rounded-full text-xs bg-[#4F46E5]/10 text-[#4F46E5] 
                          border border-[#4F46E5]/30"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm text-gray-400">{totalHits}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Flame className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-gray-400">{currentStreak}</span>
                </div>
              </div>
            </div>

            <div
              className="flex items-center justify-between gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex-1 flex items-center gap-2">
                <button
                  onClick={handleDecrement}
                  className="p-1 rounded-lg hover:bg-[#2A2B35] text-gray-400 transition-all disabled:opacity-50"
                  disabled={currentHits === 0}
                >
                  <Minus className="w-4 h-4" />
                </button>

                <div className="flex-1">
                  <div className="text-center">
                    <span className="text-lg font-medium text-white">
                      {totalHits}/{maxHits}
                    </span>
                  </div>
                  {showHitLevels && getCurrentHitLevelInfo() && (
                    <div className="text-xs text-gray-400 text-center mt-1">
                      {getCurrentHitLevelInfo()}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleIncrement}
                  className="p-1 rounded-lg hover:bg-[#2A2B35] text-gray-400 transition-all disabled:opacity-50"
                  disabled={currentHits === maxHits}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div
                {...attributes}
                {...listeners}
                className="flex items-center gap-2 cursor-grab active:cursor-grabbing"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="p-1.5 rounded-lg hover:bg-[#2A2B35] text-gray-400 transition-all"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="p-1.5 rounded-lg hover:bg-[#2A2B35] text-gray-400 transition-all"
                >
                  <AlarmClock className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowHitLevels(!showHitLevels);
                  }}
                  className="p-1.5 rounded-lg hover:bg-[#2A2B35] text-gray-400 transition-all"
                >
                  <Target className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-1.5 rounded-lg hover:bg-[#2A2B35] text-gray-400 hover:text-red-500 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="w-full bg-[#2A2B35]/30 rounded-full h-1">
              <div
                className="bg-[#4F46E5] h-1 rounded-full transition-all"
                style={{ width: `${(currentHits / maxHits) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="sr-only">Edit Habit</DialogTitle>
        <HabitModal
          id={id}
          title={initialTitle}
          note={initialNote}
          hitLevels={hitLevels}
          streak={currentStreak}
          currentHits={currentHits}
          maxHits={maxHits}
          totalHits={totalHits}
          onClose={() => setIsModalOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
