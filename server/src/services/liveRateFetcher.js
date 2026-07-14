// import fetch from "node-fetch";

// /**
//  * liveRateFetcher.js
//  * ------------------------------------------------------
//  * Talks to the free, no-API-key Gold API (https://gold-api.com)
//  * to get live XAU/XAG spot prices, then converts them into
//  * per-10g (gold) / per-kg (silver) prices.
//  *
//  * Two numbers come out of this file:
//  *   freeApiRate — the raw calculated price, no adjustment
//  *   onlineRate  — freeApiRate with your calibration constant
//  *                 applied, so it reads closer to real Indian
//  *                 bullion-market pricing ("Online Rate" in
//  *                 the admin panel)
//  *
//  * NOTE: kalashRate is NOT calculated here anymore — it now
//  * comes from Kalash Gold's own live feed, see
//  * kalashRateFetcher.js.
//  * ------------------------------------------------------
//  */

// const GOLD_API_BASE = "https://api.gold-api.com/price";
// const GRAMS_PER_TROY_OUNCE = 31.1034768;

// const INDIAN_GOLD_FACTOR = 1.116;
// const INDIAN_SILVER_FACTOR = 1.22;

// function ouncePriceToLocalUnit(pricePerOunce, unit) {
//   const pricePerGram = pricePerOunce / GRAMS_PER_TROY_OUNCE;
//   return unit === "10g" ? pricePerGram * 10 : pricePerGram * 1000;
// }

// /**
//  * Fetches the current XAU and XAG spot prices (in INR) from
//  * the free Gold API. Throws if either request fails.
//  */
// export async function fetchSpotPrices() {
//   const [goldRes, silverRes] = await Promise.all([
//     fetch(`${GOLD_API_BASE}/XAU/INR`),
//     fetch(`${GOLD_API_BASE}/XAG/INR`),
//   ]);

//   if (!goldRes.ok || !silverRes.ok) {
//     throw new Error("Failed to fetch spot prices from gold-api.com");
//   }

//   const [gold, silver] = await Promise.all([goldRes.json(), silverRes.json()]);

//   return { XAU: gold.price, XAG: silver.price };
// }

// /**
//  * Given a commodity's config and the current spot prices,
//  * returns { freeApiRate, onlineRate } — both rounded to the
//  * nearest rupee.
//  */
// export function calculateRatesForCommodity(commodity, spotPriceByMetal) {
//   const { metal, unit, purity } = commodity;

//   const freeApiRate = Math.round(
//     ouncePriceToLocalUnit(spotPriceByMetal[metal], unit) * purity
//   );

//   const calibrationFactor = metal === "XAU" ? INDIAN_GOLD_FACTOR : INDIAN_SILVER_FACTOR;
//   const onlineRate = Math.round(freeApiRate * calibrationFactor);

//   return { freeApiRate, onlineRate };
// }