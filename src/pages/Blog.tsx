import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Tag, ArrowRight, Search } from 'lucide-react';
import { BlogPost } from '../types';
import { db } from '../lib/supabase';
import { format } from 'date-fns';

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'Mountain Climbing', 'Safari', 'Travel Tips', 'Culture'];

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await db.getBlogPosts();
        
        if (error) {
          console.error('Error fetching blog posts:', error);
          setPosts([]);
        } else {
          setPosts(data);
          setFilteredPosts(data);
        }
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        setPosts([]);
        setFilteredPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    let filtered = posts;

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredPosts(filtered);
  }, [posts, selectedCategory, searchTerm]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center flex flex-col items-center">
            {/* Spinning Lines Loader */}
            <div className="relative w-16 h-16 mb-6">
              <div className="absolute inset-0 animate-spin">
                <div className="absolute top-0 left-1/2 w-0.5 h-8 bg-gradient-to-b from-blue-500 to-transparent transform -translate-x-1/2 rounded-full"></div>
                <div className="absolute bottom-0 left-1/2 w-0.5 h-8 bg-gradient-to-t from-green-500 to-transparent transform -translate-x-1/2 rounded-full"></div>
                <div className="absolute left-0 top-1/2 h-0.5 w-8 bg-gradient-to-r from-red-500 to-transparent transform -translate-y-1/2 rounded-full"></div>
                <div className="absolute right-0 top-1/2 h-0.5 w-8 bg-gradient-to-l from-purple-500 to-transparent transform -translate-y-1/2 rounded-full"></div>
              </div>
              <div className="absolute inset-1 animate-spin-reverse">
                <div className="absolute top-0 left-1/2 w-0.5 h-6 bg-gradient-to-b from-yellow-500 to-transparent transform -translate-x-1/2 rounded-full"></div>
                <div className="absolute bottom-0 left-1/2 w-0.5 h-6 bg-gradient-to-t from-pink-500 to-transparent transform -translate-x-1/2 rounded-full"></div>
                <div className="absolute left-0 top-1/2 h-0.5 w-6 bg-gradient-to-r from-cyan-500 to-transparent transform -translate-y-1/2 rounded-full"></div>
                <div className="absolute right-0 top-1/2 h-0.5 w-6 bg-gradient-to-l from-indigo-500 to-transparent transform -translate-y-1/2 rounded-full"></div>
              </div>
              <div className="absolute inset-2 animate-spin-fast">
                <div className="absolute top-0 left-1/2 w-0.5 h-4 bg-gradient-to-b from-orange-500 to-transparent transform -translate-x-1/2 rounded-full"></div>
                <div className="absolute bottom-0 left-1/2 w-0.5 h-4 bg-gradient-to-t from-teal-500 to-transparent transform -translate-x-1/2 rounded-full"></div>
                <div className="absolute left-0 top-1/2 h-0.5 w-4 bg-gradient-to-r from-lime-500 to-transparent transform -translate-y-1/2 rounded-full"></div>
                <div className="absolute right-0 top-1/2 h-0.5 w-4 bg-gradient-to-l from-rose-500 to-transparent transform -translate-y-1/2 rounded-full"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-orange-600 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="text-orange-600 font-semibold text-lg">Loading blog posts...</div>
          </div>
        </div>
      </div>
    );
  }

  const featuredPost = filteredPosts[0];
  const regularPosts = filteredPosts.slice(1);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Travel Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover insider tips, destination guides, and inspiring stories from Tanzania's most beautiful places
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-12">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    selectedCategory === category
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-orange-100'
                  }`}
                >
                  {category === 'all' ? 'All Categories' : category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-12">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img
                  src={featuredPost.featured_image}
                  alt={featuredPost.title}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="md:w-1/2 p-8">
                <div className="flex items-center space-x-4 mb-4">
                  <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                    Featured
                  </span>
                  <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                    {featuredPost.category}
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  {featuredPost.title}
                </h2>
                <p className="text-gray-600 mb-6 line-clamp-3">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{featuredPost.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{format(new Date(featuredPost.created_at), 'MMM dd, yyyy')}</span>
                    </div>
                  </div>
                  <Link
                    to={`/blog/${featuredPost.slug}`}
                    className="inline-flex items-center space-x-2 text-orange-600 hover:text-orange-700 font-semibold"
                  >
                    <span>Read More</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Regular Posts Grid */}
        {regularPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                      {post.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{format(new Date(post.created_at), 'MMM dd')}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center space-x-1 text-xs text-gray-500"
                        >
                          <Tag className="h-3 w-3" />
                          <span>{tag}</span>
                        </span>
                      ))}
                    </div>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="text-orange-600 hover:text-orange-700 font-semibold"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No articles found matching your criteria.</div>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="mt-4 text-orange-600 hover:text-orange-700"
            >
              Clear filters to see all articles
            </button>
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="mt-16 bg-orange-50 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Stay Updated with Our Latest Stories
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and get the latest travel tips, destination guides, and exclusive offers delivered to your inbox.
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
            />
            <button className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-semibold">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;