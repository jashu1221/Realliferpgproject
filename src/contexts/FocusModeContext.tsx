import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTopSections } from './TopSectionsContext';

interface FocusModeContextType {
  isFocusMode: boolean;
  toggleFocusMode: () => void;
  timerMinutes: number;
  timerSeconds: number;
  isTimerRunning: boolean;
  timerType: 'focus' | 'shortBreak' | 'longBreak';
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  setTimerType: (type: 'focus' | 'shortBreak' | 'longBreak') => void;
  setCustomDuration: (seconds: number) => void;
}

const FocusModeContext = createContext<FocusModeContextType | undefined>(undefined);

const FOCUS_TIME = 25 * 60; // 25 minutes in seconds
const SHORT_BREAK_TIME = 5 * 60; // 5 minutes in seconds
const LONG_BREAK_TIME = 15 * 60; // 15 minutes in seconds

export function FocusModeProvider({ children }: { children: React.ReactNode }) {
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerType, setTimerType] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
  const { setIsTopSectionsVisible } = useTopSections();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      playSound();
      setIsTimerRunning(false);
    }

    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const toggleFocusMode = () => {
    const newFocusMode = !isFocusMode;
    setIsFocusMode(newFocusMode);
    if (newFocusMode) {
      setIsTopSectionsVisible(false);
    }
  };

  const startTimer = () => setIsTimerRunning(true);
  const pauseTimer = () => setIsTimerRunning(false);
  
  const resetTimer = () => {
    setIsTimerRunning(false);
    switch (timerType) {
      case 'focus':
        setTimeLeft(FOCUS_TIME);
        break;
      case 'shortBreak':
        setTimeLeft(SHORT_BREAK_TIME);
        break;
      case 'longBreak':
        setTimeLeft(LONG_BREAK_TIME);
        break;
    }
  };

  const handleSetTimerType = (type: 'focus' | 'shortBreak' | 'longBreak') => {
    setTimerType(type);
    setIsTimerRunning(false);
    switch (type) {
      case 'focus':
        setTimeLeft(FOCUS_TIME);
        break;
      case 'shortBreak':
        setTimeLeft(SHORT_BREAK_TIME);
        break;
      case 'longBreak':
        setTimeLeft(LONG_BREAK_TIME);
        break;
    }
  };

  const setCustomDuration = (seconds: number) => {
    setTimeLeft(seconds);
    setIsTimerRunning(false);
  };

  const playSound = () => {
    const audio = new Audio('/notification.mp3');
    audio.play().catch(error => {
      console.warn('Audio playback failed:', error);
    });
  };

  return (
    <FocusModeContext.Provider value={{
      isFocusMode,
      toggleFocusMode,
      timerMinutes: Math.floor(timeLeft / 60),
      timerSeconds: timeLeft % 60,
      isTimerRunning,
      timerType,
      startTimer,
      pauseTimer,
      resetTimer,
      setTimerType: handleSetTimerType,
      setCustomDuration,
    }}>
      {children}
    </FocusModeContext.Provider>
  );
}

export function useFocusMode() {
  const context = useContext(FocusModeContext);
  if (context === undefined) {
    throw new Error('useFocusMode must be used within a FocusModeProvider');
  }
  return context;
}