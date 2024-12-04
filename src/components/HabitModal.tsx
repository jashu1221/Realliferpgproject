import React, { useState, useEffect } from 'react';
import {
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
} from './ui/dialog';
import { Save } from 'lucide-react';
import { HabitModalDetails } from './HabitModalDetails';
import { HabitModalProgress } from './HabitModalProgress';
import { useHabits } from '../hooks/useHabits';

interface HabitModalProps {
  id: string;
  title: string;
  note: string;
  hitLevels: HitLevel[];
  streak: number;
  count: number;
  maxCount: number;
  onClose?: () => void;
}

interface HitLevel {
  hits: number;
  title: string;
  difficulty: 'Show Up' | 'Easy' | 'Medium' | 'Hard';
}

type ActiveTab = 'details' | 'progress';

export function HabitModal({
  id,
  title: initialTitle,
  note: initialNote,
  hitLevels: initialHitLevels,
  streak,
  count,
  maxCount,
  onClose,
}: HabitModalProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('details');
  const [title, setTitle] = useState(initialTitle);
  const [note, setNote] = useState(initialNote);
  const [hitLevels, setHitLevels] = useState<HitLevel[]>(initialHitLevels);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'custom'>('daily');
  const [tags, setTags] = useState<string[]>([]);
  const [snoozeUntil, setSnoozeUntil] = useState('');
  const [snoozeReason, setSnoozeReason] = useState('');

  const { updateHabit, getHabit } = useHabits();

  // Load habit data from database
  useEffect(() => {
    const loadHabitData = async () => {
      const habit = await getHabit(id);
      if (habit) {
        setTitle(habit.title);
        setNote(habit.description || '');
        setHitLevels(habit.hitLevels || initialHitLevels);
        setPriority(habit.priority || 'medium');
        setDifficulty(habit.difficulty || 'medium');
        setFrequency(habit.frequency || 'daily');
        setTags(habit.tags || []);
        setSnoozeUntil(habit.snoozeUntil || '');
        setSnoozeReason(habit.snoozeReason || '');
      }
    };

    loadHabitData();
  }, [id, getHabit]);

  const handleSave = async () => {
    console.log('HabitModal: Saving habit changes');
    
    const updates = {
      title,
      description: note,
      hitLevels,
      priority,
      difficulty,
      frequency,
      tags,
      snoozeUntil: snoozeUntil || null,
      snoozeReason: snoozeReason || null,
      status: snoozeUntil ? 'snoozed' : 'active'
    };

    console.log('HabitModal: Updates to save:', updates);
    
    const success = await updateHabit(id, updates);

    if (success) {
      console.log('HabitModal: Successfully saved habit changes');
      if (onClose) {
        onClose();
      }
    }
  };

  return (
    <div className="flex flex-col h-[80vh]">
      <DialogHeader>
        <DialogTitle>Edit Habit</DialogTitle>
      </DialogHeader>

      <div className="flex flex-col h-[80vh]">
        <div className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent text-2xl font-bold text-white focus:outline-none 
              border-b border-transparent hover:border-[#4F46E5]/30 focus:border-[#4F46E5]
              transition-colors px-2 py-1"
            placeholder="Habit title"
          />
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full bg-[#2A2B35]/20 rounded-lg px-3 py-2 text-sm text-gray-400 
              focus:outline-none focus:ring-1 focus:ring-[#4F46E5]/50 resize-none h-16"
            placeholder="Add a note about your habit..."
          />
        </div>

        <div className="flex items-center gap-6 border-b border-[#2A2B35]/50 mt-4">
          <button
            onClick={() => setActiveTab('details')}
            className={`flex items-center gap-2 px-1 py-2 text-sm font-medium 
              border-b-2 transition-all ${
                activeTab === 'details'
                  ? 'border-[#4F46E5] text-[#4F46E5]'
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
          >
            Main Details
          </button>
          <button
            onClick={() => setActiveTab('progress')}
            className={`flex items-center gap-2 px-1 py-2 text-sm font-medium 
              border-b-2 transition-all ${
                activeTab === 'progress'
                  ? 'border-[#4F46E5] text-[#4F46E5]'
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
          >
            Progress
          </button>
        </div>

        <div className="flex-1 overflow-y-scroll px-1 py-4">
          {activeTab === 'details' && (
            <div className="space-y-7">
              <HabitModalDetails
                onUpdateHitLevels={setHitLevels}
                hitLevels={hitLevels}
                title={title}
                note={note}
                linkedGoals={[]}
                selectedTags={tags}
                onUpdateLinkedGoals={() => {}}
                onUpdateTags={setTags}
                priority={priority}
                onUpdatePriority={setPriority}
                difficulty={difficulty}
                onUpdateDifficulty={setDifficulty}
                frequency={frequency}
                onUpdateFrequency={setFrequency}
                snoozeUntil={snoozeUntil}
                snoozeReason={snoozeReason}
                onUpdateSnooze={(until, reason) => {
                  setSnoozeUntil(until);
                  setSnoozeReason(reason || '');
                }}
              />
            </div>
          )}

          {activeTab === 'progress' && (
            <div className="space-y-4">
              <HabitModalProgress
                streak={streak}
                count={count}
                maxCount={maxCount}
                stats={{
                  totalCompletions: 0,
                  totalHits: 0,
                  averageHits: 0,
                  currentStreak: streak,
                  bestStreak: streak
                }}
              />
            </div>
          )}
        </div>

        <DialogFooter className="mt-6">
          <div className="flex justify-end gap-3">
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-lg bg-[#4F46E5] text-white hover:bg-[#4338CA] 
                transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </DialogFooter>
      </div>
    </div>
  );
}