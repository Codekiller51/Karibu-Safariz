import React, { useState } from 'react'
import { Settings, Save } from 'lucide-react'

const SettingsManagement: React.FC = () => {
  const [saved, setSaved] = useState(false)
  const [settings, setSettings] = useState({
    site_name: 'Karibu Safariz',
    site_email: 'info@karibusafariz.com',
    site_phone: '+255 123 456 789',
    support_email: 'support@karibusafariz.com',
    maintenance_mode: false,
    allow_bookings: true,
    max_booking_advance_days: 180,
    cancellation_deadline_days: 7
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const isCheckbox = type === 'checkbox'
    const checked = isCheckbox ? (e.target as HTMLInputElement).checked : null

    setSettings(prev => ({
      ...prev,
      [name]: isCheckbox ? checked : type === 'number' ? parseInt(value) : value
    }))
    setSaved(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      alert('Settings saved successfully!')
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      alert('Failed to save settings')
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="mt-2 text-sm text-gray-600">Manage site-wide settings and configurations</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Site Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-6">
            <Settings className="h-5 w-5 text-orange-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Site Information</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Site Name</label>
              <input
                type="text"
                name="site_name"
                value={settings.site_name}
                onChange={handleInputChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Main Email</label>
                <input
                  type="email"
                  name="site_email"
                  value={settings.site_email}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Support Email</label>
                <input
                  type="email"
                  name="support_email"
                  value={settings.support_email}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                name="site_phone"
                value={settings.site_phone}
                onChange={handleInputChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Booking Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Booking Settings</h2>

          <div className="space-y-6">
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="allow_bookings"
                  checked={settings.allow_bookings}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Allow New Bookings</span>
              </label>
              <p className="mt-1 text-xs text-gray-500">Disable this to temporarily stop accepting bookings</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Maximum Booking Advance (days)</label>
              <input
                type="number"
                name="max_booking_advance_days"
                value={settings.max_booking_advance_days}
                onChange={handleInputChange}
                min="1"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
              />
              <p className="mt-1 text-xs text-gray-500">How many days in advance customers can book tours</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Cancellation Deadline (days)</label>
              <input
                type="number"
                name="cancellation_deadline_days"
                value={settings.cancellation_deadline_days}
                onChange={handleInputChange}
                min="0"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
              />
              <p className="mt-1 text-xs text-gray-500">How many days before tour start date cancellations are allowed</p>
            </div>
          </div>
        </div>

        {/* System Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">System Settings</h2>

          <div className="space-y-6">
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="maintenance_mode"
                  checked={settings.maintenance_mode}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Maintenance Mode</span>
              </label>
              <p className="mt-1 text-xs text-gray-500">Enable this to put the site in maintenance mode</p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {saved && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <p className="text-sm text-green-700">Settings saved successfully!</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </button>
        </div>
      </form>
    </div>
  )
}

export default SettingsManagement
