import React, { useEffect, useState } from 'react'
import { admin } from '../../lib/supabase'
import { Search, Calendar, Users, BadgeDollarSign, CheckCircle, AlertCircle } from 'lucide-react'

const BookingsManagement: React.FC = () => {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true)
      setError('')
      const { data, error } = await admin.getAllBookings()
      if (error) {
        setError(error.message || 'Failed to load bookings')
        setBookings([])
      } else {
        setBookings(data || [])
      }
      setLoading(false)
    }
    fetchBookings()
  }, [])

  const filtered = bookings.filter((b) => {
    const matchesSearch = (
      (b.profiles?.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.tour_packages?.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    )
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const updateStatus = async (id: string, status: string) => {
    const { error } = await admin.updateBookingStatus(id, status)
    if (error) {
      alert(error.message || 'Failed to update status')
      return
    }
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Bookings</h1>
          <p className="mt-2 text-sm text-gray-700">Manage customer bookings and update statuses.</p>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by customer or tour..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="mt-2 text-sm text-gray-600">Showing {filtered.length} of {bookings.length} bookings</div>
        {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
      </div>

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tour</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filtered.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{b.profiles?.full_name || 'Unknown'}</div>
                        <div className="text-xs text-gray-500">{b.profiles?.email || ''}</div>
                        <div className="text-xs text-gray-500">{b.profiles?.phone || ''}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{b.tour_packages?.title || '—'}</div>
                        <div className="text-xs text-gray-500">{b.tour_packages?.category || ''}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2 text-sm text-gray-900">
                          <Calendar className="h-4 w-4" />
                          <span>{b.start_date}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2 text-sm text-gray-900">
                          <Users className="h-4 w-4" />
                          <span>{b.participants}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2 text-sm text-gray-900">
                          <BadgeDollarSign className="h-4 w-4" />
                          <span>
                            {b.total_amount} {b.currency}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <select
                            value={b.status}
                            onChange={(e) => updateStatus(b.id, e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="completed">Completed</option>
                          </select>
                          {b.status === 'confirmed' && <CheckCircle className="h-4 w-4 text-green-600" />}
                          {b.status === 'cancelled' && <AlertCircle className="h-4 w-4 text-red-600" />}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingsManagement