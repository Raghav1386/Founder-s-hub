/**
 * api.js (frontend/src/configs/api.js)
 * 
 * Purpose:
 * Centralized API base URL resolver for local development and cloud production deployments.
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || '';

/**
 * Returns full URL for an API path
 * Example: getApiUrl('/api/founder/analyze') -> 'https://your-backend.onrender.com/api/founder/analyze' (production) or '/api/founder/analyze' (local proxy)
 */
export function getApiUrl(path) {
  if (!path.startsWith('/')) {
    path = `/${path}`;
  }
  return `${API_BASE_URL}${path}`;
}

export default getApiUrl;
