import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, Sparkles, X } from 'lucide-react';

interface Message {
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'assistant',
      content: 'Hello Hunter, I am your personal AI assistant. How can I help you level up today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages([...messages, {
      type: 'user',
      content: input,
      timestamp: new Date()
    }]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        type: 'assistant',
        content: 'I understand you want to improve. Let me analyze your patterns and suggest some optimizations...',
        timestamp: new Date()
      }]);
    }, 1000);
  };

  return (
    <div className={`fixed right-6 bottom-6 z-50 transition-all duration-300 ${
      isOpen ? 'w-96' : 'w-auto'
    }`}>
      {isOpen ? (
        <div className="bg-[#1A1B23]/95 backdrop-blur-lg rounded-2xl border border-[#2A2B35]/50 
          shadow-2xl shadow-black/50 flex flex-col h-[600px] overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-[#2A2B35]/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#4F46E5]/20 to-[#7C3AED]/20 
                flex items-center justify-center border border-[#4F46E5]/20">
                <Bot className="w-5 h-5 text-[#4F46E5]" />
              </div>
              <div>
                <h3 className="font-medium text-white">AI Assistant</h3>
                <p className="text-xs text-gray-400">Always here to help</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-lg hover:bg-[#2A2B35]/50 text-gray-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  message.type === 'user'
                    ? 'bg-[#4F46E5] text-white'
                    : 'bg-[#2A2B35]/50 text-gray-200'
                }`}>
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs mt-1 opacity-60">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-[#2A2B35]/50">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything..."
                className="flex-1 bg-[#2A2B35]/50 border border-[#2A2B35]/50 rounded-lg px-4 py-2
                  text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-[#4F46E5]/50"
              />
              <button
                onClick={handleSend}
                className="p-2 rounded-lg bg-[#4F46E5] text-white hover:bg-[#4338CA] transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="p-4 rounded-full bg-[#4F46E5] text-white hover:bg-[#4338CA] transition-colors
            shadow-lg shadow-[#4F46E5]/20 hover:shadow-[#4F46E5]/30 group"
        >
          <Bot className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>
      )}
    </div>
  );
}