import { Router } from "express";
import jwt from "jsonwebtoken";

/**
 * Auth routes
 * ------------------------------------------------------
 * POST /api/admin/login
 *   Body: { password }
 *   Compares against ADMIN_PASSWORD (single shared password —
 *   no user accounts, no DB involved). On match, issues a
 *   signed JWT valid for 7 days that the frontend stores and
 *   sends back as Authorization: Bearer <token> on every
 *   subsequent admin request (see adminAuth middleware).
 * ------------------------------------------------------
 */
const router = Router();

router.post("/admin/login", (req, res) => {
  const { password } = req.body;

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Incorrect password" });
  }

  const token = jwt.sign({ role: "admin" }, process.env.ADMIN_JWT_SECRET, {
    expiresIn: "2d",
  });

  res.json({ token });
});

export default router;