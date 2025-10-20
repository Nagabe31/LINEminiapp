import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 予約データの型定義
export interface Reservation {
  id: string
  customer_name: string
  phone_number: string
  reservation_date: string
  reservation_time: string
  party_size: number
  special_requests?: string
  status: 'pending' | 'confirmed' | 'cancelled'
  created_at: string
  updated_at: string
}

// 店舗情報の型定義（将来の拡張用）
// export interface Restaurant {
//   id: string
//   name: string
//   phone: string
//   address: string
//   business_hours: {
//     open: string
//     close: string
//   }
//   created_at: string
//   updated_at: string
// }
