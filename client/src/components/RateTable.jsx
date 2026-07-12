import RateRow from "./RateRow.jsx";

/**
 * RateTable
 * ------------------------------------------------------
 * Displays the full list of commodity rates.
 *  - On sm/tablet and desktop screens: a proper <table>.
 *  - On mobile (below sm breakpoint): a stacked list of
 *    cards, which is far more usable on small screens
 *    than a horizontally-cramped table.
 *
 * Buy/Sell/Status header cells are centered to match the
 * centered price/badge content in each row.
 * ------------------------------------------------------
 */
export default function RateTable({ rates }) {
  return (
    <div className="px-3 py-3 sm:px-6 sm:py-5">
      {/* Desktop / tablet table view */}
      <div className="hidden overflow-hidden rounded-xl border border-gold-700/30 shadow-inner-gold sm:block">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-brown-800/70 text-left">
              <th className="px-5 py-4 font-display text-sm font-semibold uppercase tracking-wide text-gold-300 sm:px-6">
                Commodity
              </th>
              <th className="px-5 py-4 font-display text-sm font-semibold uppercase tracking-wide text-gold-300 sm:px-6">
                Buy
              </th>
              <th className="px-5 py-4 font-display text-sm font-semibold uppercase tracking-wide text-gold-300 sm:px-6">
                Sell
              </th>
              <th className="px-5 py-4 font-display text-sm font-semibold uppercase tracking-wide text-gold-300 sm:px-6">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {rates.map((rate) => (
              <RateRow key={rate.id} rate={rate} variant="row" />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card view */}
      <div className="flex flex-col gap-3 sm:hidden">
        {rates.map((rate) => (
          <RateRow key={rate.id} rate={rate} variant="card" />
        ))}
      </div>
    </div>
  );
}
