import React, { useState, useRef, useEffect } from 'react';
import {
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { 
  Save, Clock, AlertCircle, Plus, Tags, 
  CheckSquare, X, Check 
} from 'lucide-react';
import { useDailies } from '../hooks/useDailies';

interface DailyModalProps {
  id: string;
  title: string;
  note?: string;
  priority: 'low' | 'medium' | 'high';
  days: string[];
  duration?: string;
  tags: string[];
  checklist?: { id: string; text: string; completed: boolean; }[];
  onClose?: () => void;
}

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function DailyModal({
  id,
  title: initialTitle,
  note: initialNote,
  priority: initialPriority,
  days: initialDays,
  duration: initialDuration,
  tags: initialTags,
  checklist: initialChecklist = [],
  onClose
}: DailyModalProps) {
  const { updateDaily, getDaily, snoozeDaily } = useDailies();
  const [title, setTitle] = useState(initialTitle);
  const [note, setNote] = useState(initialNote || '');
  const [priority, setPriority] = useState(initialPriority);
  const [days, setDays] = useState(initialDays);
  const [duration, setDuration] = useState(initialDuration);
  const [tags, setTags] = useState(initialTags);
  const [checklist, setChecklist] = useState(initialChecklist);
  const [newTag, setNewTag] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSnoozeOptions, setShowSnoozeOptions] = useState(false);
  const [snoozeUntil, setSnoozeUntil] = useState('');
  const [snoozeReason, setSnoozeReason] = useState('');

  const titleRef = useRef<HTMLInputElement>(null);
  const noteRef = useRef<HTMLTextAreaElement>(null);

  // Load daily data
  useEffect(() => {
    const loadDaily = async () => {
      const daily = await getDaily(id);
      if (daily) {
        setTitle(daily.title);
        setNote(daily.description || '');
        setPriority(daily.priority);
        setDays(daily.days);
        setDuration(daily.duration);
        setTags(daily.tags);
        setChecklist(daily.checklist || []);
        if (daily.snoozeUntil) {
          setSnoozeUntil(daily.snoozeUntil);
          setSnoozeReason(daily.snoozeReason || '');
        }
      }
    };

    loadDaily();
  }, [id, getDaily]);

  const priorityColors = {
    low: 'bg-green-500/20 text-green-400 border-green-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    high: 'bg-red-500/20 text-red-400 border-red-500/30'
  };

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
      setShowTagInput(false);
    }
  };

  const handleAddChecklistItem = () => {
    if (newChecklistItem) {
      setChecklist([
        ...checklist,
        { id: Date.now().toString(), text: newChecklistItem, completed: false }
      ]);
      setNewChecklistItem('');
    }
  };

  const handleSnooze = async () => {
    try {
      setIsLoading(true);
      const success = await snoozeDaily(id, snoozeUntil, snoozeReason);
      if (success) {
        onClose?.();
      }
    } catch (error) {
      console.error('Error snoozing daily:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const updates = {
        title,
        description: note,
        priority,
        days,
        duration,
        tags,
        checklist
      };

      const success = await updateDaily(id, updates);
      if (success) {
        onClose?.();
      }
    } catch (error) {
      console.error('Error updating daily:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[80vh]">
      <DialogHeader>
        <DialogTitle className="sr-only">Edit Daily Task</DialogTitle>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <input
              ref={titleRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 bg-transparent text-2xl font-bold text-white focus:outline-none 
                border-b border-transparent hover:border-[#4F46E5]/30 focus:border-[#4F46E5]
                transition-colors px-2 py-1"
              placeholder="Daily task title"
            />
            <button
              onClick={() => setShowSnoozeOptions(!showSnoozeOptions)}
              className="px-3 py-1.5 rounded-lg bg-[#2A2B35]/30 text-gray-400 
                hover:bg-[#2A2B35]/50 transition-all flex items-center gap-2 ml-4"
            >
              <Clock className="w-4 h-4" />
              Snooze
            </button>
          </div>
          <textarea
            ref={noteRef}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full bg-[#2A2B35]/20 rounded-lg px-3 py-2 text-sm text-gray-400 
              focus:outline-none focus:ring-1 focus:ring-[#4F46E5]/50 resize-none h-16"
            placeholder="Add a note about your daily task..."
          />
        </div>
      </DialogHeader>

      <div className="flex-1 overflow-y-auto px-1 py-4 space-y-6">
        {showSnoozeOptions && (
          <div className="p-4 bg-[#2A2B35]/30 rounded-lg border border-[#2A2B35]/50">
            <div className="flex items-center gap-2 text-sm text-yellow-400 mb-3">
              <AlertCircle className="w-4 h-4" />
              <span>Snooze this daily</span>
            </div>

            <div className="space-y-3">
              <input
                type="date"
                value={snoozeUntil}
                onChange={(e) => setSnoozeUntil(e.target.value)}
                className="w-full bg-[#1A1B23]/50 border border-[#2A2B35]/50 rounded-lg px-3 py-2
                  text-sm text-gray-400 focus:outline-none focus:border-[#4F46E5]/30"
              />

              <textarea
                value={snoozeReason}
                onChange={(e) => setSnoozeReason(e.target.value)}
                placeholder="Reason for snoozing (optional)"
                rows={2}
                className="w-full bg-[#1A1B23]/50 border border-[#2A2B35]/50 rounded-lg px-3 py-2
                  text-sm text-gray-400 placeholder:text-gray-500 focus:outline-none 
                  focus:border-[#4F46E5]/30 resize-none"
              />

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowSnoozeOptions(false)}
                  className="px-3 py-1.5 rounded-lg text-gray-400 
                    hover:bg-[#2A2B35]/50 transition-all text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSnooze}
                  disabled={!snoozeUntil}
                  className="px-3 py-1.5 rounded-lg bg-yellow-500/10 text-yellow-400
                    hover:bg-yellow-500/20 transition-all text-sm border border-yellow-500/30
                    disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm Snooze
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Priority */}
        <div className="space-y-2">
          <label className="text-sm text-gray-400">Priority</label>
          <div className="flex gap-2">
            {(['low', 'medium', 'high'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPriority(p)}
                className={`flex-1 px-3 py-2 rounded-lg border capitalize transition-all ${
                  priority === p
                    ? priorityColors[p]
                    : 'border-[#2A2B35]/50 text-gray-400 hover:text-gray-300'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Days */}
        <div className="space-y-2">
          <label className="text-sm text-gray-400">Days</label>
          <div className="flex gap-2">
            {weekDays.map((day) => (
              <button
                key={day}
                onClick={() => {
                  if (days.includes(day)) {
                    setDays(days.filter(d => d !== day));
                  } else {
                    setDays([...days, day]);
                  }
                }}
                className={`px-3 py-2 rounded-lg border text-sm transition-all ${
                  days.includes(day)
                    ? 'bg-[#4F46E5]/20 text-[#4F46E5] border-[#4F46E5]/30'
                    : 'border-[#2A2B35]/50 text-gray-400 hover:text-gray-300'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div className="space-y-2">
          <label className="text-sm text-gray-400">Duration</label>
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full bg-[#2A2B35]/20 rounded-lg px-3 py-2 text-sm text-gray-300
              border border-[#2A2B35]/50 focus:outline-none focus:border-[#4F46E5]/30"
          >
            <option value="15m">15 minutes</option>
            <option value="30m">30 minutes</option>
            <option value="1h">1 hour</option>
            <option value="2h">2 hours</option>
            <option value="4h">4 hours</option>
          </select>
        </div>

        {/* Tags */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <Tags className="w-4 h-4 text-[#4F46E5]" />
              Tags
            </h3>
            <button
              onClick={() => setShowTagInput(true)}
              className="text-sm px-2 py-1 rounded-lg bg-[#4F46E5]/10 text-[#4F46E5] 
                hover:bg-[#4F46E5]/20 transition-all flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Add Tag
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <div
                key={tag}
                className="px-3 py-1 rounded-full border bg-[#4F46E5]/10 text-[#4F46E5] 
                  border-[#4F46E5]/30 text-sm flex items-center gap-2"
              >
                <span>{tag}</span>
                <button
                  onClick={() => setTags(tags.filter(t => t !== tag))}
                  className="text-[#4F46E5] hover:text-[#4F46E5]/80"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {showTagInput && (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="New tag"
                  className="bg-[#1A1B23]/50 border border-[#2A2B35]/50 rounded-lg px-2 py-1
                    text-sm text-gray-300 focus:outline-none focus:border-[#4F46E5]/30"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                />
                <button
                  onClick={() => setShowTagInput(false)}
                  className="text-gray-400 hover:text-gray-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Checklist */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-[#4F46E5]" />
              Subtasks
            </h3>
          </div>

          <div className="space-y-2">
            {checklist.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2 p-2 rounded-lg bg-[#2A2B35]/20 
                  border border-[#2A2B35]/50"
              >
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => {
                    setChecklist(checklist.map(i => 
                      i.id === item.id ? { ...i, completed: !i.completed } : i
                    ));
                  }}
                  className="rounded border-[#2A2B35]"
                />
                <span className={`flex-1 text-sm ${
                  item.completed ? 'text-gray-500 line-through' : 'text-gray-300'
                }`}>
                  {item.text}
                </span>
                <button
                  onClick={() => setChecklist(checklist.filter(i => i.id !== item.id))}
                  className="text-gray-400 hover:text-gray-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}

            <div className="flex gap-2">
              <input
                type="text"
                value={newChecklistItem}
                onChange={(e) => setNewChecklistItem(e.target.value)}
                placeholder="Add subtask"
                className="flex-1 bg-[#1A1B23]/50 border border-[#2A2B35]/50 rounded-lg px-3 py-2
                  text-sm text-gray-300 focus:outline-none focus:border-[#4F46E5]/30"
                onKeyPress={(e) => e.key === 'Enter' && handleAddChecklistItem()}
              />
              <button
                onClick={handleAddChecklistItem}
                className="px-3 py-2 rounded-lg bg-[#4F46E5]/10 text-[#4F46E5] 
                  hover:bg-[#4F46E5]/20 transition-all"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <DialogFooter className="mt-6">
        <div className="flex justify-end gap-3">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg bg-[#4F46E5] text-white hover:bg-[#4338CA] 
              transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </DialogFooter>
    </div>
  );
}