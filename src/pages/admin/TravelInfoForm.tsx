import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, X, Plus, Trash2, Eye } from 'lucide-react';
import { admin } from '../../lib/supabase';
import { TravelInfo, QuickFact } from '../../types';

const travelInfoSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  excerpt: z.string().min(20, 'Excerpt must be at least 20 characters'),
  content: z.string().min(100, 'Content must be at least 100 characters'),
  featured_image: z.string().url('Please enter a valid image URL'),
  category: z.enum(['tips', 'packing', 'visa', 'best-time', 'health-safety', 'currency', 'weather']),
  tags: z.array(z.string().min(1)),
  quick_facts: z.array(z.object({
    label: z.string().min(1),
    value: z.string().min(1),
    icon: z.string().optional(),
  })),
  checklist_items: z.array(z.string().min(1)).optional(),
  featured: z.boolean(),
  active: z.boolean(),
});

type TravelInfoFormData = z.infer<typeof travelInfoSchema>;

const TravelInfoForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);
  const [previewMode, setPreviewMode] = useState(false);

  const categories = [
    { value: 'tips', label: 'Travel Tips' },
    { value: 'packing', label: 'Packing Guide' },
    { value: 'visa', label: 'Visa & Entry' },
    { value: 'best-time', label: 'Best Time to Visit' },
    { value: 'health-safety', label: 'Health & Safety' },
    { value: 'currency', label: 'Currency & Payments' },
    { value: 'weather', label: 'Weather Information' }
  ];

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TravelInfoFormData>({
    resolver: zodResolver(travelInfoSchema),
    defaultValues: {
      featured: false,
      active: true,
      tags: [''],
      quick_facts: [{ label: '', value: '', icon: '' }],
      checklist_items: [''],
    },
  });

  const { fields: tagsFields, append: appendTag, remove: removeTag } = useFieldArray({
    control,
    name: 'tags',
  });

  const { fields: quickFactsFields, append: appendQuickFact, remove: removeQuickFact } = useFieldArray({
    control,
    name: 'quick_facts',
  });

  const { fields: checklistFields, append: appendChecklistItem, remove: removeChecklistItem } = useFieldArray({
    control,
    name: 'checklist_items',
  });

  const watchedContent = watch('content');
  const watchedTitle = watch('title');
  const watchedExcerpt = watch('excerpt');
  const watchedFeaturedImage = watch('featured_image');

  useEffect(() => {
    if (isEditing && id) {
      fetchTravelInfo();
    }
  }, [isEditing, id]);

  const fetchTravelInfo = async () => {
    try {
      setInitialLoading(true);
      const { data, error } = await admin.getAllTravelInfo();
      if (error) throw error;
      
      const info = data?.find(i => i.id === id);
      if (!info) {
        alert('Travel information not found');
        navigate('/admin/travel-info');
        return;
      }

      // Populate form with existing data
      Object.keys(info).forEach((key) => {
        if (key !== 'id' && key !== 'created_at' && key !== 'updated_at' && key !== 'slug') {
          setValue(key as keyof TravelInfoFormData, info[key as keyof TravelInfo] as any);
        }
      });
    } catch (error) {
      console.error('Error fetching travel info:', error);
      alert('Failed to fetch travel information data');
      navigate('/admin/travel-info');
    } finally {
      setInitialLoading(false);
    }
  };

  const onSubmit = async (data: TravelInfoFormData) => {
    try {
      setLoading(true);
      
      const infoData = {
        ...data,
        slug: data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        checklist_items: data.checklist_items?.filter(item => item.trim() !== '') || [],
      };

      if (isEditing) {
        const { error } = await admin.updateTravelInfo(id!, infoData);
        if (error) throw error;
        alert('Travel information updated successfully!');
      } else {
        const { error } = await admin.createTravelInfo(infoData);
        if (error) throw error;
        alert('Travel information created successfully!');
      }

      navigate('/admin/travel-info');
    } catch (error) {
      console.error('Error saving travel info:', error);
      alert('Failed to save travel information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (previewMode) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Preview</h1>
          <button
            onClick={() => setPreviewMode(false)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            <X className="h-4 w-4" />
            <span>Close Preview</span>
          </button>
        </div>

        <article className="bg-white shadow rounded-lg overflow-hidden">
          {watchedFeaturedImage && (
            <img
              src={watchedFeaturedImage}
              alt={watchedTitle}
              className="w-full h-64 object-cover"
            />
          )}
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{watchedTitle}</h1>
            <p className="text-xl text-gray-600 mb-6">{watchedExcerpt}</p>
            <div className="prose max-w-none">
              {watchedContent?.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4">{paragraph}</p>
              ))}
            </div>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {isEditing ? 'Edit Travel Guide' : 'Create New Travel Guide'}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {isEditing ? 'Update the travel guide details below.' : 'Fill in the details to create a new travel guide.'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setPreviewMode(true)}
          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
        >
          <Eye className="h-4 w-4" />
          <span>Preview</span>
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Basic Information</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Guide Title *
              </label>
              <input
                {...register('title')}
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                placeholder="Enter travel guide title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
              {watchedTitle && (
                <p className="mt-1 text-sm text-gray-500">
                  Slug: {generateSlug(watchedTitle)}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Excerpt *
              </label>
              <textarea
                {...register('excerpt')}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                placeholder="Brief description of the travel guide"
              />
              {errors.excerpt && (
                <p className="mt-1 text-sm text-red-600">{errors.excerpt.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Featured Image URL *
              </label>
              <input
                {...register('featured_image')}
                type="url"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                placeholder="https://example.com/image.jpg"
              />
              {errors.featured_image && (
                <p className="mt-1 text-sm text-red-600">{errors.featured_image.message}</p>
              )}
              {watchedFeaturedImage && (
                <div className="mt-2">
                  <img
                    src={watchedFeaturedImage}
                    alt="Featured image preview"
                    className="w-32 h-20 object-cover rounded border"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                {...register('category')}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">Select category</option>
                {categories.map(category => (
                  <option key={category.value} value={category.value}>{category.label}</option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Content</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Guide Content *
            </label>
            <textarea
              {...register('content')}
              rows={20}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500 font-mono text-sm"
              placeholder="Write your travel guide content here. You can use markdown formatting."
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Tip: Use markdown formatting for better content structure (## for headings, **bold**, *italic*, etc.)
            </p>
          </div>
        </div>

        {/* Quick Facts */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Quick Facts</h2>
          
          <div className="space-y-4">
            {quickFactsFields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Label
                  </label>
                  <input
                    {...register(`quick_facts.${index}.label` as const)}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Fact label"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Value
                  </label>
                  <input
                    {...register(`quick_facts.${index}.value` as const)}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Fact value"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Icon (emoji)
                  </label>
                  <input
                    {...register(`quick_facts.${index}.icon` as const)}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                    placeholder="🌍"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeQuickFact(index)}
                  className="text-red-600 hover:text-red-800 p-2"
                  disabled={quickFactsFields.length === 1}
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
            
            <button
              type="button"
              onClick={() => appendQuickFact({ label: '', value: '', icon: '' })}
              className="flex items-center space-x-2 text-orange-600 hover:text-orange-700"
            >
              <Plus className="h-4 w-4" />
              <span>Add Quick Fact</span>
            </button>
          </div>
        </div>

        {/* Checklist Items */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Checklist Items (Optional)</h2>
          
          <div className="space-y-4">
            {checklistFields.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-4">
                <div className="flex-1">
                  <input
                    {...register(`checklist_items.${index}` as const)}
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Checklist item"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeChecklistItem(index)}
                  className="text-red-600 hover:text-red-800"
                  disabled={checklistFields.length === 1}
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
            
            <button
              type="button"
              onClick={() => appendChecklistItem('')}
              className="flex items-center space-x-2 text-orange-600 hover:text-orange-700"
            >
              <Plus className="h-4 w-4" />
              <span>Add Checklist Item</span>
            </button>
          </div>
        </div>

        {/* Tags */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Tags</h2>
          
          <div className="space-y-4">
            {tagsFields.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-4">
                <div className="flex-1">
                  <input
                    {...register(`tags.${index}` as const)}
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Tag"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="text-red-600 hover:text-red-800"
                  disabled={tagsFields.length === 1}
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
            
            <button
              type="button"
              onClick={() => appendTag('')}
              className="flex items-center space-x-2 text-orange-600 hover:text-orange-700"
            >
              <Plus className="h-4 w-4" />
              <span>Add Tag</span>
            </button>
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
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Featured Guide (appears prominently)
              </label>
            </div>

            <div className="flex items-center">
              <input
                {...register('active')}
                type="checkbox"
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
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
            onClick={() => navigate('/admin/travel-info')}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>{isEditing ? 'Updating...' : 'Creating...'}</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>{isEditing ? 'Update Guide' : 'Create Guide'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TravelInfoForm;