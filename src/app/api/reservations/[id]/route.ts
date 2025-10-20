import { NextRequest, NextResponse } from 'next/server'
import { ReservationService } from '../../../../lib/database'

// 特定の予約を取得
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const reservations = await ReservationService.getReservations()
    const reservation = reservations.find(r => r.id === params.id)

    if (!reservation) {
      return NextResponse.json(
        { error: '予約が見つかりません' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: reservation
    })

  } catch (error) {
    console.error('予約取得エラー:', error)
    return NextResponse.json(
      { error: '予約の取得に失敗しました' },
      { status: 500 }
    )
  }
}

// 予約を更新
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    const reservation = await ReservationService.updateReservation(params.id, body)

    return NextResponse.json({
      success: true,
      data: reservation
    })

  } catch (error) {
    console.error('予約更新エラー:', error)
    return NextResponse.json(
      { error: '予約の更新に失敗しました' },
      { status: 500 }
    )
  }
}

// 予約を削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await ReservationService.deleteReservation(params.id)

    return NextResponse.json({
      success: true,
      message: '予約が削除されました'
    })

  } catch (error) {
    console.error('予約削除エラー:', error)
    return NextResponse.json(
      { error: '予約の削除に失敗しました' },
      { status: 500 }
    )
  }
}
