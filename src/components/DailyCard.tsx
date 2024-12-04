import React, { useState, useEffect } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  Play,
  Trash2,
} from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from './ui/dialog';
import { DailyModal } from './DailyModal';
import { useDailies } from '../hooks/useDailies';
import { differenceInDays } from 'date-fns';
import { useCoins } from '../hooks/useCoins';

interface DailyCardProps {
  id: string;
  title: string;
  note?: string;
  priority: 'low' | 'medium' | 'high';
  days: string[];
  duration?: string;
  tags: string[];
  checklist?: { id: string; text: string; completed: boolean }[];
  status?: 'active' | 'snoozed' | 'completed';
  snoozeUntil?: string;
}

const priorityToDifficulty: Record<string, 'easy' | 'medium' | 'hard'> = {
  low: 'easy',
  medium: 'medium',
  high: 'hard',
};

export function DailyCard({
  id: dailyId,
  title,
  note,
  priority,
  days,
  duration = '30 minutes',
  tags = [],
  checklist = [],
  status = 'active',
  snoozeUntil,
}: DailyCardProps) {
  const [isCompleted, setIsCompleted] = useState(status === 'completed');
  const [showChecklist, setShowChecklist] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { updateDaily, deleteDaily, completeDaily } = useDailies();
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);
  const [localChecklist, setLocalChecklist] = useState(checklist);
  const { awardCoins } = useCoins();

  useEffect(() => {
    setIsCompleted(status === 'completed');
  }, [status]);

  useEffect(() => {
    setLocalChecklist(checklist);
  }, [checklist]);

  useEffect(() => {
    if (snoozeUntil) {
      const diff = differenceInDays(new Date(snoozeUntil), new Date());
      setDaysRemaining(Math.max(0, diff));
    }
  }, [snoozeUntil]);

  const handleComplete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const newStatus = !isCompleted;
      setIsCompleted(newStatus);

      if (newStatus) {
        // Mark as completed
        await completeDaily(dailyId);
        const difficulty = priorityToDifficulty[priority];
        await awardCoins('daily', dailyId, difficulty);
      } else {
        // Mark as active
        await updateDaily(dailyId, {
          status: 'active',
        });
      }
    } catch (error) {
      console.error('Error toggling daily completion:', error);
      // Revert the local state if the update fails
      setIsCompleted(!isCompleted);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteDaily(dailyId);
    } catch (error) {
      console.error('Error deleting daily:', error);
    }
  };

  const handleUnsnooze = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await updateDaily(dailyId, {
        status: 'active',
        snoozeUntil: null,
        snoozeReason: null,
      });
    } catch (error) {
      console.error('Error unsnoozing daily:', error);
    }
  };

  const handleChecklistItemToggle = async (
    itemId: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    try {
      const updatedChecklist = localChecklist.map((item) =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      );

      setLocalChecklist(updatedChecklist);

      await updateDaily(dailyId, {
        checklist: updatedChecklist,
      });
    } catch (error) {
      console.error('Error updating checklist item:', error);
      setLocalChecklist(checklist);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <div
          className="bg-[#1A1B23] border border-[#2A2B35]/50 rounded-xl p-4 
          hover:border-[#4F46E5]/30 transition-all cursor-pointer group"
        >
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <button
                  onClick={handleComplete}
                  className={`mt-1 p-1.5 rounded-lg transition-colors ${
                    isCompleted
                      ? 'bg-green-500/20 text-green-400'
                      : 'hover:bg-[#2A2B35] text-gray-400'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>
                <div>
                  <h3
                    className={`font-medium ${
                      isCompleted ? 'text-gray-500 line-through' : 'text-white'
                    }`}
                  >
                    {title}
                  </h3>
                  {note && <p className="text-sm text-gray-400 mt-1">{note}</p>}
                  {status === 'snoozed' && daysRemaining !== null && (
                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className="px-2 py-0.5 rounded-full text-xs bg-yellow-500/10 text-yellow-400 
                        border border-yellow-500/20"
                      >
                        Snoozed for {daysRemaining}{' '}
                        {daysRemaining === 1 ? 'day' : 'days'}
                      </span>
                      <button
                        onClick={handleUnsnooze}
                        className="px-2 py-0.5 rounded-full text-xs bg-[#4F46E5]/10 text-[#4F46E5] 
                          border border-[#4F46E5]/20 flex items-center gap-1 hover:bg-[#4F46E5]/20 
                          transition-colors"
                      >
                        <Play className="w-3 h-3" />
                        Resume
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`px-2 py-1 rounded text-xs ${
                    priority === 'low'
                      ? 'bg-green-500/10 text-green-400'
                      : priority === 'medium'
                      ? 'bg-yellow-500/10 text-yellow-400'
                      : 'bg-red-500/10 text-red-400'
                  }`}
                >
                  {priority}
                </div>
                <button
                  onClick={handleDelete}
                  className="p-1.5 rounded-lg hover:bg-[#2A2B35] text-gray-400 hover:text-red-500 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-1.5 text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>{days.join(', ')}</span>
              </div>
              {duration && (
                <div className="flex items-center gap-1.5 text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>{duration}</span>
                </div>
              )}
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <div
                    key={tag}
                    className="px-2 py-0.5 rounded-full text-xs bg-[#4F46E5]/10 text-[#4F46E5]"
                  >
                    {tag}
                  </div>
                ))}
              </div>
            )}

            {localChecklist.length > 0 && (
              <div className="space-y-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowChecklist(!showChecklist);
                  }}
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300"
                >
                  {showChecklist ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                  Subtasks (
                  {localChecklist.filter((item) => item.completed).length}/
                  {localChecklist.length})
                </button>
                {showChecklist && (
                  <div className="space-y-2 pl-6">
                    {localChecklist.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start gap-2 cursor-pointer"
                        onClick={(e) => handleChecklistItemToggle(item.id, e)}
                      >
                        <input
                          type="checkbox"
                          checked={item.completed}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleChecklistItemToggle(item.id, e);
                          }}
                          className="mt-1 cursor-pointer"
                        />
                        <span
                          className={`text-sm ${
                            item.completed
                              ? 'text-gray-500 line-through'
                              : 'text-gray-300'
                          }`}
                        >
                          {item.text}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="sr-only">Edit Daily Task</DialogTitle>
        <DailyModal
          id={dailyId}
          title={title}
          priority={priority}
          days={days}
          duration={duration}
          tags={tags}
          note={note}
          checklist={localChecklist}
          status={status}
          snoozeUntil={snoozeUntil}
        />
      </DialogContent>
    </Dialog>
  );
}
