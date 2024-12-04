import { useCallback, useEffect, useState } from 'react';
import { useHabits } from './useHabits';
import { useDailies } from './useDailies';
import { useTodos } from './useTodos';

interface ProgressStats {
  habits: {
    total: number;
    completed: number;
    percentage: number;
  };
  dailies: {
    total: number;
    completed: number;
    percentage: number;
  };
  todos: {
    total: number;
    completed: number;
    percentage: number;
  };
  dailyProgress: number;
}

export function useProgress() {
  const [stats, setStats] = useState<ProgressStats>({
    habits: { total: 0, completed: 0, percentage: 0 },
    dailies: { total: 0, completed: 0, percentage: 0 },
    todos: { total: 0, completed: 0, percentage: 0 },
    dailyProgress: 0,
  });

  const { habits } = useHabits();
  const { dailies } = useDailies();
  const { todos } = useTodos();

  const calculateStats = useCallback(() => {
    // Calculate habits progress - multiply each habit by 4
    const totalHabitsHits = habits.length * 4;
    const completedHits = habits.reduce((sum, h) => sum + h.currentHits, 0);
    const habitsPercentage =
      totalHabitsHits > 0 ? (completedHits / totalHabitsHits) * 100 : 0;

    // Calculate dailies progress - count all dailies regardless of status
    const totalDailies = dailies.length;
    const completedDailies = dailies.filter(
      (d) => d.status === 'completed'
    ).length;
    const dailiesPercentage =
      totalDailies > 0 ? (completedDailies / totalDailies) * 100 : 0;

    // Calculate todos progress - only active todos
    const activeTodos = todos.filter((t) => t.status === 'active');
    const completedActiveTodos = activeTodos.filter(
      (t) => t.status === 'completed'
    );
    const todosPercentage =
      activeTodos.length > 0
        ? (completedActiveTodos.length / activeTodos.length) * 100
        : 0;

    // Calculate daily progress (average of all percentages)
    const dailyProgress =
      (habitsPercentage + dailiesPercentage + todosPercentage) / 3;

    setStats({
      habits: {
        total: totalHabitsHits,
        completed: completedHits,
        percentage: habitsPercentage,
      },
      dailies: {
        total: totalDailies,
        completed: completedDailies,
        percentage: dailiesPercentage,
      },
      todos: {
        total: activeTodos.length,
        completed: completedActiveTodos.length,
        percentage: todosPercentage,
      },
      dailyProgress,
    });
  }, [habits, dailies, todos]);

  useEffect(() => {
    calculateStats();
  }, [calculateStats]);

  return stats;
}
