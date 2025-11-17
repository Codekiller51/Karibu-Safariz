import React, { useEffect, useState } from 'react'
import { admin } from '../../lib/supabase'
import { Search, CheckCircle, XCircle, Trash2 } from 'lucide-react'

const ReviewsManagement: React.FC = () => {
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true)
      setError('')
      const { data, error } = await admin.getAllReviews(!showVerifiedOnly ? false : true)
      if (error) {
        setError(error.message || 'Failed to load reviews')
        setReviews([])
      } else {
        setReviews(data || [])
      }
      setLoading(false)
    }
    fetchReviews()
  }, [showVerifiedOnly])

  const filtered = reviews.filter((r) => {
    const hay = `${r.title} ${r.content} ${r.profiles?.full_name || ''} ${r.tour_packages?.title || ''}`.toLowerCase()
    return hay.includes(searchTerm.toLowerCase())
  })

  const setVerified = async (id: string, verified: boolean) => {
    const { error } = await admin.verifyReview(id, verified)
    if (error) {
      alert(error.message || 'Failed to update review')
      return
    }
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, verified } : r)))
  }

  const deleteReview = async (id: string) => {
    if (!window.confirm('Delete this review?')) return
    const { error } = await admin.deleteReview(id)
    if (error) {
      alert(error.message || 'Failed to delete review')
      return
    }
    setReviews((prev) => prev.filter((r) => r.id !== id))
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
          <h1 className="text-2xl font-semibold text-gray-900">Reviews</h1>
          <p className="mt-2 text-sm text-gray-700">Verify or remove customer reviews.</p>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative md:col-span-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showVerifiedOnly}
              onChange={(e) => setShowVerifiedOnly(e.target.checked)}
              className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">Verified Only</span>
          </label>
        </div>
        <div className="mt-2 text-sm text-gray-600">Showing {filtered.length} of {reviews.length} reviews</div>
        {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
      </div>

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Review</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tour</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filtered.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{r.title}</div>
                        <div className="text-xs text-gray-500">Rating: {r.rating}/5</div>
                        <div className="text-xs text-gray-500">{r.verified ? 'Verified' : 'Unverified'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{r.profiles?.full_name || '—'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{r.tour_packages?.title || '—'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {r.verified ? (
                            <button
                              onClick={() => setVerified(r.id, false)}
                              className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 hover:bg-gray-200"
                            >
                              <XCircle className="h-3 w-3 mr-1" /> Unverify
                            </button>
                          ) : (
                            <button
                              onClick={() => setVerified(r.id, true)}
                              className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 hover:bg-green-200"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" /> Verify
                            </button>
                          )}
                          <button
                            onClick={() => deleteReview(r.id)}
                            className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 hover:bg-red-200"
                          >
                            <Trash2 className="h-3 w-3 mr-1" /> Delete
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

export default ReviewsManagement