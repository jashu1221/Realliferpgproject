import { supabase } from './supabase';
import type { Database } from '../types/database';

// User API
export async function signUp(email: string, password: string, name: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        level: 1,
        experience: 0,
        rank: 'E',
        stats: {
          personality: 1,
          socialCharm: 1,
          healthFitness: 1,
          intelligence: 1,
          discipline: 1
        },
        settings: {
          notifications: true,
          dailyCheckins: true,
          intenseMode: false,
          motivationStyle: 'balanced',
          rudenessLevel: 5,
          flexibility: 5,
          theme: 'dark',
          soundEffects: true,
          showStreak: true
        }
      }
    }
  });

  if (error) throw error;
  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

export async function updateUserProfile(userId: string, updates: Partial<Database['public']['Tables']['users']['Update']>) {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateUserAvatar(userId: string, avatarUrl: string) {
  const { data, error } = await supabase
    .from('users')
    .update({ avatar_url: avatarUrl })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}