import "dotenv/config";
import { connectDB } from "./config/db.js";
import { Rate } from "./models/Rate.js";
import mongoose from "mongoose";

/**
 * seed.js
 * ------------------------------------------------------
 * Run once with `npm run seed` to create the four
 * commodity documents. Safe to re-run — it upserts by
 * slug, so existing yourRate/kalashRate values are never
 * wiped out.
 *
 * `kalashItemName` values below are taken from a real sample
 * of Kalash Gold's live feed you shared:
 *   "GOLD 999 RTGS", "Gold MKT 999 [FT]",
 *   "SILVER 999 SILLY MKT", "SILVER 99 MKT"
 *
 * NOTE: "SILVER 999 SILLY MKT" is copied exactly as the feed
 * shows it (worth double-checking that's really their name for
 * Silver 999 MKT and not a typo/different product on their end).
 * ------------------------------------------------------
 */
const COMMODITIES = [
  { slug: "gold-999-rtgs", name: "Gold 999 RTGS", metal: "XAU", unit: "10g", purity: 0.999, spreadPct: 0.0015, kalashItemName: "GOLD 999 RTGS" },
  { slug: "gold-mkt-999", name: "Gold MKT 999", metal: "XAU", unit: "10g", purity: 0.999, spreadPct: 0.002, kalashItemName: "Gold MKT 999 [FT]" },
  { slug: "silver-999-mkt", name: "Silver 999 MKT", metal: "XAG", unit: "kg", purity: 0.999, spreadPct: 0.001, kalashItemName: "SILVER 999 SILLY MKT" },
  { slug: "silver-99-mkt", name: "Silver 99 MKT", metal: "XAG", unit: "kg", purity: 0.99, spreadPct: 0.0015, kalashItemName: "SILVER 99 MKT" },
];

async function seed() {
  await connectDB();

  for (const commodity of COMMODITIES) {
    await Rate.findOneAndUpdate(
      { slug: commodity.slug },
      { $setOnInsert: commodity },
      { upsert: true, new: true }
    );
    console.log(`[seed] Ensured "${commodity.name}" exists`);
  }

  await mongoose.disconnect();
  console.log("[seed] Done.");
}

seed().catch((err) => {
  console.error("[seed] Failed:", err);
  process.exit(1);
});