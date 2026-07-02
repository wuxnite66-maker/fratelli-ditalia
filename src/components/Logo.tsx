type Props = {
  size?: "sm" | "lg";
};

/** Vintage badge wordmark — recreated from the original signage:
 *  yellow field, teal script, red CAFFÈ~PIZZA caption. */
export default function Logo({ size = "sm" }: Props) {
  const sm = size === "sm";
  return (
    <div
      className={`inline-flex flex-col items-center justify-center rounded-sm border-2 border-[#2e7d74]/70 bg-[#f2d16b] shadow-[0_4px_20px_-6px_rgba(0,0,0,0.6)] ${
        sm ? "px-3 py-1.5" : "px-8 py-5"
      }`}
    >
      <span
        className={`font-serif italic font-semibold leading-none text-[#2e7d74] ${
          sm ? "text-lg" : "text-4xl md:text-5xl"
        }`}
      >
        Fratelli d&apos;Italia
      </span>
      <span
        className={`font-sans font-bold tracking-[0.3em] text-[#c4392f] ${
          sm ? "mt-0.5 text-[8px]" : "mt-2 text-xs md:text-sm"
        }`}
      >
        CAFFÈ ~ PIZZA
      </span>
    </div>
  );
}
