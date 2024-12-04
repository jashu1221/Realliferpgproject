import React, { useState, useRef, useEffect } from 'react';
import { Bot, Brain, ChevronRight } from 'lucide-react';
import { useMotivationChat } from '../../hooks/useMotivationChat';
import { useMotivation } from '../../hooks/useMotivation';
import { useCharacter } from '../../hooks/useCharacter';
import { ChatControls } from './ChatControls';
import { CheckInButton } from './CheckInButton';
import { useProgress } from '../../hooks/useProgress';

const suggestions = [
  "What would you do in this situation?",
  "I'm feeling lazy, motivate me",
  "I need intense motivation",
  "Help me stay focused"
];

export function MotivationChat() {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const { messages, isProcessing, voiceEnabled, sendMessage, toggleVoice } = useMotivationChat();
  const { settings } = useMotivation();
  const { currentCharacter } = useCharacter();
  const stats = useProgress();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const context = {
      currentStreak: stats.dailyProgress,
      settings,
      character: currentCharacter,
      dailyProgress: stats
    };

    await sendMessage(input, context);
    setInput('');
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    setShowSuggestions(false);
  };

  const handleCheckIn = async () => {
    const checkInMessage = `Here's my daily progress:
    - Overall: ${Math.round(stats.dailyProgress)}% complete
    - Habits: ${stats.habits.completed}/${stats.habits.total} (${Math.round(stats.habits.percentage)}%)
    - Dailies: ${stats.dailies.completed}/${stats.dailies.total} (${Math.round(stats.dailies.percentage)}%)
    - Todos: ${stats.todos.completed}/${stats.todos.total} (${Math.round(stats.todos.percentage)}%)
    
    How am I doing?`;

    await sendMessage(checkInMessage, { dailyProgress: stats });
  };

  return (
    <div className="flex-1 flex flex-col bg-[#1A1B23]/50 rounded-xl border border-[#2A2B35]/50 overflow-hidden max-h-[87vh] min-h-[400px]">
      {/* Header */}
      <div className="p-3 sm:p-4 border-b border-[#2A2B35]/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-[#4F46E5]/20 to-[#7C3AED]/20 
              flex items-center justify-center border border-[#4F46E5]/20 relative overflow-hidden">
              <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-[#4F46E5] relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#4F46E5]/10 animate-pulse" />
            </div>
            <div>
              <h3 className="font-medium text-sm sm:text-base text-white flex items-center gap-2">
                {currentCharacter.name}
                <span className={`px-1.5 sm:px-2 py-0.5 rounded-full text-xs 
                  ${settings.style === 'intense' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                    settings.style === 'balanced' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                    'bg-green-500/10 text-green-400 border-green-500/20'} 
                  animate-pulse whitespace-nowrap`}>
                  {settings.style.charAt(0).toUpperCase() + settings.style.slice(1)} Mode
                </span>
              </h3>
              <p className="text-xs text-gray-400">"{currentCharacter.quote}"</p>
            </div>
          </div>
          <CheckInButton onCheckIn={handleCheckIn} isProcessing={isProcessing} />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] sm:max-w-[80%] rounded-xl px-3 sm:px-4 py-2 sm:py-3 ${
              message.type === 'user'
                ? 'bg-[#4F46E5] text-white'
                : message.category === 'recommendation'
                ? 'bg-gradient-to-r from-[#1A1B23] to-[#2A2B35] text-white border border-[#4F46E5]/30'
                : 'bg-[#2A2B35]/50 text-gray-200'
            }`}>
              {message.type === 'assistant' && message.category && (
                <div className="flex items-center gap-1.5 sm:gap-2 text-[#4F46E5] mb-1.5 sm:mb-2">
                  {message.category === 'insight' ? (
                    <Brain className="w-3 h-3 sm:w-4 sm:h-4" />
                  ) : (
                    <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  )}
                  <span className="text-xs font-medium uppercase tracking-wider">
                    {message.category}
                  </span>
                </div>
              )}
              <p className="text-xs sm:text-sm">{message.content}</p>
              <p className="text-[10px] sm:text-xs mt-1.5 sm:mt-2 opacity-60">
                {new Date(message.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Section */}
      <div className="p-3 sm:p-4 border-t border-[#2A2B35]/50 space-y-2 sm:space-y-3">
        {/* Suggestions */}
        {showSuggestions && (
          <div className="flex items-center gap-1 sm:gap-2">
            <Brain className="w-3 h-3 sm:w-4 sm:h-4 text-[#4F46E5] flex-shrink-0" />
            <div className="relative flex-1 overflow-hidden">
              <div
                ref={suggestionsRef}
                className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-none"
              >
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-2 sm:px-3 py-1 rounded-lg bg-[#2A2B35]/30 text-[10px] sm:text-xs text-gray-300
                      border border-[#2A2B35]/50 hover:border-[#4F46E5]/30 hover:bg-[#2A2B35]/50
                      transition-all flex items-center gap-1 sm:gap-1.5 group whitespace-nowrap flex-shrink-0"
                  >
                    {suggestion}
                    <ChevronRight className="w-2 h-2 sm:w-3 sm:h-3 text-gray-500 group-hover:text-[#4F46E5] 
                      transform group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <ChatControls
          input={input}
          isProcessing={isProcessing}
          voiceEnabled={voiceEnabled}
          onInputChange={setInput}
          onSend={handleSend}
          onToggleVoice={toggleVoice}
          placeholder={`Ask ${currentCharacter.name}...`}
        />
      </div>
    </div>
  );
}