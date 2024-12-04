import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';
import {
  setMessages,
  addMessage,
  updateSettings,
  setLoading,
  setError,
  clearMessages
} from '../store/slices/motivationSlice';
import type { MotivationMessage, MotivationSettings } from '../types/motivation';

export function useMotivation() {
  const dispatch = useAppDispatch();
  const { messages, settings, loading, error } = useAppSelector(
    (state) => state.motivation
  );

  const updateMotivationSettings = useCallback(async (
    newSettings: Partial<MotivationSettings>
  ) => {
    try {
      dispatch(setLoading(true));
      dispatch(updateSettings(newSettings));
    } catch (error: any) {
      console.error('Error updating motivation settings:', error);
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  return {
    messages,
    settings,
    loading,
    error,
    setMessages: (messages: MotivationMessage[]) => dispatch(setMessages(messages)),
    addMessage: (message: MotivationMessage) => dispatch(addMessage(message)),
    updateMotivationSettings,
    clearMessages: () => dispatch(clearMessages())
  };
}