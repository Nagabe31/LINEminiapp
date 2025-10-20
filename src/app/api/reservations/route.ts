import { NextRequest, NextResponse } from 'next/server'
import { ReservationService } from '../../../lib/database'
import { supabase } from '../../../lib/supabase'

// 予約を作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // バリデーション
    const requiredFields = ['customerName', 'phoneNumber', 'reservationDate', 'reservationTime', 'partySize']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        )
      }
    }

    // まず店舗IDを取得
    const { data: restaurants, error: restaurantError } = await supabase
      .from('restaurants')
      .select('id')
      .limit(1)
      .single()

    if (restaurantError || !restaurants) {
      throw new Error('店舗情報の取得に失敗しました')
    }

    // 予約データを作成
    const reservationData = {
      restaurant_id: restaurants.id,
      customer_name: body.customerName,
      phone_number: body.phoneNumber,
      reservation_date: body.reservationDate,
      reservation_time: body.reservationTime,
      party_size: parseInt(body.partySize),
      special_requests: body.specialRequests || null,
      status: 'pending' as const
    }

    const reservation = await ReservationService.createReservation(reservationData)

    return NextResponse.json({
      success: true,
      data: reservation
    }, { status: 201 })

  } catch (error) {
    console.error('予約作成エラー:', error)
    return NextResponse.json(
      { error: '予約の作成に失敗しました' },
      { status: 500 }
    )
  }
}

// 予約一覧を取得
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const restaurantId = searchParams.get('restaurantId')
    const date = searchParams.get('date')

    let reservations
    if (date) {
      reservations = await ReservationService.getReservationsByDate(date, restaurantId || undefined)
    } else {
      reservations = await ReservationService.getReservations(restaurantId || undefined)
    }

    return NextResponse.json({
      success: true,
      data: reservations
    })

  } catch (error) {
    console.error('予約取得エラー:', error)
    return NextResponse.json(
      { error: '予約の取得に失敗しました' },
      { status: 500 }
    )
  }
}
