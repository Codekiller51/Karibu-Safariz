import { createClient } from '@supabase/supabase-js';

// Define types for admin operations
type AdminOperations = {
  isAdmin: boolean;
  checkAdminStatus: () => Promise<boolean>;
  getAllUsers: () => Promise<{ data: any[] | null; error: any }>;
  updateUserAdmin: (userId: string, isAdmin: boolean) => Promise<{ data: any | null; error: any }>;
  getAllTourPackages: () => Promise<{ data: any[] | null; error: any }>;
  createTourPackage: (tourData: Partial<TourPackage>) => Promise<{ data: any | null; error: any }>;
  updateTourPackage: (id: string, updates: Partial<TourPackage>) => Promise<{ data: any | null; error: any }>;
  deleteTourPackage: (id: string) => Promise<{ error: any }>;
  getAllBookings: () => Promise<{ data: any[] | null; error: any }>;
  updateBookingStatus: (id: string, status: string) => Promise<{ data: any | null; error: any }>;
  getAllReviews: (verifiedOnly?: boolean) => Promise<{ data: any[] | null; error: any }>;
  verifyReview: (id: string, verified: boolean) => Promise<{ data: any | null; error: any }>;
  deleteReview: (id: string) => Promise<{ error: any }>;
  getAllBlogPosts: () => Promise<{ data: any[] | null; error: any }>;
  createBlogPost: (postData: Partial<BlogPost>) => Promise<{ data: any | null; error: any }>;
  updateBlogPost: (id: string, updates: Partial<BlogPost>) => Promise<{ data: any | null; error: any }>;
  deleteBlogPost: (id: string) => Promise<{ error: any }>;
  getAllDestinations: () => Promise<{ data: any[] | null; error: any }>;
  createDestination: (destinationData: Partial<Destination>) => Promise<{ data: any | null; error: any }>;
  updateDestination: (id: string, updates: Partial<Destination>) => Promise<{ data: any | null; error: any }>;
  deleteDestination: (id: string) => Promise<{ error: any }>;
  getAllTravelInfo: () => Promise<{ data: any[] | null; error: any }>;
  createTravelInfo: (infoData: Partial<TravelInfo>) => Promise<{ data: any | null; error: any }>;
  updateTravelInfo: (id: string, updates: Partial<TravelInfo>) => Promise<{ data: any | null; error: any }>;
  deleteTravelInfo: (id: string) => Promise<{ error: any }>;
  getAllContactInquiries: () => Promise<{ data: any[] | null; error: any }>;
  updateInquiryStatus: (id: string, status: string) => Promise<{ data: any | null; error: any }>;
  deleteInquiry: (id: string) => Promise<{ error: any }>;
  getAllPayments: () => Promise<{ data: any[] | null; error: any }>;
  getAllCustomerSurveys: () => Promise<{ data: any[] | null; error: any }>;
  respondToSurvey: (id: string, response: string) => Promise<{ data: any | null; error: any }>;
};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Validate that the URL is actually a valid URL
try {
  new URL(supabaseUrl);
} catch (error) {
  throw new Error(`Invalid Supabase URL: "${supabaseUrl}". Please check your VITE_SUPABASE_URL in the .env file. It should be a valid URL like "https://your-project.supabase.co"`);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database operations for client-side use
export const db = {
  // Profile operations
  getProfile: async (userId: string) => {
    const { data, error } = await supabase.rpc('get_my_profile');
    if (error) return { data: null, error } as any;
    return { data, error: null } as any;
  },

  updateProfile: async (userId: string, updates: any) => {
    return await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();
  },

  // Tour package operations
  getTourPackages: async () => {
    return await supabase
      .from('tour_packages')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false });
  },

  getTourPackage: async (id: string) => {
    // First try to find by slug
    let { data, error } = await supabase
      .from('tour_packages')
      .select('*')
      .eq('slug', id)
      .eq('active', true)
      .single();
    
    // If not found by slug, try by ID
    if (error && error.code === 'PGRST116') {
      const result = await supabase
        .from('tour_packages')
        .select('*')
        .eq('id', id)
        .eq('active', true)
        .single();
      
      data = result.data;
      error = result.error;
    }
    
    return { data, error };
  },

  getTourAverageRating: async (tourId: string) => {
    const { data, error } = await supabase
      .from('reviews')
      .select('rating')
      .eq('tour_id', tourId)
      .eq('verified', true);

    if (error) return { data: null, error };

    if (!data || data.length === 0) {
      return { averageRating: 0, totalReviews: 0, error: null };
    }

    const average = data.reduce((sum, review) => sum + review.rating, 0) / data.length;
    return { averageRating: Math.round(average * 10) / 10, totalReviews: data.length, error: null };
  },

  // Booking operations
  getUserBookings: async (userId: string) => {
    return await supabase
      .from('bookings')
      .select(`
        *,
        tour_packages (
          title,
          category,
          duration,
          images
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
  },

  // Contact operations
  createContactInquiry: async (inquiryData: any) => {
    return await supabase
      .from('contact_inquiries')
      .insert(inquiryData)
      .select()
      .single();
  },

  // Blog operations
  getBlogPosts: async () => {
    return await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('published_at', { ascending: false });
  },

  // Review operations
  getAllReviews: async (limit?: number, offset?: number, verifiedOnly: boolean = true) => {
    let query = supabase
      .from('reviews')
      .select(`
        *,
        profiles (
          full_name,
          avatar_url,
          nationality
        ),
        tour_packages (
          title,
          category
        )
      `);
    
    if (verifiedOnly) {
      query = query.eq('verified', true);
    }
    
    query = query.order('created_at', { ascending: false });
    
    if (limit) {
      query = query.limit(limit);
    }
    
    if (offset) {
      query = query.range(offset, offset + (limit || 10) - 1);
    }
    
    return await query;
  },

  getFeaturedReviews: async (limit: number = 3) => {
    return await supabase
      .from('reviews')
      .select(`
        *,
        profiles (
          full_name,
          avatar_url,
          nationality
        ),
        tour_packages (
          title,
          category
        )
      `)
      .eq('verified', true)
      .gte('rating', 4)
      .order('created_at', { ascending: false })
      .limit(limit);
  },

  getTourReviews: async (tourId: string) => {
    return await supabase
      .from('reviews')
      .select(`
        *,
        profiles (
          full_name,
          avatar_url
        )
      `)
      .eq('tour_id', tourId)
      .eq('verified', true)
      .order('created_at', { ascending: false });
  },

  getUserReviews: async (userId: string) => {
    return await supabase
      .from('reviews')
      .select(`
        *,
        tour_packages (
          title,
          category
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
  },

  getReviewStats: async (tourId?: string) => {
    let query = supabase
      .from('reviews')
      .select('rating')
      .eq('verified', true);
    
    if (tourId) {
      query = query.eq('tour_id', tourId);
    }
    
    const { data, error } = await query;

    if (error) return { averageRating: 0, totalReviews: 0, recommendationRate: 0, error };

    if (!data || data.length === 0) {
      return { 
        averageRating: 0, 
        totalReviews: 0, 
        recommendationRate: 0,
        distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        error: null 
      };
    }

    const average = data.reduce((sum, review) => sum + review.rating, 0) / data.length;
    const distribution = data.reduce((acc, review) => {
      acc[review.rating] = (acc[review.rating] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    // Ensure all ratings 1-5 are represented
    for (let i = 1; i <= 5; i++) {
      if (!distribution[i]) distribution[i] = 0;
    }

    // Calculate recommendation rate (4+ star reviews)
    const recommendationRate = data.length > 0 
      ? Math.round((data.filter(review => review.rating >= 4).length / data.length) * 100)
      : 0;

    return { 
      averageRating: Math.round(average * 10) / 10, 
      totalReviews: data.length, 
      recommendationRate,
      distribution,
      error: null 
    };
  },

  getReviewStats_old: async (tourId: string) => {
    const { data, error } = await supabase
      .from('reviews')
      .select('rating')
      .eq('tour_id', tourId)
      .eq('verified', true);

    if (error) return { data: null, error };

    if (!data || data.length === 0) {
      return { 
        data: { 
          average: 0, 
          count: 0, 
          distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } 
        }, 
        error: null 
      };
    }

    const average = data.reduce((sum, review) => sum + review.rating, 0) / data.length;
    const distribution = data.reduce((acc, review) => {
      acc[review.rating] = (acc[review.rating] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    // Ensure all ratings 1-5 are represented
    for (let i = 1; i <= 5; i++) {
      if (!distribution[i]) distribution[i] = 0;
    }

    return { 
      data: { 
        average: Math.round(average * 10) / 10, 
        count: data.length, 
        distribution 
      }, 
      error: null 
    };
  },

  createReview: async (reviewData: any) => {
    return await supabase
      .from('reviews')
      .insert(reviewData)
      .select()
      .single();
  },

  // Destination operations
  getDestinations: async () => {
    return await supabase
      .from('destinations')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false });
  },

  getDestination: async (slug: string) => {
    return await supabase
      .from('destinations')
      .select('*')
      .eq('slug', slug)
      .eq('active', true)
      .single();
  },

  // Travel info operations
  getTravelInfo: async () => {
    return await supabase
      .from('travel_info')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false });
  },

  getTravelInfoBySlug: async (slug: string) => {
    return await supabase
      .from('travel_info')
      .select('*')
      .eq('slug', slug)
      .eq('active', true)
      .single();
  }
};

// Admin operations
export const admin: AdminOperations = {
  isAdmin: false,
  
  checkAdminStatus: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;
      const { data, error } = await supabase.rpc('is_admin');
      if (error) throw error;
      admin.isAdmin = Boolean(data);
      return admin.isAdmin;
    } catch (error) {
      console.error('Error checking admin status:', error);
      admin.isAdmin = false;
      return false;
    }
  },
  
  // User management
  getAllUsers: async () => {
    await admin.checkAdminStatus();
    if (!admin.isAdmin) return { data: null, error: { message: 'Unauthorized' } };
    const { data, error } = await supabase.rpc('get_all_users');
    return { data, error } as any;
  },
  
  updateUserAdmin: async (userId: string, isAdmin: boolean) => {
    await admin.checkAdminStatus();
    if (!admin.isAdmin) return { data: null, error: { message: 'Unauthorized' } };
    const { data, error } = await supabase.rpc('set_user_admin', { target_id: userId, make_admin: isAdmin });
    return { data, error } as any;
  },
  
  // Tour package management
  getAllTourPackages: async () => {
    await admin.checkAdminStatus();
    if (!admin.isAdmin) return { data: null, error: { message: 'Unauthorized' } };
    
    return await supabase
      .from('tour_packages')
      .select('*')
      .order('created_at', { ascending: false });
  },
  
  createTourPackage: async (tourData: Partial<TourPackage>) => {
    console.log('createTourPackage called with:', tourData);
    await admin.checkAdminStatus();
    console.log('Admin status after check:', admin.isAdmin);
    if (!admin.isAdmin) return { data: null, error: { message: 'Unauthorized' } };
    
    console.log('Attempting to insert tour package...');
    const result = await supabase
      .from('tour_packages')
      .insert(tourData)
      .select()
      .single();
    
    console.log('Insert result:', result);
    return result;
  },
  
  updateTourPackage: async (id: string, updates: Partial<TourPackage>) => {
    await admin.checkAdminStatus();
    if (!admin.isAdmin) return { data: null, error: { message: 'Unauthorized' } };
    
    console.log('Updating tour package:', id, updates);
    
    const { data, error } = await supabase
      .from('tour_packages')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select();
    
    console.log('Update result:', { data, error });
    
    if (error) return { data: null, error };
    if (!data || data.length === 0) return { data: null, error: { message: 'Tour package not found' } };
    
    return { data: data[0], error: null };
  },
  
  deleteTourPackage: async (id: string) => {
    await admin.checkAdminStatus();
    if (!admin.isAdmin) return { error: { message: 'Unauthorized' } };
    
    return await supabase
      .from('tour_packages')
      .delete()
      .eq('id', id);
  },
  
  // Booking management
  getAllBookings: async () => {
    await admin.checkAdminStatus();
    if (!admin.isAdmin) return { data: null, error: { message: 'Unauthorized' } };

    // First try with the join, fallback to simple query if relationship issues
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        profiles (
          id,
          full_name,
          email,
          phone
        ),
        tour_packages (
          title,
          category,
          duration
        )
      `)
      .order('created_at', { ascending: false });

    // If join fails due to missing relationship, get bookings without joins
    if (error && error.code === 'PGRST200') {
      return await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });
    }

    return { data, error };
  },
  
  updateBookingStatus: async (id: string, status: string) => {
    await admin.checkAdminStatus();
    if (!admin.isAdmin) return { data: null, error: { message: 'Unauthorized' } };
    
    return await supabase
      .from('bookings')
      .update({ 
        status, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single();
  },
  
  // Review management
  getAllReviews: async (verifiedOnly: boolean = false) => {
    await admin.checkAdminStatus();
    if (!admin.isAdmin) return { data: null, error: { message: 'Unauthorized' } };
    
    let query = supabase
      .from('reviews')
      .select(`
        *,
        tour_packages (
          title,
          category
        )
      `);
    
    if (verifiedOnly) {
      query = query.eq('verified', true);
    }
    
    return await query.order('created_at', { ascending: false });
  },
  
  verifyReview: async (id: string, verified: boolean) => {
    await admin.checkAdminStatus();
    if (!admin.isAdmin) return { data: null, error: { message: 'Unauthorized' } };
    
    return await supabase
      .from('reviews')
      .update({ 
        verified, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single();
  },
  
  deleteReview: async (id: string) => {
    await admin.checkAdminStatus();
    if (!admin.isAdmin) return { error: { message: 'Unauthorized' } };
    
    return await supabase
      .from('reviews')
      .delete()
      .eq('id', id);
  },
  
  // Blog post management
  getAllBlogPosts: async () => {
    await admin.checkAdminStatus();
    if (!admin.isAdmin) return { data: null, error: { message: 'Unauthorized' } };
    
    return await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });
  },
  
  createBlogPost: async (postData: Partial<BlogPost>) => {
    await admin.checkAdminStatus();
    if (!admin.isAdmin) return { data: null, error: { message: 'Unauthorized' } };
    
    return await supabase
      .from('blog_posts')
      .insert(postData)
      .select()
      .single();
  },
  
  updateBlogPost: async (id: string, updates: Partial<BlogPost>) => {
    await admin.checkAdminStatus();
    if (!admin.isAdmin) return { data: null, error: { message: 'Unauthorized' } };
    
    const { data, error } = await supabase
      .from('blog_posts')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select();
    
    if (error) return { data: null, error };
    if (!data || data.length === 0) return { data: null, error: { message: 'Blog post not found' } };
    
    return { data: data[0], error: null };
  },
  
  deleteBlogPost: async (id: string) => {
    await admin.checkAdminStatus();
    if (!admin.isAdmin) return { error: { message: 'Unauthorized' } };
    
    return await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);
  },
  
  // Destination management
  getAllDestinations: async () => {
    await admin.checkAdminStatus();
    if (!admin.isAdmin) return { data: null, error: { message: 'Unauthorized' } };
    
    return await supabase
      .from('destinations')
      .select('*')
      .order('created_at', { ascending: false });
  },
  
  createDestination: async (destinationData: Partial<Destination>) => {
    await admin.checkAdminStatus();
    if (!admin.isAdmin) return { data: null, error: { message: 'Unauthorized' } };
    
    return await supabase
      .from('destinations')
      .insert(destinationData)
      .select()
      .single();
  },
  
  updateDestination: async (id: string, updates: Partial<Destination>) => {
    await admin.checkAdminStatus();
    if (!admin.isAdmin) return { data: null, error: { message: 'Unauthorized' } };
    
    return await supabase
      .from('destinations')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
  },
  
  deleteDestination: async (id: string) => {
    await admin.checkAdminStatus();
    if (!admin.isAdmin) return { error: { message: 'Unauthorized' } };
    
    return await supabase
      .from('destinations')
      .delete()
      .eq('id', id);
  },
  
  // Travel info management
  getAllTravelInfo: async () => {
    await admin.checkAdminStatus();
    if (!admin.isAdmin) return { data: null, error: { message: 'Unauthorized' } };
    
    return await supabase
      .from('travel_info')
      .select('*')
      .order('created_at', { ascending: false });
  },
  
  createTravelInfo: async (infoData: Partial<TravelInfo>) => {
    await admin.checkAdminStatus();
    if (!admin.isAdmin) return { data: null, error: { message: 'Unauthorized' } };
    
    return await supabase
      .from('travel_info')
      .insert(infoData)
      .select()
      .single();
  },
  
  updateTravelInfo: async (id: string, updates: Partial<TravelInfo>) => {
    await admin.checkAdminStatus();
    if (!admin.isAdmin) return { data: null, error: { message: 'Unauthorized' } };
    
    const { data, error } = await supabase
      .from('travel_info')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select();
    
    if (error) return { data: null, error };
    if (!data || data.length === 0) return { data: null, error: { message: 'Travel info not found' } };
    
    return { data: data[0], error: null };
  },
  
  deleteTravelInfo: async (id: string) => {
    await admin.checkAdminStatus();
    if (!admin.isAdmin) return { error: { message: 'Unauthorized' } };
    
    return await supabase
      .from('travel_info')
      .delete()
      .eq('id', id);
  },
  
  // Contact inquiry management
  getAllContactInquiries: async () => {
    await admin.checkAdminStatus();
    if (!admin.isAdmin) return { data: null, error: { message: 'Unauthorized' } };
    
    return await supabase
      .from('contact_inquiries')
      .select('*')
      .order('created_at', { ascending: false });
  },
  
  updateInquiryStatus: async (id: string, status: string) => {
    await admin.checkAdminStatus();
    if (!admin.isAdmin) return { data: null, error: { message: 'Unauthorized' } };
    
    return await supabase
      .from('contact_inquiries')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
  },
  
  deleteInquiry: async (id: string) => {
    await admin.checkAdminStatus();
    if (!admin.isAdmin) return { error: { message: 'Unauthorized' } };
    
    return await supabase
      .from('contact_inquiries')
      .delete()
      .eq('id', id);
  },
  
  // Payment management
  getAllPayments: async () => {
    await admin.checkAdminStatus();
    if (!admin.isAdmin) return { data: null, error: { message: 'Unauthorized' } };
    
    return await supabase
      .from('payments')
      .select(`
        *,
        bookings (
          id,
          user_id,
          tour_id,
          start_date,
          participants,
          tour_packages (
            title
          )
        )
      `)
      .order('created_at', { ascending: false });
  },
  
  // Customer survey management
  getAllCustomerSurveys: async () => {
    await admin.checkAdminStatus();
    if (!admin.isAdmin) return { data: null, error: { message: 'Unauthorized' } };
    
    return await supabase
      .from('customer_surveys')
      .select(`
        *,
        bookings (
          id,
          user_id,
          tour_id,
          profiles (
            full_name
          ),
          tour_packages (
            title
          )
        )
      `)
      .order('created_at', { ascending: false });
  },
  
  respondToSurvey: async (id: string, response: string) => {
    await admin.checkAdminStatus();
    if (!admin.isAdmin) return { data: null, error: { message: 'Unauthorized' } };
    
    return await supabase
      .from('customer_surveys')
      .update({ 
        response_from_company: response,
        response_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
  }
};