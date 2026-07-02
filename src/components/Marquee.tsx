const WORDS = [
  "Pizza",
  "Pasta",
  "Amore",
  "Espresso",
  "Vino",
  "Famiglia",
  "Tradizione",
  "Dolce Vita",
];

export default function Marquee() {
  const row = [...WORDS, ...WORDS];
  return (
    <div
      className="relative overflow-hidden border-y border-gold/15 bg-ink-soft py-5"
      aria-hidden
    >
      <div className="marquee-track flex w-max items-center gap-10">
        {[...row, ...row].map((w, i) => (
          <span key={i} className="flex items-center gap-10">
            <span className="font-serif text-2xl italic text-gold/60 md:text-3xl">
              {w}
            </span>
            <span className="text-gold/30">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
