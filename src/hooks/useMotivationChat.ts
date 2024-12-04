import { useState, useCallback } from 'react';
import { useMotivation } from './useMotivation';
import { useCharacter } from './useCharacter';
import { generateMotivationalResponse } from '../lib/openai';
import { synthesizeSpeech, playAudioBuffer } from '../lib/elevenlabs';
import type { MotivationMessage } from '../types/motivation';

export function useMotivationChat() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const { settings, messages, setMessages, addMessage } = useMotivation();
  const { currentCharacter } = useCharacter();

  const speak = useCallback(async (text: string) => {
    if (!voiceEnabled) return;
    
    try {
      const audioBuffer = await synthesizeSpeech(text);
      await playAudioBuffer(audioBuffer);
    } catch (error) {
      console.error('Error speaking:', error);
    }
  }, [voiceEnabled]);

  const sendMessage = useCallback(async (
    content: string,
    context?: {
      goals?: string[];
      achievements?: string[];
      currentStreak?: number;
      dailyProgress?: {
        habits: { total: number; completed: number; percentage: number };
        dailies: { total: number; completed: number; percentage: number };
        todos: { total: number; completed: number; percentage: number };
        dailyProgress: number;
      };
    }
  ) => {
    try {
      setIsProcessing(true);

      // Save user message
      const userMessage: MotivationMessage = {
        id: Date.now().toString(),
        content,
        type: 'user',
        context,
        createdAt: new Date().toISOString()
      };

      // Add user message
      addMessage(userMessage);

      // Generate AI response based on character and settings
      const response = await generateMotivationalResponse(
        content,
        currentCharacter.name,
        settings.style,
        {
          ...context,
          settings: {
            rudenessLevel: settings.rudenessLevel,
            flexibility: settings.flexibility,
            systemInstructions: settings.systemInstructions
          }
        }
      );

      // Add AI response
      const aiMessage: MotivationMessage = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        type: 'assistant',
        category: response.category,
        createdAt: new Date().toISOString()
      };

      addMessage(aiMessage);

      // Speak the response if enabled
      await speak(response.content);

      return response;
    } catch (error) {
      console.error('Error in chat:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [settings, currentCharacter, addMessage, speak]);

  const toggleVoice = () => setVoiceEnabled(!voiceEnabled);

  return {
    messages,
    isProcessing,
    voiceEnabled,
    sendMessage,
    toggleVoice
  };
}