import { Rate } from "../models/Rate.js";
import { fetchKalashRates } from "../services/kalashRateFetcher.js";

/**
 * refreshRatesJob
 * ------------------------------------------------------
 * Runs on an interval (see server.js). Each tick:
 *  1. Fetches Kalash Gold's live feed -> kalashRate, matched
 *     per-commodity via `kalashItemName`.
 *  2. If the commodity is NOT in manual-override mode
 *     (isManualOverride: false), yourRate auto-follows:
 *         yourRate = kalashRate - YOUR_RATE_DISCOUNT
 *     If the admin has manually saved a value, isManualOverride
 *     is true and this job leaves yourRate alone entirely,
 *     until the admin hits "Reset" in the admin panel.
 *
 * Free API Rate / Online Rate (gold-api.com) are no longer
 * fetched here — Kalash's own feed is now the single source
 * of truth, per request.
 * ------------------------------------------------------
 */

// How much cheaper "Your Rate" is than the live Kalash rate,
// by default (until an admin manually overrides a commodity).
const YOUR_RATE_DISCOUNT = 100;

export async function refreshRatesJob() {
  let kalashRatesByItemName = {};
  try {
    kalashRatesByItemName = await fetchKalashRates();
  } catch (err) {
    console.error("[rates-job] Failed to fetch Kalash Gold feed:", err.message);
    return; // nothing to update this tick without the feed
  }

  try {
    const commodities = await Rate.find({});

    await Promise.all(
      commodities.map(async (commodity) => {
        const liveKalashRate = commodity.kalashItemName
          ? kalashRatesByItemName[commodity.kalashItemName]
          : undefined;

        if (liveKalashRate === undefined) {
          // Name didn't match anything in the feed this tick — skip,
          // leave existing kalashRate/yourRate untouched.
          return;
        }

        commodity.kalashRate = liveKalashRate;

        if (!commodity.isManualOverride) {
          commodity.yourRate = Math.max(0, liveKalashRate - YOUR_RATE_DISCOUNT);
        }

        if (!commodity.previousClose) {
          commodity.previousClose = commodity.yourRate;
        }

        await commodity.save();
      })
    );

    console.log(`[rates-job] Refreshed ${commodities.length} commodities from Kalash feed`);
  } catch (err) {
    console.error("[rates-job] Failed to save refreshed rates:", err.message);
  }
}