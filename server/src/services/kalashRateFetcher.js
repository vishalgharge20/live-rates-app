import fetch from "node-fetch";

/**
 * kalashRateFetcher.js
 * ------------------------------------------------------
 * Fetches Kalash Gold's live-rate feed and parses it into
 * { [itemName]: rateInfo } for lookup.
 *
 * IMPORTANT: despite the URL containing "/xml/", the actual
 * response is PLAIN TAB-DELIMITED TEXT, not XML markup — e.g.:
 *
 *   2853  GOLD 999 RTGS    -    146244   147413   144770   YES
 *
 * (confirmed by hitting GET /api/admin/kalash-raw and getting
 * back `{}` from an XML parser — a sure sign the input wasn't
 * XML tags at all). So this reads it as delimited text instead.
 *
 * Each line has 6-7 columns in this order:
 *
 *   ID | Name | Purchase | Sale | High | Low | Flag (Flag optional)
 *
 * For domestic gold/silver items, Purchase is "-" (no separate
 * buy quote) and Sale/High/Low are identical — only the forex
 * rows (GOLD($), SILVER($), INR(₹)) have a real bid/ask spread.
 * So for our commodities, `Sale` is the meaningful reference
 * price used as kalashRate.
 * ------------------------------------------------------
 */

const KALASH_FEED_URL =
  "http://bcast.kalashgold.com:7767/VOTSBroadcastStreaming/Services/xml/GetLiveRateByTemplateID/kalashgold";

/** Fetches the raw feed text, unparsed — useful for debugging. */
export async function fetchRawKalashFeed() {
  const res = await fetch(KALASH_FEED_URL);
  if (!res.ok) {
    throw new Error(`Kalash feed request failed with status ${res.status}`);
  }
  const rawText = await res.text();
  return { rawText, rows: parseFeedRows(rawText) };
}

/**
 * Splits the raw plain-text feed into rows of columns.
 * Prefers splitting on tab characters; falls back to runs of
 * 2+ spaces if a line has no tabs (defensive, in case the feed
 * ever switches to space-padded columns).
 */
function parseFeedRows(rawText) {
  const lines = rawText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const rows = [];

  for (const line of lines) {
    let columns = line.split("\t").map((c) => c.trim()).filter((c) => c !== "");
    if (columns.length < 5) {
      columns = line.split(/\s{2,}/).map((c) => c.trim()).filter((c) => c !== "");
    }
    if (columns.length >= 5) rows.push(columns);
  }

  return rows;
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
 * Maps parsed rows into { [itemName]: { purchase, sale, high, low } },
 * keyed by the trimmed item name (column 2).
 */
export function mapKalashFeedToRates(rows) {
  const ratesByItemName = {};

  for (const columns of rows) {
    // Expected order: [ID, Name, Purchase, Sale, High, Low, Flag?]
    const [, name, purchase, sale, high, low] = columns;
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
 * Convenience: fetch + parse + map, returning { [itemName]: rate }
 * where rate is `sale` (the meaningful number for domestic items),
 * falling back to `purchase` if sale is missing.
 */
export async function fetchKalashRates() {
  const { rows } = await fetchRawKalashFeed();
  const detailedRates = mapKalashFeedToRates(rows);

  const simpleRates = {};
  for (const [name, { sale, purchase }] of Object.entries(detailedRates)) {
    const rate = sale ?? purchase;
    if (rate !== null) simpleRates[name] = rate;
  }
  return simpleRates;
}