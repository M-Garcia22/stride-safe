import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type helpers for database
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
      users: {
        Row: {
          id: string;
          email: string;
          user_type: 'track' | 'trainer' | 'vet';
          name: string;
          organization: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      horses: {
        Row: {
          id: string;
          name: string;
          birth_date: string;
          sex: 'Colt' | 'Filly' | 'Gelding' | 'Mare' | 'Stallion';
          color: string;
          trainer_id: string;
          owner: string;
          track_id: string | null;
          vet_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['horses']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['horses']['Insert']>;
      };
      races: {
        Row: {
          id: string;
          race_number: number;
          name: string;
          race_time: string;
          race_date: string;
          status: 'scheduled' | 'running' | 'finished';
          distance: string;
          purse: string;
          track_id: string;
          surface: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['races']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['races']['Insert']>;
      };
      welfare_reports: {
        Row: {
          id: string;
          horse_id: string;
          race_id: string | null;
          report_date: string;
          race_course: string;
          surface: string;
          distance: string;
          welfare_status: 'good' | 'warning' | 'alert';
          risk_category: 1 | 2 | 3 | 4 | 5;
          alerts: string[];
          stride_analysis: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['welfare_reports']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['welfare_reports']['Insert']>;
      };
      race_entries: {
        Row: {
          id: string;
          race_id: string;
          horse_id: string;
          post_position: number;
          jockey: string;
          odds: string;
          weight: number;
          performance_score: number;
          wellness_score: number;
          performance_ring_score: number;
          welfare_alert: boolean;
          examination_status: 'pending' | 'in-progress' | 'passed' | 'scratched';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['race_entries']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['race_entries']['Insert']>;
      };
      examinations: {
        Row: {
          id: string;
          race_entry_id: string;
          examiner_id: string;
          examination_date: string;
          status: 'approved' | 'pending' | 'declined';
          comments: string | null;
          recommendation_date: string | null;
          regulatory_vet_comments: string | null;
          official_steward_notified: string | null;
          track_official_notified: string | null;
          official_record_updated: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['examinations']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['examinations']['Insert']>;
      };
      messages: {
        Row: {
          id: string;
          from_user_id: string;
          to_user_id: string;
          horse_id: string | null;
          urgency: 'routine' | 'urgent' | 'emergency';
          message: string;
          additional_details: string | null;
          read: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['messages']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['messages']['Insert']>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

