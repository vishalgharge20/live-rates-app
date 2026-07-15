import RateRow from "./RateRow.jsx";

/**
 * RateTable
 * ------------------------------------------------------
 * Premium jewellery style rate table.
 * ------------------------------------------------------
 */
export default function RateTable({ rates }) {
  return (
    <div className="px-3 py-3 sm:px-6 sm:py-6">
      {/* Desktop / Tablet */}
      <div className="hidden overflow-hidden rounded-2xl border border-gold-600/30 bg-brown-900/30 shadow-xl shadow-black/30 sm:block">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gold-700/30 bg-gradient-to-r from-brown-800 to-brown-900">
              <th className="px-6 py-4 text-left font-display text-sm font-bold uppercase tracking-[0.18em] text-gold-300">
                Commodity
              </th>

              <th className="px-6 py-4 text-center font-display text-sm font-bold uppercase tracking-[0.18em] text-gold-300">
                Today's Rate
              </th>

              <th className="px-6 py-4 text-center font-display text-sm font-bold uppercase tracking-[0.18em] text-gold-300">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {rates
            .filter((rate) => rate.name !== "Gold 999 RTGS")
            .map((rate) => (
              <RateRow key={rate.id} rate={rate} variant="row" />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="flex flex-col gap-3 sm:hidden">
        {rates
        .filter((rate) => rate.name !== "Gold 999 RTGS")
        .map((rate) => (
          <RateRow key={rate.id} rate={rate} variant="card" />
        ))}
      </div>
    </div>
  );
}