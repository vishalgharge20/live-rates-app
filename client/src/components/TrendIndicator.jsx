// import { TrendingDown, TrendingUp } from "lucide-react";

// /**
//  * TrendIndicator
//  * ------------------------------------------------------
//  * Shows how today's price compares to the session's
//  * opening/reference price:
//  *
//  *   Y. Close  ₹1,47,850         ▲ +375 (+0.25%)
//  *
//  * Redesigned for readability: larger, higher-contrast
//  * text and a clear pill for the change, instead of a
//  * single cramped line of tiny text.
//  * ------------------------------------------------------
//  */
// export default function TrendIndicator({ currentPrice, previousClose }) {
//   const diff = currentPrice - previousClose;
//   const pct = previousClose ? (diff / previousClose) * 100 : 0;
//   const isUp = diff >= 0;

//   const Arrow = isUp ? TrendingUp : TrendingDown;
//   const pillClass = isUp
//     ? "bg-emerald-500/15 text-emerald-300"
//     : "bg-red-500/15 text-red-300";

//   return (
//     <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
//       <span className="font-body text-sm text-gold-300/70 sm:text-base">
//         Y. Close &#8377;{previousClose.toLocaleString("en-IN")}
//       </span>
//       <span
//         className={`flex items-center gap-1 rounded-full px-2 py-0.5 font-body text-sm font-semibold sm:text-base ${pillClass}`}
//       >
//         <Arrow className="h-3.5 w-3.5" />
//         {isUp ? "+" : ""}
//         {diff.toLocaleString("en-IN")} ({isUp ? "+" : ""}
//         {pct.toFixed(2)}%)
//       </span>
//     </div>
//   );
// }


// option 2


import { TrendingDown, TrendingUp } from "lucide-react";

/**
 * TrendIndicator
 * ------------------------------------------------------
 * Premium market trend indicator.
 * ------------------------------------------------------
 */
export default function TrendIndicator({ currentPrice, previousClose }) {
  const diff = currentPrice - previousClose;
  const pct = previousClose ? (diff / previousClose) * 100 : 0;

  const isUp = diff >= 0;

  const Arrow = isUp ? TrendingUp : TrendingDown;

  const pillClass = isUp
    ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
    : "border border-red-500/30 bg-red-500/10 text-red-300";

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 text-sm sm:justify-start">
      {/* Yesterday */}
      <div className="text-gold-400/70">
        <span className="font-body">Yesterday</span>{" "}
        <span className="font-semibold text-gold-200">
          ₹{previousClose.toLocaleString("en-IN")}
        </span>
      </div>

      {/* Change */}
      <div
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-semibold ${pillClass}`}
      >
        <Arrow className="h-4 w-4" strokeWidth={2.5} />

        <span>
          {isUp ? "+" : ""}
          {diff.toLocaleString("en-IN")}
        </span>

        <span className="opacity-80">
          ({isUp ? "+" : ""}
          {pct.toFixed(2)}%)
        </span>
      </div>
    </div>
  );
}