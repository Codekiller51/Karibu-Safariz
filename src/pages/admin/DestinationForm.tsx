import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { admin } from '../../lib/supabase'
import { ArrowLeft } from 'lucide-react'

const DestinationForm: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [loading, setLoading] = useState(!!id)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    short_description: '',
    featured_image: '',
    images: [] as string[],
    category: 'mountain' as const,
    location: {
      latitude: 0,
      longitude: 0,
      region: '',
      district: ''
    },
    best_time_to_visit: '',
    activities: [] as string[],
    highlights: [] as string[],
    difficulty_level: 'moderate' as const,
    duration_recommended: '',
    entry_requirements: [] as string[],
    accommodation_options: [] as string[],
    transportation: [] as string[],
    featured: false,
    active: true
  })

  useEffect(() => {
    if (id) {
      const fetchDestination = async () => {
        try {
          const { data, error } = await admin.getAllDestinations()
          if (error) throw error
          const destination = data?.find(d => d.id === id)
          if (destination) {
            setFormData(destination)
          } else {
            alert('Destination not found')
            navigate('/admin/destinations')
          }
        } catch (error) {
          console.error('Error fetching destination:', error)
          alert('Failed to fetch destination data')
          navigate('/admin/destinations')
        } finally {
          setLoading(false)
        }
      }
      fetchDestination()
    }
  }, [id, navigate])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name.startsWith('location.')) {
      const key = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        location: { ...prev.location, [key]: isNaN(Number(value)) ? value : Number(value) }
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: checked }))
  }

  const handleArrayInput = (name: string, value: string) => {
    const items = value.split('\n').filter(item => item.trim())
    setFormData(prev => ({ ...prev, [name]: items }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      if (id) {
        const { error } = await admin.updateDestination(id, formData)
        if (error) throw error
        alert('Destination updated successfully')
      } else {
        const { error } = await admin.createDestination(formData)
        if (error) throw error
        alert('Destination created successfully')
      }
      navigate('/admin/destinations')
    } catch (err: any) {
      console.error('Error saving destination:', err)
      setError(err.message || 'Failed to save destination. Please try again.')
    } finally {
      setSubmitting(false)
    }
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
      <div className="mb-6">
        <button
          onClick={() => navigate('/admin/destinations')}
          className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Destinations
        </button>
        <h1 className="text-2xl font-semibold text-gray-900">
          {id ? 'Edit Destination' : 'Add New Destination'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Slug *</label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Short Description *</label>
          <textarea
            name="short_description"
            value={formData.short_description}
            onChange={handleInputChange}
            required
            rows={2}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows={4}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="mountain">Mountain</option>
              <option value="park">Park</option>
              <option value="cultural">Cultural</option>
              <option value="coastal">Coastal</option>
              <option value="adventure">Adventure</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Difficulty Level *</label>
            <select
              name="difficulty_level"
              value={formData.difficulty_level}
              onChange={handleInputChange}
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="easy">Easy</option>
              <option value="moderate">Moderate</option>
              <option value="challenging">Challenging</option>
              <option value="extreme">Extreme</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Region *</label>
            <input
              type="text"
              name="location.region"
              value={formData.location.region}
              onChange={handleInputChange}
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">District</label>
            <input
              type="text"
              name="location.district"
              value={formData.location.district}
              onChange={handleInputChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Latitude</label>
            <input
              type="number"
              step="0.0001"
              name="location.latitude"
              value={formData.location.latitude}
              onChange={handleInputChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Longitude</label>
            <input
              type="number"
              step="0.0001"
              name="location.longitude"
              value={formData.location.longitude}
              onChange={handleInputChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Featured Image URL *</label>
          <input
            type="url"
            name="featured_image"
            value={formData.featured_image}
            onChange={handleInputChange}
            required
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Best Time to Visit *</label>
          <textarea
            name="best_time_to_visit"
            value={formData.best_time_to_visit}
            onChange={handleInputChange}
            required
            rows={2}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Duration Recommended *</label>
          <input
            type="text"
            name="duration_recommended"
            value={formData.duration_recommended}
            onChange={handleInputChange}
            required
            placeholder="e.g., 2-3 days"
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Activities (one per line)</label>
          <textarea
            value={formData.activities.join('\n')}
            onChange={(e) => handleArrayInput('activities', e.target.value)}
            rows={3}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Highlights (one per line)</label>
          <textarea
            value={formData.highlights.join('\n')}
            onChange={(e) => handleArrayInput('highlights', e.target.value)}
            rows={3}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        <div className="flex items-center space-x-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Active</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Featured</span>
          </label>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/admin/destinations')}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Saving...' : 'Save Destination'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default DestinationForm
