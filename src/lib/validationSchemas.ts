import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  full_name: z.string().min(2, 'Full name is required'),
});

export const blogSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  excerpt: z.string().min(20, 'Excerpt must be at least 20 characters'),
  content: z.string().min(100, 'Content must be at least 100 characters'),
  featured_image: z.string().url('Please enter a valid image URL'),
  author: z.string().min(2, 'Author name is required'),
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string().min(1)),
  published: z.boolean(),
});

export const tourSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  short_description: z.string().min(20, 'Short description must be at least 20 characters'),
  category: z.enum(['mountain-climbing', 'safari', 'day-trips']),
  duration: z.number().min(1, 'Duration must be at least 1 day'),
  difficulty: z.enum(['easy', 'moderate', 'challenging', 'extreme']),
  price_usd: z.number().min(1, 'Price must be greater than 0'),
  price_tzs: z.number().min(1, 'Price must be greater than 0'),
  max_participants: z.number().min(1, 'Max participants must be at least 1'),
  min_participants: z.number().min(1, 'Min participants must be at least 1'),
  images: z.array(z.string().url()).min(1, 'At least one image is required'),
  includes: z.array(z.string().min(1)),
  excludes: z.array(z.string().min(1)),
  requirements: z.array(z.string().min(1)),
  best_time: z.string().min(5, 'Best time must be specified'),
  featured: z.boolean(),
  active: z.boolean(),
});

export const travelInfoSchema = z.object({
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

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type BlogFormData = z.infer<typeof blogSchema>;
export type TourFormData = z.infer<typeof tourSchema>;
export type TravelInfoFormData = z.infer<typeof travelInfoSchema>;
