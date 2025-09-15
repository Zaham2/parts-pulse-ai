import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: 'buyer' | 'seller' | 'admin'
          avatar_url: string | null
          phone: string | null
          address: any | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: 'buyer' | 'seller' | 'admin'
          avatar_url?: string | null
          phone?: string | null
          address?: any | null
        }
        Update: {
          email?: string
          full_name?: string | null
          role?: 'buyer' | 'seller' | 'admin'
          avatar_url?: string | null
          phone?: string | null
          address?: any | null
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          seller_id: string
          title: string
          description: string | null
          category: 'cpu' | 'gpu' | 'motherboard' | 'ram' | 'storage' | 'psu' | 'case' | 'cooling' | 'other'
          brand: string | null
          model: string | null
          condition: 'new' | 'like_new' | 'good' | 'fair' | 'poor'
          price: number
          original_price: number | null
          specifications: any | null
          images: string[]
          is_available: boolean
          views_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          seller_id: string
          title: string
          description?: string | null
          category: 'cpu' | 'gpu' | 'motherboard' | 'ram' | 'storage' | 'psu' | 'case' | 'cooling' | 'other'
          brand?: string | null
          model?: string | null
          condition: 'new' | 'like_new' | 'good' | 'fair' | 'poor'
          price: number
          original_price?: number | null
          specifications?: any | null
          images?: string[]
          is_available?: boolean
        }
        Update: {
          title?: string
          description?: string | null
          category?: 'cpu' | 'gpu' | 'motherboard' | 'ram' | 'storage' | 'psu' | 'case' | 'cooling' | 'other'
          brand?: string | null
          model?: string | null
          condition?: 'new' | 'like_new' | 'good' | 'fair' | 'poor'
          price?: number
          original_price?: number | null
          specifications?: any | null
          images?: string[]
          is_available?: boolean
          updated_at?: string
        }
      }
      ai_evaluations: {
        Row: {
          id: string
          user_id: string
          product_info: any
          images: string[]
          questions_answers: any | null
          ai_response: any | null
          estimated_price: number | null
          confidence_score: number | null
          status: 'pending' | 'processing' | 'completed' | 'failed'
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          product_info: any
          images?: string[]
          questions_answers?: any | null
          status?: 'pending' | 'processing' | 'completed' | 'failed'
        }
        Update: {
          product_info?: any
          images?: string[]
          questions_answers?: any | null
          ai_response?: any | null
          estimated_price?: number | null
          confidence_score?: number | null
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          buyer_id: string
          seller_id: string
          product_id: string
          quantity: number
          total_price: number
          status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
          shipping_address: any | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          buyer_id: string
          seller_id: string
          product_id: string
          quantity?: number
          total_price: number
          status?: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
          shipping_address?: any | null
          notes?: string | null
        }
        Update: {
          quantity?: number
          total_price?: number
          status?: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
          shipping_address?: any | null
          notes?: string | null
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          user_id: string
          product_id: string
          rating: number
          comment: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          product_id: string
          rating: number
          comment?: string | null
        }
        Update: {
          rating?: number
          comment?: string | null
          updated_at?: string
        }
      }
    }
  }
}