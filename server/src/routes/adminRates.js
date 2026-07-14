import { Router } from "express";
import { Rate } from "../models/Rate.js";
import { fetchRawKalashFeed } from "../services/kalashRateFetcher.js";

/**
 * Admin routes
 * ------------------------------------------------------
 * GET   /api/admin/rates                — list all commodities with
 *                                          kalashRate, yourRate, isManualOverride
 * PUT   /api/admin/rates/:slug          — manually set yourRate
 *                                          (flips isManualOverride to true —
 *                                          the background job then leaves
 *                                          this commodity's yourRate alone)
 * POST  /api/admin/rates/:slug/reset    — clears isManualOverride so
 *                                          yourRate goes back to
 *                                          auto-following (kalashRate - 100)
 *
 * NOTE: no authentication yet — that's Phase 4 ("admin auth").
 * Do not expose this router publicly without adding auth first.
 * ------------------------------------------------------
 */
const YOUR_RATE_DISCOUNT = 100;
const router = Router();

router.get("/admin/rates", async (_req, res) => {
  try {
    const commodities = await Rate.find({}).sort({ createdAt: 1 });
    res.json(commodities);
  } catch (err) {
    res.status(500).json({ error: "Failed to load admin rates" });
  }
});

/**
 * DEBUG ROUTE — hit this once deployed to see exactly what Kalash
 * Gold's live feed returns, parsed to JSON but with NO field-name
 * mapping applied. Use it to confirm the real tag names, then
 * update mapKalashFeedToRates() in kalashRateFetcher.js and each
 * commodity's `kalashItemName` in MongoDB to match.
 */
router.get("/admin/kalash-raw", async (_req, res) => {
  try {
    const raw = await fetchRawKalashFeed();
    res.json(raw);
  } catch (err) {
    res.status(502).json({ error: "Failed to fetch/parse Kalash feed", detail: err.message });
  }
});

router.put("/admin/rates/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const { yourRate, status } = req.body;

    if (yourRate !== undefined && (typeof yourRate !== "number" || yourRate <= 0)) {
      return res.status(400).json({ error: "yourRate must be a positive number" });
    }

    const update = {};
    if (yourRate !== undefined) {
      update.yourRate = yourRate;
      update.isManualOverride = true; // stop auto-following Kalash rate
    }
    if (status !== undefined) update.status = status;

    const updated = await Rate.findOneAndUpdate({ slug }, update, { new: true });

    if (!updated) {
      return res.status(404).json({ error: `No commodity found with slug "${slug}"` });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update rate" });
  }
});

router.post("/admin/rates/:slug/reset", async (req, res) => {
  try {
    const { slug } = req.params;
    const commodity = await Rate.findOne({ slug });

    if (!commodity) {
      return res.status(404).json({ error: `No commodity found with slug "${slug}"` });
    }

    commodity.isManualOverride = false;
    // Apply immediately rather than waiting for the next job tick
    commodity.yourRate = Math.max(0, commodity.kalashRate - YOUR_RATE_DISCOUNT);
    await commodity.save();

    res.json(commodity);
  } catch (err) {
    res.status(500).json({ error: "Failed to reset rate" });
  }
});

export default router;