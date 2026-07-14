import { Router } from "express";
import { Rate } from "../models/Rate.js";
import { getSpotRates } from "../services/spotRatesStore.js";

/**
 * Public routes
 * ------------------------------------------------------
 * GET /api/rates
 *   Returns id, name, buy, sell, previousClose, status.
 *
 *   buy/sell are both `null` (frontend should show "-") when:
 *     - the admin has disabled this commodity (isDisabled), OR
 *     - there's currently no rate to show (yourRate is null —
 *       either Kalash has no live data and it's not manually
 *       overridden, or it just hasn't been fetched yet)
 *   Otherwise both are set to the admin's yourRate — no spread
 *   calculation, since the site only shows one rate per row.
 *
 * GET /api/spot-rates
 *   Returns the 3 forex/spot rates (GOLD($), SILVER($), INR(₹))
 *   straight from Kalash's feed — read-only, no admin override,
 *   refreshed by the same background job. { gold, silver, inr }
 *   each shaped as { bid, ask } or null if not available yet.
 * ------------------------------------------------------
 */
const router = Router();

router.get("/rates", async (_req, res) => {
  try {
    const commodities = await Rate.find({}).sort({ createdAt: 1 });

    const publicRates = commodities.map((c) => {
      const hasRate = !c.isDisabled && c.yourRate !== null && c.yourRate !== undefined;

      return {
        id: c.slug,
        name: c.name,
        buy: hasRate ? c.yourRate : null,
        sell: hasRate ? c.yourRate : null,
        previousClose: c.previousClose,
        status: hasRate ? c.status : "unavailable",
      };
    });

    res.json(publicRates);
  } catch (err) {
    res.status(500).json({ error: "Failed to load rates" });
  }
});

router.get("/spot-rates", (_req, res) => {
  res.json(getSpotRates());
});

export default router;