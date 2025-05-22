
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
      products: {
        Row: {
          id: string
          name: string
          price: number
          original_price: number | null
          description: string
          image_url: string
          category_id: string | null
          in_stock: boolean
          featured: boolean
          rating: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          price: number
          original_price?: number | null
          description: string
          image_url: string
          category_id?: string | null
          in_stock?: boolean
          featured?: boolean
          rating?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          price?: number
          original_price?: number | null
          description?: string
          image_url?: string
          category_id?: string | null
          in_stock?: boolean
          featured?: boolean
          rating?: number
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          image_url: string
          description: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          image_url: string
          description: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          image_url?: string
          description?: string
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string | null
          status: string
          total_amount: number
          customer_name: string
          customer_email: string
          customer_phone: string | null
          shipping_address: string | null
          payment_method: string
          payment_status: string
          transaction_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          status?: string
          total_amount: number
          customer_name: string
          customer_email: string
          customer_phone?: string | null
          shipping_address?: string | null
          payment_method?: string
          payment_status?: string
          transaction_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          status?: string
          total_amount?: number
          customer_name?: string
          customer_email?: string
          customer_phone?: string | null
          shipping_address?: string | null
          payment_method?: string
          payment_status?: string
          transaction_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          price?: number
          created_at?: string
        }
      }
      whatsapp_settings: {
        Row: {
          id: string
          phone_number: string
          default_message: string
          product_message: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          phone_number: string
          default_message: string
          product_message: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          phone_number?: string
          default_message?: string
          product_message?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
