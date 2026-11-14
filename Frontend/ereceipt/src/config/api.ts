/**
 * Centralized API Base URL configuration.
 *
 * In production (Render / Cloud):
 * Uses VITE_API_BASE_URL if defined (e.g. https://ereceipt-backend.onrender.com).
 *
 * In local dev:
 * Vite's proxy automatically routes `/api` requests to http://localhost:5000.
 */

// Default backend URL (used when VITE_API_BASE_URL is not explicitly passed)
export const DEFAULT_BACKEND_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://ereceipt-backend-cib6.onrender.com';

// Backward-compatibility alias
export const LIVE_AZURE_BACKEND = DEFAULT_BACKEND_URL;

export const API_BASE_URL: string = (() => {
  // 1. Explicit Vite environment variable override
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  // 2. Local Vite development server on port 5173
  if (
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') &&
    window.location.port === '5173'
  ) {
    return '';
  }

  // 3. Production web deployment or Capacitor Android mobile APK:
  return DEFAULT_BACKEND_URL;
})().replace(/\/+$/, '');

export default API_BASE_URL;
