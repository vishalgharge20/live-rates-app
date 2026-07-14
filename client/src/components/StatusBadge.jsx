import { Check, HelpCircle, X } from "lucide-react";

/**
 * StatusBadge
 * ------------------------------------------------------
 * Luxury pill badge for commodity status — icon + colored
 * dot only, no text label (removed per request).
 * ------------------------------------------------------
 */

const STATUS_CONFIG = {
  available: {
    bg: "bg-emerald-500/15",
    border: "border-emerald-500/40",
    text: "text-emerald-300",
    dot: "bg-emerald-400",
    Icon: Check,
  },

  unavailable: {
    bg: "bg-red-500/15",
    border: "border-red-500/40",
    text: "text-red-300",
    dot: "bg-red-400",
    Icon: X,
  },

  "on-request": {
    bg: "bg-amber-500/15",
    border: "border-amber-500/40",
    text: "text-amber-300",
    dot: "bg-amber-400",
    Icon: HelpCircle,
  },
};

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.unavailable;

  const { bg, border, text, dot, Icon } = config;

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
    </div>
  );
}