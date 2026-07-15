import logo from "../../src/SR-logo.png";

/**
 * ShopBanner
 * ------------------------------------------------------
 * Premium jewellery/refinery branding.
 */
export default function ShopBanner() {
  return (
    <div className="mb-3 flex w-full max-w-[1200px] flex-col items-center text-center sm:mb-4">
      {/* Logo + Flourishes */}
      <div className="flex items-center justify-center gap-3 sm:gap-4">
        <Flourish />

        {/* Logo */}
        <img
        src={logo}
        alt="Siddhanath Refinery Logo"
        className="
          h-28 w-28
          object-contain
          rounded-full

          drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]

          sm:h-24
          sm:w-24

          lg:h-40
          lg:w-40
        "
      />

        <Flourish flip />
      </div>

      {/* Shop Name */}
      <h1
        className="
          mt-1
          font-display
          font-bold
          leading-none

          text-[2rem]
          tracking-[0.03em]

          text-gold-200

          drop-shadow-[0_3px_8px_rgba(0,0,0,0.6)]

          sm:mt-2
          sm:text-3xl
          lg:text-4xl
        "
      >
        Siddhanath{" "}
        <span className="text-gold-400">
          Refinery
        </span>
      </h1>

      {/* Divider */}
      <div className="mt-3 hidden items-center gap-3 sm:flex">
        <span className="h-px w-24 bg-gradient-to-r from-transparent to-gold-500/70" />
        <span className="h-2 w-2 rotate-45 bg-gold-400" />
        <span className="h-px w-24 bg-gradient-to-l from-transparent to-gold-500/70" />
      </div>
    </div>
  );
}

/**
 * Decorative Flourish
 */
function Flourish({ flip = false }) {
  return (
    <svg
      viewBox="0 0 60 20"
      className={`hidden h-4 w-20 text-gold-500/60 sm:block ${
        flip ? "scale-x-[-1]" : ""
      }`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
    >
      <path d="M0 10 H40" />
      <circle cx="46" cy="10" r="3" />
      <path d="M52 10 H60" />
    </svg>
  );
}