'use client'

import { useState, useEffect } from 'react'
import { Calendar, Clock, Users, Phone, User, Search, Filter, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { Reservation } from '../../lib/supabase'

export default function AdminDashboard() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [dateFilter, setDateFilter] = useState('')

  useEffect(() => {
    fetchReservations()
  }, [])

  useEffect(() => {
    filterReservations()
  }, [reservations, searchTerm, statusFilter, dateFilter])

  const fetchReservations = async () => {
    try {
      const response = await fetch('/api/reservations')
      if (response.ok) {
        const data = await response.json()
        setReservations(data.data)
      }
    } catch (error) {
      console.error('予約取得エラー:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterReservations = () => {
    let filtered = reservations

    // 検索フィルター
    if (searchTerm) {
      filtered = filtered.filter(reservation =>
        reservation.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.phone_number.includes(searchTerm)
      )
    }

    // ステータスフィルター
    if (statusFilter !== 'all') {
      filtered = filtered.filter(reservation => reservation.status === statusFilter)
    }

    // 日付フィルター
    if (dateFilter) {
      filtered = filtered.filter(reservation => reservation.reservation_date === dateFilter)
    }

    setFilteredReservations(filtered)
  }

  const updateReservationStatus = async (id: string, status: 'confirmed' | 'cancelled') => {
    try {
      const response = await fetch(`/api/reservations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        setReservations(prev =>
          prev.map(reservation =>
            reservation.id === id ? { ...reservation, status } : reservation
          )
        )
      }
    } catch (error) {
      console.error('ステータス更新エラー:', error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return '確定'
      case 'cancelled':
        return 'キャンセル'
      default:
        return '保留中'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">予約管理ダッシュボード</h1>
            <div className="text-sm text-gray-500">
              総予約数: {reservations.length}件
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* フィルター */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* 検索 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="お名前または電話番号で検索"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            {/* ステータスフィルター */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="all">すべてのステータス</option>
              <option value="pending">保留中</option>
              <option value="confirmed">確定</option>
              <option value="cancelled">キャンセル</option>
            </select>

            {/* 日付フィルター */}
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />

            {/* リセットボタン */}
            <button
              onClick={() => {
                setSearchTerm('')
                setStatusFilter('all')
                setDateFilter('')
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              リセット
            </button>
          </div>
        </div>

        {/* 予約一覧 */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {filteredReservations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">予約が見つかりません</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      お客様情報
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      予約日時
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      人数
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ステータス
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReservations.map((reservation) => (
                    <tr key={reservation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <User className="w-4 h-4 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {reservation.customer_name}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Phone className="w-3 h-3 mr-1" />
                              {reservation.phone_number}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm text-gray-900">
                              {formatDate(reservation.reservation_date)}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {reservation.reservation_time}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">
                            {reservation.party_size}名
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(reservation.status)}
                          <span className="ml-2 text-sm text-gray-900">
                            {getStatusText(reservation.status)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {reservation.status === 'pending' && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => updateReservationStatus(reservation.id, 'confirmed')}
                              className="text-green-600 hover:text-green-900"
                            >
                              確定
                            </button>
                            <button
                              onClick={() => updateReservationStatus(reservation.id, 'cancelled')}
                              className="text-red-600 hover:text-red-900"
                            >
                              キャンセル
                            </button>
                          </div>
                        )}
                        {reservation.status !== 'pending' && (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
