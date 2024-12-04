import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';
import { useAuth } from '../contexts/AuthContext';
import { 
  createTimeBlock,
  getTimeBlocks,
  updateTimeBlock as updateTimeBlockInDb,
  deleteTimeBlock
} from '../lib/firebase/timeblocks';
import { 
  setBlocks,
  addBlock,
  updateBlock,
  removeBlock,
  setSelectedDate,
  setLoading,
  setError
} from '../store/slices/timeBlockSlice';
import type { TimeBlock, TimeBlockFormData } from '../types/timeblock';

export function useTimeBlocks() {
  const dispatch = useAppDispatch();
  const { currentUser } = useAuth();
  const { blocks, selectedDate, loading, error } = useAppSelector(
    (state) => state.timeBlocks
  );

  const fetchBlocks = useCallback(async (date: string) => {
    if (!currentUser) return;

    try {
      dispatch(setLoading(true));
      dispatch(setSelectedDate(date));
      const fetchedBlocks = await getTimeBlocks(currentUser.uid, date);
      dispatch(setBlocks(fetchedBlocks));
    } catch (err: any) {
      console.error('Error fetching time blocks:', err);
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  }, [currentUser, dispatch]);

  const addTimeBlock = useCallback(async (date: string, blockData: TimeBlockFormData) => {
    if (!currentUser) return;

    try {
      dispatch(setLoading(true));
      const newBlock = await createTimeBlock(currentUser.uid, {
        ...blockData,
        date
      });
      dispatch(addBlock(newBlock as TimeBlock));
      return newBlock;
    } catch (err: any) {
      console.error('Error adding time block:', err);
      dispatch(setError(err.message));
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  }, [currentUser, dispatch]);

  const updateTimeBlock = useCallback(async (blockId: string, updates: Partial<TimeBlock>) => {
    if (!currentUser) return;

    try {
      dispatch(setLoading(true));
      const updatedBlock = await updateTimeBlockInDb(currentUser.uid, blockId, updates);
      dispatch(updateBlock(updatedBlock as TimeBlock));
      return updatedBlock;
    } catch (err: any) {
      console.error('Error updating time block:', err);
      dispatch(setError(err.message));
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  }, [currentUser, dispatch]);

  const removeTimeBlock = useCallback(async (blockId: string) => {
    if (!currentUser) return;

    try {
      dispatch(setLoading(true));
      await deleteTimeBlock(currentUser.uid, blockId);
      dispatch(removeBlock(blockId));
    } catch (err: any) {
      console.error('Error removing time block:', err);
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  }, [currentUser, dispatch]);

  return {
    blocks,
    selectedDate,
    loading,
    error,
    fetchBlocks,
    addBlock: addTimeBlock,
    updateBlock: updateTimeBlock,
    removeBlock: removeTimeBlock
  };
}