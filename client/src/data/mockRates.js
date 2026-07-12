/**
 * mockRates.js
 * ------------------------------------------------------
 * Fallback/initial data shown for a split second before
 * the first live fetch from the free Gold API resolves
 * (see src/hooks/useLiveRates.js). Not randomly simulated
 * anymore — the live hook replaces these values with real
 * fetched prices as soon as the first request completes.
 * ------------------------------------------------------
 */

export const initialRates = [
  // {
  //   id: "gold-999-rtgs",
  //   name: "Gold 999 RTGS",
  //   buy: 148220,
  //   sell: 148225,
  //   previousClose: 147850,
  //   status: "available",
  // },
  {
    id: "gold-mkt-999",
    name: "Gold MKT 999",
    buy: 141780,
    sell: 141800,
    previousClose: 141420,
    status: "available",
  },
  {
    id: "silver-999-mkt",
    name: "Silver 999 MKT",
    buy: 224000,
    sell: 224180,
    previousClose: 224350,
    status: "unavailable",
  },
  {
    id: "silver-99-mkt",
    name: "Silver 99 MKT",
    buy: 220500,
    sell: 220680,
    previousClose: 220100,
    status: "on-request",
  },
];