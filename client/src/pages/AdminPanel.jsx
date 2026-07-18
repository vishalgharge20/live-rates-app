import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Ban, CheckCircle2, LogOut, RotateCcw, Save, ShieldCheck } from "lucide-react";
import { API_BASE_URL } from "../config/api.js";
import { pollAligned } from "../utils/pollAligned.js";

/**
 * AdminPanel
 * ------------------------------------------------------
 * Protected by a shared-password login (see AdminLogin.jsx).
 * Reads the JWT from localStorage("adminToken") and attaches
 * it as Authorization: Bearer <token> on every admin request.
 * If the token is missing on mount, or any request comes back
 * 401 (missing/expired/invalid token), the token is cleared
 * and the user is redirected to /admin/login.
 *
 * Responsive: table layout on sm+ screens, stacked cards on
 * mobile (matches the pattern used on the public RateTable).
 * ------------------------------------------------------
 */
export default function AdminPanel() {
  const [commodities, setCommodities] = useState([]);
  const [draftValues, setDraftValues] = useState({});
  const [busySlug, setBusySlug] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  function getToken() {
    return localStorage.getItem("adminToken");
  }

  function logout() {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  }

  function authHeaders() {
    return { Authorization: `Bearer ${getToken()}` };
  }

  async function handleAuthedFetch(url, options = {}) {
    const res = await fetch(url, {
      ...options,
      headers: { ...(options.headers || {}), ...authHeaders() },
    });

    if (res.status === 401) {
      logout();
      throw new Error("Session expired — please log in again.");
    }

    return res;
  }

  async function loadCommodities() {
    try {
      const res = await handleAuthedFetch(`${API_BASE_URL}/admin/rates`);
      if (!res.ok) throw new Error("Failed to load admin rates");
      const data = await res.json();
      setCommodities(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    if (!getToken()) {
      navigate("/admin/login");
      return;
    }

    const stopPolling = pollAligned(loadCommodities, 7000);

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        loadCommodities();
      }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      stopPolling();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
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
      const res = await handleAuthedFetch(`${API_BASE_URL}/admin/rates/${slug}`, {
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
      const res = await handleAuthedFetch(`${API_BASE_URL}/admin/rates/${slug}/reset`, {
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
      const res = await handleAuthedFetch(`${API_BASE_URL}/admin/rates/${slug}/toggle`, {
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

  const visibleCommodities = commodities.filter((c) => c.slug !== "gold-999-rtgs");

  return (
    <div className="min-h-screen bg-brown-950 px-3 py-6 sm:px-10 sm:py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 sm:mb-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-gold-400 sm:h-6 sm:w-6" />
            <h1 className="font-display text-lg font-bold uppercase text-gold-200 sm:text-2xl">
              Admin Panel &mdash; Rate Control
            </h1>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-1 rounded-md border border-gold-600/40 px-3 py-1.5 font-display text-xs font-semibold uppercase text-gold-300 transition-opacity hover:border-gold-400"
          >
            <LogOut className="h-3.5 w-3.5" />
            Log Out
          </button>
        </div>

        {error && (
          <p className="mb-4 rounded-lg bg-red-500/10 px-4 py-2 font-body text-sm text-red-300">
            {error}
          </p>
        )}

        {/* ============================
            Mobile: stacked cards
            ============================ */}
        <div className="flex flex-col gap-3 sm:hidden">
          {visibleCommodities.map((c) => {
            const hasKalashRate = c.kalashRate !== null && c.kalashRate !== undefined;
            const hasYourRate = c.yourRate !== null && c.yourRate !== undefined;

            return (
              <div
                key={c.slug}
                className={`rounded-xl border border-gold-700/30 bg-brown-900/60 p-4 ${
                  c.isDisabled ? "opacity-50" : ""
                }`}
              >
                {/* Name + badges */}
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="font-display text-base font-semibold uppercase text-gold-100">
                    {c.name}
                  </span>
                  {c.isDisabled && (
                    <span className="rounded-full bg-red-500/15 px-2 py-0.5 font-body text-[11px] text-red-300">
                      Disabled
                    </span>
                  )}
                  {!c.isDisabled && c.isManualOverride && (
                    <span className="rounded-full bg-amber-400/15 px-2 py-0.5 font-body text-[11px] text-amber-300">
                      Manual
                    </span>
                  )}
                </div>

                {/* Reference rate */}
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-display text-xs uppercase tracking-wider text-gold-400">
                    Reference Rate
                  </span>
                  <span className="font-price text-gold-100/80">
                    {hasKalashRate ? `₹${c.kalashRate.toLocaleString("en-IN")}` : "-"}
                  </span>
                </div>

                {/* Your rate input */}
                <div className="mb-3">
                  <label className="mb-1 block font-display text-xs uppercase tracking-wider text-gold-400">
                    Your Rate
                  </label>
                  <input
                    type="number"
                    placeholder={hasYourRate ? c.yourRate.toLocaleString("en-IN") : "-"}
                    value={draftValues[c.slug] ?? ""}
                    onChange={(e) => handleDraftChange(c.slug, e.target.value)}
                    className="w-full rounded-md border border-gold-600/40 bg-brown-950 px-3 py-2 font-price text-gold-100 outline-none placeholder:text-gold-100/30 focus:border-gold-400"
                  />
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleSave(c.slug)}
                    disabled={busySlug === c.slug}
                    className="flex flex-1 items-center justify-center gap-1 rounded-md bg-gold-500 px-3 py-2 font-display text-xs font-semibold uppercase text-brown-950 transition-opacity hover:bg-gold-400 disabled:opacity-50"
                  >
                    <Save className="h-3.5 w-3.5" />
                    {busySlug === c.slug ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={() => handleReset(c.slug)}
                    disabled={busySlug === c.slug || !c.isManualOverride}
                    className="flex flex-1 items-center justify-center gap-1 rounded-md border border-gold-600/40 px-3 py-2 font-display text-xs font-semibold uppercase text-gold-300 transition-opacity hover:border-gold-400 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Reset
                  </button>
                  <button
                    onClick={() => handleToggleDisable(c.slug)}
                    disabled={busySlug === c.slug}
                    className={`flex flex-1 items-center justify-center gap-1 rounded-md border px-3 py-2 font-display text-xs font-semibold uppercase transition-opacity disabled:opacity-50 ${
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
              </div>
            );
          })}
        </div>

        {/* ============================
            Desktop / tablet: table
            ============================ */}
        <div className="hidden overflow-x-auto rounded-xl border border-gold-700/30 sm:block">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-brown-800/90">
                <th className="px-4 py-3 font-display text-xs uppercase tracking-wider text-gold-400">
                  Commodity
                </th>
                <th className="px-4 py-3 font-display text-xs uppercase tracking-wider text-gold-400">
                  Refrence Rate
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
              {visibleCommodities.map((c) => {
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
                        className="w-32 rounded-md border border-gold-600/40 bg-brown-950 px-2 py-1 font-price text-gold-100 outline-none placeholder:text-gold-100/30 focus:border-gold-400"
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