'use client'

import { useState } from 'react'
import ReservationForm from '../components/ReservationForm'
import ConfirmationModal from '../components/ConfirmationModal'
import SuccessMessage from '../components/SuccessMessage'

interface ReservationFormData {
  customerName: string
  phoneNumber: string
  reservationDate: string
  reservationTime: string
  partySize: number
  specialRequests: string
}

export default function Home() {
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [reservationData, setReservationData] = useState<ReservationFormData | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleFormSubmit = (data: ReservationFormData) => {
    setReservationData(data)
    setShowConfirmation(true)
  }

  const handleConfirmReservation = async () => {
    if (!reservationData) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservationData),
      })

      if (!response.ok) {
        throw new Error('予約の送信に失敗しました')
      }

      setShowConfirmation(false)
      setShowSuccess(true)
    } catch (error) {
      console.error('予約エラー:', error)
      alert('予約の送信に失敗しました。もう一度お試しください。')
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewReservation = () => {
    setShowSuccess(false)
    setReservationData(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      {/* ヘッダー */}
      <header className="bg-gradient-to-r from-red-500 to-orange-500 text-white py-8">
        <div className="max-w-md mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-2">🍽️ レストラン予約</h1>
          <p className="text-red-100">お気軽にご予約ください</p>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-md mx-auto px-4 py-8">
        {!showSuccess ? (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <ReservationForm onSubmit={handleFormSubmit} isLoading={isLoading} />
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <SuccessMessage onNewReservation={handleNewReservation} />
          </div>
        )}
      </main>

      {/* 確認モーダル */}
      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmReservation}
        data={reservationData}
        isLoading={isLoading}
      />

      {/* フッター */}
      <footer className="text-center py-6 text-gray-600 text-sm">
        <p>© 2024 レストラン予約システム</p>
      </footer>
    </div>
  )
}