import React, { useEffect, useState } from 'react'
import { admin } from '../../lib/supabase'
import { Search, UserCheck, UserX } from 'lucide-react'

const UsersManagement: React.FC = () => {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      setError('')
      const { data, error } = await admin.getAllUsers()
      if (error) {
        setError(error.message || 'Failed to load users')
        setUsers([])
      } else {
        setUsers(data || [])
      }
      setLoading(false)
    }
    fetchUsers()
  }, [])

  const filtered = users.filter((u) => {
    const hay = `${u.full_name} ${u.email || ''} ${u.phone || ''}`.toLowerCase()
    return hay.includes(searchTerm.toLowerCase())
  })

  const toggleAdmin = async (id: string, isAdmin: boolean) => {
    const { error } = await admin.updateUserAdmin(id, !isAdmin)
    if (error) {
      alert(error.message || 'Failed to update admin status')
      return
    }
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, is_admin: !isAdmin } : u)))
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
          <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
          <p className="mt-2 text-sm text-gray-700">Manage user accounts and admin privileges.</p>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>
        <div className="mt-2 text-sm text-gray-600">Showing {filtered.length} of {users.length} users</div>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filtered.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{u.full_name}</div>
                        <div className="text-xs text-gray-500">{u.nationality || ''}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{u.email || '—'}</div>
                        <div className="text-xs text-gray-500">{u.phone || ''}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleAdmin(u.id, u.is_admin)}
                          className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${
                            u.is_admin ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          {u.is_admin ? (
                            <>
                              <UserCheck className="h-3 w-3 mr-1" /> Admin
                            </>
                          ) : (
                            <>
                              <UserX className="h-3 w-3 mr-1" /> Regular
                            </>
                          )}
                        </button>
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

export default UsersManagement