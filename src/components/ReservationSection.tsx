"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HOURS, SITE } from "@/data/site";
import Reveal from "./Reveal";

/**
 * Reservierung mit Next.js API-Route + Resend:
 * Formular validiert gegen echte Öffnungszeiten, schickt per POST an
 * /api/reservations, die Route versendet direkt per E-Mail via Resend.
 * Keine Activation, kein Spam-Schutz, einfach weg.
 */

const toMin = (s: string) => {
  const [h, m] = s.split(":").map(Number);
  return h * 60 + m;
};
const fmtMin = (m: number) =>
  `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

function slotsForDate(dateStr: string): string[] {
  if (!dateStr) return [];
  const day = new Date(dateStr + "T12:00:00").getDay();
  const info = HOURS.find((h) => h.day === day);
  if (!info?.slots) return [];
  const out: string[] = [];
  for (const s of info.slots) {
    // letzte Reservierung 60 min vor Küchenschluss
    for (let m = toMin(s.open); m <= toMin(s.close) - 60; m += 30) {
      out.push(fmtMin(m));
    }
  }
  return out;
}

function dayLabel(dateStr: string): string {
  const day = new Date(dateStr + "T12:00:00").getDay();
  return HOURS.find((h) => h.day === day)?.label ?? "";
}

export default function ReservationSection() {
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState("2");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(false);
  const [customerNotified, setCustomerNotified] = useState(false);

  const slots = useMemo(() => slotsForDate(date), [date]);
  const closedDay = date !== "" && slots.length === 0;
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const valid =
    date &&
    time &&
    name.trim().length >= 2 &&
    emailValid &&
    !closedDay;

  const dateNice = date
    ? new Date(date + "T12:00:00").toLocaleDateString("de-AT", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    : "";

  const submit = async () => {
    setSending(true);
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          date, // ISO (YYYY-MM-DD) — für Kalender-Eintrag
          dateNice,
          time,
          guests,
          notes: notes.trim(),
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json().catch(() => ({}));
      setCustomerNotified(data?.customerNotified === true);
      setSendError(false);
    } catch {
      setSendError(true);
    }
    setSending(false);
    setDone(true);
  };

  return (
    <section
      id="reservieren"
      className="relative overflow-hidden border-y border-gold/20 py-24 md:py-32"
    >
      {/* warm highlight background — die Sektion soll auffallen */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(201,169,97,0.14),transparent_60%)]" />
      <div className="absolute inset-0 bg-ink-soft/80" />

      <div className="relative mx-auto max-w-3xl px-6 md:px-8">
        <Reveal className="text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.4em] text-gold">
            Prenota un Tavolo
          </p>
          <h2 className="font-serif text-4xl text-cream md:text-6xl">
            Tisch <em className="gold-text">reservieren</em>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-cream-dim">
            In 30 Sekunden angefragt — Sie erhalten sofort eine Bestätigung
            per E-Mail. Kostenlos &amp; unverbindlich.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="glass-strong mt-12 rounded-2xl p-6 md:p-10">
            <AnimatePresence initial={false}>
              {!done ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (valid && !sending) submit();
                  }}
                  className="grid gap-5 md:grid-cols-2"
                >
                  <div>
                    <label
                      htmlFor="res-date"
                      className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-gold-light"
                    >
                      Datum *
                    </label>
                    <input
                      id="res-date"
                      type="date"
                      required
                      min={today}
                      value={date}
                      onChange={(e) => {
                        setDate(e.target.value);
                        setTime("");
                      }}
                      className="min-h-12 w-full rounded-lg border border-gold/25 bg-ink px-4 text-cream focus:border-gold/70 focus:outline-none [color-scheme:dark]"
                    />
                    {closedDay && (
                      <p className="mt-2 text-sm text-[#e0776e]" role="alert">
                        {dayLabel(date)} ist leider Ruhetag — geöffnet
                        Mi–Sa.
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="res-time"
                      className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-gold-light"
                    >
                      Uhrzeit *
                    </label>
                    <select
                      id="res-time"
                      required
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      disabled={!date || closedDay}
                      className="min-h-12 w-full rounded-lg border border-gold/25 bg-ink px-4 text-cream focus:border-gold/70 focus:outline-none disabled:opacity-40"
                    >
                      <option value="">
                        {date ? "Uhrzeit wählen …" : "Zuerst Datum wählen"}
                      </option>
                      {slots.map((s) => (
                        <option key={s} value={s}>
                          {s} Uhr
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="res-guests"
                      className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-gold-light"
                    >
                      Personen *
                    </label>
                    <select
                      id="res-guests"
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      className="min-h-12 w-full rounded-lg border border-gold/25 bg-ink px-4 text-cream focus:border-gold/70 focus:outline-none"
                    >
                      {["1", "2", "3", "4", "5", "6", "7", "8"].map((g) => (
                        <option key={g} value={g}>
                          {g} {g === "1" ? "Person" : "Personen"}
                        </option>
                      ))}
                      <option value="9+">Mehr als 8 (Gruppe)</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="res-name"
                      className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-gold-light"
                    >
                      Name *
                    </label>
                    <input
                      id="res-name"
                      type="text"
                      required
                      minLength={2}
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ihr Name"
                      className="min-h-12 w-full rounded-lg border border-gold/25 bg-ink px-4 text-cream placeholder:text-cream-dim/40 focus:border-gold/70 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="res-email"
                      className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-gold-light"
                    >
                      E-Mail *
                    </label>
                    <input
                      id="res-email"
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ihre@email.at"
                      className="min-h-12 w-full rounded-lg border border-gold/25 bg-ink px-4 text-cream placeholder:text-cream-dim/40 focus:border-gold/70 focus:outline-none"
                    />
                    <p className="mt-1.5 text-xs text-cream-dim/60">
                      Sie erhalten sofort eine Bestätigung per E-Mail.
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <label
                      htmlFor="res-notes"
                      className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-gold-light"
                    >
                      Anmerkungen <span className="text-cream-dim/50">(optional)</span>
                    </label>
                    <textarea
                      id="res-notes"
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="z. B. Allergien, Kinderstuhl, Tisch am Fenster, besonderer Anlass …"
                      className="w-full resize-none rounded-lg border border-gold/25 bg-ink px-4 py-3 text-cream placeholder:text-cream-dim/40 focus:border-gold/70 focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <button
                      type="submit"
                      disabled={!valid || sending}
                      className="btn-gold w-full rounded-full px-8 py-4 text-sm font-bold uppercase tracking-widest disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {sending ? "Wird gesendet …" : "Reservierung anfragen"}
                    </button>
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  key="confirm"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                  role="status"
                >
                  <p className="font-serif text-3xl italic text-gold-light">
                    Perfetto, {name.trim()}!
                  </p>
                  <div className="mx-auto mt-6 max-w-sm rounded-xl border border-gold/25 bg-ink/60 p-5 text-left">
                    <p className="text-sm text-cream-dim">Ihre Anfrage:</p>
                    <p className="mt-2 font-serif text-xl text-cream">
                      {dateNice} · {time} Uhr
                    </p>
                    <p className="text-cream-dim">
                      {guests === "9+" ? "Gruppe (9+)" : `${guests} ${guests === "1" ? "Person" : "Personen"}`}
                      {" · "}✉ {email.trim()}
                    </p>
                  </div>
                  {!sendError ? (
                    <>
                      <p className="mx-auto mt-6 max-w-sm text-cream-dim">
                        <strong className="text-cream">
                          Vielen Dank für Ihre Reservierung!
                        </strong>{" "}
                        {customerNotified ? (
                          <>
                            Eine Bestätigung mit allen Details ist unterwegs an{" "}
                            <span className="text-gold-light">{email.trim()}</span>.
                            Wir freuen uns auf Ihren Besuch.
                          </>
                        ) : (
                          <>Wir freuen uns auf Ihren Besuch.</>
                        )}
                      </p>
                      <a
                        href={`tel:${SITE.phoneIntl}`}
                        className="btn-ghost mt-5 inline-block rounded-full px-10 py-4 text-base font-semibold tracking-widest"
                      >
                        ☎ {SITE.phone}
                      </a>
                    </>
                  ) : (
                    <>
                      <p className="mx-auto mt-6 max-w-sm text-cream-dim" role="alert">
                        Die Online-Übertragung hat leider{" "}
                        <strong className="text-cream">nicht geklappt</strong>.
                        Ein Anruf (30 Sekunden) und der Chef hält Ihren Tisch
                        frei:
                      </p>
                      <a
                        href={`tel:${SITE.phoneIntl}`}
                        className="btn-gold mt-5 inline-block rounded-full px-10 py-4 text-base font-bold tracking-widest"
                      >
                        ☎ {SITE.phone} — jetzt reservieren
                      </a>
                    </>
                  )}
                  <div className="mt-6">
                    <button
                      onClick={() => setDone(false)}
                      className="text-sm text-cream-dim underline-offset-4 hover:text-gold-light hover:underline"
                    >
                      Angaben ändern
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
