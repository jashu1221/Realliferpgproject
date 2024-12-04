import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Todo } from '../../types/todo';

interface TodoState {
  todos: Todo[];
  selectedTodo: Todo | null;
  loading: boolean;
  error: string | null;
}

const initialState: TodoState = {
  todos: [],
  selectedTodo: null,
  loading: false,
  error: null,
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    setTodos: (state, action: PayloadAction<Todo[]>) => {
      console.log('todoSlice: Setting todos:', action.payload);
      state.todos = action.payload;
      state.error = null;
    },
    setSelectedTodo: (state, action: PayloadAction<Todo>) => {
      console.log('todoSlice: Setting selected todo:', action.payload);
      state.selectedTodo = action.payload;
      state.error = null;
    },
    clearSelectedTodo: (state) => {
      console.log('todoSlice: Clearing selected todo');
      state.selectedTodo = null;
    },
    updateTodoStatus: (
      state,
      action: PayloadAction<{ id: string; status: Todo['status'] }>
    ) => {
      console.log('todoSlice: Updating todo status:', action.payload);
      const todo = state.todos.find((t) => t.id === action.payload.id);
      if (todo) {
        todo.status = action.payload.status;
      }
    },
    deleteTodoAction: (state, action: PayloadAction<string>) => {
      console.log('todoSlice: Deleting todo:', action.payload);
      state.todos = state.todos.filter((todo) => todo.id !== action.payload);
      if (state.selectedTodo?.id === action.payload) {
        state.selectedTodo = null;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      console.log('todoSlice: Setting loading:', action.payload);
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      console.log('todoSlice: Setting error:', action.payload);
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setTodos,
  setSelectedTodo,
  clearSelectedTodo,
  updateTodoStatus,
  setLoading,
  setError,
  deleteTodoAction,
} = todoSlice.actions;

export default todoSlice.reducer;
