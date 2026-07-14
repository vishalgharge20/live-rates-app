import { Rate } from "../models/Rate.js";
import { fetchKalashRates } from "../services/kalashRateFetcher.js";

/**
 * refreshRatesJob
 * ------------------------------------------------------
 * Runs on an interval (see server.js). Each tick:
 *  1. Fetches Kalash Gold's live feed -> kalashRate, matched
 *     per-commodity via `kalashItemName`.
 *  2. If Kalash has NO current data for this commodity
 *     (name not found this tick, or it's showing dashes),
 *     kalashRate is set to null ("-" in the UI) — this no
 *     longer freezes on the last known stale number.
 *  3. If the commodity is NOT in manual-override mode:
 *       - has live kalashRate -> yourRate = kalashRate - 100
 *       - no live kalashRate  -> yourRate = null ("-")
 *     If isManualOverride is true, yourRate is left exactly
 *     as the admin set it, regardless of Kalash's status —
 *     only Reset in the admin panel clears that.
 *  4. isDisabled commodities still get their kalashRate
 *     refreshed normally (so the number is ready the moment
 *     they're re-enabled) — isDisabled only affects what the
 *     PUBLIC page shows, handled in publicRates.js.
 * ------------------------------------------------------
 */

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

    console.log(`[rates-job] Refreshed ${commodities.length} commodities from Kalash feed`);
  } catch (err) {
    console.error("[rates-job] Failed to save refreshed rates:", err.message);
  }
}