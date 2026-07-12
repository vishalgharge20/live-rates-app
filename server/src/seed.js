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
 * NOTE: your pasted frontend hook had dropped
 * "Gold 999 RTGS" from COMMODITY_CONFIG — it's restored
 * here since the original spec calls for all 4 commodities.
 * Remove it from the array below if that was intentional.
 * ------------------------------------------------------
 */
const COMMODITIES = [
  { slug: "gold-999-rtgs", name: "Gold 999 RTGS", metal: "XAU", unit: "10g", purity: 0.999, spreadPct: 0.0015 },
  { slug: "gold-mkt-999", name: "Gold MKT 999", metal: "XAU", unit: "10g", purity: 0.999, spreadPct: 0.002 },
  { slug: "silver-999-mkt", name: "Silver 999 MKT", metal: "XAG", unit: "kg", purity: 0.999, spreadPct: 0.001 },
  { slug: "silver-99-mkt", name: "Silver 99 MKT", metal: "XAG", unit: "kg", purity: 0.99, spreadPct: 0.0015 },
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
