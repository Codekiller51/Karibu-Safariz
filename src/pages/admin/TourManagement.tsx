import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, Search, Filter, ToggleLeft, ToggleRight, Star } from 'lucide-react';
import { admin } from '../../lib/supabase';
import { TourPackage } from '../../types';

const TourManagement: React.FC = () => {
  const [tours, setTours] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      setLoading(true);
      const { data, error } = await admin.getAllTourPackages();
      if (error) throw error;
      setTours(data || []);
    } catch (error) {
      console.error('Error fetching tours:', error);
      alert('Failed to fetch tours. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredTours = tours.filter(tour => {
    const matchesSearch = tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tour.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tour.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || tour.difficulty === selectedDifficulty;
    const matchesFeatured = !showFeaturedOnly || tour.featured;
    
    return matchesSearch && matchesCategory && matchesDifficulty && matchesFeatured;
  });

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      try {
        const { error } = await admin.deleteTourPackage(id);
        if (error) throw error;
        
        setTours(tours.filter(tour => tour.id !== id));
        alert('Tour package deleted successfully!');
      } catch (error) {
        console.error('Error deleting tour:', error);
        alert('Failed to delete tour package. Please try again.');
      }
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await admin.updateTourPackage(id, { active: !currentStatus });
      if (error) throw error;
      
      setTours(tours.map(tour => 
        tour.id === id ? { ...tour, active: !currentStatus } : tour
      ));
    } catch (error) {
      console.error('Error updating tour status:', error);
      alert('Failed to update tour status. Please try again.');
    }
  };

  const toggleFeatured = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await admin.updateTourPackage(id, { featured: !currentStatus });
      if (error) throw error;
      
      setTours(tours.map(tour => 
        tour.id === id ? { ...tour, featured: !currentStatus } : tour
      ));
    } catch (error) {
      console.error('Error updating featured status:', error);
      alert('Failed to update featured status. Please try again.');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'challenging': return 'bg-orange-100 text-orange-800';
      case 'extreme': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'mountain-climbing': return 'bg-blue-100 text-blue-800';
      case 'safari': return 'bg-green-100 text-green-800';
      case 'day-trips': return 'bg-teal-100 text-teal-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
          <h1 className="text-2xl font-semibold text-gray-900">Tour Packages</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage all tour packages, including creating new ones and editing existing packages.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            to="/admin/tours/new"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-orange-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Tour Package
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search tours..."
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
            <option value="mountain-climbing">Mountain Climbing</option>
            <option value="safari">Safari</option>
            <option value="day-trips">Day Trips</option>
          </select>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="moderate">Moderate</option>
            <option value="challenging">Challenging</option>
            <option value="extreme">Extreme</option>
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
              setSelectedDifficulty('all');
              setShowFeaturedOnly(false);
            }}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredTours.length} of {tours.length} tour packages
        </div>
      </div>

      {/* Tours Table */}
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tour Package
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Difficulty
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
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
                  {filteredTours.map((tour) => (
                    <tr key={tour.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-12 w-12 flex-shrink-0">
                            <img
                              className="h-12 w-12 rounded-lg object-cover"
                              src={tour.images[0]}
                              alt={tour.title}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                              {tour.title}
                            </div>
                            <div className="text-sm text-gray-500 max-w-xs truncate">
                              {tour.short_description}
                            </div>
                            {tour.featured && (
                              <div className="flex items-center mt-1">
                                <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                                <span className="text-xs text-yellow-600">Featured</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(tour.category)}`}>
                          {tour.category.replace('-', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(tour.difficulty)}`}>
                          {tour.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {tour.duration} days
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>${tour.price_usd}</div>
                        <div className="text-xs text-gray-500">TZS {tour.price_tzs.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-1">
                          <button
                            onClick={() => toggleActive(tour.id, tour.active)}
                            className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                              tour.active
                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                            }`}
                          >
                            {tour.active ? (
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
                            onClick={() => toggleFeatured(tour.id, tour.featured)}
                            className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                              tour.featured
                                ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                          >
                            <Star className={`h-3 w-3 mr-1 ${tour.featured ? 'fill-current' : ''}`} />
                            {tour.featured ? 'Featured' : 'Regular'}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/tours/${tour.category}/${tour.id}`}
                            className="text-indigo-600 hover:text-indigo-900 p-1 rounded"
                            title="View Tour"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <Link
                            to={`/admin/tours/edit/${tour.id}`}
                            className="text-orange-600 hover:text-orange-900 p-1 rounded"
                            title="Edit Tour"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(tour.id, tour.title)}
                            className="text-red-600 hover:text-red-900 p-1 rounded"
                            title="Delete Tour"
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

      {filteredTours.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">
            {tours.length === 0 ? 'No tour packages found.' : 'No tours match your current filters.'}
          </div>
          {tours.length === 0 && (
            <Link
              to="/admin/tours/new"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Tour Package
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default TourManagement;