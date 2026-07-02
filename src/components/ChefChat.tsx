"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MENU } from "@/data/menu";
import { HOURS, SITE } from "@/data/site";

type Msg = { from: "chef" | "user"; text: string };

/** Rule-based "Frag den Chef" — answers from real menu & hours data. */
function answer(q: string): string {
  const s = q.toLowerCase();

  if (/(öffnung|geöffnet|offen|zusperr|aufsperr|wann)/.test(s)) {
    const lines = HOURS.map(
      (h) =>
        `${h.label}: ${
          h.slots
            ? h.slots.map((x) => `${x.open}–${x.close}`).join(" & ")
            : "Ruhetag"
        }`
    ).join("\n");
    return `Ecco! Unsere Zeiten:\n${lines}\n\nA presto! 🍕`;
  }
  if (/(vegetarisch|vegan|fleischlos)/.test(s)) {
    const veg = MENU.flatMap((c) => c.items)
      .filter((i) => i.vegetarian)
      .slice(0, 6)
      .map((i) => i.name)
      .join(", ");
    return `Certo! Vegetarisch empfehle ich: ${veg}. Die Vegetariana mit Zucchini, Melanzani und Paprika ist molto amata!`;
  }
  if (/(beliebt|empfehl|empfiehl|beste|favorit|tipp|was soll)/.test(s)) {
    return `Ah, Sie fragen den Richtigen! Meine Fratelli (€ 14,50) ist die Spezialität des Hauses. Die Salamino und Quattro Stagioni lieben alle. Und danach? Tiramisu della casa. Fidati di me — vertrauen Sie mir!`;
  }
  if (/(scharf|pikant|diavolo)/.test(s)) {
    return `Piccante? La Diavolo! Scharfe Salami, Peperoni, Chili — die weckt die Lebensgeister. 🌶️`;
  }
  if (/(reservier|tisch|platz)/.test(s)) {
    return `Rufen Sie uns einfach an: ${SITE.phone} — ich halte Ihnen einen schönen Tisch frei. Prometto!`;
  }
  if (/(wo|adresse|find|anfahrt|standort)/.test(s)) {
    return `Sie finden uns in der ${SITE.address}. Emotional gesehen: direkt in Italien. 🇮🇹`;
  }
  if (/(wein|vino|bier|birra|trink|moretti)/.test(s)) {
    return `Birra Moretti steht für sich selbst, sagen meine Gäste. Und zum Essen empfehle ich unseren Vino della Casa — vom Chef persönlich ausgesucht.`;
  }
  if (/(preis|kost|teuer|günstig)/.test(s)) {
    return `Ehrliche Küche zu ehrlichen Preisen — die meisten Gerichte liegen zwischen 10 und 15 Euro. Qualität, die man schmeckt!`;
  }
  if (/(tiramisu|dessert|dolce|süß|nachspeise|panna)/.test(s)) {
    return `Il dolce! Unser Tiramisu della Casa ist hausgemacht — Mascarpone, Espresso, Amore. Panna Cotta gibt es auch. Beide? Warum nicht!`;
  }
  if (/(hallo|ciao|servus|hi|hey|grüß)/.test(s)) {
    return `Ciao, benvenuto! Was kann ich für Sie tun? Fragen Sie mich nach Empfehlungen, Öffnungszeiten oder unserer Karte!`;
  }
  return `Mamma mia, das beantworte ich Ihnen am liebsten persönlich! Rufen Sie an: ${SITE.phone} — oder fragen Sie mich nach Empfehlungen, vegetarischen Gerichten oder unseren Öffnungszeiten.`;
}

const SUGGESTIONS = [
  "Was empfiehlst du?",
  "Wann habt ihr offen?",
  "Was gibt's Vegetarisches?",
];

export default function ChefChat() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      from: "chef",
      text: "Ciao! Ich bin der Chef. 👨‍🍳 Fragen Sie mich alles — Pizza, Zeiten, Empfehlungen!",
    },
  ]);
  const [input, setInput] = useState("");
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bodyRef.current?.scrollTo({
      top: bodyRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [msgs, open]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t) return;
    setMsgs((m) => [...m, { from: "user", text: t }]);
    setInput("");
    setTimeout(() => {
      setMsgs((m) => [...m, { from: "chef", text: answer(t) }]);
    }, 600);
  };

  return (
    <>
      <motion.button
        onClick={() => setOpen(!open)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.8, duration: 0.8 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        aria-expanded={open}
        aria-label="Frag den Chef — Chat öffnen"
        className="btn-gold fixed bottom-6 right-6 z-[110] flex h-14 w-14 items-center justify-center rounded-full text-2xl shadow-2xl"
      >
        {open ? "×" : "👨‍🍳"}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="glass-strong fixed bottom-24 right-6 z-[110] flex max-h-[70vh] w-[min(380px,calc(100vw-3rem))] flex-col overflow-hidden rounded-2xl shadow-2xl"
            role="dialog"
            aria-label="Frag den Chef"
          >
            <div className="border-b border-gold/15 bg-ink-card px-5 py-4">
              <p className="font-serif text-xl italic text-gold-light">
                Frag den Chef
              </p>
              <p className="text-xs text-cream-dim">
                Antwortet sofort — mit italienischem Schmäh
              </p>
            </div>

            <div
              ref={bodyRef}
              className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
            >
              {msgs.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    m.from === "chef"
                      ? "rounded-bl-sm bg-ink-card text-cream"
                      : "ml-auto rounded-br-sm bg-gold text-ink"
                  }`}
                >
                  {m.text}
                </motion.div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 px-4 pb-2">
              {SUGGESTIONS.map((sug) => (
                <button
                  key={sug}
                  onClick={() => send(sug)}
                  className="rounded-full border border-gold/30 px-3 py-1.5 text-xs text-gold-light transition-colors hover:bg-gold/10"
                >
                  {sug}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex gap-2 border-t border-gold/15 p-3"
            >
              <label htmlFor="chef-input" className="sr-only">
                Ihre Frage an den Chef
              </label>
              <input
                id="chef-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ihre Frage …"
                className="min-h-11 flex-1 rounded-full border border-gold/20 bg-ink px-4 text-sm text-cream placeholder:text-cream-dim/50 focus:border-gold/60 focus:outline-none"
              />
              <button
                type="submit"
                className="btn-gold min-h-11 rounded-full px-5 text-sm font-bold"
              >
                Senden
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
