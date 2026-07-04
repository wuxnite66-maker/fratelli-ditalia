import { Resend } from "resend";
import { SITE } from "@/data/site";

// Lazy init: erst zur Runtime, nicht beim Build
let resendInstance: Resend | null = null;
const getResend = () => {
  if (!resendInstance) {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error("RESEND_API_KEY not set — check Vercel Environment Variables");
    resendInstance = new Resend(key);
  }
  return resendInstance;
};

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Baut einen Wanduhr-Zeitstempel (Europe/Vienna) im Kalenderformat
 * YYYYMMDDTHHMMSS. Reine Komponenten-Arithmetik — unabhängig von der
 * Server-Zeitzone, da wir im selben Bezugssystem schreiben und lesen.
 */
function calStamp(dateISO: string, time: string, addHours = 0): string {
  const [h, m] = time.split(":").map(Number);
  const d = new Date(`${dateISO}T${pad(h)}:${pad(m)}:00`);
  d.setHours(d.getHours() + addHours);
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(
    d.getHours()
  )}${pad(d.getMinutes())}00`;
}

type Reservation = {
  name: string;
  phone: string;
  date: string; // YYYY-MM-DD
  dateNice: string;
  time: string; // HH:MM
  guests: string;
};

/** Ein-Klick-Link: Termin in Google Kalender übernehmen. */
function googleCalendarLink(r: Reservation, start: string, end: string): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `🍕 Reservierung: ${r.name} (${r.guests === "9+" ? "Gruppe 9+" : r.guests + " Pers."})`,
    dates: `${start}/${end}`,
    ctz: "Europe/Vienna",
    details: `Gast: ${r.name}\nTelefon: ${r.phone}\nPersonen: ${r.guests}\n\nAngefragt über die Website — bitte telefonisch bestätigen.`,
    location: `Fratelli d'Italia, ${SITE.address}`,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

/** ICS-Datei (Anhang) — importierbar in Google/Apple/Outlook-Kalender. */
function buildIcs(r: Reservation, start: string, end: string): string {
  const now = new Date();
  const stamp = `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(
    now.getUTCDate()
  )}T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}Z`;
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Fratelli d Italia//Reservierung//DE",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:res-${start}-${r.phone.replace(/\D/g, "")}@fratelli-ditalia`,
    `DTSTAMP:${stamp}`,
    `DTSTART;TZID=Europe/Vienna:${start}`,
    `DTEND;TZID=Europe/Vienna:${end}`,
    `SUMMARY:🍕 Reservierung: ${r.name} (${r.guests} Pers.)`,
    `DESCRIPTION:Gast: ${r.name}\\nTelefon: ${r.phone}\\nPersonen: ${r.guests}\\n\\nAngefragt über die Website — bitte telefonisch bestätigen.`,
    `LOCATION:Fratelli d'Italia\\, ${SITE.address}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<Reservation>;
    const { name, phone, date, dateNice, time, guests } = body;

    if (!name || !phone || !dateNice || !time || !guests) {
      return Response.json({ error: "Fehlende Felder" }, { status: 400 });
    }

    // Kalenderdaten (Reservierung wird mit 2 Stunden geblockt)
    const r: Reservation = { name, phone, date: date ?? "", dateNice, time, guests };
    const hasDate = /^\d{4}-\d{2}-\d{2}$/.test(r.date);
    const start = hasDate ? calStamp(r.date, time) : "";
    const end = hasDate ? calStamp(r.date, time, 2) : "";

    // Optional: echter Auto-Eintrag in den Google Kalender über ein
    // Apps-Script-Webhook (läuft unter dem Google-Konto des Betreibers).
    let calendarSynced = false;
    const webhook = process.env.GOOGLE_CALENDAR_WEBHOOK;
    if (webhook && hasDate) {
      try {
        const res = await fetch(webhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: r.name,
            phone: r.phone,
            date: r.date,
            time: r.time,
            guests: r.guests,
            durationHours: 2,
          }),
        });
        calendarSynced = res.ok;
      } catch {
        calendarSynced = false;
      }
    }

    const calButton =
      hasDate && !calendarSynced
        ? `<p style="margin:24px 0;"><a href="${googleCalendarLink(r, start, end)}"
             style="background:#c9a961;color:#0b0a08;padding:12px 22px;border-radius:8px;
             text-decoration:none;font-weight:bold;">📅 In Google Kalender eintragen</a></p>`
        : "";
    const syncedNote = calendarSynced
      ? `<p style="color:#2e7d74;font-weight:bold;">✅ Bereits automatisch im Google Kalender eingetragen.</p>`
      : "";

    const result = await getResend().emails.send({
      from: "Fratelli d'Italia <onboarding@resend.dev>",
      to: process.env.RESERVATION_EMAIL || "jinmarco17@gmail.com",
      subject: `🍕 Reservierung: ${dateNice}, ${time} Uhr — ${name}`,
      html: `
        <h2>Neue Reservierungsanfrage</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Telefon:</strong> ${phone}</p>
        <p><strong>Datum:</strong> ${dateNice}</p>
        <p><strong>Uhrzeit:</strong> ${time} Uhr</p>
        <p><strong>Personen:</strong> ${guests === "9+" ? "Gruppe (mehr als 8)" : guests}</p>
        ${syncedNote}
        ${calButton}
        <hr />
        <p>👉 <strong>Nächster Schritt:</strong> Rufen Sie den Gast unter <strong>${phone}</strong> an und bestätigen Sie den Tisch.</p>
      `,
      attachments: hasDate
        ? [
            {
              filename: "reservierung.ics",
              content: Buffer.from(buildIcs(r, start, end)).toString("base64"),
            },
          ]
        : undefined,
    });

    if (result.error) {
      return Response.json({ error: result.error.message }, { status: 500 });
    }

    return Response.json({ success: true, id: result.data?.id, calendarSynced });
  } catch {
    return Response.json({ error: "Fehler beim Versand" }, { status: 500 });
  }
}
