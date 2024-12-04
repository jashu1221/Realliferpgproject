import React, { useState } from 'react';
import { Play, Pause, RefreshCw, Coffee, Brain, Clock, Settings, ChevronDown } from 'lucide-react';
import { useFocusMode } from '../contexts/FocusModeContext';

const timePresets = {
  focus: [
    { label: '25min', value: 25 },
    { label: '45min', value: 45 },
    { label: '60min', value: 60 }
  ],
  shortBreak: [
    { label: '5min', value: 5 },
    { label: '10min', value: 10 },
    { label: '15min', value: 15 }
  ],
  longBreak: [
    { label: '15min', value: 15 },
    { label: '20min', value: 20 },
    { label: '30min', value: 30 }
  ]
};

export function FocusTimer() {
  const {
    isFocusMode,
    timerMinutes,
    timerSeconds,
    isTimerRunning,
    timerType,
    startTimer,
    pauseTimer,
    resetTimer,
    setTimerType,
    setCustomDuration
  } = useFocusMode();

  const [showDurationPicker, setShowDurationPicker] = useState(false);

  if (!isFocusMode) return null;

  return (
    <div className="w-full mt-4 px-4 lg:px-6">
      <div className="bg-[#1A1B23]/95 border border-[#2A2B35]/50 rounded-xl backdrop-blur-sm">
        <div className="container mx-auto py-5 px-6">
          <div className="flex items-center justify-between gap-6">
            {/* Timer Types */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setTimerType('focus')}
                className={`px-5 py-2.5 rounded-lg transition-all flex items-center gap-2 ${
                  timerType === 'focus'
                    ? 'bg-[#4F46E5]/20 text-[#4F46E5] border border-[#4F46E5]/30'
                    : 'text-gray-400 hover:bg-[#2A2B35]/50'
                }`}
              >
                <Brain className="w-4 h-4" />
                <span className="text-sm font-medium">Focus</span>
              </button>
              <button
                onClick={() => setTimerType('shortBreak')}
                className={`px-5 py-2.5 rounded-lg transition-all flex items-center gap-2 ${
                  timerType === 'shortBreak'
                    ? 'bg-[#4F46E5]/20 text-[#4F46E5] border border-[#4F46E5]/30'
                    : 'text-gray-400 hover:bg-[#2A2B35]/50'
                }`}
              >
                <Coffee className="w-4 h-4" />
                <span className="text-sm font-medium">Short Break</span>
              </button>
              <button
                onClick={() => setTimerType('longBreak')}
                className={`px-5 py-2.5 rounded-lg transition-all flex items-center gap-2 ${
                  timerType === 'longBreak'
                    ? 'bg-[#4F46E5]/20 text-[#4F46E5] border border-[#4F46E5]/30'
                    : 'text-gray-400 hover:bg-[#2A2B35]/50'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">Long Break</span>
              </button>
            </div>

            {/* Timer Display & Controls */}
            <div className="flex items-center gap-8">
              {/* Duration Picker */}
              <div className="relative">
                <button
                  onClick={() => setShowDurationPicker(!showDurationPicker)}
                  className="px-4 py-2 rounded-lg text-gray-400 hover:bg-[#2A2B35]/50 
                    transition-all flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  <span className="text-sm">Duration</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 
                    ${showDurationPicker ? 'rotate-180' : ''}`} />
                </button>

                {showDurationPicker && (
                  <div className="absolute top-full right-0 mt-2 w-48 py-2 bg-[#1A1B23] 
                    border border-[#2A2B35]/50 rounded-lg shadow-xl z-50">
                    {timePresets[timerType].map((preset) => (
                      <button
                        key={preset.value}
                        onClick={() => {
                          setCustomDuration(preset.value * 60);
                          setShowDurationPicker(false);
                        }}
                        className="w-full px-4 py-2 text-sm text-gray-400 hover:bg-[#2A2B35]/50 
                          transition-all text-left flex items-center justify-between"
                      >
                        <span>{preset.label}</span>
                        {timerMinutes === preset.value && (
                          <div className="w-1.5 h-1.5 rounded-full bg-[#4F46E5]" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Timer Display */}
              <div className="text-4xl font-bold bg-gradient-to-r from-[#4F46E5] to-[#7C3AED]
                bg-clip-text text-transparent tabular-nums tracking-wider font-mono min-w-[120px] text-center">
                {String(timerMinutes).padStart(2, '0')}:{String(timerSeconds).padStart(2, '0')}
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={isTimerRunning ? pauseTimer : startTimer}
                  className="p-3 rounded-lg bg-[#4F46E5]/20 text-[#4F46E5] 
                    hover:bg-[#4F46E5]/30 transition-all border border-[#4F46E5]/30"
                >
                  {isTimerRunning ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={resetTimer}
                  className="p-3 rounded-lg text-gray-400 hover:bg-[#2A2B35]/50 transition-all"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}