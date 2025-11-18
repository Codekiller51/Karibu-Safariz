import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { admin } from '../../lib/supabase'
import { Search, Edit, Trash2, Plus, Eye, EyeOff } from 'lucide-react'

const DestinationManagement: React.FC = () => {
  const [destinations, setDestinations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchDestinations = async () => {
      setLoading(true)
      setError('')
      const { data, error } = await admin.getAllDestinations()
      if (error) {
        setError(error.message || 'Failed to load destinations')
        setDestinations([])
      } else {
        setDestinations(data || [])
      }
      setLoading(false)
    }
    fetchDestinations()
  }, [])

  const filtered = destinations.filter((d) => {
    const hay = `${d.name} ${d.description || ''} ${d.category || ''}`.toLowerCase()
    return hay.includes(searchTerm.toLowerCase())
  })

  const toggleActive = async (id: string, active: boolean) => {
    const { error } = await admin.updateDestination(id, { active: !active })
    if (error) {
      alert(error.message || 'Failed to update destination')
      return
    }
    setDestinations((prev) => prev.map((d) => (d.id === id ? { ...d, active: !active } : d)))
  }

  const deleteDestination = async (id: string) => {
    if (!window.confirm('Delete this destination?')) return
    const { error } = await admin.deleteDestination(id)
    if (error) {
      alert(error.message || 'Failed to delete destination')
      return
    }
    setDestinations((prev) => prev.filter((d) => d.id !== id))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Destinations</h1>
          <p className="mt-2 text-sm text-gray-700">Manage travel destinations and their details.</p>
        </div>
        <Link
          to="/admin/destinations/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Destination
        </Link>
      </div>

      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search destinations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="mt-2 text-sm text-gray-600">Showing {filtered.length} of {destinations.length} destinations</div>
        {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
      </div>

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filtered.map((d) => (
                    <tr key={d.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{d.name}</div>
                        <div className="text-xs text-gray-500">{d.slug}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {d.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{d.location?.region || '—'}</div>
                        <div className="text-xs text-gray-500">{d.location?.district || ''}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleActive(d.id, d.active)}
                          className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${
                            d.active ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          {d.active ? (
                            <>
                              <Eye className="h-3 w-3 mr-1" /> Active
                            </>
                          ) : (
                            <>
                              <EyeOff className="h-3 w-3 mr-1" /> Inactive
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/admin/destinations/edit/${d.id}`}
                            className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 hover:bg-blue-200"
                          >
                            <Edit className="h-3 w-3 mr-1" /> Edit
                          </Link>
                          <button
                            onClick={() => deleteDestination(d.id)}
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

export default DestinationManagement
