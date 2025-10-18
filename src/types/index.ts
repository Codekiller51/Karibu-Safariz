// Core types for the Karibu Safariz website
export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  phone?: string;
  nationality?: string;
  created_at: string;
  updated_at: string;
}

export interface TourPackage {
  id: string;
  title: string;
  slug: string;
  description: string;
  short_description: string;
  category: 'mountain-climbing' | 'safari' | 'day-trips';
  duration: number;
  difficulty: 'easy' | 'moderate' | 'challenging' | 'extreme';
  price_usd: number;
  price_tzs: number;
  max_participants: number;
  min_participants: number;
  images: string[];
  itinerary: DayItinerary[];
  includes: string[];
  excludes: string[];
  requirements: string[];
  best_time: string;
  created_at: string;
  updated_at: string;
}

export interface DayItinerary {
  day: number;
  title: string;
  description: string;
  activities: string[];
  accommodation?: string;
  meals?: string[];
  elevation_gain?: number;
  distance?: number;
}

export interface Booking {
  id: string;
  user_id: string;
  tour_id: string;
  start_date: string;
  participants: number;
  total_amount: number;
  currency: 'USD' | 'TZS';
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  special_requests?: string;
  participant_details: ParticipantDetail[];
  created_at: string;
  updated_at: string;
}

export interface ParticipantDetail {
  name: string;
  age: number;
  nationality: string;
  dietary_requirements?: string;
  medical_conditions?: string;
}

export interface Review {
  id: string;
  user_id: string;
  tour_id: string;
  booking_id?: string;
  rating: number;
  title: string;
  content: string;
  images?: string[];
  verified: boolean;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string;
    avatar_url?: string;
    nationality?: string;
  };
  tour_packages?: {
    title: string;
    category: string;
  };
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  author: string;
  category: string;
  tags: string[];
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'replied' | 'closed';
  created_at: string;
}

export interface Destination {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  featured_image: string;
  images: string[];
  category: 'mountain' | 'park' | 'cultural' | 'coastal' | 'adventure';
  location: {
    latitude: number;
    longitude: number;
    region: string;
    district?: string;
  };
  best_time_to_visit: string;
  activities: string[];
  highlights: string[];
  difficulty_level: 'easy' | 'moderate' | 'challenging' | 'extreme';
  duration_recommended: string;
  entry_requirements: string[];
  accommodation_options: string[];
  transportation: string[];
  featured: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TravelInfo {
  id: string;
  title: string;
  slug: string;
  category: 'tips' | 'packing' | 'visa' | 'best-time' | 'health-safety' | 'currency' | 'weather';
  content: string;
  excerpt: string;
  featured_image: string;
  tags: string[];
  quick_facts: QuickFact[];
  checklist_items?: string[];
  featured: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaymentDetails {
  id: string;
  booking_id: string;
  payment_method: 'paypal';
  payment_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transaction_fee: number;
  paypal_order_id?: string;
  paypal_payer_id?: string;
  created_at: string;
  updated_at: string;
}

export interface BookingForm {
  // Customer Information
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  nationality: string;
  
  // Booking Details
  tour_id: string;
  start_date: string;
  participants: number;
  participant_details: ParticipantDetail[];
  
  // Special Requirements
  dietary_requirements?: string;
  medical_conditions?: string;
  accessibility_needs?: string;
  special_requests?: string;
  
  // Pricing
  base_price: number;
  additional_fees: AdditionalFee[];
  total_amount: number;
  currency: string;
  
  // Terms and Conditions
  terms_accepted: boolean;
  cancellation_policy_accepted: boolean;
  privacy_policy_accepted: boolean;
}

export interface AdditionalFee {
  name: string;
  amount: number;
  description: string;
  mandatory: boolean;
}

export interface CustomerSurvey {
  id: string;
  booking_id: string;
  user_id: string;
  
  // Overall Experience
  overall_rating: number;
  service_quality_rating: number;
  value_for_money_rating: number;
  guide_performance_rating: number;
  
  // Detailed Feedback
  what_went_well: string;
  areas_for_improvement: string;
  additional_comments: string;
  
  // Recommendation
  would_recommend: boolean;
  likelihood_to_return: number;
  
  // Media
  photos: string[];
  
  // Survey Metadata
  survey_sent_at: string;
  completed_at?: string;
  response_from_company?: string;
  response_at?: string;
  
  created_at: string;
  updated_at: string;
}

export interface QuickFact {
  label: string;
  value: string;
  icon?: string;
}