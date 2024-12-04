import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';
import { useAuth } from '../contexts/AuthContext';
import {
  updateCharacterIndex,
  getUserProfile,
} from '../lib/firebase/character';
import {
  setSelectedCharacterIndex,
  setLoading,
  setError,
} from '../store/slices/characterSlice';
import { PREDEFINED_CHARACTERS, CharacterArchetype } from '../types/character';

export function useCharacter() {
  const dispatch = useAppDispatch();
  const { currentUser } = useAuth();
  const { selectedCharacterIndex, loading, error } = useAppSelector(
    (state) => state.character
  );

  const fetchSelectedCharacter = useCallback(async () => {
    if (!currentUser) return;

    try {
      dispatch(setLoading(true));
      const userProfile = await getUserProfile(currentUser.uid);
      if (userProfile) {
        // Use characterIndex from profile or default to 0
        const index = userProfile.characterIndex ?? 0;
        dispatch(setSelectedCharacterIndex(index));
      }
    } catch (error: any) {
      console.error('Error fetching selected character:', error);
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  }, [currentUser, dispatch]);

  const changeCharacter = useCallback(
    async (archetype: CharacterArchetype) => {
      if (!currentUser) return;

      try {
        dispatch(setLoading(true));
        const newIndex = Object.values(CharacterArchetype).indexOf(archetype);
        if (newIndex === -1) {
          throw new Error('Invalid character archetype');
        }
        await updateCharacterIndex(currentUser.uid, newIndex);
        dispatch(setSelectedCharacterIndex(newIndex));
      } catch (error: any) {
        console.error('Error changing character:', error);
        dispatch(setError(error.message));
      } finally {
        dispatch(setLoading(false));
      }
    },
    [currentUser, dispatch]
  );

  const getCurrentCharacter = useCallback(() => {
    const archetypes = Object.values(CharacterArchetype);
    const index = selectedCharacterIndex < 0 || selectedCharacterIndex >= archetypes.length 
      ? 0 // Default to first character if index is invalid
      : selectedCharacterIndex;
    const archetype = archetypes[index];
    return PREDEFINED_CHARACTERS[archetype];
  }, [selectedCharacterIndex]);

  return {
    selectedCharacterIndex,
    currentCharacter: getCurrentCharacter(),
    loading,
    error,
    fetchSelectedCharacter,
    changeCharacter,
  };
}