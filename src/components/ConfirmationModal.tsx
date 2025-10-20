'use client'

import { X, Calendar, Clock, Users, Phone, User, MessageSquare } from 'lucide-react'

interface ReservationData {
  customerName: string
  phoneNumber: string
  reservationDate: string
  reservationTime: string
  partySize: number
  specialRequests: string
}

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  data: ReservationData | null
  isLoading?: boolean
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  data,
  isLoading = false
}: ConfirmationModalProps) {
  if (!isOpen || !data) return null

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">予約内容確認</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 予約詳細 */}
        <div className="p-6 space-y-4">
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm text-gray-600">お名前</p>
                <p className="font-medium text-gray-900">{data.customerName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm text-gray-600">電話番号</p>
                <p className="font-medium text-gray-900">{data.phoneNumber}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm text-gray-600">希望日</p>
                <p className="font-medium text-gray-900">{formatDate(data.reservationDate)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm text-gray-600">希望時間</p>
                <p className="font-medium text-gray-900">{data.reservationTime}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm text-gray-600">人数</p>
                <p className="font-medium text-gray-900">{data.partySize}名</p>
              </div>
            </div>

            {data.specialRequests && (
              <div className="flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-red-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">ご要望</p>
                  <p className="font-medium text-gray-900">{data.specialRequests}</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>ご注意:</strong> ご予約確定後、確認のためお電話をいたします。
            </p>
          </div>
        </div>

        {/* ボタン */}
        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            キャンセル
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg font-medium hover:from-red-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isLoading ? '確定中...' : '確定'}
          </button>
        </div>
      </div>
    </div>
  )
}
