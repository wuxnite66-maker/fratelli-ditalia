"use client";

import Reveal from "./Reveal";
import TiltCard from "./TiltCard";

const DISHES = [
  {
    name: "Pizza Fratelli",
    tag: "Spezialität des Hauses",
    desc: "Das Aushängeschild — großzügig belegt, gehütetes Rezept des Chefs.",
    img: "/images/hero-pizza.jpg",
    price: "14,50",
  },
  {
    name: "Pizza Ricardo",
    tag: "Nach Belieben des Chefs",
    desc: "Jeden Tag anders, jeden Tag gut. Vertrauen Sie dem Mann am Ofen.",
    img: "/images/pizza-burrata.jpg",
    price: "14,90",
  },
  {
    name: "Quattro Stagioni",
    tag: "Der Klassiker",
    desc: "Vier Jahreszeiten auf traumhaft aufgegangenem Teig.",
    img: "/images/pizza-rustic.jpg",
    price: "12,90",
  },
  {
    name: "Tiramisu della Casa",
    tag: "Das süße Finale",
    desc: "Hausgemacht: Mascarpone, Espresso und ein Hauch Amore.",
    img: "/images/tiramisu.jpg",
    price: "6,50",
  },
];

export default function SignatureDishes() {
  return (
    <section
      id="signature"
      className="relative mx-auto max-w-7xl px-6 py-28 md:px-8 md:py-40"
    >
      <Reveal className="text-center">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.4em] text-gold">
          Le Nostre Firme
        </p>
        <h2 className="font-serif text-4xl text-cream md:text-6xl">
          Signature-<em className="gold-text">Gerichte</em>
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-cream-dim">
          Was Gäste immer wieder bestellen — und wovon sie ihren Freunden
          erzählen.
        </p>
      </Reveal>

      <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {DISHES.map((d, i) => (
          <Reveal key={d.name} delay={i * 0.1}>
            <TiltCard className="group h-full">
              <article className="glass relative h-full overflow-hidden rounded-xl">
                <div className="relative h-56 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={d.img}
                    alt={d.name}
                    data-food
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  {/* cheese-melt glow on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 h-24 translate-y-full bg-gradient-to-t from-[#c4572f66] to-transparent transition-transform duration-700 ease-out group-hover:translate-y-0" />
                </div>
                <div className="card-layer relative p-6">
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold">
                    {d.tag}
                  </p>
                  <h3 className="mt-2 font-serif text-2xl italic text-cream">
                    {d.name}
                  </h3>
                  <p className="mt-3 min-h-12 text-sm leading-relaxed text-cream-dim">
                    {d.desc}
                  </p>
                  <p className="mt-4 font-serif text-xl text-gold-light">
                    € {d.price}
                  </p>
                </div>
              </article>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
