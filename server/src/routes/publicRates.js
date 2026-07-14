import { Router } from "express";
import { Rate } from "../models/Rate.js";

/**
 * Public routes
 * ------------------------------------------------------
 * GET /api/rates
 *   Returns id, name, buy, sell, previousClose, status.
 *
 *   The site now only displays a single "Today's Rate" per
 *   commodity (no separate Buy/Sell columns anymore), so
 *   buy and sell are BOTH set to the admin's yourRate —
 *   no spread calculation. Kept as two fields (rather than
 *   renaming to a single `rate` field) so existing frontend
 *   code reading either `buy` or `sell` keeps working without
 *   changes.
 * ------------------------------------------------------
 */
const router = Router();

router.get("/rates", async (_req, res) => {
  try {
    const commodities = await Rate.find({}).sort({ createdAt: 1 });

    const publicRates = commodities.map((c) => ({
      id: c.slug,
      name: c.name,
      buy: c.yourRate,
      sell: c.yourRate,
      previousClose: c.previousClose,
      status: c.status,
    }));

    res.json(publicRates);
  } catch (err) {
    res.status(500).json({ error: "Failed to load rates" });
  }
});

export default router;