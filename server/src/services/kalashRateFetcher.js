import fetch from "node-fetch";
import { XMLParser } from "fast-xml-parser";

/**
 * kalashRateFetcher.js
 * ------------------------------------------------------
 * Fetches Kalash Gold's own live-rate broadcast feed and
 * parses it into { [itemName]: rateInfo } for lookup.
 *
 * Based on a real sample of this feed's output, each row has
 * 7 columns in this order:
 *
 *   ID | Name | Purchase | Sale | High | Low | Flag
 *
 * e.g. "2853  GOLD 999 RTGS   -   148225   148225   148225   YES"
 *
 * For domestic gold/silver items, Purchase is always "-" (no
 * separate buy quote) and Sale/High/Low are identical — only
 * the forex rows (GOLD($), SILVER($), INR(₹)) have real
 * bid/ask/high/low spread. So for our commodities, `Sale` is
 * the one meaningful reference price — that's what gets used
 * as kalashRate.
 *
 * Because the exact XML tag names are still unconfirmed (the
 * root/table wrapper name is a guess — commonly "NewDataSet" /
 * "Table" for this kind of ADO.NET XML export), this reads each
 * row's values BY POSITION rather than by tag name, so it's
 * resilient to whatever the actual tag names turn out to be.
 * If parsing comes back empty, hit the URL directly in a
 * browser and compare its structure against `findRowsArray()`
 * below.
 * ------------------------------------------------------
 */

const KALASH_FEED_URL =
  "http://bcast.kalashgold.com:7767/VOTSBroadcastStreaming/Services/xml/GetLiveRateByTemplateID/kalashgold";

const parser = new XMLParser({ ignoreAttributes: false });

/** Fetches the raw feed and returns it parsed into a JS object, no mapping applied. */
export async function fetchRawKalashFeed() {
  const res = await fetch(KALASH_FEED_URL);
  if (!res.ok) {
    throw new Error(`Kalash feed request failed with status ${res.status}`);
  }
  const xmlText = await res.text();
  return parser.parse(xmlText);
}

/**
 * Recursively searches a parsed object for the array of real data
 * rows — sidesteps needing to know the exact wrapper tag names
 * (e.g. NewDataSet.Table).
 *
 * Uses a STRICT heuristic to avoid accidentally matching an
 * <xs:schema> metadata block (common in ADO.NET XML exports,
 * often appearing BEFORE the actual data in document order):
 * a real row must have at least 5 fields, and its first field
 * must parse as a plain number (the row ID, e.g. "2853") — schema
 * definition nodes don't look like that.
 */
function looksLikeDataRow(item) {
  if (!item || typeof item !== "object") return false;
  const values = Object.values(item);
  if (values.length < 5) return false;
  const firstValue = String(values[0]).trim();
  return firstValue !== "" && !Number.isNaN(Number(firstValue));
}

function findRowsArray(node, keyHint = "") {
  // Skip XML schema metadata blocks outright, wherever they appear
  if (/^xs:|^\?xml/i.test(keyHint)) return null;

  if (Array.isArray(node) && node.length > 0 && node.every(looksLikeDataRow)) {
    return node;
  }

  if (node && typeof node === "object") {
    for (const [key, value] of Object.entries(node)) {
      const found = findRowsArray(value, key);
      if (found) return found;
    }
  }

  return null;
}

/** Parses a single "-" or numeric string into a number, or null for "-". */
function parseRateValue(raw) {
  if (raw === undefined || raw === null) return null;
  const str = String(raw).trim();
  if (str === "-" || str === "") return null;
  const num = Number(str);
  return Number.isNaN(num) ? null : num;
}

/**
 * Maps the parsed feed into { [itemName]: { purchase, sale, high, low } }
 * keyed by the trimmed item name (column 2), reading columns 3-6
 * (Purchase, Sale, High, Low) by position.
 */
export function mapKalashFeedToRates(parsedFeed) {
  const rows = findRowsArray(parsedFeed);
  if (!rows) return {};

  const ratesByItemName = {};

  for (const row of rows) {
    const values = Object.values(row);
    // Expected order: [ID, Name, Purchase, Sale, High, Low, Flag]
    const [, name, purchase, sale, high, low] = values;
    if (typeof name !== "string") continue;

    ratesByItemName[name.trim()] = {
      purchase: parseRateValue(purchase),
      sale: parseRateValue(sale),
      high: parseRateValue(high),
      low: parseRateValue(low),
    };
  }

  return ratesByItemName;
}

/**
 * Convenience: fetch + map, returning { [itemName]: rate } where
 * rate is `sale` (the meaningful number for domestic items), falling
 * back to `purchase` if sale is missing.
 */
export async function fetchKalashRates() {
  const parsedFeed = await fetchRawKalashFeed();
  const detailedRates = mapKalashFeedToRates(parsedFeed);

  const simpleRates = {};
  for (const [name, { sale, purchase }] of Object.entries(detailedRates)) {
    const rate = sale ?? purchase;
    if (rate !== null) simpleRates[name] = rate;
  }
  return simpleRates;
}