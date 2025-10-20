import { supabase, Reservation } from './supabase'

// 予約関連のデータベース操作
export class ReservationService {
  // 予約を作成
  static async createReservation(data: Omit<Reservation, 'id' | 'created_at' | 'updated_at'>) {
    const { data: reservation, error } = await supabase
      .from('reservations')
      .insert([data])
      .select()
      .single()

    if (error) {
      throw new Error(`予約の作成に失敗しました: ${error.message}`)
    }

    return reservation
  }

  // 予約一覧を取得
  static async getReservations(restaurantId?: string) {
    let query = supabase
      .from('reservations')
      .select('*')
      .order('reservation_date', { ascending: true })
      .order('reservation_time', { ascending: true })

    if (restaurantId) {
      query = query.eq('restaurant_id', restaurantId)
    }

    const { data: reservations, error } = await query

    if (error) {
      throw new Error(`予約一覧の取得に失敗しました: ${error.message}`)
    }

    return reservations
  }

  // 特定の日付の予約を取得
  static async getReservationsByDate(date: string, restaurantId?: string) {
    let query = supabase
      .from('reservations')
      .select('*')
      .eq('reservation_date', date)
      .order('reservation_time', { ascending: true })

    if (restaurantId) {
      query = query.eq('restaurant_id', restaurantId)
    }

    const { data: reservations, error } = await query

    if (error) {
      throw new Error(`日付別予約の取得に失敗しました: ${error.message}`)
    }

    return reservations
  }

  // 予約を更新
  static async updateReservation(id: string, updates: Partial<Reservation>) {
    const { data: reservation, error } = await supabase
      .from('reservations')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`予約の更新に失敗しました: ${error.message}`)
    }

    return reservation
  }

  // 予約を削除
  static async deleteReservation(id: string) {
    const { error } = await supabase
      .from('reservations')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(`予約の削除に失敗しました: ${error.message}`)
    }
  }

  // 予約をキャンセル
  static async cancelReservation(id: string) {
    return this.updateReservation(id, { status: 'cancelled' })
  }

  // 予約を確定
  static async confirmReservation(id: string) {
    return this.updateReservation(id, { status: 'confirmed' })
  }
}

// 店舗関連のデータベース操作
export class RestaurantService {
  // 店舗一覧を取得
  static async getRestaurants() {
    const { data: restaurants, error } = await supabase
      .from('restaurants')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) {
      throw new Error(`店舗一覧の取得に失敗しました: ${error.message}`)
    }

    return restaurants
  }

  // 特定の店舗を取得
  static async getRestaurant(id: string) {
    const { data: restaurant, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      throw new Error(`店舗情報の取得に失敗しました: ${error.message}`)
    }

    return restaurant
  }
}
