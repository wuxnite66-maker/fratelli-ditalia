"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";
import { SITE } from "@/data/site";

const LINKS = [
  { href: "#speisekarte", label: "Speisekarte" },
  { href: "#geschichte", label: "Geschichte" },
  { href: "#atmosphaere", label: "Atmosphäre" },
  { href: "#rezensionen", label: "Stimmen" },
  { href: "#standort", label: "Standort & Zeiten" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[100] transition-all duration-500 ${
        scrolled ? "glass-strong py-2 shadow-2xl" : "bg-transparent py-4"
      }`}
    >
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-4 md:px-8"
        aria-label="Hauptnavigation"
      >
        <a href="#top" aria-label="Fratelli d'Italia — zum Seitenanfang">
          <Logo size="sm" />
        </a>

        <ul className="hidden items-center gap-7 lg:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="group relative text-sm tracking-wide text-cream-dim transition-colors hover:text-gold-light"
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-gold transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={`tel:${SITE.phoneIntl}`}
            className="text-sm font-semibold text-gold-light transition-colors hover:text-gold"
          >
            ☎ {SITE.phone}
          </a>
          <a
            href="#reservieren"
            className="btn-gold rounded-full px-5 py-2 text-sm font-bold"
          >
            Tisch reservieren
          </a>
        </div>

        {/* mobile burger */}
        <button
          className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 lg:hidden"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label={open ? "Menü schließen" : "Menü öffnen"}
        >
          <span
            className={`h-px w-6 bg-gold transition-all duration-300 ${
              open ? "translate-y-[3.5px] rotate-45" : ""
            }`}
          />
          <span
            className={`h-px w-6 bg-gold transition-all duration-300 ${
              open ? "-translate-y-[3.5px] -rotate-45" : ""
            }`}
          />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="glass-strong overflow-hidden lg:hidden"
          >
            <ul className="flex flex-col gap-1 px-6 py-4">
              {LINKS.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block py-3 font-serif text-2xl italic text-cream transition-colors hover:text-gold-light"
                  >
                    {l.label}
                  </a>
                </motion.li>
              ))}
              <li className="pt-3">
                <a
                  href="#reservieren"
                  onClick={() => setOpen(false)}
                  className="btn-gold block rounded-full px-5 py-3 text-center font-bold"
                >
                  Tisch reservieren
                </a>
              </li>
              <li className="pt-2">
                <a
                  href={`tel:${SITE.phoneIntl}`}
                  className="btn-ghost block rounded-full px-5 py-3 text-center font-semibold"
                >
                  Anrufen · {SITE.phone}
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
