import { Router } from "express";
import { Rate } from "../models/Rate.js";

/**
 * Public routes
 * ------------------------------------------------------
 * GET /api/rates
 *   Returns the shape the frontend RateTable already
 *   expects: id, name, buy, sell, previousClose, status.
 *   `buy` is the admin-set yourRate; `sell` is derived from
 *   it using the commodity's spread.
 * ------------------------------------------------------
 */
const router = Router();

router.get("/rates", async (_req, res) => {
  try {
    const commodities = await Rate.find({}).sort({ createdAt: 1 });

    const publicRates = commodities.map((c) => {
      const buy = c.yourRate;
      const sell = Math.round(buy * (1 + c.spreadPct));

      return {
        id: c.slug,
        name: c.name,
        buy,
        sell,
        previousClose: c.previousClose,
        status: c.status,
      };
    });

    res.json(publicRates);
  } catch (err) {
    res.status(500).json({ error: "Failed to load rates" });
  }
});

export default router;
