import React, { useState, useEffect, useCallback } from 'react';
import { Mic, Radio, MicOff, Loader, Brain, Star, Crown } from 'lucide-react';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';
import { useAuth } from '../contexts/AuthContext';
import { useHabits } from '../hooks/useHabits';
import { useDailies } from '../hooks/useDailies';
import { useTodos } from '../hooks/useTodos';
import { useCoins } from '../hooks/useCoins';

const assistantPhrases = [
  "Ready to level up",
  "Your AI companion awaits",
  "Voice commands activated",
  "Tracking your progress",
  "Achievement system online"
];

export function VoiceAssistant() {
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const { userProfile } = useAuth();
  const { habits } = useHabits();
  const { dailies } = useDailies();
  const { todos } = useTodos();
  const { userCoins } = useCoins();

  const {
    isListening,
    isProcessing,
    transcript,
    startListening,
    stopListening,
    processCommand,
    browserSupportsSpeechRecognition
  } = useVoiceAssistant();

  // Initialize AudioContext on first user interaction
  const initAudioContext = useCallback(() => {
    if (!audioContext) {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      setAudioContext(ctx);
    }
  }, [audioContext]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % assistantPhrases.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (transcript && !isListening && !isProcessing) {
      const context = {
        userName: userProfile?.name || 'Hunter',
        level: userProfile?.level || 1,
        coins: userCoins?.totalCoins || 0,
        stats: {
          habits: habits.length,
          dailies: dailies.length,
          todos: todos.length,
          activeHabits: habits.filter(h => h.status === 'active').length,
          completedDailies: dailies.filter(d => d.status === 'completed').length,
          pendingTodos: todos.filter(t => t.status === 'active').length
        }
      };
      processCommand(transcript, context);
    }
  }, [transcript, isListening, isProcessing, processCommand, userProfile, habits, dailies, todos, userCoins]);

  const handleMicClick = () => {
    initAudioContext();
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="card-dark h-[200px] flex items-center justify-center">
        <p className="text-red-400">Browser doesn't support speech recognition.</p>
      </div>
    );
  }

  return (
    <div className="card-dark h-[200px] flex flex-col relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-[#4F46E5]/5 to-[#7C3AED]/5" />
      
      <div className="relative flex flex-col h-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#4F46E5]/20 to-[#7C3AED]/20 
              flex items-center justify-center border border-[#4F46E5]/20">
              <Radio className="w-5 h-5 text-[#4F46E5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium text-gray-300">System Assistant</h3>
                <div className="flex items-center gap-1 text-xs">
                  <Crown className="w-3 h-3 text-[#D4AF37]" />
                  <span className="text-[#D4AF37]">Level {userProfile?.level || 1}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-xs text-gray-500 h-4 overflow-hidden">
                  {userProfile?.name ? `Hello, ${userProfile.name}! ` : ''}
                  {assistantPhrases[currentPhrase]}
                </p>
                {userCoins && (
                  <div className="flex items-center gap-1 text-xs">
                    <Star className="w-3 h-3 text-[#D4AF37]" />
                    <span className="text-[#D4AF37]">{userCoins.totalCoins} coins</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <button 
            onClick={handleMicClick}
            disabled={isProcessing}
            className={`p-2 rounded-lg transition-all ${
              isListening
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                : 'bg-[#4F46E5]/10 text-[#4F46E5] hover:bg-[#4F46E5]/20'
            } group-hover:animate-pulse`}
          >
            {isProcessing ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : isListening ? (
              <MicOff className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </button>
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full flex items-center gap-1">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-1 rounded-full overflow-hidden ${
                  isListening ? 'bg-red-500/20' : 'bg-[#4F46E5]/20'
                }`}
              >
                <div
                  className={`h-full transform origin-left scale-x-0 
                    group-hover:scale-x-100 transition-transform duration-300 ${
                    isListening
                      ? 'bg-gradient-to-r from-red-500 to-red-600'
                      : 'bg-gradient-to-r from-[#4F46E5] to-[#7C3AED]'
                  }`}
                  style={{
                    transitionDelay: `${i * 50}ms`,
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto text-xs text-center text-gray-500 opacity-0 group-hover:opacity-100 
          transition-opacity pb-2">
          {isListening 
            ? "Listening... Speak your command" 
            : isProcessing 
            ? "Processing your request..." 
            : `Try saying: "Show my habits" or "Create a new daily"`}
        </div>
      </div>
    </div>
  );
}

// Add type declarations for AudioContext
declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}