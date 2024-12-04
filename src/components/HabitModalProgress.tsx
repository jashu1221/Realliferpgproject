import React, { useState } from 'react';
import {
  Star,
  Check,
  Trophy,
  Calendar,
  TrendingUp,
  Award,
  Target,
  Clock,
  AlertCircle,
  XCircle,
  Coffee,
  Filter,
  Calendar as CalendarIcon,
  ChevronRight,
} from 'lucide-react';

interface HabitModalProgressProps {
  streak: number;
  count: number;
  maxCount: number;
  completedDays: number;
  totalDays: number;
  completedHits: number;
  totalHits: number;
}

interface DayStatus {
  date: Date;
  status: 'done' | 'skip' | 'snooze' | 'rest' | 'none';
  reason?: string;
  hits?: number;
}

interface SnoozeRecord {
  id: string;
  startDate: Date;
  endDate: Date;
  reason: string;
  status: 'active' | 'expired' | 'cancelled';
}

// Mock data - Replace with real data in production
const last90Days: DayStatus[] = Array.from({ length: 90 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - i);
  const random = Math.random();

  if (random > 0.8)
    return { date, status: 'done', hits: Math.floor(Math.random() * 4) + 1 };
  if (random > 0.6) return { date, status: 'skip', reason: 'Busy with work' };
  if (random > 0.4) return { date, status: 'snooze', reason: 'Feeling unwell' };
  if (random > 0.2) return { date, status: 'rest' };
  return { date, status: 'none' };
}).reverse();

// Mock snooze history - Replace with real data
const snoozeHistory: SnoozeRecord[] = [
  {
    id: '1',
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-03-07'),
    reason: 'Taking a break for recovery',
    status: 'expired',
  },
  {
    id: '2',
    startDate: new Date('2024-03-15'),
    endDate: new Date('2024-03-20'),
    reason: 'Traveling for work',
    status: 'active',
  },
  {
    id: '3',
    startDate: new Date('2024-02-15'),
    endDate: new Date('2024-02-18'),
    reason: 'Minor injury',
    status: 'cancelled',
  },
];

const statusColors = {
  done: 'bg-[#4F46E5]/20 border-[#4F46E5]/30 group-hover:bg-[#4F46E5]/30',
  skip: 'bg-red-500/20 border-red-500/30 group-hover:bg-red-500/30',
  snooze: 'bg-yellow-500/20 border-yellow-500/30 group-hover:bg-yellow-500/30',
  rest: 'bg-green-500/20 border-green-500/30 group-hover:bg-green-500/30',
  none: 'bg-[#2A2B35]/20 border-[#2A2B35]/30 group-hover:bg-[#2A2B35]/40',
};

const statusIcons = {
  done: Check,
  skip: XCircle,
  snooze: Clock,
  rest: Coffee,
  none: AlertCircle,
};

export function HabitModalProgress({
  streak,
  count,
  maxCount,
  completedDays,
  totalDays,
  completedHits,
  totalHits,
}: HabitModalProgressProps) {
  const [filter, setFilter] = useState<
    'all' | 'done' | 'skip' | 'snooze' | 'rest'
  >('all');
  const [showSnoozeHistory, setShowSnoozeHistory] = useState(false);

  // Group days into rows of 15 for a more compact view
  const rows: DayStatus[][] = [];
  let currentRow: DayStatus[] = [];

  last90Days.forEach((day) => {
    if (filter === 'all' || day.status === filter) {
      currentRow.push(day);
      if (currentRow.length === 15) {
        rows.push(currentRow);
        currentRow = [];
      }
    }
  });
  if (currentRow.length > 0) {
    rows.push(currentRow);
  }

  const getStatusColor = (status: 'active' | 'expired' | 'cancelled') => {
    switch (status) {
      case 'active':
        return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400';
      case 'expired':
        return 'bg-gray-500/20 border-gray-500/30 text-gray-400';
      case 'cancelled':
        return 'bg-red-500/20 border-red-500/30 text-red-400';
    }
  };

  return (
    <div className="space-y-8  max-h-[calc(100vh-16rem)] px-1">
      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-4">
        {[
          {
            icon: Trophy,
            label: 'Current Streak',
            value: `${streak} days`,
            color: 'text-[#4F46E5]',
          },
          {
            icon: Star,
            label: 'Completion Rate',
            value: `${Math.round((completedDays / totalDays) * 100)}%`,
            color: 'text-[#D4AF37]',
          },
          {
            icon: Target,
            label: 'Total Hits',
            value: `${completedHits}/${totalHits}`,
            color: 'text-[#4F46E5]',
          },
          {
            icon: Award,
            label: 'Best Streak',
            value: '15 days',
            color: 'text-[#D4AF37]',
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-[#2A2B35]/30 rounded-xl p-4 border border-[#2A2B35]/50"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-[#2A2B35]/50 flex items-center justify-center">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <span className="text-xs text-gray-400">{stat.label}</span>
            </div>
            <span className="text-lg font-semibold text-white">
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* Activity Calendar */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#4F46E5]" />
            90-Day Activity
          </h3>

          {/* Filter Buttons */}
          <div className="flex items-center gap-2">
            {[
              { value: 'all', label: 'All' },
              { value: 'done', label: 'Done' },
              { value: 'skip', label: 'Skipped' },
              { value: 'snooze', label: 'Snoozed' },
              { value: 'rest', label: 'Rest' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value as typeof filter)}
                className={`px-2 py-1 rounded-lg text-xs transition-all ${
                  filter === option.value
                    ? 'bg-[#4F46E5]/20 text-[#4F46E5] border border-[#4F46E5]/30'
                    : 'text-gray-400 hover:bg-[#2A2B35]/30'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#2A2B35]/30 rounded-xl p-4 border border-[#2A2B35]/50">
          {/* Calendar Grid */}
          <div className="space-y-0.5">
            {rows.map((row, rowIndex) => (
              <div key={rowIndex} className="flex gap-0.5">
                {row.map((day, dayIndex) => {
                  const StatusIcon = statusIcons[day.status];
                  return (
                    <div key={dayIndex} className="group relative">
                      <div
                        className={`w-2.5 h-2.5 rounded-[1px] border ${
                          statusColors[day.status]
                        } 
                          transition-all duration-200`}
                      />

                      {/* Tooltip */}
                      <div
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 
                        bg-[#1A1B23] border border-[#2A2B35]/50 rounded-lg p-2 z-50
                        opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity
                        shadow-xl"
                      >
                        <div className="text-xs space-y-1">
                          <div className="font-medium text-white">
                            {day.date.toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </div>
                          <div className="flex items-center gap-1.5 text-gray-400">
                            <StatusIcon className="w-3.5 h-3.5" />
                            <span className="capitalize">{day.status}</span>
                          </div>
                          {day.hits && (
                            <div className="flex items-center gap-1.5 text-[#4F46E5]">
                              <Target className="w-3.5 h-3.5" />
                              <span>{day.hits} hits</span>
                            </div>
                          )}
                          {day.reason && (
                            <div className="text-gray-500 italic">
                              "{day.reason}"
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[#2A2B35]/50">
            {[
              { status: 'done', label: 'Completed' },
              { status: 'skip', label: 'Skipped' },
              { status: 'snooze', label: 'Snoozed' },
              { status: 'rest', label: 'Rest Day' },
            ].map((item) => {
              const Icon = statusIcons[item.status as keyof typeof statusIcons];
              return (
                <div key={item.status} className="flex items-center gap-1.5">
                  <div
                    className={`w-2 h-2 rounded-[1px] border ${
                      statusColors[item.status as keyof typeof statusColors]
                    }`}
                  />
                  <span className="text-[10px] text-gray-400">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Snooze History */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#4F46E5]" />
            Snooze History
          </h3>
          <button
            onClick={() => setShowSnoozeHistory(!showSnoozeHistory)}
            className="text-sm text-[#4F46E5] hover:text-[#4F46E5]/80 transition-colors flex items-center gap-1"
          >
            {showSnoozeHistory ? 'Hide' : 'Show'} History
            <ChevronRight
              className={`w-4 h-4 transition-transform duration-300 ${
                showSnoozeHistory ? 'rotate-90' : ''
              }`}
            />
          </button>
        </div>

        {showSnoozeHistory && (
          <div className="space-y-2">
            {snoozeHistory.map((record) => (
              <div
                key={record.id}
                className="p-3 rounded-lg bg-[#2A2B35]/30 border border-[#2A2B35]/50
                  hover:border-[#4F46E5]/30 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#2A2B35]/50 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-[#4F46E5]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-200">
                          {record.reason}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(
                            record.status
                          )}`}
                        >
                          {record.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                        <CalendarIcon className="w-3.5 h-3.5" />
                        <span>
                          {record.startDate.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}{' '}
                          -{' '}
                          {record.endDate.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Monthly Stats */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#4F46E5]" />
          Monthly Overview
        </h3>

        <div className="bg-[#2A2B35]/30 rounded-xl p-4 border border-[#2A2B35]/50">
          <div className="space-y-4">
            {[
              {
                label: 'Completion Days',
                value: completedDays,
                total: totalDays,
              },
              { label: 'Total Hits', value: completedHits, total: totalHits },
              {
                label: 'Rest Days Taken',
                value: last90Days.filter((d) => d.status === 'rest').length,
                total: 8,
              },
            ].map((stat) => (
              <div key={stat.label} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">{stat.label}</span>
                  <span className="text-[#4F46E5]">
                    {stat.value}/{stat.total}
                  </span>
                </div>
                <div className="h-1.5 bg-[#1A1B23] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] rounded-full"
                    style={{ width: `${(stat.value / stat.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
