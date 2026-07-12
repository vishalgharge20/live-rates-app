import { useEffect, useState } from "react";
import { initialRates } from "../data/mockRates.js";
import { API_BASE_URL } from "../config/api.js";

/**
 * useLiveRates
 * ------------------------------------------------------
 * Polls OUR OWN backend's public rates endpoint
 * (GET /api/rates) instead of calling the free
 * gold-api.com feed directly from the browser.
 *
 * The backend is now the single source of truth: it fetches
 * gold-api.com itself, calculates Free API Rate + Kalash
 * Rate, and lets an admin override the final "Your Rate"
 * shown here — see live-rates-backend/.
 * ------------------------------------------------------
 */

const REFRESH_INTERVAL_MS = 15000;

export function useLiveRates() {
  // Shown immediately while the first fetch is in flight
  const [rates, setRates] = useState(initialRates);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchRates() {
      try {
        const res = await fetch(`${API_BASE_URL}/rates`);
        if (!res.ok) throw new Error("Rate fetch failed");

        const data = await res.json();
        if (cancelled) return;

        setRates(data);
        setError(null);
      } catch (err) {
        // Keep showing the last known-good rates on failure; just
        // surface the error so the UI can show a small notice.
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchRates();
    const intervalId = setInterval(fetchRates, REFRESH_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, []);

  return { rates, isLoading, error };
}
