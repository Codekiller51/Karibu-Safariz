import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Calendar, MapPin, Phone, Mail, Edit, Save, X, Camera, Upload, Star } from 'lucide-react';
import { supabase, db } from '../lib/supabase';
import { Booking } from '../types';
import ReviewForm from '../components/reviews/ReviewForm';
import ReviewsList from '../components/reviews/ReviewsList';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    avatar_url: '',
    phone: '',
    nationality: '',
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'bookings' | 'reviews'>('bookings');
  const [userReviews, setUserReviews] = useState([]);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      const currentUser = data.user;
      
      if (!currentUser) {
        navigate('/login');
        return;
      }
      
      setUser(currentUser);
      
      try {
        // Fetch user profile
        const { data: profileData, error: profileError } = await db.getProfile(currentUser.id);
        
        if (profileError) {
          console.error('Error fetching profile:', profileError);
          // Create a basic profile from user data
          const basicProfile = {
            id: currentUser.id,
            full_name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'User',
            email: currentUser.email,
            phone: '',
            nationality: '',
            avatar_url: '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          setProfile(basicProfile);
          setFormData({
            full_name: basicProfile.full_name,
            avatar_url: basicProfile.avatar_url || '',
            phone: basicProfile.phone || '',
            nationality: basicProfile.nationality || '',
          });
        } else {
          setProfile({
            ...profileData,
            email: currentUser.email,
          });
          setFormData({
            full_name: profileData.full_name,
            avatar_url: profileData.avatar_url || '',
            phone: profileData.phone || '',
            nationality: profileData.nationality || '',
          });
        }

        // Fetch user bookings
        const { data: bookingsData, error: bookingsError } = await db.getUserBookings(currentUser.id);
        
        if (bookingsError) {
          console.error('Error fetching bookings:', bookingsError);
          setBookings([]);
        } else {
          setBookings(bookingsData || []);
        }

        // Fetch user reviews
        const { data: reviewsData, error: reviewsError } = await db.getUserReviews(currentUser.id);
        
        if (reviewsError) {
          console.error('Error fetching reviews:', reviewsError);
          setUserReviews([]);
        } else {
          setUserReviews(reviewsData || []);
        }
      } catch (error) {
        console.error('Error loading profile data:', error);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [navigate]);

  const getDefaultAvatar = (name: string) => {
    // Generate a default avatar based on initials
    const initials = name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
    
    // Generate a consistent color based on the name
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
    ];
    const colorIndex = name.length % colors.length;
    
    return { initials, colorClass: colors[colorIndex] };
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      
      setAvatarFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadAvatar = async () => {
    if (!avatarFile || !user) return null;
    
    setUploadingAvatar(true);
    
    try {
      // In a real app, you would upload to Supabase Storage or another service
      // For now, we'll simulate the upload and use a placeholder
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate successful upload - in real app, this would be the actual uploaded URL
      const uploadedUrl = avatarPreview;
      
      return uploadedUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSave = async () => {
    if (!user || !profile) return;

    try {
      let avatarUrl = formData.avatar_url;
      
      // Upload new avatar if selected
      if (avatarFile) {
        try {
          const uploadedUrl = await uploadAvatar();
          if (uploadedUrl) {
            avatarUrl = uploadedUrl;
          }
        } catch (error) {
          alert('Failed to upload avatar. Please try again.');
          return;
        }
      }
      
      const { data, error } = await db.updateProfile(user.id, {
        full_name: formData.full_name,
        avatar_url: avatarUrl,
        phone: formData.phone,
        nationality: formData.nationality,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        console.error('Error updating profile:', error);
        // Show error message to user
      } else {
        setProfile({ 
          ...profile, 
          ...formData, 
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString() 
        });
        setEditing(false);
        setAvatarFile(null);
        setAvatarPreview('');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleCancel = () => {
    setFormData({
      full_name: profile.full_name,
      avatar_url: profile.avatar_url || '',
      phone: profile.phone || '',
      nationality: profile.nationality || '',
    });
    setAvatarFile(null);
    setAvatarPreview('');
    setEditing(false);
  };

  const handleReviewSuccess = () => {
    setShowReviewForm(null);
    // Refresh reviews
    if (user) {
      db.getUserReviews(user.id).then(({ data }) => {
        setUserReviews(data || []);
      });
    }
  };

  const getBookingForReview = (bookingId: string) => {
    return bookings.find(booking => booking.id === bookingId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
            <div className="text-orange-600 font-semibold text-lg">Loading profile...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="text-gray-500">Profile not found</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center mb-6">
                <div className="relative inline-block mb-4">
                  {(avatarPreview || profile.avatar_url) ? (
                    <img
                      src={avatarPreview || profile.avatar_url}
                      alt={profile.full_name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                    />
                  ) : (
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl font-bold border-4 border-gray-200 ${getDefaultAvatar(profile.full_name).colorClass}`}>
                      {getDefaultAvatar(profile.full_name).initials}
                    </div>
                  )}
                  
                  {editing && (
                    <label className="absolute bottom-0 right-0 bg-orange-600 hover:bg-orange-700 text-white rounded-full p-2 cursor-pointer transition-colors">
                      <Camera className="h-4 w-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <h1 className="text-2xl font-bold text-gray-900">{profile.full_name}</h1>
                <p className="text-gray-600">{profile.email}</p>
              </div>

              <div className="space-y-4">
                {editing ? (
                  <>
                    {avatarFile && (
                      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center space-x-2 text-blue-700 text-sm">
                          <Upload className="h-4 w-4" />
                          <span>New avatar selected: {avatarFile.name}</span>
                        </div>
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nationality
                      </label>
                      <input
                        type="text"
                        value={formData.nationality}
                        onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSave}
                        disabled={uploadingAvatar}
                        className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        {uploadingAvatar ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4" />
                            <span>Save</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleCancel}
                        disabled={uploadingAvatar}
                        className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors flex items-center justify-center space-x-2"
                      >
                        <X className="h-4 w-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-4">
                      <button
                        onClick={() => setEditing(true)}
                        className="text-orange-600 hover:text-orange-700 text-sm flex items-center space-x-1"
                      >
                        <Camera className="h-4 w-4" />
                        <span>Change Photo</span>
                      </button>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-600">{profile.phone || 'Not provided'}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-600">{profile.nationality || 'Not provided'}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-600">
                        Member since {new Date(profile.created_at).getFullYear()}
                      </span>
                    </div>
                    <button
                      onClick={() => setEditing(true)}
                      className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Edit Profile</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Bookings */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8">
              {/* Tab Navigation */}
              <div className="flex space-x-8 mb-6 border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'bookings'
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  My Bookings ({bookings.length})
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'reviews'
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  My Reviews ({userReviews.length})
                </button>
              </div>
              
              {/* Bookings Tab */}
              {activeTab === 'bookings' && (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">My Bookings</h2>
                  {bookings.length > 0 ? (
                <div className="space-y-6">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Booking #{booking.id.slice(0, 8)}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <span className="text-sm text-gray-500">Start Date:</span>
                          <div className="font-medium">{new Date(booking.start_date).toLocaleDateString()}</div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Participants:</span>
                          <div className="font-medium">{booking.participants} people</div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Total Amount:</span>
                          <div className="font-medium">${booking.total_amount.toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Currency:</span>
                          <div className="font-medium">{booking.currency}</div>
                        </div>
                      </div>

                      {booking.special_requests && (
                        <div className="mb-4">
                          <span className="text-sm text-gray-500">Special Requests:</span>
                          <div className="text-gray-700">{booking.special_requests}</div>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2">
                        <button className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors text-sm">
                          View Details
                        </button>
                        {booking.status === 'pending' && (
                          <button className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors text-sm">
                            Modify Booking
                          </button>
                        )}
                        {booking.status === 'completed' && (
                          <button 
                            onClick={() => setShowReviewForm(booking.id)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
                          >
                            Write Review
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
                  <p className="text-gray-600 mb-6">
                    Start planning your Tanzania adventure today!
                  </p>
                  <button
                    onClick={() => navigate('/tours')}
                    className="bg-orange-600 text-white px-6 py-3 rounded-md hover:bg-orange-700 transition-colors"
                  >
                    Browse Tours
                  </button>
                </div>
              )}
                </>
              )}

              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">My Reviews</h2>
                  {userReviews.length > 0 ? (
                    <ReviewsList tourId={undefined} showTourInfo={true} />
                  ) : (
                    <div className="text-center py-12">
                      <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
                      <p className="text-gray-600 mb-6">
                        Complete a tour to share your experience and help other travelers!
                      </p>
                      <button
                        onClick={() => setActiveTab('bookings')}
                        className="bg-orange-600 text-white px-6 py-3 rounded-md hover:bg-orange-700 transition-colors"
                      >
                        View My Bookings
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Review Form Modal */}
        {showReviewForm && (
          <ReviewForm
            bookingId={showReviewForm}
            tourId={getBookingForReview(showReviewForm)?.tour_id || ''}
            tourTitle={getBookingForReview(showReviewForm)?.tour_packages?.title || 'Tour'}
            onSuccess={handleReviewSuccess}
            onCancel={() => setShowReviewForm(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Profile;