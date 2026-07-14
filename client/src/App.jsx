import Header from "./components/Header.jsx";
import ShopBanner from "./components/ShopBanner.jsx";
import DisclaimerBanner from "./components/DisclaimerBanner.jsx";
import RateTable from "./components/RateTable.jsx";
import SpotRatesBar from "./components/SpotRatesBar.jsx";
import Footer from "./components/Footer.jsx";
import MandalaBackground from "./components/MandalaBackground.jsx";
import { useLiveRates } from "./hooks/useLiveRates.js";

/**
 * App
 * ------------------------------------------------------
 * Root component for the Live Rates page.
 *
 * Rates now come from useLiveRates(), which polls the free
 * Gold API (gold-api.com) for real XAU/XAG spot prices every
 * 30 seconds and derives Buy/Sell for each commodity — no
 * more randomly-simulated mock data.
 * ------------------------------------------------------
 */
export default function App() {
  const { rates, error } = useLiveRates();

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-brown-950 px-2 py-3 sm:px-6 sm:py-8">
      {/* Tiled mandala texture across the whole page */}
      <MandalaBackground />

      {/* Ambient gold glow for depth */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(200,145,42,0.10),_transparent_55%)]" />

      <div className="relative flex w-full max-w-[1200px] flex-col items-center">
        <ShopBanner />

        {/* Outer gold hairline frame with a small inset gap, then the card itself */}
        <div className="w-full rounded-2xl border border-gold-600/30 p-[3px] shadow-premium">
          <div className="overflow-hidden rounded-[0.9rem] border-2 border-gold-500/50 bg-brown-900">
            <Header />
            <DisclaimerBanner />

            {error && (
              <p className="bg-red-500/10 px-4 py-1.5 text-center font-body text-xs text-red-300 sm:text-sm">
                Live rate feed is temporarily unavailable — showing the last known rates.
              </p>
            )}

            <RateTable rates={rates} />

            {/* Reference-only spot rates (GOLD($)/SILVER($)/INR(₹)) —
                kept visually secondary to the main commodity table
                above: smaller heading, muted label, tucked below the
                prices people actually care about. */}
            <div className="px-2 pb-4 sm:px-6 sm:pb-6">
              <p className="mb-2 font-body text-[11px] uppercase tracking-[0.15em] text-gold-500/60 sm:text-xs">
                Spot Rates
              </p>
              <SpotRatesBar />
            </div>

            {/* Full footer on tablet/desktop; hidden on mobile to keep the
                page fitting a single screen without scrolling */}
            {/* <div className="hidden sm:block"> */}
            <Footer />
            {/* </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}