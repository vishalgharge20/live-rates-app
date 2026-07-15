import PriceCell from "./PriceCell.jsx";
import StatusBadge from "./StatusBadge.jsx";
// import TrendIndicator from "./TrendIndicator.jsx";

export default function RateRow({ rate, variant = "row" }) {
  const { name, sell, previousClose, status } = rate;

  // ==========================
  // Mobile Card
  // ==========================
  if (variant === "card") {
    return (
      <div className="rounded-xl border border-gold-700/40 bg-brown-800/60 px-4 py-2.5 shadow-lg shadow-black/40">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-display text-base font-bold tracking-wide text-gold-100">
            {name}
          </h3>
          <StatusBadge status={status} />
        </div>

        <div className="mt-1 flex flex-col items-center border-t border-gold-700/20 pt-2">
          <PriceCell value={sell} size="sm" />
          <span className="mt-0.5 font-body text-[11px] tracking-wide text-gold-400/70">
            Today's Rate
          </span>
        </div>
      </div>
    );
  }

  // ==========================
  // Desktop Table
  // ==========================
  return (
    <tr className="border-b border-gold-700/20 bg-brown-900/40 transition-colors hover:bg-brown-700/40">
      <td className="px-6 py-3">
        <div className="font-display text-base font-bold text-gold-100">
          {name}
        </div>
      </td>

      <td className="px-4 py-3 text-center">
        <PriceCell value={sell} size="md" />
      </td>

      <td className="px-6 py-3 text-center">
        <StatusBadge status={status} />
      </td>
    </tr>
  );
}