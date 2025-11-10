import {
  Compass,
  Backpack,
  FileText,
  Calendar,
  Shield,
  DollarSign,
  Cloud,
  Mountain,
  MapPin,
  Users,
} from 'lucide-react';

export const TRAVEL_INFO_CATEGORIES = [
  { id: 'all', name: 'All Information', icon: Compass, color: 'bg-blue-500' },
  { id: 'tips', name: 'Travel Tips', icon: Compass, color: 'bg-green-500' },
  { id: 'packing', name: 'What to Pack', icon: Backpack, color: 'bg-purple-500' },
  { id: 'visa', name: 'Visa & Entry', icon: FileText, color: 'bg-red-500' },
  { id: 'best-time', name: 'Best Time to Visit', icon: Calendar, color: 'bg-yellow-500' },
  { id: 'health-safety', name: 'Health & Safety', icon: Shield, color: 'bg-pink-500' },
  { id: 'currency', name: 'Currency & Payments', icon: DollarSign, color: 'bg-indigo-500' },
  { id: 'weather', name: 'Weather Information', icon: Cloud, color: 'bg-cyan-500' },
] as const;

export const DESTINATION_CATEGORIES = [
  { id: 'all', name: 'All Destinations', icon: MapPin, color: 'bg-blue-500' },
  { id: 'mountain', name: 'Mountains & Peaks', icon: Mountain, color: 'bg-gray-600' },
  { id: 'park', name: 'National Parks', icon: MapPin, color: 'bg-green-600' },
  { id: 'cultural', name: 'Cultural & Historical', icon: Users, color: 'bg-yellow-600' },
  { id: 'coastal', name: 'Coastal & Islands', icon: Compass, color: 'bg-blue-600' },
  { id: 'adventure', name: 'Adventure', icon: Mountain, color: 'bg-red-600' },
] as const;

export const TOUR_CATEGORIES = [
  { value: 'mountain-climbing', label: 'Mountain Climbing' },
  { value: 'safari', label: 'Safari' },
  { value: 'day-trips', label: 'Day Trips' },
] as const;

export const TOUR_DIFFICULTIES = [
  { value: 'easy', label: 'Easy' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'challenging', label: 'Challenging' },
  { value: 'extreme', label: 'Extreme' },
] as const;

export const BLOG_CATEGORIES = [
  'Mountain Climbing',
  'Safari',
  'Travel Tips',
  'Culture',
  'Photography',
  'Conservation',
  'Local Stories',
] as const;
