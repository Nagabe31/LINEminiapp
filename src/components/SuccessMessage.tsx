'use client'

import { CheckCircle, RotateCcw } from 'lucide-react'

interface SuccessMessageProps {
  onNewReservation: () => void
}

export default function SuccessMessage({ onNewReservation }: SuccessMessageProps) {
  return (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
      </div>
      
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">予約が完了しました！</h2>
        <p className="text-gray-600 leading-relaxed">
          ご予約ありがとうございます。<br />
          確認のため、お電話をいたします。
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>ご連絡先:</strong> 03-1234-5678<br />
          <strong>営業時間:</strong> 11:00 - 22:00
        </p>
      </div>

      <button
        onClick={onNewReservation}
        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
      >
        <RotateCcw className="w-4 h-4" />
        新しい予約
      </button>
    </div>
  )
}
