import PriceCell from "./PriceCell.jsx";
import StatusBadge from "./StatusBadge.jsx";
import TrendIndicator from "./TrendIndicator.jsx";

/**
 * RateRow
 * ------------------------------------------------------
 * Premium jewellery style rate card.
 * ------------------------------------------------------
 */
export default function RateRow({ rate, variant = "row" }) {
  const { name, sell, previousClose, status } = rate;

  // ==========================
  // Mobile Card
  // ==========================
  if (variant === "card") {
    return (
      <div className="rounded-xl border border-gold-700/40 bg-brown-800/60 px-5 py-4 shadow-lg shadow-black/40">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl font-bold tracking-wide text-gold-100">
            {name}
          </h3>

          <StatusBadge status={status} />
        </div>

        {/* Price */}
        <div className="border-t border-gold-700/20 py-5">
          <div className="flex flex-col items-center">
            <PriceCell value={sell} size="sm" />

            <span className="mt-2 font-body text-sm tracking-wide text-gold-400/80">
              Today's Rate
            </span>
          </div>
        </div>

        {/* Trend */}
        <div className="border-t border-gold-700/10 pt-3">
          <TrendIndicator
            currentPrice={sell}
            previousClose={previousClose}
          />
        </div>
      </div>
    );
  }

  // ==========================
  // Desktop Table
  // ==========================
  return (
    <tr className="border-b border-gold-700/20 bg-brown-900/40 transition-colors hover:bg-brown-700/40">
      {/* Commodity */}
      <td className="px-6 py-4">
        <div className="font-display text-lg font-bold text-gold-100">
          {name}
        </div>

        <div className="mt-2">
          <TrendIndicator
            currentPrice={sell}
            previousClose={previousClose}
          />
        </div>
      </td>

      {/* Today's Rate */}
      <td className="px-4 py-4 text-center">
        <PriceCell value={sell} />
      </td>

      {/* Status */}
      <td className="px-6 py-4 text-center">
        <StatusBadge status={status} />
      </td>
    </tr>
  );
}