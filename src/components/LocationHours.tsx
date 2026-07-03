"use client";

import { useEffect, useState } from "react";
import { HOURS, SITE } from "@/data/site";
import { useOpenStatus } from "@/lib/useOpenStatus";
import Reveal from "./Reveal";

export default function LocationHours() {
  const status = useOpenStatus();
  const [todayIdx, setTodayIdx] = useState<number | null>(null);

  useEffect(() => {
    setTodayIdx(new Date().getDay());
  }, []);

  return (
    <section
      id="standort"
      className="relative mx-auto max-w-7xl px-6 py-28 md:px-8 md:py-40"
    >
      <Reveal className="text-center">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.4em] text-gold">
          Dove Siamo
        </p>
        <h2 className="font-serif text-4xl text-cream md:text-6xl">
          Italien ist <em className="gold-text">näher, als Sie denken</em>
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-cream-dim">
          Friedrichsgasse 8 — emotional gesehen nur wenige Schritte von
          Neapel entfernt.
        </p>
      </Reveal>

      <div className="mt-16 grid gap-8 lg:grid-cols-5">
        {/* map */}
        <Reveal className="lg:col-span-3">
          <div className="group relative h-full min-h-[420px] overflow-hidden rounded-xl border border-gold/20 shadow-2xl">
            <iframe
              src={SITE.mapsEmbed}
              title="Karte — Fratelli d'Italia, Friedrichsgasse 8, Wiener Neustadt"
              className="h-full min-h-[420px] w-full grayscale-[0.4] contrast-[1.05] transition-all duration-700 group-hover:grayscale-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <a
              href={SITE.mapsUrl}
              target="_blank"
              rel="noopener"
              className="btn-gold absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-6 py-3 text-sm font-bold uppercase tracking-widest"
            >
              Route starten
            </a>
          </div>
        </Reveal>

        {/* hours + contact */}
        <Reveal delay={0.15} className="lg:col-span-2">
          <div className="glass flex h-full flex-col rounded-xl p-8">
            {status && (
              <div
                className={`mb-6 inline-flex items-center gap-2 self-start rounded-full px-4 py-2 text-sm font-semibold ${
                  status.open
                    ? "bg-teal/20 text-teal-light"
                    : "bg-vintage-red/15 text-[#e0776e]"
                }`}
                role="status"
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    status.open ? "animate-pulse bg-teal-light" : "bg-[#e0776e]"
                  }`}
                />
                {status.label}
              </div>
            )}

            <h3 className="font-serif text-2xl italic text-cream">
              Öffnungszeiten
            </h3>
            <table className="mt-4 w-full text-sm">
              <tbody>
                {HOURS.map((h) => {
                  const isToday = todayIdx === h.day;
                  return (
                    <tr
                      key={h.label}
                      className={`border-b border-gold/8 ${
                        isToday ? "text-gold-light" : "text-cream-dim"
                      }`}
                    >
                      <td className="py-2.5 font-medium">
                        {h.label}
                        {isToday && (
                          <span className="ml-2 text-[10px] uppercase tracking-widest text-gold">
                            heute
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 text-right tabular-nums">
                        {h.slots
                          ? h.slots
                              .map((s) => `${s.open}–${s.close}`)
                              .join(" · ")
                          : "Ruhetag"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="mt-8 space-y-3">
              <a
                href={`tel:${SITE.phoneIntl}`}
                className="btn-gold flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold uppercase tracking-widest"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                {SITE.phone}
              </a>
              <a
                href={SITE.facebook}
                target="_blank"
                rel="noopener"
                className="btn-ghost flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold uppercase tracking-widest"
              >
                Facebook
              </a>
              <p className="pt-2 text-center text-sm text-cream-dim">
                {SITE.address}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
