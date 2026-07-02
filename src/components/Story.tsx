"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import Reveal from "./Reveal";

export default function Story() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const yImg1 = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const yImg2 = useTransform(scrollYProgress, [0, 1], [140, -60]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-3, 3]);

  return (
    <section
      id="geschichte"
      ref={ref}
      className="relative mx-auto max-w-7xl px-6 py-28 md:px-8 md:py-40"
    >
      <div className="grid items-center gap-16 lg:grid-cols-2">
        {/* text */}
        <div>
          <Reveal>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.4em] text-gold">
              La Nostra Storia
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-serif text-4xl leading-tight text-cream md:text-6xl">
              Ein Stück Italien,
              <br />
              <em className="gold-text">mitten in der Stadt.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-8 text-lg leading-relaxed text-cream-dim">
              In der Friedrichsgasse 8 duftet es nach Ofen, Basilikum und
              gutem Leben. Hier wird nicht einfach Pizza gemacht — hier wird
              sie <em className="text-gold-light">zelebriert</em>: dünner
              Teig, der traumhaft aufgeht, großzügiger Belag und ein Chef,
              der den italienischen Schmäh so ernst nimmt wie seinen
              Espresso.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <p className="mt-5 text-lg leading-relaxed text-cream-dim">
              Jeder Gast ist Familie. Wer einmal hier war, kommt wieder —
              nicht nur wegen der Pizza, sondern wegen des Gefühls, für
              einen Abend in Italien gewesen zu sein.
            </p>
          </Reveal>
          <Reveal delay={0.4}>
            <div className="mt-10 flex items-center gap-8">
              <div>
                <p className="font-serif text-4xl text-gold-light">4,8 ★</p>
                <p className="mt-1 text-xs uppercase tracking-widest text-cream-dim">
                  Google-Bewertung
                </p>
              </div>
              <div className="h-12 w-px bg-gold/25" />
              <div>
                <p className="font-serif text-4xl text-gold-light">512+</p>
                <p className="mt-1 text-xs uppercase tracking-widest text-cream-dim">
                  Rezensionen
                </p>
              </div>
              <div className="hidden h-12 w-px bg-gold/25 sm:block" />
              <div className="hidden sm:block">
                <p className="font-serif text-4xl text-gold-light">∞</p>
                <p className="mt-1 text-xs uppercase tracking-widest text-cream-dim">
                  Amore
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* parallax collage */}
        <div className="relative h-[520px] md:h-[640px]" aria-hidden>
          <motion.div
            style={reduced ? {} : { y: yImg1, rotate }}
            className="absolute left-0 top-0 w-[70%] overflow-hidden rounded-lg shadow-2xl"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/pizza-burrata.jpg"
              alt=""
              data-food
              loading="lazy"
              className="aspect-[3/4] w-full object-cover"
            />
          </motion.div>
          <motion.div
            style={reduced ? {} : { y: yImg2 }}
            className="absolute bottom-0 right-0 w-[55%] overflow-hidden rounded-lg border-4 border-ink shadow-2xl"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/wine-pour.jpg"
              alt=""
              data-food
              loading="lazy"
              className="aspect-[3/4] w-full object-cover"
            />
          </motion.div>
          <div className="absolute -left-6 bottom-16 rounded-sm border-2 border-teal/70 bg-vintage-yellow px-5 py-3 shadow-xl md:bottom-24">
            <p className="font-serif text-xl italic font-semibold text-teal">
              „Come una volta"
            </p>
            <p className="text-[10px] font-bold tracking-[0.25em] text-vintage-red">
              WIE FRÜHER — WIE ZUHAUSE
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
