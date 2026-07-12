import PriceCell from "./PriceCell.jsx";
import StatusBadge from "./StatusBadge.jsx";
import TrendIndicator from "./TrendIndicator.jsx";

/**
 * RateRow
 * ------------------------------------------------------
 * Renders a single commodity's pricing data.
 *
 * Two visual variants are supported so the same data
 * source can power both the desktop table and the
 * mobile card layout without duplicating logic:
 *  - variant="row"  -> rendered as a <tr> (desktop/tablet)
 *  - variant="card" -> rendered as a bordered card (mobile)
 *
 * Note: Low/High are intentionally not displayed per
 * request — only Buy, Sell, Trend and Status are shown.
 * ------------------------------------------------------
 */
export default function RateRow({ rate, variant = "row" }) {
  const { name, buy, sell, previousClose, status } = rate;

  if (variant === "card") {
    return (
      <div className="rounded-xl border border-gold-700/40 bg-brown-800/60 px-4 py-5 shadow-lg shadow-black/40">
        <div className="mb-1 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-gold-100">{name}</h3>
          <StatusBadge status={status} />
        </div>
        <div className="grid grid-cols-2 gap-4 border-t border-gold-700/20 pt-2">
          <div className="flex flex-col items-center">
            <span className="font-display text-sm uppercase tracking-wider text-gold-500">
              Buy
            </span>
            <PriceCell value={buy} size="sm" />
          </div>
          <div className="flex flex-col items-center">
            <span className="font-display text-sm uppercase tracking-wider text-gold-500">
              Sell
            </span>
            <PriceCell value={sell} size="sm" />
          </div>
        </div>
        <div className="mt-3 border-t border-gold-700/10 pt-3">
          <TrendIndicator currentPrice={buy} previousClose={previousClose} />
        </div>
      </div>
    );
  }

  // Default: table row for desktop / tablet
  return (
    <tr className="border-b border-gold-700/20 bg-brown-900/40 transition-colors hover:bg-brown-700/40">
      <td className="px-4 py-3 sm:px-6 sm:py-4">
        <span className="font-display text-lg font-semibold text-gold-100 sm:text-base">
          {name}
        </span>
        <div className="mt-1">
          <TrendIndicator currentPrice={buy} previousClose={previousClose} />
        </div>
      </td>
      <td className="px-2 py-3 text-center sm:px-4 sm:py-4">
        <PriceCell value={buy} />
      </td>
      <td className="px-2 py-3 text-center sm:px-4 sm:py-4">
        <PriceCell value={sell} />
      </td>
      <td className="px-4 py-3 text-center sm:px-6 sm:py-4">
        <StatusBadge status={status} />
      </td>
    </tr>
  );
}