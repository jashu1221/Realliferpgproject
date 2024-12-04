export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      habits: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          type: 'habit' | 'daily'
          frequency: 'daily' | 'weekly' | 'custom'
          active_days: string[] | null
          priority: 'low' | 'medium' | 'high'
          current_streak: number
          best_streak: number
          total_hits: number
          current_hits: number
          max_hits: number
          last_completed: string | null
          snooze_until: string | null
          snooze_reason: string | null
          status: 'active' | 'snoozed' | 'archived'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          type: 'habit' | 'daily'
          frequency: 'daily' | 'weekly' | 'custom'
          active_days?: string[] | null
          priority?: 'low' | 'medium' | 'high'
          current_streak?: number
          best_streak?: number
          total_hits?: number
          current_hits?: number
          max_hits?: number
          last_completed?: string | null
          snooze_until?: string | null
          snooze_reason?: string | null
          status?: 'active' | 'snoozed' | 'archived'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          type?: 'habit' | 'daily'
          frequency?: 'daily' | 'weekly' | 'custom'
          active_days?: string[] | null
          priority?: 'low' | 'medium' | 'high'
          current_streak?: number
          best_streak?: number
          total_hits?: number
          current_hits?: number
          max_hits?: number
          last_completed?: string | null
          snooze_until?: string | null
          snooze_reason?: string | null
          status?: 'active' | 'snoozed' | 'archived'
          created_at?: string
          updated_at?: string
        }
      }
      hit_levels: {
        Row: {
          id: string
          habit_id: string
          hits: number
          title: string
          description: string | null
          difficulty: 'Show Up' | 'Easy' | 'Medium' | 'Hard'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          habit_id: string
          hits: number
          title: string
          description?: string | null
          difficulty: 'Show Up' | 'Easy' | 'Medium' | 'Hard'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          habit_id?: string
          hits?: number
          title?: string
          description?: string | null
          difficulty?: 'Show Up' | 'Easy' | 'Medium' | 'Hard'
          created_at?: string
          updated_at?: string
        }
      }
      habit_tags: {
        Row: {
          id: string
          habit_id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          habit_id: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          habit_id?: string
          name?: string
          created_at?: string
        }
      }
      habit_completions: {
        Row: {
          id: string
          habit_id: string
          completed_at: string
          hits_count: number
          note: string | null
        }
        Insert: {
          id?: string
          habit_id: string
          completed_at?: string
          hits_count: number
          note?: string | null
        }
        Update: {
          id?: string
          habit_id?: string
          completed_at?: string
          hits_count?: number
          note?: string | null
        }
      }
    }
    Functions: {
      update_habit_streak: {
        Args: {
          habit_id: string
        }
        Returns: void
      }
      update_habit_hits: {
        Args: {
          habit_id: string
          hits_count: number
        }
        Returns: void
      }
    }
  }
}