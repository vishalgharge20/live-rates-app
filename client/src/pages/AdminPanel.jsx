import { useEffect, useState } from "react";
import { Ban, CheckCircle2, RotateCcw, Save, ShieldCheck } from "lucide-react";
import { API_BASE_URL } from "../config/api.js";
import { pollAligned } from "../utlis/pollAligned.js";

/**
 * AdminPanel
 * ------------------------------------------------------
 * Shows every commodity with two rates side by side:
 *   Kalash Rate — fetched live from Kalash Gold's own feed
 *   Your Rate   — what actually gets shown on the public
 *                 Live Rates page
 *
 * By default, Your Rate auto-follows (Kalash Rate - ₹100)
 * every time the background job refreshes. The moment an
 * admin manually saves a value here, that commodity switches
 * to "manual override" mode and stops auto-following — until
 * the admin hits Reset, which clears the override and snaps
 * Your Rate straight back to (Kalash Rate - ₹100).
 *
 * NOTE: no login/auth yet — this route is unprotected until
 * Phase 4 ("admin authentication") is built. Don't deploy
 * this publicly as-is.
 * ------------------------------------------------------
 */
export default function AdminPanel() {
  const [commodities, setCommodities] = useState([]);
  const [draftValues, setDraftValues] = useState({}); // slug -> string being typed
  const [busySlug, setBusySlug] = useState(null); // slug currently saving or resetting
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
    const stopPolling = pollAligned(loadCommodities, 15000);
    return () => stopPolling();
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

    setBusySlug(slug);
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
      setBusySlug(null);
    }
  }

  async function handleReset(slug) {
    setBusySlug(slug);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/rates/${slug}/reset`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to reset rate");

      const updated = await res.json();
      setCommodities((prev) => prev.map((c) => (c.slug === slug ? updated : c)));
      setDraftValues((prev) => ({ ...prev, [slug]: "" }));
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusySlug(null);
    }
  }

  async function handleToggleDisable(slug) {
    setBusySlug(slug);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/rates/${slug}/toggle`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to toggle rate");

      const updated = await res.json();
      setCommodities((prev) => prev.map((c) => (c.slug === slug ? updated : c)));
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusySlug(null);
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
                  Kalash Rate
                </th>
                <th className="px-4 py-3 font-display text-xs uppercase tracking-wider text-gold-400">
                  Your Rate
                </th>
                <th className="px-4 py-3 font-display text-xs uppercase tracking-wider text-gold-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {commodities
                .filter((c) => c.slug !== "gold-999-rtgs")
                .map((c) => {
                  const hasKalashRate = c.kalashRate !== null && c.kalashRate !== undefined;
                  const hasYourRate = c.yourRate !== null && c.yourRate !== undefined;

                  return (
                    <tr
                      key={c.slug}
                      className={`border-t border-gold-700/20 bg-brown-900/40 ${
                        c.isDisabled ? "opacity-50" : ""
                      }`}
                    >
                      <td className="px-4 py-3">
                        <span className="font-display font-semibold uppercase text-gold-100">
                          {c.name}
                        </span>
                        {c.isDisabled && (
                          <span className="ml-2 rounded-full bg-red-500/15 px-2 py-0.5 font-body text-[11px] text-red-300">
                            Disabled
                          </span>
                        )}
                        {!c.isDisabled && !c.isManualOverride && (
                          <span className="ml-2 rounded-full bg-emerald-500/15 px-2 py-0.5 font-body text-[11px] text-emerald-300">
                            Auto (Kalash &minus; &#8377;100)
                          </span>
                        )}
                        {!c.isDisabled && c.isManualOverride && (
                          <span className="ml-2 rounded-full bg-amber-400/15 px-2 py-0.5 font-body text-[11px] text-amber-300">
                            Manual
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-price text-gold-100/80">
                        {hasKalashRate ? `₹${c.kalashRate.toLocaleString("en-IN")}` : "-"}
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          placeholder={hasYourRate ? c.yourRate.toLocaleString("en-IN") : "-"}
                          value={draftValues[c.slug] ?? ""}
                          onChange={(e) => handleDraftChange(c.slug, e.target.value)}
                          className="w-32 rounded-md border border-gold-600/40 bg-brown-950 px-2 py-1 font-price text-gold-100 outline-none focus:border-gold-400"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            onClick={() => handleSave(c.slug)}
                            disabled={busySlug === c.slug}
                            className="flex items-center gap-1 rounded-md bg-gold-500 px-3 py-1.5 font-display text-xs font-semibold uppercase text-brown-950 transition-opacity hover:bg-gold-400 disabled:opacity-50"
                          >
                            <Save className="h-3.5 w-3.5" />
                            {busySlug === c.slug ? "Saving..." : "Save"}
                          </button>
                          <button
                            onClick={() => handleReset(c.slug)}
                            disabled={busySlug === c.slug || !c.isManualOverride}
                            title={
                              c.isManualOverride
                                ? "Go back to auto-following Kalash Rate - ₹100"
                                : "Already auto-following"
                            }
                            className="flex items-center gap-1 rounded-md border border-gold-600/40 px-3 py-1.5 font-display text-xs font-semibold uppercase text-gold-300 transition-opacity hover:border-gold-400 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                            Reset
                          </button>
                          <button
                            onClick={() => handleToggleDisable(c.slug)}
                            disabled={busySlug === c.slug}
                            title={
                              c.isDisabled
                                ? "Show this rate on the public page again"
                                : "Hide this rate on the public page (shows '-')"
                            }
                            className={`flex items-center gap-1 rounded-md border px-3 py-1.5 font-display text-xs font-semibold uppercase transition-opacity disabled:opacity-50 ${
                              c.isDisabled
                                ? "border-emerald-500/40 text-emerald-300 hover:border-emerald-400"
                                : "border-red-500/40 text-red-300 hover:border-red-400"
                            }`}
                          >
                            {c.isDisabled ? (
                              <>
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Enable
                              </>
                            ) : (
                              <>
                                <Ban className="h-3.5 w-3.5" />
                                Disable
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}