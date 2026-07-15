import jwt from "jsonwebtoken";

/**
 * adminAuth
 * ------------------------------------------------------
 * Protects all /api/admin/* routes except /admin/login.
 * Expects `Authorization: Bearer <token>` where <token> was
 * issued by POST /api/admin/login. Rejects with 401 if the
 * header is missing, malformed, or the token is invalid/expired.
 * ------------------------------------------------------
 */
export function adminAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Missing or malformed Authorization header" });
  }

  try {
    jwt.verify(token, process.env.ADMIN_JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}