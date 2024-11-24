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
      businesses: {
        Row: {
          id: string
          name: string
          address: string | null
          contact_person: string | null
          phone: string | null
          email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          address?: string | null
          contact_person?: string | null
          phone?: string | null
          email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string | null
          contact_person?: string | null
          phone?: string | null
          email?: string
          created_at?: string
          updated_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          business_id: string
          title: string
          type: string
          description: string | null
          file_url: string | null
          uploaded_by: string | null
          uploaded_at: string
        }
        Insert: {
          id?: string
          business_id: string
          title: string
          type: string
          description?: string | null
          file_url?: string | null
          uploaded_by?: string | null
          uploaded_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          title?: string
          type?: string
          description?: string | null
          file_url?: string | null
          uploaded_by?: string | null
          uploaded_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}