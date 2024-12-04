import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDocs,
  getDoc,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../firebase';
import type { Todo } from '../../types/todo';

// Helper function to convert Firestore timestamps
const convertTimestamps = (data: any) => {
  if (!data) return data;

  const result = { ...data };
  Object.keys(result).forEach((key) => {
    if (result[key] instanceof Timestamp) {
      result[key] = result[key].toDate().toISOString();
    }
  });
  return result;
};

// Get user's todos collection reference
const getUserTodosRef = (userId: string) =>
  collection(db, 'users', userId, 'todos');

// Default values for new todos
const defaultTodoValues = {
  priority: 'medium',
  tags: [],
  status: 'active',
  checklist: [],
};

// Create a new todo
export const createTodo = async (userId: string, todoData: Partial<Todo>) => {
  try {
    console.log('Firebase createTodo: Starting to create todo:', todoData);
    const todosRef = getUserTodosRef(userId);

    const newTodo = {
      ...defaultTodoValues,
      ...todoData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(todosRef, newTodo);
    console.log('Firebase createTodo: Successfully created todo');
    return { id: docRef.id, ...newTodo };
  } catch (error) {
    console.error('Firebase createTodo: Error creating todo:', error);
    throw error;
  }
};

// Get all todos for a user
export const getUserTodos = async (userId: string) => {
  try {
    console.log('Firebase getUserTodos: Fetching todos for user:', userId);
    const todosRef = getUserTodosRef(userId);
    const q = query(todosRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    const todos = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...defaultTodoValues,
      ...convertTimestamps(doc.data()),
    }));
    console.log('Firebase getUserTodos: Successfully fetched todos:', todos);
    return todos;
  } catch (error) {
    console.error('Firebase getUserTodos: Error fetching todos:', error);
    throw error;
  }
};

// Get a single todo
export const getTodo = async (userId: string, todoId: string) => {
  try {
    console.log('Firebase getTodo: Fetching todo:', todoId);
    const todoRef = doc(db, 'users', userId, 'todos', todoId);
    const todoDoc = await getDoc(todoRef);

    if (!todoDoc.exists()) {
      throw new Error('Todo not found');
    }

    const todo = {
      id: todoDoc.id,
      ...defaultTodoValues,
      ...convertTimestamps(todoDoc.data()),
    };

    console.log('Firebase getTodo: Successfully fetched todo:', todo);
    return todo;
  } catch (error) {
    console.error('Firebase getTodo: Error fetching todo:', error);
    throw error;
  }
};

// Update a todo
export const updateTodo = async (
  userId: string,
  todoId: string,
  updates: Partial<Todo>
) => {
  try {
    console.log(
      'Firebase updateTodo: Starting to update todo:',
      todoId,
      updates
    );
    const todoRef = doc(db, 'users', userId, 'todos', todoId);

    const updateData = {
      ...updates,
      updatedAt: serverTimestamp(),
    };

    console.log('Firebase updateTodo: Prepared update data:', updateData);
    await updateDoc(todoRef, updateData);

    // Fetch the updated todo to return
    const updatedTodo = await getTodo(userId, todoId);
    console.log('Firebase updateTodo: Successfully updated todo:', updatedTodo);
    return updatedTodo;
  } catch (error) {
    console.error('Firebase updateTodo: Error updating todo:', error);
    throw error;
  }
};

// Complete a todo
export const completeTodo = async (userId: string, todoId: string) => {
  try {
    console.log('Firebase completeTodo: Starting to complete todo:', todoId);
    const todoRef = doc(db, 'users', userId, 'todos', todoId);

    await updateDoc(todoRef, {
      status: 'completed',
      completedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    console.log('Firebase completeTodo: Successfully completed todo');
    return await getTodo(userId, todoId);
  } catch (error) {
    console.error('Firebase completeTodo: Error completing todo:', error);
    throw error;
  }
};

export const deleteTodo = async (userId: string, todoId: string) => {
  try {
    console.log('Firebase deleteTodo: Starting to delete todo:', todoId);
    const batch = writeBatch(db);

    // Get references
    const todoRef = doc(db, 'users', userId, 'todos', todoId);

    // Delete the todo document
    batch.delete(todoRef);

    // Commit the deletion
    await batch.commit();

    console.log('Firebase deleteTodo: Successfully deleted todo');
    return { success: true, todoId };
  } catch (error) {
    console.error('Firebase deleteTodo: Error deleting todo:', error);
    throw error;
  }
};
