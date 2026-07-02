"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import ScrollVideo from "./ScrollVideo";

const HEADLINE = ["Italienische", "Seele", "in Wiener Neustadt"];

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -140]);

  return (
    <section
      ref={ref}
      id="top"
      className="relative flex h-[100svh] items-center justify-center overflow-hidden"
    >
      {/* cinematic background — drop /videos/hero.mp4 in and it plays */}
      <motion.div
        style={reduced ? {} : { scale }}
        className="absolute inset-0"
      >
        <ScrollVideo
          src="/videos/hero.mp4"
          poster="/images/hero-pizza.jpg"
          alt="Frisch gebackene Pizza im Fratelli d'Italia"
          className="h-full w-full"
        />
      </motion.div>

      {/* vignette layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/30 to-ink" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(11,10,8,0.75)_100%)]" />

      <motion.div
        style={reduced ? {} : { y: textY, opacity }}
        className="relative z-10 px-6 text-center"
      >
        <motion.p
          initial={{ opacity: 0, letterSpacing: "0.2em" }}
          animate={{ opacity: 1, letterSpacing: "0.45em" }}
          transition={{ duration: 1.6, delay: 0.3, ease: "easeOut" }}
          className="mb-6 text-xs font-medium uppercase tracking-[0.45em] text-gold-light md:text-sm"
        >
          Benvenuti · Seit Jahren das Stück Italien der Stadt
        </motion.p>

        <h1 className="font-serif text-5xl leading-[1.05] md:text-7xl lg:text-8xl">
          {HEADLINE.map((line, i) => (
            <span key={line} className="block overflow-hidden">
              <motion.span
                className={`block ${i === 1 ? "gold-text italic" : "text-cream"}`}
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{
                  duration: 1.1,
                  delay: 0.5 + i * 0.18,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.3, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-8 max-w-xl text-base text-cream-dim md:text-lg"
        >
          Dünner Teig. Ehrliche Zutaten. Ein Chef, der jeden Gast wie Familie
          behandelt. <span className="text-gold-light">4,8&nbsp;★</span> aus
          über 512 Stimmen.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.55, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <a
            href="#speisekarte"
            className="btn-gold rounded-full px-8 py-4 text-sm font-bold uppercase tracking-widest"
          >
            Speisekarte entdecken
          </a>
          <a
            href="#standort"
            className="btn-ghost rounded-full px-8 py-4 text-sm font-semibold uppercase tracking-widest"
          >
            Tisch &amp; Anfahrt
          </a>
        </motion.div>
      </motion.div>

      {/* scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
        style={reduced ? {} : { opacity }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        aria-hidden
      >
        <div className="flex h-12 w-7 items-start justify-center rounded-full border border-gold/50 p-2">
          <div className="scroll-dot h-2 w-1 rounded-full bg-gold" />
        </div>
      </motion.div>
    </section>
  );
}
