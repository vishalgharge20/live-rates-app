import Header from "./components/Header.jsx";
import ShopBanner from "./components/ShopBanner.jsx";
import DisclaimerBanner from "./components/DisclaimerBanner.jsx";
import RateTable from "./components/RateTable.jsx";
import SpotRatesBar from "./components/SpotRatesBar.jsx";
import Footer from "./components/Footer.jsx";
import MandalaBackground from "./components/MandalaBackground.jsx";
import { useLiveRates } from "./hooks/useLiveRates.js";

export default function App() {
  const { rates, error } = useLiveRates();

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center bg-brown-950 px-2 py-3 sm:px-6 sm:py-8">
      {/* Tiled mandala texture across the whole page */}
      <MandalaBackground />

      {/* Ambient gold glow for depth */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(200,145,42,0.10),_transparent_55%)]" />

      {/* Sticky banner box — same framed-card style as the rate card
          below (rounded outer hairline + inset gold-bordered panel) */}
      <div className="sticky top-0 z-50 w-full max-w-[1200px] rounded-2xl border border-gold-600/30 bg-brown-950 p-[3px] shadow-premium">
        <div className="overflow-hidden rounded-[0.9rem] border-2 border-gold-500/50 bg-brown-900">
          <ShopBanner />
        </div>
      </div>

      <div className="relative flex w-full max-w-[1200px] flex-col items-center">
        {/* Small gap between the sticky banner box and the rate card box */}
        <div className="h-2 sm:h-3" />

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

            <div className="px-2 pb-4 pt-0.5 sm:px-6 sm:pb-6">
              <SpotRatesBar />
            </div>

            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}import Header from "./components/Header.jsx";
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
 * Rates come from useLiveRates(), which polls our backend's
 * /api/rates every 15s (aligned to wall-clock boundaries) and
 * also refetches immediately on resume. `rates` is `null`
 * until the first fetch resolves — RateTable only renders
 * once we actually have data, so nothing fake ever shows.
 * ------------------------------------------------------
 */
export default function App() {
  const { rates, error } = useLiveRates();

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-brown-950 px-2 py-3 sm:px-6 sm:py-8">
      <MandalaBackground />

      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(200,145,42,0.10),_transparent_55%)]" />

      <div className="relative flex w-full max-w-[1200px] flex-col items-center">
        <ShopBanner />

        <div className="w-full rounded-2xl border border-gold-600/30 p-[3px] shadow-premium">
          <div className="overflow-hidden rounded-[0.9rem] border-2 border-gold-500/50 bg-brown-900">
            <Header />
            <DisclaimerBanner />

            {error && (
              <p className="bg-red-500/10 px-4 py-1.5 text-center font-body text-xs text-red-300 sm:text-sm">
                Live rate feed is temporarily unavailable — showing the last known rates.
              </p>
            )}

            {rates === null ? (
              <div className="px-4 py-16 text-center font-body text-base text-gold-300/70 sm:py-20">
                Loading latest prices&hellip;
              </div>
            ) : (
              <RateTable rates={rates} />
            )}

            <div className="px-2 pb-4 sm:px-6 sm:pb-6">
              <p className="mb-2 font-body text-[11px] uppercase tracking-[0.15em] text-gold-500/60 sm:text-xs">
                Spot Rates
              </p>
              <SpotRatesBar />
            </div>

            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}