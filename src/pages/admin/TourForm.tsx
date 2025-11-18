import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, X, Plus, Trash2, Upload, Image as ImageIcon } from 'lucide-react';
import { admin } from '../../lib/supabase';
import { TourPackage, DayItinerary } from '../../types';
import { tourSchema, type TourFormData } from '../../lib/validationSchemas';

const TourForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);
  const [itinerary, setItinerary] = useState<DayItinerary[]>([]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TourFormData>({
    resolver: zodResolver(tourSchema),
    defaultValues: {
      featured: false,
      active: true,
      images: [],
      includes: [''],
      excludes: [''],
      requirements: [''],
    },
  });

  const { fields: includesFields, append: appendInclude, remove: removeInclude } = useFieldArray({
    control,
    name: 'includes',
  });

  const { fields: excludesFields, append: appendExclude, remove: removeExclude } = useFieldArray({
    control,
    name: 'excludes',
  });

  const { fields: requirementsFields, append: appendRequirement, remove: removeRequirement } = useFieldArray({
    control,
    name: 'requirements',
  });

  const { fields: imagesFields, append: appendImage, remove: removeImage } = useFieldArray({
    control,
    name: 'images',
  });

  useEffect(() => {
    if (isEditing && id) {
      fetchTour();
    }
  }, [isEditing, id]);

  const fetchTour = async () => {
    try {
      setInitialLoading(true);
      const { data, error } = await admin.getAllTourPackages();
      if (error) throw error;
      
      const tour = data?.find(t => t.id === id);
      if (!tour) {
        alert('Tour not found');
        navigate('/admin/tours');
        return;
      }

      // Populate form with existing data
      Object.keys(tour).forEach((key) => {
        if (key !== 'id' && key !== 'created_at' && key !== 'updated_at') {
          setValue(key as keyof TourFormData, tour[key as keyof TourPackage] as any);
        }
      });

      setItinerary(tour.itinerary || []);
    } catch (error) {
      console.error('Error fetching tour:', error);
      alert('Failed to fetch tour data');
      navigate('/admin/tours');
    } finally {
      setInitialLoading(false);
    }
  };

  const onSubmit = async (data: TourFormData) => {
    console.log('Form submitted with data:', data);
    console.log('Is editing:', isEditing);
    console.log('Admin status:', admin.isAdmin);
    
    try {
      setLoading(true);
      
      const tourData = {
        ...data,
        slug: data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        itinerary,
      };

      console.log('Prepared tour data:', tourData);

      if (isEditing) {
        console.log('Updating tour with ID:', id);
        const { error } = await admin.updateTourPackage(id!, tourData);
        if (error) throw error;
        alert('Tour package updated successfully!');
      } else {
        console.log('Creating new tour package');
        const { error } = await admin.createTourPackage(tourData);
        console.log('Create result:', { error });
        if (error) throw error;
        alert('Tour package created successfully!');
      }

      navigate('/admin/tours');
    } catch (error) {
      console.error('Error saving tour:', error);
      alert('Failed to save tour package. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addItineraryDay = () => {
    const newDay: DayItinerary = {
      day: itinerary.length + 1,
      title: '',
      description: '',
      activities: [''],
      accommodation: '',
      meals: [''],
    };
    setItinerary([...itinerary, newDay]);
  };

  const updateItineraryDay = (index: number, field: keyof DayItinerary, value: any) => {
    const updated = [...itinerary];
    updated[index] = { ...updated[index], [field]: value };
    setItinerary(updated);
  };

  const removeItineraryDay = (index: number) => {
    const updated = itinerary.filter((_, i) => i !== index);
    // Renumber days
    updated.forEach((day, i) => {
      day.day = i + 1;
    });
    setItinerary(updated);
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          {isEditing ? 'Edit Tour Package' : 'Create New Tour Package'}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {isEditing ? 'Update the tour package details below.' : 'Fill in the details to create a new tour package.'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tour Title *
              </label>
              <input
                {...register('title')}
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter tour title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Short Description *
              </label>
              <textarea
                {...register('short_description')}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Brief description for tour cards"
              />
              {errors.short_description && (
                <p className="mt-1 text-sm text-red-600">{errors.short_description.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Description *
              </label>
              <textarea
                {...register('description')}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Detailed description of the tour"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                {...register('category')}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select category</option>
                <option value="mountain-climbing">Mountain Climbing</option>
                <option value="safari">Safari</option>
                <option value="day-trips">Day Trips</option>
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty *
              </label>
              <select
                {...register('difficulty')}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select difficulty</option>
                <option value="easy">Easy</option>
                <option value="moderate">Moderate</option>
                <option value="challenging">Challenging</option>
                <option value="extreme">Extreme</option>
              </select>
              {errors.difficulty && (
                <p className="mt-1 text-sm text-red-600">{errors.difficulty.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (days) *
              </label>
              <input
                {...register('duration', { valueAsNumber: true })}
                type="number"
                min="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Number of days"
              />
              {errors.duration && (
                <p className="mt-1 text-sm text-red-600">{errors.duration.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Best Time to Visit *
              </label>
              <input
                {...register('best_time')}
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., June - October"
              />
              {errors.best_time && (
                <p className="mt-1 text-sm text-red-600">{errors.best_time.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Pricing and Participants */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Pricing & Participants</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (USD) *
              </label>
              <input
                {...register('price_usd', { valueAsNumber: true })}
                type="number"
                min="1"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Price in USD"
              />
              {errors.price_usd && (
                <p className="mt-1 text-sm text-red-600">{errors.price_usd.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (TZS) *
              </label>
              <input
                {...register('price_tzs', { valueAsNumber: true })}
                type="number"
                min="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Price in Tanzanian Shillings"
              />
              {errors.price_tzs && (
                <p className="mt-1 text-sm text-red-600">{errors.price_tzs.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Participants *
              </label>
              <input
                {...register('min_participants', { valueAsNumber: true })}
                type="number"
                min="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Minimum number of participants"
              />
              {errors.min_participants && (
                <p className="mt-1 text-sm text-red-600">{errors.min_participants.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Participants *
              </label>
              <input
                {...register('max_participants', { valueAsNumber: true })}
                type="number"
                min="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Maximum number of participants"
              />
              {errors.max_participants && (
                <p className="mt-1 text-sm text-red-600">{errors.max_participants.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Images</h2>
          
          <div className="space-y-4">
            {imagesFields.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-4">
                <div className="flex-1">
                  <input
                    {...register(`images.${index}` as const)}
                    type="url"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Image URL"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="text-red-600 hover:text-red-800"
                  disabled={imagesFields.length === 1}
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
            
            <button
              type="button"
              onClick={() => appendImage('')}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
            >
              <Plus className="h-4 w-4" />
              <span>Add Image</span>
            </button>
          </div>
          
          {errors.images && (
            <p className="mt-1 text-sm text-red-600">{errors.images.message}</p>
          )}
        </div>

        {/* Includes/Excludes/Requirements */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Tour Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Includes */}
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-4">What's Included</h3>
              <div className="space-y-3">
                {includesFields.map((field, index) => (
                  <div key={field.id} className="flex items-center space-x-2">
                    <input
                      {...register(`includes.${index}` as const)}
                      type="text"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="What's included"
                    />
                    <button
                      type="button"
                      onClick={() => removeInclude(index)}
                      className="text-red-600 hover:text-red-800"
                      disabled={includesFields.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => appendInclude('')}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm"
                >
                  <Plus className="h-3 w-3" />
                  <span>Add Item</span>
                </button>
              </div>
            </div>

            {/* Excludes */}
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-4">What's Not Included</h3>
              <div className="space-y-3">
                {excludesFields.map((field, index) => (
                  <div key={field.id} className="flex items-center space-x-2">
                    <input
                      {...register(`excludes.${index}` as const)}
                      type="text"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="What's not included"
                    />
                    <button
                      type="button"
                      onClick={() => removeExclude(index)}
                      className="text-red-600 hover:text-red-800"
                      disabled={excludesFields.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => appendExclude('')}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm"
                >
                  <Plus className="h-3 w-3" />
                  <span>Add Item</span>
                </button>
              </div>
            </div>

            {/* Requirements */}
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-4">Requirements</h3>
              <div className="space-y-3">
                {requirementsFields.map((field, index) => (
                  <div key={field.id} className="flex items-center space-x-2">
                    <input
                      {...register(`requirements.${index}` as const)}
                      type="text"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Requirement"
                    />
                    <button
                      type="button"
                      onClick={() => removeRequirement(index)}
                      className="text-red-600 hover:text-red-800"
                      disabled={requirementsFields.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => appendRequirement('')}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm"
                >
                  <Plus className="h-3 w-3" />
                  <span>Add Requirement</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Itinerary */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-gray-900">Itinerary</h2>
            <button
              type="button"
              onClick={addItineraryDay}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              <span>Add Day</span>
            </button>
          </div>

          <div className="space-y-6">
            {itinerary.map((day, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-md font-medium text-gray-900">Day {day.day}</h3>
                  <button
                    type="button"
                    onClick={() => removeItineraryDay(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Day Title
                    </label>
                    <input
                      type="text"
                      value={day.title}
                      onChange={(e) => updateItineraryDay(index, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Day title"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={day.description}
                      onChange={(e) => updateItineraryDay(index, 'description', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Day description"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Activities (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={day.activities?.join(', ') || ''}
                      onChange={(e) => updateItineraryDay(index, 'activities', e.target.value.split(', ').filter(Boolean))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Activities for this day"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Accommodation
                    </label>
                    <input
                      type="text"
                      value={day.accommodation || ''}
                      onChange={(e) => updateItineraryDay(index, 'accommodation', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Accommodation for this day"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Settings</h2>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                {...register('featured')}
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Featured Tour (appears on homepage)
              </label>
            </div>

            <div className="flex items-center">
              <input
                {...register('active')}
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Active (visible to public)
              </label>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/admin/tours')}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>{isEditing ? 'Updating...' : 'Creating...'}</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>{isEditing ? 'Update Tour' : 'Create Tour'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TourForm;