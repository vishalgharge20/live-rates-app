import ShineOverlay from "./ShineOverlay.jsx";

/**
 * Header
 * ------------------------------------------------------
 * Royal-styled banner for the Live Rates card. Deep
 * brown-to-brown gradient, gold hairline rule, and a
 * slow shine sweep for a premium metallic feel.
 *
 * NOTE: the tagline and "Live / last updated" indicator
 * were removed per feedback to keep this band compact
 * and free of redundant/decorative text.
 * ------------------------------------------------------
 */
export default function Header() {
  return (
    <div className="relative overflow-hidden border-b-2 border-gold-600/40 bg-gradient-to-r from-brown-900 via-brown-800 to-brown-900 px-4 py-3 sm:px-8 sm:py-3">
      <ShineOverlay />

      {/* Decorative gold glow */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-gold-500/10 blur-3xl" />

      <div className="relative flex items-center justify-between gap-4">
        <h2 className="font-display text-base font-bold tracking-wide text-gold-200 sm:text-2xl">
          Live <span className="text-gold-400">Gold &amp; Silver</span> Rates
        </h2>
      </div>
    </div>
  );
}
