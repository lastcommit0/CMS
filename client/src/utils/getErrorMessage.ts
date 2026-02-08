import axios from 'axios';
import { z } from 'zod';

/**
 * Extracts a human-readable message from any error object.
 * Standardizes handling of Axios, Zod, and Native errors.
 */
export const getErrorMessage = (error: unknown, fallback = "An unexpected error occurred"): string => {
  if (error && typeof error === 'object' && 'data' in error) {
    const data = (error as { data?: any }).data;
    if (Array.isArray(data?.error?.details)) return data.error.details[0].message;
    if (data?.error?.message) return data.error.message;
    if (typeof data?.message === 'string') return data.message;
  }

  // 1. Handle Axios errors (API Responses)
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    
    // Check for nested details (e.g., Strapi, NestJS, or custom 2026 patterns)
    if (Array.isArray(data?.error?.details)) return data.error.details[0].message;
    if (data?.error?.message) return data.error.message;
    if (data?.message) return typeof data.message === 'string' ? data.message : data.message[0];
    
    return error.message || fallback;
  }

  // 2. Handle Zod Validation Errors (Client-side)
  if (error instanceof z.ZodError) {
    return error.issues[0]?.message || "Invalid input data";
  }

  // 3. Handle Native Errors
  if (error instanceof Error) {
    return error.message;
  }

  // 4. Handle String errors
  if (typeof error === 'string') return error;

  return fallback;
};
