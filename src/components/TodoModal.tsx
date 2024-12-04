import React, { useState, useEffect } from 'react';
import {
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Save, Plus, Tags, CheckSquare, X } from 'lucide-react';
import { useTodos } from '../hooks/useTodos';

interface TodoModalProps {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  dueDate: string;
  timeEstimate?: string;
  tags: string[];
  note?: string;
  checklist?: { id: string; text: string; completed: boolean; }[];
  status: 'active' | 'completed';
  onClose?: () => void;
}

export function TodoModal({
  id,
  title: initialTitle,
  difficulty: initialDifficulty,
  dueDate: initialDueDate,
  timeEstimate: initialTimeEstimate,
  tags: initialTags,
  note: initialNote,
  checklist: initialChecklist = [],
  status,
  onClose
}: TodoModalProps) {
  const [formData, setFormData] = useState({
    title: initialTitle,
    difficulty: initialDifficulty,
    dueDate: initialDueDate,
    timeEstimate: initialTimeEstimate || '',
    tags: initialTags,
    note: initialNote || '',
    checklist: initialChecklist,
  });

  const [newTag, setNewTag] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { updateTodo, getTodo } = useTodos();

  // Load latest todo data when modal opens
  useEffect(() => {
    const loadTodoData = async () => {
      const todo = await getTodo(id);
      if (todo) {
        setFormData({
          title: todo.title,
          difficulty: todo.priority as 'easy' | 'medium' | 'hard',
          dueDate: todo.dueDate,
          timeEstimate: todo.timeEstimate || '',
          tags: todo.tags,
          note: todo.description || '',
          checklist: todo.checklist || [],
        });
      }
    };
    loadTodoData();
  }, [id, getTodo]);

  const handleAddTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag]
      }));
      setNewTag('');
      setShowTagInput(false);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleAddChecklistItem = () => {
    if (newChecklistItem) {
      const newItem = {
        id: Date.now().toString(),
        text: newChecklistItem,
        completed: false
      };
      setFormData(prev => ({
        ...prev,
        checklist: [...prev.checklist, newItem]
      }));
      setNewChecklistItem('');
    }
  };

  const handleRemoveChecklistItem = (itemId: string) => {
    setFormData(prev => ({
      ...prev,
      checklist: prev.checklist.filter(item => item.id !== itemId)
    }));
  };

  const handleToggleChecklistItem = (itemId: string) => {
    setFormData(prev => ({
      ...prev,
      checklist: prev.checklist.map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
    }));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const updates = {
        title: formData.title,
        priority: formData.difficulty,
        dueDate: formData.dueDate,
        timeEstimate: formData.timeEstimate || null,
        tags: formData.tags,
        description: formData.note,
        checklist: formData.checklist
      };

      const success = await updateTodo(id, updates);
      if (success && onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error updating todo:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[80vh]">
      <DialogHeader>
        <DialogTitle className="sr-only">Edit Todo</DialogTitle>
        <div className="space-y-4">
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            disabled={status === 'completed'}
            className="w-full bg-transparent text-2xl font-bold text-white focus:outline-none 
              border-b border-transparent hover:border-[#4F46E5]/30 focus:border-[#4F46E5]
              transition-colors px-2 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Todo title"
          />
          <textarea
            value={formData.note}
            onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
            disabled={status === 'completed'}
            className="w-full bg-[#2A2B35]/20 rounded-lg px-3 py-2 text-sm text-gray-400 
              focus:outline-none focus:ring-1 focus:ring-[#4F46E5]/50 resize-none h-16
              disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Add a note about your todo..."
          />
        </div>
      </DialogHeader>

      <div className="flex-1 overflow-y-auto px-1 py-4 space-y-6">
        {/* Main Details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Due Date</label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
              disabled={status === 'completed'}
              className="w-full bg-[#2A2B35]/30 border border-[#2A2B35]/50 rounded-lg px-4 py-3
                text-gray-200 focus:outline-none focus:border-[#4F46E5]/50
                disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Time Estimate</label>
            <select
              value={formData.timeEstimate}
              onChange={(e) => setFormData(prev => ({ ...prev, timeEstimate: e.target.value }))}
              disabled={status === 'completed'}
              className="w-full bg-[#2A2B35]/30 border border-[#2A2B35]/50 rounded-lg px-4 py-3
                text-gray-200 focus:outline-none focus:border-[#4F46E5]/50
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">No estimate</option>
              <option value="15m">15 minutes</option>
              <option value="30m">30 minutes</option>
              <option value="1h">1 hour</option>
              <option value="2h">2 hours</option>
              <option value="4h">4 hours</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-400">Difficulty</label>
          <div className="flex gap-2">
            {(['easy', 'medium', 'hard'] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => setFormData(prev => ({ ...prev, difficulty: diff }))}
                disabled={status === 'completed'}
                className={`flex-1 px-3 py-2 rounded-lg border capitalize transition-all ${
                  formData.difficulty === diff
                    ? diff === 'easy'
                      ? 'bg-green-500/20 text-green-400 border-green-500/30'
                      : diff === 'medium'
                      ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                      : 'bg-red-500/20 text-red-400 border-red-500/30'
                    : 'border-[#2A2B35]/50 text-gray-400 hover:text-gray-300'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {diff}
              </button>
            ))}
          </div>
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
              disabled={status === 'completed'}
              className="text-sm px-2 py-1 rounded-lg bg-[#4F46E5]/10 text-[#4F46E5] 
                hover:bg-[#4F46E5]/20 transition-all flex items-center gap-1
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              Add Tag
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag) => (
              <div
                key={tag}
                className="px-3 py-1 rounded-full border bg-[#4F46E5]/10 text-[#4F46E5] 
                  border-[#4F46E5]/30 text-sm flex items-center gap-2"
              >
                <span>{tag}</span>
                {status !== 'completed' && (
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="text-[#4F46E5] hover:text-[#4F46E5]/80"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
            {showTagInput && status !== 'completed' && (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="New tag"
                  className="bg-[#2A2B35]/30 border border-[#2A2B35]/50 rounded-lg px-2 py-1
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
              Checklist
            </h3>
          </div>

          <div className="space-y-2">
            {formData.checklist.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2 p-2 rounded-lg bg-[#2A2B35]/20 
                  border border-[#2A2B35]/50"
              >
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => handleToggleChecklistItem(item.id)}
                  disabled={status === 'completed'}
                  className="rounded border-[#2A2B35] disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <span className={`flex-1 text-sm ${
                  item.completed ? 'text-gray-500 line-through' : 'text-gray-300'
                }`}>
                  {item.text}
                </span>
                {status !== 'completed' && (
                  <button
                    onClick={() => handleRemoveChecklistItem(item.id)}
                    className="text-gray-400 hover:text-gray-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}

            {status !== 'completed' && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newChecklistItem}
                  onChange={(e) => setNewChecklistItem(e.target.value)}
                  placeholder="Add checklist item"
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
            )}
          </div>
        </div>
      </div>

      <DialogFooter className="mt-6">
        <div className="flex justify-end gap-3">
          <button
            onClick={handleSave}
            disabled={isLoading || status === 'completed'}
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