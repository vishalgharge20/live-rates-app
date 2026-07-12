import { Rate } from "../models/Rate.js";
import { fetchSpotPrices, calculateRatesForCommodity } from "../services/liveRateFetcher.js";
import { fetchKalashRates } from "../services/kalashRateFetcher.js";

/**
 * refreshRatesJob
 * ------------------------------------------------------
 * Runs on an interval (see server.js). Each tick:
 *  1. Fetches XAU/XAG spot prices -> freeApiRate + onlineRate
 *     (onlineRate = freeApiRate x your calibration constant)
 *  2. Fetches Kalash Gold's live XML feed -> kalashRate, matched
 *     per-commodity via `kalashItemName`
 *  3. If the admin hasn't set yourRate yet (still 0), seeds it
 *     with kalashRate (falling back to onlineRate if this
 *     commodity's kalashItemName isn't mapped/found yet).
 *     Once an admin has set yourRate, this job never overwrites
 *     it — only freeApiRate/onlineRate/kalashRate refresh.
 *
 * The Kalash feed fetch is wrapped separately so that if it's
 * unreachable/blocked, freeApiRate/onlineRate still update —
 * only kalashRate is skipped for that tick.
 * ------------------------------------------------------
 */
export async function refreshRatesJob() {
  let spotPriceByMetal;
  try {
    spotPriceByMetal = await fetchSpotPrices();
  } catch (err) {
    console.error("[rates-job] Failed to fetch gold-api.com spot prices:", err.message);
    return; // nothing to update this tick without spot prices
  }

  let kalashRatesByItemName = {};
  try {
    kalashRatesByItemName = await fetchKalashRates();
  } catch (err) {
    console.error("[rates-job] Failed to fetch Kalash Gold feed:", err.message);
    // Continue anyway — freeApiRate/onlineRate can still update this tick
  }

  try {
    const commodities = await Rate.find({});

    await Promise.all(
      commodities.map(async (commodity) => {
        const { freeApiRate, onlineRate } = calculateRatesForCommodity(
          commodity,
          spotPriceByMetal
        );

        commodity.freeApiRate = freeApiRate;
        commodity.onlineRate = onlineRate;

        const liveKalashRate = commodity.kalashItemName
          ? kalashRatesByItemName[commodity.kalashItemName]
          : undefined;

        if (liveKalashRate !== undefined) {
          commodity.kalashRate = liveKalashRate;
        }
        // else: kalashItemName not set/matched yet — leave kalashRate as-is
        // (likely 0 until kalashItemName is confirmed and set correctly)

        // Only auto-fill yourRate the very first time (admin hasn't set one yet)
        if (!commodity.yourRate) {
          commodity.yourRate = commodity.kalashRate || onlineRate;
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
    console.error("[rates-job] Failed to save refreshed rates:", err.message);
  }
}