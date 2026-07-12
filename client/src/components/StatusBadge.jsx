// import { Check, HelpCircle, X } from "lucide-react";

// /**
//  * StatusBadge
//  * ------------------------------------------------------
//  * Renders a small circular icon + label describing whether
//  * a commodity can currently be traded.
//  *
//  *   Status        Meaning
//  *   ------------  --------------------------------------
//  *   available     We are buying/selling this right now.
//  *   unavailable   Trading temporarily stopped / out of stock.
//  *   on-request    Contact us for current price.
//  *
//  * NOTE: this 3-tier model can be reverted to the simpler
//  * Active/Inactive model at any time — it lives entirely
//  * in this one file plus the `status` field in mockRates.js.
//  * ------------------------------------------------------
//  */
// const STATUS_CONFIG = {
//   available: {
//     label: "Available",
//     circleClass: "bg-emerald-500 shadow-emerald-500/40",
//     textClass: "text-emerald-400",
//     Icon: Check,
//   },
//   unavailable: {
//     label: "Unavailable",
//     circleClass: "bg-red-500 shadow-red-500/40",
//     textClass: "text-red-400",
//     Icon: X,
//   },
//   "on-request": {
//     label: "On Request",
//     circleClass: "bg-amber-400 shadow-amber-400/40",
//     textClass: "text-amber-300",
//     Icon: HelpCircle,
//   },
// };

// export default function StatusBadge({ status }) {
//   const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.unavailable;
//   const { label, circleClass, textClass, Icon } = config;

//   return (
//     <div className="flex items-center justify-center gap-1.5">
//       <span
//         className={`flex h-5 w-5 items-center justify-center rounded-full shadow-md sm:h-6 sm:w-6 ${circleClass}`}
//       >
//         <Icon className="h-3 w-3 text-white sm:h-3.5 sm:w-3.5" strokeWidth={3} />
//       </span>
//       <span
//         className={`hidden font-display text-[10px] font-semibold uppercase tracking-wide sm:inline sm:text-xs ${textClass}`}
//       >
//         {label}
//       </span>
//     </div>
//   );
// }

// Option 2

import { Check, HelpCircle, X } from "lucide-react";

/**
 * StatusBadge
 * ------------------------------------------------------
 * Luxury pill badge for commodity status.
 * ------------------------------------------------------
 */

const STATUS_CONFIG = {
  available: {
    label: "Available",
    bg: "bg-emerald-500/15",
    border: "border-emerald-500/40",
    text: "text-emerald-300",
    dot: "bg-emerald-400",
    Icon: Check,
  },

  unavailable: {
    label: "Unavailable",
    bg: "bg-red-500/15",
    border: "border-red-500/40",
    text: "text-red-300",
    dot: "bg-red-400",
    Icon: X,
  },

  "on-request": {
    label: "On Request",
    bg: "bg-amber-500/15",
    border: "border-amber-500/40",
    text: "text-amber-300",
    dot: "bg-amber-400",
    Icon: HelpCircle,
  },
};

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.unavailable;

  const { label, bg, border, text, dot, Icon } = config;

  return (
    <div
      className={`
        inline-flex
        items-center
        gap-2
        rounded-full
        border
        px-3
        py-1.5
        ${bg}
        ${border}
      `}
    >
      <span
        className={`h-2.5 w-2.5 rounded-full ${dot} animate-pulse`}
      />

      <Icon
        className={`h-3.5 w-3.5 ${text}`}
        strokeWidth={2.5}
      />

      <span
        className={`
          font-display
          text-xs
          font-semibold
          tracking-wide
          ${text}
        `}
      >
        {label}
      </span>
    </div>
  );
}