import { useState, useCallback } from 'react';
import { useSpeechRecognition } from '../lib/recognition';
import { useAuth } from '../contexts/AuthContext';
import { useHabits } from './useHabits';
import { useDailies } from './useDailies';
import { useTodos } from './useTodos';
import { useCoins } from './useCoins';
import {
  generateAssistantResponse,
  parseCommand,
} from '../lib/openai/assistant';
import { synthesizeSpeech, playAudioBuffer } from '../lib/elevenlabs';

export interface AssistantContext {
  userName: string;
  level: number;
  coins: number;
  stats: {
    habits: number;
    dailies: number;
    todos: number;
    activeHabits: number;
    completedDailies: number;
    pendingTodos: number;
  };
}

export function useVoiceAssistant() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { userProfile } = useAuth();
  const { habits, createHabit } = useHabits();
  const { dailies, createDaily } = useDailies();
  const { todos, createTodo } = useTodos();
  const { userCoins } = useCoins();

  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    error: recognitionError,
  } = useSpeechRecognition();

  const speak = useCallback(async (text: string) => {
    try {
      const audioBuffer = await synthesizeSpeech(text);
      await playAudioBuffer(audioBuffer);
    } catch (error) {
      console.error('Error speaking:', error);
    }
  }, []);

  const processCommand = useCallback(
    async (command: string, context: AssistantContext) => {
      setIsProcessing(true);
      try {
        const parsedCommand = await parseCommand(command);
        let response = '';

        switch (parsedCommand.type) {
          case 'create_habit':
            if (parsedCommand.data?.title) {
              const habitData = {
                title: parsedCommand.data.title,
                description: parsedCommand.data.description || '',
                type: 'habit',
                frequency: 'daily',
                priority: parsedCommand.data.priority || 'medium',
                difficulty: 'medium',
                maxHits: 4,
                currentHits: 0,
                totalHits: 0,
                status: 'active',
                currentStreak: 0,
                bestStreak: 0,
                tags: [],
                hitLevels: [
                  { hits: 1, title: 'Show up', difficulty: 'Show Up' },
                  { hits: 2, title: '30 minutes', difficulty: 'Easy' },
                  { hits: 3, title: '1 hour', difficulty: 'Medium' },
                  { hits: 4, title: '2 hours', difficulty: 'Hard' },
                ],
              };

              await createHabit(habitData);
              response = `Created new habit: ${parsedCommand.data.title}. You can track your progress in the habits panel.`;
            }
            break;

          case 'create_daily':
            if (parsedCommand.data?.title) {
              const dailyData = {
                title: parsedCommand.data.title,
                description: parsedCommand.data.description || '',
                priority: parsedCommand.data.priority || 'medium',
                days: parsedCommand.data.days || [
                  'Mon',
                  'Tue',
                  'Wed',
                  'Thu',
                  'Fri',
                ],
                tags: [],
                status: 'active',
              };

              await createDaily(dailyData);
              response = `Created new daily task: ${parsedCommand.data.title}. You can find it in your dailies list.`;
            }
            break;

          case 'create_todo':
            if (parsedCommand.data?.title) {
              const todoData = {
                title: parsedCommand.data.title,
                description: parsedCommand.data.description || '',
                priority: parsedCommand.data.priority || 'medium',
                dueDate:
                  parsedCommand.data.dueDate ||
                  new Date().toISOString().split('T')[0],
                tags: [],
                status: 'active',
              };

              await createTodo(todoData);
              response = `Added new todo: ${parsedCommand.data.title}. Check your todo list to see it.`;
            }
            break;

          case 'status':
            response = `${context.userName}, you're Level ${context.level} with ${context.coins} coins. 
              You have ${context.stats.activeHabits} active habits, 
              ${context.stats.completedDailies} completed dailies, and 
              ${context.stats.pendingTodos} pending todos.`;
            break;

          case 'list':
            let items = [];
            if (parsedCommand.data.type === 'habits') {
              items = habits.map((h) => `${h.title} (${h.status})`);
              response = `Your habits: ${items.join(', ')}`;
            } else if (parsedCommand.data.type === 'dailies') {
              items = dailies.map((d) => `${d.title} (${d.status})`);
              response = `Your dailies: ${items.join(', ')}`;
            } else if (parsedCommand.data.type === 'todos') {
              items = todos.map((t) => `${t.title} (${t.status})`);
              response = `Your todos: ${items.join(', ')}`;
            }
            break;

          default:
            response = await generateAssistantResponse(command, context);
        }
        console.log(response);
        await speak(response);
        resetTranscript();
      } catch (error) {
        console.error('Error processing command:', error);
        await speak(
          `Sorry ${context.userName}, I encountered an error processing your command. Please try again.`
        );
      } finally {
        setIsProcessing(false);
      }
    },
    [
      createHabit,
      createDaily,
      createTodo,
      habits,
      dailies,
      todos,
      speak,
      resetTranscript,
    ]
  );

  return {
    isListening,
    isProcessing,
    transcript,
    startListening,
    stopListening,
    processCommand,
    browserSupportsSpeechRecognition: !recognitionError,
  };
}
