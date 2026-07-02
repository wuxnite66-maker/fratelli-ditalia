"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MENU, formatPrice } from "@/data/menu";
import Reveal from "./Reveal";

export default function MenuExperience() {
  const [active, setActive] = useState(MENU[1].id); // start on Pizze
  const category = MENU.find((c) => c.id === active)!;

  return (
    <section
      id="speisekarte"
      className="relative border-y border-gold/10 bg-ink-soft py-28 md:py-40"
    >
      <div className="mx-auto max-w-5xl px-6 md:px-8">
        <Reveal className="text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.4em] text-gold">
            Il Menù
          </p>
          <h2 className="font-serif text-4xl text-cream md:text-6xl">
            Die <em className="gold-text">Speisekarte</em>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-cream-dim">
            Mit der Maus über ein Gericht fahren verrät mehr. Gerichte mit{" "}
            <span className="text-gold-light">★</span> sind laut unseren
            Gästen die beliebtesten.
          </p>
        </Reveal>

        {/* category tabs */}
        <Reveal delay={0.15}>
          <div
            className="mt-12 flex flex-wrap justify-center gap-2"
            role="tablist"
            aria-label="Speisekarten-Kategorien"
          >
            {MENU.map((c) => (
              <button
                key={c.id}
                role="tab"
                aria-selected={active === c.id}
                onClick={() => setActive(c.id)}
                className={`relative min-h-11 rounded-full px-5 py-2.5 text-sm font-medium tracking-wide transition-all duration-300 ${
                  active === c.id
                    ? "text-ink"
                    : "text-cream-dim hover:text-gold-light"
                }`}
              >
                {active === c.id && (
                  <motion.span
                    layoutId="tab-pill"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-gold-deep via-gold to-gold-deep"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{c.label}</span>
              </button>
            ))}
          </div>
        </Reveal>

        {/* items */}
        <div className="mt-12 min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(6px)" }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mb-8 text-center">
                <h3 className="font-serif text-3xl italic text-gold-light">
                  {category.label}
                </h3>
                <p className="mt-1 text-sm text-cream-dim">
                  {category.subtitle}
                </p>
                {category.note && (
                  <p className="mt-2 text-xs italic text-gold/70">
                    {category.note}
                  </p>
                )}
              </div>

              <ul className="grid gap-x-12 gap-y-1 md:grid-cols-2">
                {category.items.map((item, i) => (
                  <motion.li
                    key={item.name}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i, duration: 0.4 }}
                    className="menu-item group rounded-lg px-4 py-3.5 transition-colors duration-300 hover:bg-gold/5"
                    tabIndex={0}
                  >
                    <div className="flex items-baseline">
                      <span className="font-serif text-lg text-cream transition-colors group-hover:text-gold-light">
                        {item.name}
                        {item.popular && (
                          <span
                            className="ml-2 text-sm text-gold"
                            title="Beliebt bei Gästen"
                          >
                            ★
                          </span>
                        )}
                        {item.chef && (
                          <span className="ml-2 rounded-sm bg-vintage-red/90 px-1.5 py-0.5 align-middle text-[9px] font-bold uppercase tracking-wider text-cream">
                            Chef
                          </span>
                        )}
                      </span>
                      <span className="dots" aria-hidden />
                      <span className="font-serif text-lg text-gold-light">
                        {formatPrice(item.price)}
                      </span>
                    </div>
                    <div className="menu-detail">
                      <div>
                        <p className="pt-1.5 text-sm leading-relaxed text-cream-dim">
                          {item.description}
                          {item.vegetarian && (
                            <span className="ml-2 text-teal-light">
                              · vegetarisch
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* PDF actions */}
        <Reveal delay={0.1}>
          <div className="mt-16 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="/speisekarte-fratelli-ditalia.pdf"
              target="_blank"
              rel="noopener"
              className="btn-gold rounded-full px-8 py-4 text-sm font-bold uppercase tracking-widest"
            >
              Speisekarte als PDF öffnen
            </a>
            <a
              href="/speisekarte-fratelli-ditalia.pdf"
              download
              className="btn-ghost rounded-full px-8 py-4 text-sm font-semibold uppercase tracking-widest"
            >
              PDF herunterladen
            </a>
          </div>
          <p className="mt-6 text-center text-xs text-cream-dim/60">
            Alle Preise in Euro, inkl. MwSt. Änderungen vorbehalten.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
