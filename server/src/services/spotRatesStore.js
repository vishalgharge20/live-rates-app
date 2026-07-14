/**
 * spotRatesStore.js
 * ------------------------------------------------------
 * Holds the latest GOLD($)/SILVER($)/INR(₹) spot rates in
 * memory. No MongoDB involved on purpose — these are pure
 * read-only, always-auto informational rates with nothing
 * for an admin to override, so there's no need to persist
 * them anywhere. Just refreshed in place every job tick.
 * ------------------------------------------------------
 */
let latestSpotRates = {
  gold: null,
  silver: null,
  inr: null,
  updatedAt: null,
};

export function setSpotRates(spotRates) {
  latestSpotRates = { ...spotRates, updatedAt: new Date().toISOString() };
}

export function getSpotRates() {
  return latestSpotRates;
}