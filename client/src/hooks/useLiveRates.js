import { useEffect, useState } from "react";
import { initialRates } from "../data/mockRates.js";
import { API_BASE_URL } from "../config/api.js";
import { pollAligned } from "../utils/pollAligned.js";

const REFRESH_INTERVAL_MS = 7000;

export function useLiveRates() {
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
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    const stopPolling = pollAligned(fetchRates, REFRESH_INTERVAL_MS);

    // Browsers throttle/suspend setInterval in background tabs, so the
    // aligned poll can silently stop firing while the tab is hidden.
    // Force an immediate refetch when the tab becomes visible again.
    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        fetchRates();
      }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      cancelled = true;
      stopPolling();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return { rates, isLoading, error };
}