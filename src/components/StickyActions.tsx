"use client";

import { useEffect, useState } from "react";
import { SITE } from "@/data/site";

/** Mobile Sticky-Bar: die drei Aktionen, die Gäste bringen. */
export default function StickyActions() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`glass-strong fixed inset-x-0 bottom-0 z-[105] grid grid-cols-3 border-t border-gold/25 pb-[env(safe-area-inset-bottom)] transition-transform duration-500 md:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      aria-label="Schnellaktionen"
    >
      <a
        href={`tel:${SITE.phoneIntl}`}
        className="flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-semibold uppercase tracking-wide text-cream"
      >
        <span aria-hidden>☎</span> Anrufen
      </a>
      <a
        href="#reservieren"
        className="flex min-h-14 flex-col items-center justify-center gap-0.5 bg-gradient-to-r from-gold-deep via-gold to-gold-deep text-[11px] font-bold uppercase tracking-wide text-ink"
      >
        <span aria-hidden>✦</span> Reservieren
      </a>
      <a
        href={SITE.mapsUrl}
        target="_blank"
        rel="noopener"
        className="flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-semibold uppercase tracking-wide text-cream"
      >
        <span aria-hidden>➤</span> Route
      </a>
    </div>
  );
}
