import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import publicRatesRouter from "./routes/publicRates.js";
import adminRatesRouter from "./routes/adminRates.js";
import { refreshRatesJob } from "./jobs/refreshRatesJob.js";

const PORT = process.env.PORT || 4000;
const REFRESH_INTERVAL_MS = Number(process.env.RATE_REFRESH_INTERVAL_MS) || 30000;

async function main() {
  await connectDB();

  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use("/api", publicRatesRouter);
  app.use("/api", adminRatesRouter);

  app.get("/api/health", (_req, res) => res.json({ ok: true }));

  app.listen(PORT, () => {
    console.log(`[server] Listening on http://localhost:${PORT}`);
  });

  // Run once immediately on boot, then on the configured interval
  refreshRatesJob();
  setInterval(refreshRatesJob, REFRESH_INTERVAL_MS);
}

main().catch((err) => {
  console.error("[server] Failed to start:", err);
  process.exit(1);
});
