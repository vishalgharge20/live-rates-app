import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/api.js";
import { pollAligned } from "../utils/pollAligned.js";

/**
 * useLiveRates
 * ------------------------------------------------------
 * Polls OUR OWN backend's public rates endpoint
 * (GET /api/rates) using pollAligned() so this refreshes on
 * wall-clock boundaries AND immediately on resume (tab
 * refocus, app reopened from home screen, etc) — see
 * pollAligned.js for why that matters on mobile.
 *
 * `rates` starts as `null`, NOT mock/dummy data. Showing fake
 * prices — even briefly — on a live bullion-rates page is
 * worse than a short "Loading..." state, especially since a
 * cold Render backend or a resuming PWA can both take a few
 * seconds before the first real fetch resolves.
 * ------------------------------------------------------
 */

const REFRESH_INTERVAL_MS = 15000;

export function useLiveRates() {
  const [rates, setRates] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchRates() {
      try {
        // no-store: prevents Safari/mobile browsers from serving a
        // stale cached response after the app resumes from background
        const res = await fetch(`${API_BASE_URL}/rates`, { cache: "no-store" });
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

    const stopPolling = pollAligned(fetchRates, REFRESH_INTERVAL_MS);

    return () => {
      cancelled = true;
      stopPolling();
    };
  }, []);

  return { rates, isLoading, error };
}