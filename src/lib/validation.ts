import { z } from 'zod';

// ========================================
// BOOKING VALIDATION SCHEMAS
// ========================================

export const bookingSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long').trim(),
  email: z.string().email('Invalid email address').max(100, 'Email too long'),
  phone: z.string().min(10, 'Phone number too short').max(20, 'Phone number too long').trim(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  service: z.enum(['Standard Visit', 'Extended Visit', 'Vet Appointment'], {
    errorMap: () => ({ message: 'Invalid service type' })
  }),
  notes: z.string().max(500, 'Notes too long').optional(),
  address: z.string().min(1, 'Address is required').max(200, 'Address too long').trim(),
  numberOfCats: z.number().int().min(1, 'Must have at least 1 cat').max(10, 'Too many cats'),
  specialInstructions: z.string().max(1000, 'Special instructions too long').optional(),
});

export const bookingUpdateSchema = z.object({
  status: z.enum(['pending', 'approved', 'declined', 'completed', 'cancelled'], {
    errorMap: () => ({ message: 'Invalid status' })
  }).optional(),
  adminNotes: z.string().max(500, 'Admin notes too long').optional(),
});

// ========================================
// MESSAGE VALIDATION SCHEMAS
// ========================================

export const messageSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long').trim(),
  email: z.string().email('Invalid email address').max(100, 'Email too long'),
  subject: z.string().min(1, 'Subject is required').max(200, 'Subject too long').trim(),
  message: z.string().min(1, 'Message is required').max(2000, 'Message too long').trim(),
});

export const messageUpdateSchema = z.object({
  status: z.enum(['unread', 'read', 'replied'], {
    errorMap: () => ({ message: 'Invalid status' })
  }),
  adminNotes: z.string().max(500, 'Admin notes too long').optional(),
});

// ========================================
// ADMIN VALIDATION SCHEMAS
// ========================================

export const adminLoginSchema = z.object({
  password: z.string().min(1, 'Password is required'),
});

// ========================================
// UTILITY FUNCTIONS
// ========================================

export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, ''); // Remove event handlers
}

export function validateDateRange(startDate: string, endDate: string): { valid: boolean; error?: string } {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = new Date();
  
  // Reset time to start of day for comparison
  now.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  
  if (start < now) {
    return { valid: false, error: 'Start date cannot be in the past' };
  }
  
  if (end < start) {
    return { valid: false, error: 'End date must be after start date' };
  }
  
  const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  if (daysDiff > 30) {
    return { valid: false, error: 'Booking cannot exceed 30 days' };
  }
  
  return { valid: true };
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

// ========================================
// RATE LIMITING UTILITIES
// ========================================

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

export const rateLimitConfigs = {
  booking: { windowMs: 15 * 60 * 1000, maxRequests: 5 }, // 5 bookings per 15 minutes
  contact: { windowMs: 5 * 60 * 1000, maxRequests: 3 },  // 3 messages per 5 minutes
  admin: { windowMs: 15 * 60 * 1000, maxRequests: 10 },  // 10 admin requests per 15 minutes
  payment: { windowMs: 60 * 1000, maxRequests: 3 },      // 3 payments per minute
} as const;

// ========================================
// ERROR RESPONSE HELPERS
// ========================================

export function createValidationError(message: string) {
  return new Response(JSON.stringify({ error: message }), {
    status: 400,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function createRateLimitError() {
  return new Response(JSON.stringify({ error: 'Too many requests. Please try again later.' }), {
    status: 429,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function createUnauthorizedError() {
  return new Response(JSON.stringify({ error: 'Unauthorized' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  });
}
