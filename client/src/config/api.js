/**
 * api.js
 * ------------------------------------------------------
 * Base URL for our own backend (Express + MongoDB), not
 * the free gold-api.com feed — the backend now owns
 * fetching/calibrating rates; the frontend just reads from it.
 *
 * Override via a Vite env var if the backend runs elsewhere:
 *   VITE_API_BASE_URL=https://your-backend.example.com/api
 * ------------------------------------------------------
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";
