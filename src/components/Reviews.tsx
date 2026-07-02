"use client";

import { REVIEWS, SITE } from "@/data/site";
import Reveal from "./Reveal";

function Stars({ n }: { n: number }) {
  return (
    <div
      className="flex gap-0.5 text-gold"
      aria-label={`${n} von 5 Sternen`}
      role="img"
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={i < n ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function Reviews() {
  return (
    <section
      id="rezensionen"
      className="relative border-y border-gold/10 bg-ink-soft py-28 md:py-40"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <Reveal className="text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.4em] text-gold">
            Le Voci
          </p>
          <h2 className="font-serif text-4xl text-cream md:text-6xl">
            Was unsere Gäste <em className="gold-text">erzählen</em>
          </h2>
          <div className="mt-8 inline-flex items-center gap-4 rounded-full border border-gold/25 px-8 py-4">
            <span className="font-serif text-5xl text-gold-light">
              {SITE.rating.toLocaleString("de-AT")}
            </span>
            <div className="text-left">
              <Stars n={5} />
              <p className="mt-1 text-xs text-cream-dim">
                {SITE.reviewCount} Google-Rezensionen
              </p>
            </div>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <Reveal key={r.author} delay={i * 0.12}>
              <figure className="review-glow glass h-full rounded-xl border border-gold/15 p-8">
                <Stars n={r.stars} />
                <blockquote className="mt-5 text-[15px] leading-relaxed text-cream-dim">
                  „{r.text}"
                </blockquote>
                <figcaption className="mt-6 border-t border-gold/10 pt-4">
                  <p className="font-serif text-lg italic text-cream">
                    {r.author}
                  </p>
                  <p className="mt-0.5 text-xs text-cream-dim/70">
                    {r.badge} · {r.time}
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
