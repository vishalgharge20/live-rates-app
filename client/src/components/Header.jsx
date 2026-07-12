import ShineOverlay from "./ShineOverlay.jsx";

/**
 * Header
 * ------------------------------------------------------
 * Premium centered title banner.
 * ------------------------------------------------------
 */
export default function Header() {
  return (
    <div className="relative overflow-hidden border-b-2 border-gold-600/40 bg-gradient-to-r from-brown-900 via-brown-800 to-brown-900 px-4 py-5 sm:px-8 sm:py-5">
      <ShineOverlay />

      {/* Decorative gold glow */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-gold-500/10 blur-3xl" />

      <div className="relative flex justify-center">
        <h2
          className="
            text-center
            font-display
            font-bold
            tracking-wide
            text-gold-200

            text-xl
            sm:text-3xl
            lg:text-4xl
          "
        >
          Live <span className="text-gold-400">Gold &amp; Silver</span> Rates
        </h2>
      </div>
    </div>
  );
}