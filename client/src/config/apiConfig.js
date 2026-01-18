// client/src/config/apiConfig.js

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  console.error(
    '❌ VITE_API_BASE_URL is missing. Set it in Vercel environment variables.'
  );
}

export default API_BASE_URL;
