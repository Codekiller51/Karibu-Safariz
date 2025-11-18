import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, X, Plus, Trash2, Eye, Calendar } from 'lucide-react';
import { admin } from '../../lib/supabase';
import { BlogPost } from '../../types';
import { blogSchema, type BlogFormData } from '../../lib/validationSchemas';

const BlogForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);
  const [previewMode, setPreviewMode] = useState(false);

  const categories = [
    'Mountain Climbing',
    'Safari',
    'Travel Tips',
    'Culture',
    'Photography',
    'Conservation',
    'Local Stories'
  ];

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      published: false,
      tags: [''],
    },
  });

  const { fields: tagsFields, append: appendTag, remove: removeTag } = useFieldArray({
    control,
    name: 'tags',
  });

  const watchedContent = watch('content');
  const watchedTitle = watch('title');
  const watchedExcerpt = watch('excerpt');
  const watchedFeaturedImage = watch('featured_image');

  useEffect(() => {
    if (isEditing && id) {
      fetchPost();
    }
  }, [isEditing, id]);

  const fetchPost = async () => {
    try {
      setInitialLoading(true);
      const { data, error } = await admin.getAllBlogPosts();
      if (error) throw error;
      
      const post = data?.find(p => p.id === id);
      if (!post) {
        alert('Blog post not found');
        navigate('/admin/blog');
        return;
      }

      // Populate form with existing data
      Object.keys(post).forEach((key) => {
        if (key !== 'id' && key !== 'created_at' && key !== 'updated_at' && key !== 'slug') {
          setValue(key as keyof BlogFormData, post[key as keyof BlogPost] as any);
        }
      });
    } catch (error) {
      console.error('Error fetching blog post:', error);
      alert('Failed to fetch blog post data');
      navigate('/admin/blog');
    } finally {
      setInitialLoading(false);
    }
  };

  const onSubmit = async (data: BlogFormData) => {
    try {
      setLoading(true);
      
      const postData = {
        ...data,
        slug: data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        published_at: data.published ? new Date().toISOString() : null,
      };

      if (isEditing) {
        const { error } = await admin.updateBlogPost(id!, postData);
        if (error) throw error;
        alert('Blog post updated successfully!');
      } else {
        const { error } = await admin.createBlogPost(postData);
        if (error) throw error;
        alert('Blog post created successfully!');
      }

      navigate('/admin/blog');
    } catch (error) {
      console.error('Error saving blog post:', error);
      alert('Failed to save blog post. Please try again.');
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
            {isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {isEditing ? 'Update the blog post details below.' : 'Fill in the details to create a new blog post.'}
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
                Post Title *
              </label>
              <input
                {...register('title')}
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter blog post title"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Brief description of the blog post"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Author *
                </label>
                <input
                  {...register('author')}
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Author name"
                />
                {errors.author && (
                  <p className="mt-1 text-sm text-red-600">{errors.author.message}</p>
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
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Content</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Post Content *
            </label>
            <textarea
              {...register('content')}
              rows={20}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
              placeholder="Write your blog post content here. You can use markdown formatting."
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Tip: Use markdown formatting for better content structure (## for headings, **bold**, *italic*, etc.)
            </p>
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
            >
              <Plus className="h-4 w-4" />
              <span>Add Tag</span>
            </button>
          </div>
          
          {errors.tags && (
            <p className="mt-1 text-sm text-red-600">{errors.tags.message}</p>
          )}
        </div>

        {/* Publishing Settings */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Publishing Settings</h2>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                {...register('published')}
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Publish immediately
              </label>
            </div>
            
            <div className="text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {isEditing ? 'Last updated' : 'Will be created'}: {new Date().toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/admin/blog')}
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
                <span>{isEditing ? 'Update Post' : 'Create Post'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;