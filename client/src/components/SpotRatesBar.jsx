import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/api.js";
import { pollAligned } from "../utils/pollAligned.js";

/**
 * SpotRatesBar
 * ------------------------------------------------------
 * Read-only display of GOLD($), SILVER($), and INR(₹) spot
 * rates, straight from Kalash's feed. Purely informational —
 * no admin edits, no MongoDB, just whatever the backend's
 * in-memory store currently has (see spotRatesStore.js).
 * ------------------------------------------------------
 */
const ROWS = [
  { key: "gold", label: "GOLD($)" },
  { key: "silver", label: "SILVER($)" },
  { key: "inr", label: "INR(\u20B9)" },
];

export default function SpotRatesBar() {
  const [spotRates, setSpotRates] = useState({ gold: null, silver: null, inr: null });

  useEffect(() => {
    async function fetchSpotRates() {
      try {
        const res = await fetch(`${API_BASE_URL}/spot-rates`);
        if (!res.ok) return;
        const data = await res.json();
        setSpotRates(data);
      } catch {
        // Silently keep showing the last known values on failure —
        // this is informational-only, not worth an error banner.
      }
    }

    const stopPolling = pollAligned(fetchSpotRates, 15000);
    return () => stopPolling();
  }, []);

  return (
    <div className="overflow-hidden rounded-xl border border-gold-700/30">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-brown-800/90">
            <th className="px-4 py-3 text-left font-display text-xs uppercase tracking-wider text-gold-400 sm:px-6">
              Spot Rate
            </th>
            <th className="px-4 py-3 text-center font-display text-xs uppercase tracking-wider text-gold-400 sm:px-6">
              Bid
            </th>
            <th className="px-4 py-3 text-center font-display text-xs uppercase tracking-wider text-gold-400 sm:px-6">
              Ask
            </th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map(({ key, label }) => {
            const rate = spotRates[key];
            return (
              <tr key={key} className="border-t border-gold-700/20 bg-brown-900/40">
                <td className="px-4 py-3 font-display text-sm font-semibold text-gold-100 sm:px-6">
                  {label}
                </td>
                <td className="px-4 py-3 text-center font-price text-lg font-bold text-gold-100 sm:px-6">
                  {rate ? rate.bid.toLocaleString("en-IN") : "-"}
                </td>
                <td className="px-4 py-3 text-center font-price text-lg font-bold text-gold-100 sm:px-6">
                  {rate ? rate.ask.toLocaleString("en-IN") : "-"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}