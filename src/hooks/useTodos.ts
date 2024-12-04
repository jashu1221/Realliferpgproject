import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';
import { useAuth } from '../contexts/AuthContext';
import {
  setTodos,
  setSelectedTodo,
  clearSelectedTodo,
  updateTodoStatus,
  setLoading,
  setError,
  deleteTodoAction,
} from '../store/slices/todoSlice';
import {
  createTodo as createTodoInDb,
  updateTodo as updateTodoInDb,
  completeTodo as completeTodoInDb,
  getUserTodos as getTodosFromDb,
  getTodo as getTodoFromDb,
  deleteTodo as deleteTodoInDb,
} from '../lib/firebase/todos';
import type { Todo } from '../types/todo';

export function useTodos() {
  const dispatch = useAppDispatch();
  const { currentUser } = useAuth();
  const { todos, selectedTodo, loading, error } = useAppSelector(
    (state) => state.todos
  );

  // Fetch todos when component mounts or user changes
  useEffect(() => {
    console.log('useTodos: Checking for user to fetch todos');
    if (currentUser) {
      console.log('useTodos: User found, fetching todos');
      fetchTodos();
    }
  }, [currentUser]);

  const fetchTodos = useCallback(async () => {
    if (!currentUser) {
      console.log('fetchTodos: No user found, skipping fetch');
      return;
    }

    try {
      dispatch(setLoading(true));
      console.log(
        'fetchTodos: Starting to fetch todos for user',
        currentUser.uid
      );
      const fetchedTodos = await getTodosFromDb(currentUser.uid);
      console.log('fetchTodos: Successfully fetched todos:', fetchedTodos);
      dispatch(setTodos(fetchedTodos));
    } catch (error: any) {
      console.error('fetchTodos: Error fetching todos:', error);
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  }, [currentUser, dispatch]);

  const getTodo = useCallback(
    async (todoId: string) => {
      if (!currentUser) {
        console.log('getTodo: No user found, cannot fetch todo');
        return null;
      }

      try {
        dispatch(setLoading(true));
        const todo = await getTodoFromDb(currentUser.uid, todoId);
        return todo;
      } catch (error: any) {
        console.error('getTodo: Error fetching todo:', error);
        dispatch(setError(error.message));
        return null;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [currentUser, dispatch]
  );

  const createTodo = useCallback(
    async (todoData: Partial<Todo>) => {
      if (!currentUser) {
        console.log('createTodo: No user found, cannot create todo');
        return false;
      }

      try {
        dispatch(setLoading(true));
        console.log('createTodo: Starting to create todo:', todoData);
        const newTodo = await createTodoInDb(currentUser.uid, todoData);
        console.log('createTodo: Successfully created todo:', newTodo);
        await fetchTodos(); // Refresh todos list
        return true;
      } catch (error: any) {
        console.error('createTodo: Error creating todo:', error);
        dispatch(setError(error.message));
        return false;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [currentUser, dispatch, fetchTodos]
  );

  const updateTodo = useCallback(
    async (id: string, updates: Partial<Todo>) => {
      if (!currentUser) {
        console.log('updateTodo: No user found, cannot update todo');
        return false;
      }

      try {
        dispatch(setLoading(true));
        console.log('updateTodo: Starting to update todo:', id, updates);

        const updatedTodo = await updateTodoInDb(currentUser.uid, id, updates);
        console.log('updateTodo: Successfully updated todo:', updatedTodo);
        await fetchTodos(); // Refresh todos list
        return true;
      } catch (error: any) {
        console.error('updateTodo: Error updating todo:', error);
        dispatch(setError(error.message));
        return false;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [currentUser, dispatch, fetchTodos]
  );

  const completeTodo = useCallback(
    async (id: string) => {
      if (!currentUser) {
        console.log('completeTodo: No user found, cannot complete todo');
        return false;
      }

      try {
        dispatch(setLoading(true));
        console.log('completeTodo: Starting to complete todo:', id);
        const updatedTodo = await completeTodoInDb(currentUser.uid, id);
        dispatch(updateTodoStatus({ id, status: 'completed' }));
        console.log('completeTodo: Successfully completed todo:', updatedTodo);
        await fetchTodos(); // Refresh todos list
        return true;
      } catch (error: any) {
        console.error('completeTodo: Error completing todo:', error);
        dispatch(setError(error.message));
        return false;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [currentUser, dispatch, fetchTodos]
  );

  const selectTodo = useCallback(
    (todo: Todo) => {
      console.log('selectTodo: Selecting todo:', todo);
      dispatch(setSelectedTodo(todo));
    },
    [dispatch]
  );

  const clearTodo = useCallback(() => {
    console.log('clearTodo: Clearing selected todo');
    dispatch(clearSelectedTodo());
  }, [dispatch]);

  const deleteTodo = useCallback(
    async (id: string) => {
      if (!currentUser) {
        console.log('deleteTodo: No user found, cannot delete todo');
        return false;
      }

      try {
        dispatch(setLoading(true));
        console.log('deleteTodo: Starting to delete todo:', id);

        // Delete from Firebase
        await deleteTodoInDb(currentUser.uid, id);

        // Update Redux store
        dispatch(deleteTodoAction(id));

        console.log('deleteTodo: Successfully deleted todo:', id);
        return true;
      } catch (error: any) {
        console.error('deleteTodo: Error deleting todo:', error);
        dispatch(setError(error.message));
        return false;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [currentUser, dispatch]
  );

  return {
    todos,
    loading,
    error,
    selectedTodo,
    fetchTodos,
    getTodo,
    createTodo,
    updateTodo,
    completeTodo,
    selectTodo,
    clearTodo,
    deleteTodo,
  };
}
