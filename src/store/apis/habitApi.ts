import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';
import { Habit, HabitStats } from '../../types';

export const habitApi = createApi({
  reducerPath: 'habitApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Habit'],
  endpoints: (builder) => ({
    getHabits: builder.query<Habit[], void>({
      query: () => '/habits',
      providesTags: ['Habit'],
    }),
    getHabitById: builder.query<Habit, string>({
      query: (id) => `/habits/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Habit', id }],
    }),
    createHabit: builder.mutation<Habit, Partial<Habit>>({
      query: (habit) => ({
        url: '/habits',
        method: 'POST',
        body: habit,
      }),
      invalidatesTags: ['Habit'],
    }),
    updateHabit: builder.mutation<Habit, { id: string; updates: Partial<Habit> }>({
      query: ({ id, updates }) => ({
        url: `/habits/${id}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Habit', id }],
    }),
    completeHabit: builder.mutation<void, { id: string; hits: number }>({
      query: ({ id, hits }) => ({
        url: `/habits/${id}/complete`,
        method: 'POST',
        body: { hits },
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Habit', id }],
    }),
    getHabitStats: builder.query<HabitStats, string>({
      query: (id) => `/habits/${id}/stats`,
      providesTags: (_result, _error, id) => [{ type: 'Habit', id }],
    }),
  }),
});

export const {
  useGetHabitsQuery,
  useGetHabitByIdQuery,
  useCreateHabitMutation,
  useUpdateHabitMutation,
  useCompleteHabitMutation,
  useGetHabitStatsQuery,
} = habitApi;