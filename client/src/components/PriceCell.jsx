import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";

/**
 * PriceCell
 * ------------------------------------------------------
 * Premium price display used for Buy / Sell values.
 *
 * - Larger typography
 * - Bigger trend arrows
 * - More spacing
 * - Flash animation on price updates
 * ------------------------------------------------------
 */
export default function PriceCell({ value, subLabel, size = "lg" }) {
  const [flash, setFlash] = useState(null);
  const previousValue = useRef(value);

  useEffect(() => {
    if (previousValue.current !== value) {
      const direction = value > previousValue.current ? "up" : "down";

      setFlash(direction);
      previousValue.current = value;

      const timeout = setTimeout(() => setFlash(null), 600);

      return () => clearTimeout(timeout);
    }
  }, [value]);

  const flashClass =
    flash === "up"
      ? "animate-flash-green"
      : flash === "down"
      ? "animate-flash-red"
      : "";

  const textSize =
    size === "lg"
      ? "text-2xl sm:text-3xl lg:text-4xl"
      : size === "md"
      ? "text-lg sm:text-xl lg:text-2xl"
      : "text-xl sm:text-2xl";

  return (
    <div
      className={`flex flex-col items-center rounded-lg px-3 py-2 transition-colors sm:px-4 sm:py-3 ${flashClass}`}
    >
      <div className="flex items-center gap-2">
        {flash === "up" && (
          <ArrowUp className="h-5 w-5 text-emerald-400 sm:h-6 sm:w-6" />
        )}

        {flash === "down" && (
          <ArrowDown className="h-5 w-5 text-red-400 sm:h-6 sm:w-6" />
        )}

        <span
          className={`font-display font-extrabold tracking-tight text-gold-100 ${textSize}`}
        >
          {value.toLocaleString("en-IN")}
        </span>
      </div>

      {subLabel && (
        <span className="mt-1 font-body text-xs font-medium text-gold-400/70 sm:text-sm">
          {subLabel}
        </span>
      )}
    </div>
  );
}