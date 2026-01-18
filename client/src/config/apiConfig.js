// client/src/config/apiConfig.js

// Read base URL from Vite environment
const RAW_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Validate environment variable early
if (!RAW_BASE_URL) {
  console.error(
    '❌ VITE_API_BASE_URL is missing. Please set it in .env.local (dev) or Vercel environment variables (prod).'
  );
}

// Normalize base URL and append /api (backend route prefix)
const API_BASE_URL = RAW_BASE_URL
  ? `${RAW_BASE_URL.replace(/\/$/, '')}/api`
  : '';

export default API_BASE_URL;
