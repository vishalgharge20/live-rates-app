import mongoose from "mongoose";

/**
 * Rate
 * ------------------------------------------------------
 * One document per commodity (Gold 999 RTGS, Silver 99 MKT,
 * etc). Three price fields are tracked side by side:
 *
 *   freeApiRate  — raw calculated price from the free
 *                  gold-api.com spot price (auto-updated by
 *                  the background job, admin cannot edit)
 *   kalashRate   — freeApiRate with a calibration factor
 *                  applied to approximate real Indian
 *                  bullion-market rates (auto-updated too)
 *   yourRate     — the rate the admin has actually set for
 *                  display on the public site. Defaults to
 *                  kalashRate until the admin overrides it.
 *
 * `sell` is derived from `yourRate` with a small spread
 * rather than stored separately, since the admin only edits
 * one number (matches the "Edit Your Rate and save" spec).
 * ------------------------------------------------------
 */
const rateSchema = new mongoose.Schema(
  {
    // Stable slug, e.g. "gold-999-rtgs" — used as the public id
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },

    // Which metal/unit this commodity is priced from
    metal: { type: String, enum: ["XAU", "XAG"], required: true },
    unit: { type: String, enum: ["10g", "kg"], required: true },
    purity: { type: Number, required: true },
    spreadPct: { type: Number, required: true, default: 0.002 },

    // The exact item name used for this commodity inside Kalash
    // Gold's live feed (matched by name, e.g. "GOLD 999 RTGS",
    // "Gold MKT 999 [FT]" — see kalashRateFetcher.js / seed.js)
    kalashItemName: { type: String, default: "" },

    // Auto-calculated prices (written by the background job)
    freeApiRate: { type: Number, default: 0 }, // raw gold-api.com price
    onlineRate: { type: Number, default: 0 }, // freeApiRate x calibration constant
    kalashRate: { type: Number, default: 0 }, // fetched live from Kalash Gold's feed

    // Admin-controlled price actually shown on the public page
    yourRate: { type: Number, default: 0 },

    // Reference point for the trend indicator on the public page
    previousClose: { type: Number, default: 0 },

    // "available" | "unavailable" | "on-request"
    status: { type: String, default: "available" },
  },
  { timestamps: true }
);

export const Rate = mongoose.model("Rate", rateSchema);