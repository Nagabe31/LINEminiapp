'use client'

import { useState } from 'react'
import { Calendar, Clock, Users, Phone, User, MessageSquare } from 'lucide-react'

interface ReservationFormData {
  customerName: string
  phoneNumber: string
  reservationDate: string
  reservationTime: string
  partySize: number
  specialRequests: string
}

interface ReservationFormProps {
  onSubmit: (data: ReservationFormData) => void
  isLoading?: boolean
}

export default function ReservationForm({ onSubmit, isLoading = false }: ReservationFormProps) {
  const [formData, setFormData] = useState<ReservationFormData>({
    customerName: '',
    phoneNumber: '',
    reservationDate: '',
    reservationTime: '',
    partySize: 1,
    specialRequests: ''
  })

  const [errors, setErrors] = useState<Partial<ReservationFormData>>({})

  // 明日の日付を最小値に設定
  const getMinDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<ReservationFormData> = {}

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'お名前を入力してください'
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = '電話番号を入力してください'
    } else if (!/^[0-9-+()]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = '正しい電話番号の形式で入力してください'
    }

    if (!formData.reservationDate) {
      newErrors.reservationDate = '希望日を選択してください'
    }

    if (!formData.reservationTime) {
      newErrors.reservationTime = '希望時間を選択してください'
    }

    if (!formData.partySize || formData.partySize < 1) {
      newErrors.partySize = '人数を選択してください'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const handleInputChange = (field: keyof ReservationFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // エラーをクリア
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const timeSlots = [
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* お名前 */}
      <div className="space-y-2">
        <label htmlFor="customerName" className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <User className="w-4 h-4" />
          お名前
        </label>
        <input
          type="text"
          id="customerName"
          value={formData.customerName}
          onChange={(e) => handleInputChange('customerName', e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
            errors.customerName ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="山田太郎"
        />
        {errors.customerName && (
          <p className="text-sm text-red-500">{errors.customerName}</p>
        )}
      </div>

      {/* 電話番号 */}
      <div className="space-y-2">
        <label htmlFor="phoneNumber" className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Phone className="w-4 h-4" />
          電話番号
        </label>
        <input
          type="tel"
          id="phoneNumber"
          value={formData.phoneNumber}
          onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
            errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="090-1234-5678"
        />
        {errors.phoneNumber && (
          <p className="text-sm text-red-500">{errors.phoneNumber}</p>
        )}
      </div>

      {/* 希望日 */}
      <div className="space-y-2">
        <label htmlFor="reservationDate" className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Calendar className="w-4 h-4" />
          希望日
        </label>
        <input
          type="date"
          id="reservationDate"
          value={formData.reservationDate}
          onChange={(e) => handleInputChange('reservationDate', e.target.value)}
          min={getMinDate()}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
            errors.reservationDate ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.reservationDate && (
          <p className="text-sm text-red-500">{errors.reservationDate}</p>
        )}
      </div>

      {/* 希望時間 */}
      <div className="space-y-2">
        <label htmlFor="reservationTime" className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Clock className="w-4 h-4" />
          希望時間
        </label>
        <select
          id="reservationTime"
          value={formData.reservationTime}
          onChange={(e) => handleInputChange('reservationTime', e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
            errors.reservationTime ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">時間を選択してください</option>
          {timeSlots.map(time => (
            <option key={time} value={time}>{time}</option>
          ))}
        </select>
        {errors.reservationTime && (
          <p className="text-sm text-red-500">{errors.reservationTime}</p>
        )}
      </div>

      {/* 人数 */}
      <div className="space-y-2">
        <label htmlFor="partySize" className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Users className="w-4 h-4" />
          人数
        </label>
        <select
          id="partySize"
          value={formData.partySize}
          onChange={(e) => handleInputChange('partySize', parseInt(e.target.value))}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
            errors.partySize ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value={0}>人数を選択してください</option>
          {Array.from({ length: 8 }, (_, i) => i + 1).map(num => (
            <option key={num} value={num}>{num}名</option>
          ))}
        </select>
        {errors.partySize && (
          <p className="text-sm text-red-500">{errors.partySize}</p>
        )}
      </div>

      {/* ご要望 */}
      <div className="space-y-2">
        <label htmlFor="specialRequests" className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <MessageSquare className="w-4 h-4" />
          ご要望・アレルギー等
        </label>
        <textarea
          id="specialRequests"
          value={formData.specialRequests}
          onChange={(e) => handleInputChange('specialRequests', e.target.value)}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors resize-none"
          placeholder="アレルギーや特別なご要望がございましたらお書きください"
        />
      </div>

      {/* 送信ボタン */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-4 px-6 rounded-lg font-bold text-lg hover:from-red-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95"
      >
        {isLoading ? '送信中...' : '予約を送信'}
      </button>
    </form>
  )
}
