import { useEffect, useState } from "react";
import { Save, ShieldCheck } from "lucide-react";
import { API_BASE_URL } from "../config/api.js";

/**
 * AdminPanel
 * ------------------------------------------------------
 * Shows every commodity with three rates side by side:
 *   Free API Rate  — raw calculated rate from gold-api.com
 *   Kalash Rate    — that rate with the calibration factor
 *                    applied (auto-updated, read-only here)
 *   Your Rate      — editable; what actually gets shown on
 *                    the public Live Rates page
 *
 * NOTE: no login/auth yet — this route is unprotected until
 * Phase 4 ("admin authentication") is built. Don't deploy
 * this publicly as-is.
 * ------------------------------------------------------
 */
export default function AdminPanel() {
  const [commodities, setCommodities] = useState([]);
  const [draftValues, setDraftValues] = useState({}); // slug -> string being typed
  const [savingSlug, setSavingSlug] = useState(null);
  const [error, setError] = useState(null);

  async function loadCommodities() {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/rates`);
      if (!res.ok) throw new Error("Failed to load admin rates");
      const data = await res.json();
      setCommodities(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadCommodities();
    const intervalId = setInterval(loadCommodities, 15000);
    return () => clearInterval(intervalId);
  }, []);

  function handleDraftChange(slug, value) {
    setDraftValues((prev) => ({ ...prev, [slug]: value }));
  }

  async function handleSave(slug) {
    const rawValue = draftValues[slug];
    const yourRate = Number(rawValue);

    if (!rawValue || Number.isNaN(yourRate) || yourRate <= 0) {
      setError("Enter a valid positive number before saving.");
      return;
    }

    setSavingSlug(slug);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/rates/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ yourRate }),
      });
      if (!res.ok) throw new Error("Failed to save rate");

      const updated = await res.json();
      setCommodities((prev) => prev.map((c) => (c.slug === slug ? updated : c)));
      setDraftValues((prev) => ({ ...prev, [slug]: "" }));
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingSlug(null);
    }
  }

  return (
    <div className="min-h-screen bg-brown-950 px-4 py-8 sm:px-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-gold-400" />
          <h1 className="font-display text-2xl font-bold uppercase text-gold-200">
            Admin Panel &mdash; Rate Control
          </h1>
        </div>

        {error && (
          <p className="mb-4 rounded-lg bg-red-500/10 px-4 py-2 font-body text-sm text-red-300">
            {error}
          </p>
        )}

        <div className="overflow-hidden rounded-xl border border-gold-700/30">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-brown-800/90">
                <th className="px-4 py-3 font-display text-xs uppercase tracking-wider text-gold-400">
                  Commodity
                </th>
                <th className="px-4 py-3 font-display text-xs uppercase tracking-wider text-gold-400">
                  Free API Rate
                </th>
                <th className="px-4 py-3 font-display text-xs uppercase tracking-wider text-gold-400">
                  Kalash Rate
                </th>
                <th className="px-4 py-3 font-display text-xs uppercase tracking-wider text-gold-400">
                  Your Rate
                </th>
                <th className="px-4 py-3 font-display text-xs uppercase tracking-wider text-gold-400">
                  Save
                </th>
              </tr>
            </thead>
            <tbody>
              {commodities.map((c) => (
                <tr key={c.slug} className="border-t border-gold-700/20 bg-brown-900/40">
                  <td className="px-4 py-3 font-display font-semibold uppercase text-gold-100">
                    {c.name}
                  </td>
                  <td className="px-4 py-3 font-price text-gold-100/80">
                    &#8377;{c.freeApiRate.toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3 font-price text-gold-100/80">
                    &#8377;{c.kalashRate.toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      placeholder={c.yourRate.toLocaleString("en-IN")}
                      value={draftValues[c.slug] ?? ""}
                      onChange={(e) => handleDraftChange(c.slug, e.target.value)}
                      className="w-32 rounded-md border border-gold-600/40 bg-brown-950 px-2 py-1 font-price text-gold-100 outline-none focus:border-gold-400"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleSave(c.slug)}
                      disabled={savingSlug === c.slug}
                      className="flex items-center gap-1 rounded-md bg-gold-500 px-3 py-1.5 font-display text-xs font-semibold uppercase text-brown-950 transition-opacity hover:bg-gold-400 disabled:opacity-50"
                    >
                      <Save className="h-3.5 w-3.5" />
                      {savingSlug === c.slug ? "Saving..." : "Save"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
