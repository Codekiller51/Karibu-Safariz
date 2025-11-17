import React, { useEffect, useState } from 'react'
import { admin } from '../../lib/supabase'
import { Search, Mail, Phone, MessageSquare } from 'lucide-react'

const InquiriesManagement: React.FC = () => {
  const [inquiries, setInquiries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchInquiries = async () => {
      setLoading(true)
      setError('')
      const { data, error } = await admin.getAllContactInquiries()
      if (error) {
        setError(error.message || 'Failed to load inquiries')
        setInquiries([])
      } else {
        setInquiries(data || [])
      }
      setLoading(false)
    }
    fetchInquiries()
  }, [])

  const filtered = inquiries.filter((i) => {
    const hay = `${i.name} ${i.email || ''} ${i.phone || ''} ${i.subject || ''}`.toLowerCase()
    const matchesSearch = hay.includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || i.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const updateStatus = async (id: string, status: string) => {
    const { error } = await admin.updateInquiryStatus(id, status)
    if (error) {
      alert(error.message || 'Failed to update status')
      return
    }
    setInquiries((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)))
  }

  const deleteInquiry = async (id: string) => {
    if (!window.confirm('Delete this inquiry?')) return
    const { error } = await admin.deleteInquiry(id)
    if (error) {
      alert(error.message || 'Failed to delete inquiry')
      return
    }
    setInquiries((prev) => prev.filter((i) => i.id !== id))
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
          <h1 className="text-2xl font-semibold text-gray-900">Contact Inquiries</h1>
          <p className="mt-2 text-sm text-gray-700">Respond to customer messages and manage statuses.</p>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search inquiries..."
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
            <option value="new">New</option>
            <option value="replied">Replied</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        <div className="mt-2 text-sm text-gray-600">Showing {filtered.length} of {inquiries.length} inquiries</div>
        {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
      </div>

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sender</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filtered.map((i) => (
                    <tr key={i.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 flex items-center space-x-2">
                          <Mail className="h-4 w-4" />
                          <span>{i.email}</span>
                        </div>
                        <div className="text-xs text-gray-500 flex items-center space-x-2">
                          <MessageSquare className="h-3 w-3" />
                          <span>{i.name}</span>
                        </div>
                        {i.phone && (
                          <div className="text-xs text-gray-500 flex items-center space-x-2">
                            <Phone className="h-3 w-3" />
                            <span>{i.phone}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{i.subject}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-700 max-w-md truncate">{i.message}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <select
                            value={i.status}
                            onChange={(e) => updateStatus(i.id, e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                          >
                            <option value="new">New</option>
                            <option value="replied">Replied</option>
                            <option value="closed">Closed</option>
                          </select>
                          <button
                            onClick={() => deleteInquiry(i.id)}
                            className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 hover:bg-red-200"
                          >
                            Delete
                          </button>
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

export default InquiriesManagement