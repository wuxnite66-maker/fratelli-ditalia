"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import ScrollVideo from "./ScrollVideo";
import Reveal from "./Reveal";

/** Immersive Videowand — each tile is drop-in ready for Higgsfield clips
 *  (/videos/atmo-1.mp4 …), falls back to Ken-Burns stills. */
const TILES = [
  {
    video: "/videos/atmo-1.mp4",
    poster: "/images/restaurant-interior.jpg",
    alt: "Warmes Restaurant-Ambiente",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    video: "/videos/atmo-2.mp4",
    poster: "/images/pasta-fork.jpg",
    alt: "Spaghetti auf der Gabel",
    span: "",
  },
  {
    video: "/videos/atmo-3.mp4",
    poster: "/images/wine-pour.jpg",
    alt: "Wein wird eingeschenkt",
    span: "",
  },
  {
    video: "/videos/atmo-4.mp4",
    poster: "/images/pizza-sharing.jpg",
    alt: "Pizza wird geteilt",
    span: "md:col-span-2",
  },
  {
    video: "/videos/atmo-5.mp4",
    poster: "/images/espresso.jpg",
    alt: "Espresso",
    span: "",
  },
  {
    video: "/videos/atmo-6.mp4",
    poster: "/images/pizza-beer.jpg",
    alt: "Pizza und Birra Moretti",
    span: "",
  },
];

export default function Atmosphere() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section
      id="atmosphaere"
      ref={ref}
      className="relative mx-auto max-w-7xl px-6 py-28 md:px-8 md:py-40"
    >
      <Reveal className="text-center">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.4em] text-gold">
          L&apos;Atmosfera
        </p>
        <h2 className="font-serif text-4xl text-cream md:text-6xl">
          Ein Abend wie <em className="gold-text">in Italien</em>
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-cream-dim">
          Warmes Licht, Ofenknistern, Gespräche und Gelächter — schwer zu
          beschreiben, leicht zu erleben.
        </p>
      </Reveal>

      <motion.div
        style={reduced ? {} : { y }}
        className="mt-16 grid auto-rows-[200px] grid-cols-2 gap-3 md:auto-rows-[240px] md:grid-cols-4 md:gap-4"
      >
        {TILES.map((t, i) => (
          <Reveal key={t.poster} delay={i * 0.08} className={t.span}>
            <div className="group relative h-full overflow-hidden rounded-xl">
              <ScrollVideo
                src={t.video}
                poster={t.poster}
                alt={t.alt}
                className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-20" />
            </div>
          </Reveal>
        ))}
      </motion.div>
    </section>
  );
}
