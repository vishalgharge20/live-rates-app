/**
 * ShineOverlay
 * ------------------------------------------------------
 * A thin diagonal band of light that sweeps across its
 * parent every few seconds — the classic "premium metal"
 * shimmer seen on luxury packaging and watch dials.
 *
 * Usage: place inside any `relative overflow-hidden`
 * container as an absolutely-positioned sibling.
 * ------------------------------------------------------
 */
export default function ShineOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-y-0 left-0 w-1/3 animate-shine bg-gradient-to-r from-transparent via-gold-200/20 to-transparent" />
    </div>
  );
}
