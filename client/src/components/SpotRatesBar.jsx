import { useEffect, useState } from "react";
import PriceCell from "./PriceCell.jsx";
import { API_BASE_URL } from "../config/api.js";
import { pollAligned } from "../utils/pollAligned.js";

/**
 * SpotRatesBar
 * ------------------------------------------------------
 * Simplified read-only display of GOLD($), SILVER($), and
 * INR(₹) spot rates — one number per row (the Ask price),
 * not a bid/ask table. Reuses PriceCell so these flash green/
 * red on change exactly like the main commodity prices.
 *
 * Purely informational — no admin edits, no MongoDB, just
 * whatever the backend's in-memory store currently has
 * (see spotRatesStore.js).
 * ------------------------------------------------------
 */
const ROWS = [
  { key: "gold", label: "GOLD ($)", prefix: "$", decimals: 2 },
  { key: "silver", label: "SILVER ($)", prefix: "$", decimals: 2 },
  { key: "inr", label: "INR (\u20B9)", prefix: "\u20B9", decimals: 2 },
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
      <div className="bg-brown-800/90 px-4 py-2.5 sm:px-6">
        <span className="font-display text-xs uppercase tracking-wider text-gold-400">
          Spot Rate
        </span>
      </div>
      <div className="divide-y divide-gold-700/20">
        {ROWS.map(({ key, label, prefix, decimals }) => {
          const rate = spotRates[key];
          return (
            <div
              key={key}
              className="flex items-center justify-between bg-brown-900/40 px-4 py-1.5 sm:px-6"
            >
              <span className="font-display text-sm font-semibold text-gold-100">{label}</span>
              <PriceCell
                value={rate ? rate.ask : null}
                size="sm"
                prefix={prefix}
                decimals={decimals}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}