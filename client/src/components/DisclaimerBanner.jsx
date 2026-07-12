/**
 * DisclaimerBanner
 * ------------------------------------------------------
 * Compact notice reminding viewers that displayed rates
 * are informational only, not a binding quote.
 * ------------------------------------------------------
 */
export default function DisclaimerBanner() {
  return (
    <div className="border-b border-gold-700/20 bg-brown-950/60 px-4 py-1.5 text-center sm:px-10 sm:py-2">
      <p className="font-body text-[10px] uppercase tracking-[0.1em] text-red-400 sm:text-xs">
        Market rate is only for your knowledge purpose
      </p>
    </div>
  );
}
