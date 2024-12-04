import React, { useState, KeyboardEvent } from 'react';
import { Plus, Tabs } from 'lucide-react';
import { HabitCard } from './HabitCard';
import { DailyCard } from './DailyCard';
import { TodoCard } from './TodoCard';
import { TimeBlocking } from './TimeBlocking';
import { useHabits } from '../hooks/useHabits';
import { useDailies } from '../hooks/useDailies';
import { useTodos } from '../hooks/useTodos';

export function TasksPanel() {
  const [habitInput, setHabitInput] = useState('');
  const [dailyInput, setDailyInput] = useState('');
  const [todoInput, setTodoInput] = useState('');
  const [showCompletedTodos, setShowCompletedTodos] = useState(false);

  const { habits, createHabit } = useHabits();
  const { dailies, createDaily } = useDailies();
  const { todos, createTodo } = useTodos();

  const handleHabitKeyPress = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && habitInput.trim()) {
      console.log('TasksPanel: Creating new habit:', habitInput);

      const newHabit = {
        title: habitInput.trim(),
        description: '',
        type: 'habit',
        frequency: 'daily',
        priority: 'medium',
        difficulty: 'medium',
        maxHits: 4,
        status: 'active',
        tags: [],
        hitLevels: [
          { hits: 1, title: 'Show up', difficulty: 'Show Up' },
          { hits: 2, title: '30 minutes', difficulty: 'Easy' },
          { hits: 3, title: '1 hour', difficulty: 'Medium' },
          { hits: 4, title: '2 hours', difficulty: 'Hard' },
        ],
      };

      try {
        const success = await createHabit(newHabit);
        if (success) {
          console.log('TasksPanel: Successfully created habit');
          setHabitInput('');
        }
      } catch (error) {
        console.error('TasksPanel: Error creating habit:', error);
      }
    }
  };

  const handleDailyKeyPress = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && dailyInput.trim()) {
      console.log('TasksPanel: Creating new daily:', dailyInput);

      const newDaily = {
        title: dailyInput.trim(),
        description: '',
        priority: 'medium',
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        duration: '30 minutes',
        tags: [],
        status: 'active',
        checklist: [],
      };

      try {
        const success = await createDaily(newDaily);
        if (success) {
          console.log('TasksPanel: Successfully created daily');
          setDailyInput('');
        }
      } catch (error) {
        console.error('TasksPanel: Error creating daily:', error);
      }
    }
  };

  const handleTodoKeyPress = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && todoInput.trim()) {
      console.log('TasksPanel: Creating new todo:', todoInput);

      const newTodo = {
        title: todoInput.trim(),
        description: '',
        priority: 'medium',
        dueDate: new Date().toISOString().split('T')[0],
        tags: [],
        status: 'active',
        checklist: [],
      };

      try {
        const success = await createTodo(newTodo);
        if (success) {
          console.log('TasksPanel: Successfully created todo');
          setTodoInput('');
        }
      } catch (error) {
        console.error('TasksPanel: Error creating todo:', error);
      }
    }
  };

  const activeTodos = todos.filter((todo) => todo.status === 'active');
  const completedTodos = todos.filter((todo) => todo.status === 'completed');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Habits Section */}
      <div className="card-dark space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 rounded-full bg-gradient-to-b from-purple-500/80 to-pink-500/80" />
            <h3 className="text-sm font-medium text-gray-300">Habits</h3>
          </div>
          <span className="text-xs text-gray-500">{habits.length}</span>
        </div>

        <div className="relative">
          <input
            type="text"
            value={habitInput}
            onChange={(e) => setHabitInput(e.target.value)}
            onKeyPress={handleHabitKeyPress}
            placeholder="Add new habit"
            className="input-dark"
          />
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 
            hover:bg-[#2A2B35]/50 rounded transition-colors"
          >
            <Plus className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        <div className="space-y-2">
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              id={habit.id}
              title={habit.title}
              note={habit.description}
              maxHits={habit.maxHits}
              currentHits={habit.currentHits}
              totalHits={habit.totalHits}
              currentStreak={habit.currentStreak}
              hitLevels={habit.hitLevels}
              tags={habit.tags}
              status={habit.status}
              snoozeUntil={habit.snoozeUntil}
              snoozeReason={habit.snoozeReason}
              difficulty={habit.difficulty}
            />
          ))}
        </div>
      </div>

      {/* Dailies Section */}
      <div className="card-dark space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 rounded-full bg-gradient-to-b from-blue-500/80 to-cyan-500/80" />
            <h3 className="text-sm font-medium text-gray-300">Dailies</h3>
          </div>
          <span className="text-xs text-gray-500">{dailies.length}</span>
        </div>

        <div className="relative">
          <input
            type="text"
            value={dailyInput}
            onChange={(e) => setDailyInput(e.target.value)}
            onKeyPress={handleDailyKeyPress}
            placeholder="Add new daily"
            className="input-dark"
          />
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 
            hover:bg-[#2A2B35]/50 rounded transition-colors"
          >
            <Plus className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        <div className="space-y-2">
          {dailies.map((daily) => (
            <DailyCard
              key={daily.id}
              id={daily.id}
              title={daily.title}
              note={daily.description}
              priority={daily.priority}
              days={daily.days}
              duration={daily.duration}
              tags={daily.tags}
              checklist={daily.checklist}
              status={daily.status}
              snoozeUntil={daily.snoozeUntil}
            />
          ))}
        </div>
      </div>

      {/* Todo Section */}
      <div className="card-dark space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 rounded-full bg-gradient-to-b from-emerald-500/80 to-teal-500/80" />
            <h3 className="text-sm font-medium text-gray-300">To-do List</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCompletedTodos(!showCompletedTodos)}
              className={`text-xs px-2 py-1 rounded-lg transition-colors ${
                showCompletedTodos
                  ? 'bg-[#4F46E5]/10 text-[#4F46E5] border border-[#4F46E5]/30'
                  : 'text-gray-400 hover:bg-[#2A2B35]/50'
              }`}
            >
              {showCompletedTodos ? 'Show Active' : 'Show Completed'}
            </button>
            <span className="text-xs text-gray-500">
              {showCompletedTodos ? completedTodos.length : activeTodos.length}
            </span>
          </div>
        </div>

        {!showCompletedTodos && (
          <div className="relative">
            <input
              type="text"
              value={todoInput}
              onChange={(e) => setTodoInput(e.target.value)}
              onKeyPress={handleTodoKeyPress}
              placeholder="Add new todo"
              className="input-dark"
            />
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 
              hover:bg-[#2A2B35]/50 rounded transition-colors"
            >
              <Plus className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        )}

        <div className="space-y-2">
          {(showCompletedTodos ? completedTodos : activeTodos).map((todo) => (
            <TodoCard
              key={todo.id}
              id={todo.id}
              title={todo.title}
              difficulty={todo.priority}
              dueDate={todo.dueDate}
              timeEstimate={todo.timeEstimate}
              tags={todo.tags}
              note={todo.description}
              checklist={todo.checklist}
              status={todo.status}
            />
          ))}
        </div>
      </div>

      {/* Time Blocking Section */}
      <TimeBlocking />
    </div>
  );
}
