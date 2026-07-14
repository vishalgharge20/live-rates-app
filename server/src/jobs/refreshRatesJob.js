import { Rate } from "../models/Rate.js";
import {
  fetchRawKalashFeed,
  mapKalashFeedToRates,
  extractSpotRates,
} from "../services/kalashRateFetcher.js";
import { setSpotRates } from "../services/spotRatesStore.js";

/**
 * refreshRatesJob
 * ------------------------------------------------------
 * Runs on an interval (see server.js). Each tick:
 *  1. Fetches Kalash Gold's live feed ONCE (both the domestic
 *     commodities and the GOLD($)/SILVER($)/INR(₹) spot rates
 *     come from the same feed — no need for two requests).
 *  2. Updates each commodity's kalashRate, matched by
 *     `kalashItemName`. If Kalash has no current data for it,
 *     kalashRate is set to null ("-" in the UI) rather than
 *     freezing on a stale number.
 *  3. If the commodity is NOT in manual-override mode:
 *       - has live kalashRate -> yourRate = kalashRate - 100
 *       - no live kalashRate  -> yourRate = null ("-")
 *     If isManualOverride is true, yourRate is left exactly
 *     as the admin set it, regardless of Kalash's status —
 *     only Reset in the admin panel clears that.
 *  4. Stores the 3 spot rates in memory (spotRatesStore) —
 *     these are read-only informational rates, no admin
 *     override, no MongoDB involved.
 * ------------------------------------------------------
 */

const YOUR_RATE_DISCOUNT = 100;

export async function refreshRatesJob() {
  let rows;
  try {
    ({ rows } = await fetchRawKalashFeed());
  } catch (err) {
    console.error("[rates-job] Failed to fetch Kalash Gold feed:", err.message);
    return; // nothing to update this tick without the feed
  }

  const detailedRatesByItemName = mapKalashFeedToRates(rows);

  // Spot rates (GOLD($)/SILVER($)/INR(₹)) — read-only, no DB
  setSpotRates(extractSpotRates(detailedRatesByItemName));

  // Domestic commodities -> MongoDB
  const kalashRatesByItemName = {};
  for (const [name, { sale, purchase }] of Object.entries(detailedRatesByItemName)) {
    const rate = sale ?? purchase;
    if (rate !== null) kalashRatesByItemName[name] = rate;
  }

  try {
    const commodities = await Rate.find({});

    await Promise.all(
      commodities.map(async (commodity) => {
        const liveKalashRate = commodity.kalashItemName
          ? kalashRatesByItemName[commodity.kalashItemName]
          : undefined;

        commodity.kalashRate = liveKalashRate ?? null;

        if (!commodity.isManualOverride) {
          commodity.yourRate =
            liveKalashRate !== undefined
              ? Math.max(0, liveKalashRate - YOUR_RATE_DISCOUNT)
              : null;
        }

        if (!commodity.previousClose && commodity.yourRate) {
          commodity.previousClose = commodity.yourRate;
        }

        await commodity.save();
      })
    );

    console.log(`[rates-job] Refreshed ${commodities.length} commodities + spot rates`);
  } catch (err) {
    console.error("[rates-job] Failed to save refreshed rates:", err.message);
  }
}