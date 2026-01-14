/**
 * API Configuration
 * Environment-aware base URL for development and production
 */

const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

// Always use full backend URL (no Vite proxy)
// Production: Use environment variable
// Development: Use localhost
const API_BASE_URL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_API_BASE_URL
    : "http://localhost:5001/api";

export default API_BASE_URL;
