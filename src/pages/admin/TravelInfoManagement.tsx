import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, Search, Filter, ToggleLeft, ToggleRight, Star } from 'lucide-react';
import { admin } from '../../lib/supabase';
import { TravelInfo } from '../../types';

const TravelInfoManagement: React.FC = () => {
  const [travelInfo, setTravelInfo] = useState<TravelInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  const categories = [
    { value: 'tips', label: 'Travel Tips' },
    { value: 'packing', label: 'Packing Guide' },
    { value: 'visa', label: 'Visa & Entry' },
    { value: 'best-time', label: 'Best Time to Visit' },
    { value: 'health-safety', label: 'Health & Safety' },
    { value: 'currency', label: 'Currency & Payments' },
    { value: 'weather', label: 'Weather Information' }
  ];

  useEffect(() => {
    fetchTravelInfo();
  }, []);

  const fetchTravelInfo = async () => {
    try {
      setLoading(true);
      const { data, error } = await admin.getAllTravelInfo();
      if (error) throw error;
      setTravelInfo(data || []);
    } catch (error) {
      console.error('Error fetching travel info:', error);
      alert('Failed to fetch travel information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredInfo = travelInfo.filter(info => {
    const matchesSearch = info.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         info.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || info.category === selectedCategory;
    const matchesFeatured = !showFeaturedOnly || info.featured;
    
    return matchesSearch && matchesCategory && matchesFeatured;
  });

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      try {
        const { error } = await admin.deleteTravelInfo(id);
        if (error) throw error;
        
        setTravelInfo(travelInfo.filter(info => info.id !== id));
        alert('Travel information deleted successfully!');
      } catch (error) {
        console.error('Error deleting travel info:', error);
        alert('Failed to delete travel information. Please try again.');
      }
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await admin.updateTravelInfo(id, { active: !currentStatus });
      if (error) throw error;
      
      setTravelInfo(travelInfo.map(info => 
        info.id === id ? { ...info, active: !currentStatus } : info
      ));
    } catch (error) {
      console.error('Error updating active status:', error);
      alert('Failed to update active status. Please try again.');
    }
  };

  const toggleFeatured = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await admin.updateTravelInfo(id, { featured: !currentStatus });
      if (error) throw error;
      
      setTravelInfo(travelInfo.map(info => 
        info.id === id ? { ...info, featured: !currentStatus } : info
      ));
    } catch (error) {
      console.error('Error updating featured status:', error);
      alert('Failed to update featured status. Please try again.');
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'tips': 'bg-green-100 text-green-800',
      'packing': 'bg-teal-100 text-teal-800',
      'visa': 'bg-red-100 text-red-800',
      'best-time': 'bg-yellow-100 text-yellow-800',
      'health-safety': 'bg-pink-100 text-pink-800',
      'currency': 'bg-sky-100 text-sky-800',
      'weather': 'bg-cyan-100 text-cyan-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryLabel = (category: string) => {
    const categoryObj = categories.find(cat => cat.value === category);
    return categoryObj ? categoryObj.label : category;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Travel Information</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage travel guides, tips, and essential information for travelers.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            to="/admin/travel-info/new"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-orange-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Travel Guide
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search travel info..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category.value} value={category.value}>{category.label}</option>
            ))}
          </select>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showFeaturedOnly}
              onChange={(e) => setShowFeaturedOnly(e.target.checked)}
              className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">Featured Only</span>
          </label>

          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setShowFeaturedOnly(false);
            }}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredInfo.length} of {travelInfo.length} travel guides
        </div>
      </div>

      {/* Travel Info Table */}
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Travel Guide
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tags
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInfo.map((info) => (
                    <tr key={info.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-12 w-12 flex-shrink-0">
                            <img
                              className="h-12 w-12 rounded-lg object-cover"
                              src={info.featured_image}
                              alt={info.title}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                              {info.title}
                            </div>
                            <div className="text-sm text-gray-500 max-w-xs truncate">
                              {info.excerpt}
                            </div>
                            {info.featured && (
                              <div className="flex items-center mt-1">
                                <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                                <span className="text-xs text-yellow-600">Featured</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(info.category)}`}>
                          {getCategoryLabel(info.category)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {info.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                          {info.tags.length > 3 && (
                            <span className="text-xs text-gray-500">+{info.tags.length - 3} more</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-1">
                          <button
                            onClick={() => toggleActive(info.id, info.active)}
                            className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                              info.active
                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                            }`}
                          >
                            {info.active ? (
                              <>
                                <ToggleRight className="h-3 w-3 mr-1" />
                                Active
                              </>
                            ) : (
                              <>
                                <ToggleLeft className="h-3 w-3 mr-1" />
                                Inactive
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => toggleFeatured(info.id, info.featured)}
                            className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                              info.featured
                                ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                          >
                            <Star className={`h-3 w-3 mr-1 ${info.featured ? 'fill-current' : ''}`} />
                            {info.featured ? 'Featured' : 'Regular'}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/travel-info/${info.slug}`}
                            className="text-indigo-600 hover:text-indigo-900 p-1 rounded"
                            title="View Guide"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <Link
                            to={`/admin/travel-info/edit/${info.id}`}
                            className="text-orange-600 hover:text-orange-900 p-1 rounded"
                            title="Edit Guide"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(info.id, info.title)}
                            className="text-red-600 hover:text-red-900 p-1 rounded"
                            title="Delete Guide"
                          >
                            <Trash2 className="h-4 w-4" />
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

      {filteredInfo.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">
            {travelInfo.length === 0 ? 'No travel guides found.' : 'No guides match your current filters.'}
          </div>
          {travelInfo.length === 0 && (
            <Link
              to="/admin/travel-info/new"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Travel Guide
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default TravelInfoManagement;