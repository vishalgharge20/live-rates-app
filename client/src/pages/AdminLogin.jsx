import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, ShieldCheck } from "lucide-react";
import { API_BASE_URL } from "../config/api.js";

/**
 * AdminLogin
 * ------------------------------------------------------
 * Single shared-password gate for /admin. On success, stores
 * the JWT in localStorage under "adminToken" and redirects to
 * /admin. AdminPanel reads that token and attaches it to every
 * admin API call; if a call ever comes back 401, AdminPanel
 * clears the token and sends the user back here.
 * ------------------------------------------------------
 */
export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Login failed");
      }

      const { token } = await res.json();
      localStorage.setItem("adminToken", token);
      navigate("/admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brown-950 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-xl border border-gold-700/30 bg-brown-900 p-6 shadow-premium"
      >
        <div className="mb-5 flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-gold-400" />
          <h1 className="font-display text-xl font-bold uppercase text-gold-200">
            Admin Login
          </h1>
        </div>

        {error && (
          <p className="mb-4 rounded-lg bg-red-500/10 px-4 py-2 font-body text-sm text-red-300">
            {error}
          </p>
        )}

        <label className="mb-1 block font-body text-xs uppercase tracking-wider text-gold-400">
          Password
        </label>
        <div className="mb-4 flex items-center gap-2 rounded-md border border-gold-600/40 bg-brown-950 px-3 py-2 focus-within:border-gold-400">
          <Lock className="h-4 w-4 text-gold-500/70" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent font-body text-gold-100 outline-none"
            autoFocus
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-gold-500 py-2 font-display text-sm font-semibold uppercase text-brown-950 transition-opacity hover:bg-gold-400 disabled:opacity-50"
        >
          {loading ? "Checking..." : "Log In"}
        </button>
      </form>
    </div>
  );
}