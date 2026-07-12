import { Rate } from "../models/Rate.js";
import { fetchSpotPrices, calculateRatesForCommodity } from "../services/liveRateFetcher.js";

/**
 * refreshRatesJob
 * ------------------------------------------------------
 * Runs on an interval (see server.js). Each tick:
 *  1. Fetches the current XAU/XAG spot prices.
 *  2. For every commodity stored in MongoDB, recalculates
 *     freeApiRate and kalashRate.
 *  3. If the admin hasn't set a yourRate yet (still 0),
 *     seeds it with the kalashRate so the public page has
 *     something sensible to show before the first manual
 *     edit. Once an admin has set yourRate, this job never
 *     overwrites it — only freeApiRate/kalashRate refresh.
 * ------------------------------------------------------
 */
export async function refreshRatesJob() {
  try {
    const spotPriceByMetal = await fetchSpotPrices();
    const commodities = await Rate.find({});

    await Promise.all(
      commodities.map(async (commodity) => {
        const { freeApiRate, kalashRate } = calculateRatesForCommodity(
          commodity,
          spotPriceByMetal
        );

        commodity.freeApiRate = freeApiRate;
        commodity.kalashRate = kalashRate;

        // Only auto-fill yourRate the very first time (admin hasn't set one yet)
        if (!commodity.yourRate) {
          commodity.yourRate = kalashRate;
        }

        // First successful refresh also seeds the trend reference point
        if (!commodity.previousClose) {
          commodity.previousClose = commodity.yourRate;
        }

        await commodity.save();
      })
    );

    console.log(`[rates-job] Refreshed ${commodities.length} commodities`);
  } catch (err) {
    // Swallow errors so a temporary API outage doesn't crash the server —
    // the next interval tick will simply try again.
    console.error("[rates-job] Failed to refresh rates:", err.message);
  }
}
