import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";

/**
 * PriceCell
 * ------------------------------------------------------
 * Premium jewellery style price display.
 * ------------------------------------------------------
 */
export default function PriceCell({ value, subLabel, size = "lg" }) {
  const [flash, setFlash] = useState(null);
  const previousValue = useRef(value);

  useEffect(() => {
    if (previousValue.current !== value) {
      setFlash(value > previousValue.current ? "up" : "down");
      previousValue.current = value;

      const timeout = setTimeout(() => setFlash(null), 700);

      return () => clearTimeout(timeout);
    }
  }, [value]);

  const flashClass =
    flash === "up"
      ? "animate-flash-green"
      : flash === "down"
      ? "animate-flash-red"
      : "";

  // const textSize =
  //   size === "lg"
  //     ? "text-3xl sm:text-4xl lg:text-5xl"
  //     : size === "md"
  //     ? "text-2xl sm:text-3xl"
  //     : "text-[2rem] sm:text-4xl";

  const textSize =
  size === "lg"
    ? "text-xl sm:text-2xl lg:text-3xl"
    : size === "md"
    ? "text-base sm:text-lg lg:text-xl"
    : "text-2xl sm:text-3xl"

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
            bg-gradient-to-b
            from-yellow-100
            via-yellow-300
            to-yellow-500
            bg-clip-text
            text-transparent
            drop-shadow-[0_2px_10px_rgba(255,215,0,0.25)]
            ${textSize}
          `}
        >
          ₹{value.toLocaleString("en-IN")}
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