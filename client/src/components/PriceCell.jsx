import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";

/**
 * PriceCell
 * ------------------------------------------------------
 * Premium jewellery style price display.
 *
 * When `value` is null/undefined (rate disabled, or Kalash
 * currently has no live data for this commodity), renders a
 * plain "-" instead of crashing on `null.toLocaleString()".
 * No flash animation runs for that transition either — flash
 * only makes sense when comparing two real numbers.
 * ------------------------------------------------------
 */
export default function PriceCell({ value, subLabel, size = "lg", prefix = "\u20B9", decimals = 0 }) {
  const [flash, setFlash] = useState(null);
  const previousValue = useRef(value);

  useEffect(() => {
    const isRealNumber = (v) => typeof v === "number" && !Number.isNaN(v);

    if (
      isRealNumber(value) &&
      isRealNumber(previousValue.current) &&
      previousValue.current !== value
    ) {
      setFlash(value > previousValue.current ? "up" : "down");
      const timeout = setTimeout(() => setFlash(null), 700);
      previousValue.current = value;
      return () => clearTimeout(timeout);
    }

    previousValue.current = value;
  }, [value]);

  const flashClass =
    flash === "up"
      ? "animate-flash-green"
      : flash === "down"
      ? "animate-flash-red"
      : "";

  const textSize =
  size === "lg"
    ? "text-3xl sm:text-4xl lg:text-5xl"
    : size === "md"
    ? "text-lg sm:text-xl lg:text-2xl"
    : size === "sm"
    ? "text-base sm:text-lg"
    : "text-sm sm:text-base";

  const hasValue = value !== null && value !== undefined;

  return (
    <div
      className={`rounded-xl px-4 py-3 transition-all duration-300 ${flashClass}`}
    >
      <div className="flex items-center justify-center gap-2">
        {flash === "up" && (
          <ArrowUp className="h-5 w-5 text-emerald-400 animate-pulse" />
        )}

        {flash === "down" && (
          <ArrowDown className="h-5 w-5 text-red-400 animate-pulse" />
        )}

        <span
          className={`
            font-display
            font-extrabold
            tracking-tight
            leading-none
            ${
              hasValue
                ? "bg-gradient-to-b from-yellow-100 via-yellow-300 to-yellow-500 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(255,215,0,0.25)]"
                : "text-gold-500/60"
            }
            ${textSize}
          `}
        >
          {hasValue
            ? `${prefix}${value.toLocaleString("en-IN", {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals,
              })}`
            : "-"}
        </span>
      </div>

      {subLabel && (
        <div className="mt-2 text-center">
          <span className="font-body text-xs text-gold-400/70 sm:text-sm">
            {subLabel}
          </span>
        </div>
      )}
    </div>
  );
}