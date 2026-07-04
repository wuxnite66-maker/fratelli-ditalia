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
  email: string;
  date: string; // YYYY-MM-DD
  dateNice: string;
  time: string; // HH:MM
  guests: string;
  notes?: string;
};

/** Personenzahl schön formatiert. */
const guestsNice = (g: string) =>
  g === "9+"
    ? "Gruppe (mehr als 8 Personen)"
    : `${g} ${g === "1" ? "Person" : "Personen"}`;

/** Anmerkungen als Zeile für Kalender-Beschreibungen (leer → weggelassen). */
const notesLine = (r: Reservation, nl: string) =>
  r.notes ? `${nl}Anmerkungen: ${r.notes}` : "";

/** Ein-Klick-Link: Termin in Google Kalender übernehmen. */
function googleCalendarLink(r: Reservation, start: string, end: string): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `🍕 Reservierung: ${r.name} (${r.guests === "9+" ? "Gruppe 9+" : r.guests + " Pers."})`,
    dates: `${start}/${end}`,
    ctz: "Europe/Vienna",
    details: `Gast: ${r.name}\nE-Mail: ${r.email}\nPersonen: ${r.guests}${notesLine(r, "\n")}\n\nAngefragt über die Website — bitte per E-Mail bestätigen.`,
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
    `UID:res-${start}-${r.email.replace(/[^a-z0-9]/gi, "")}@fratelli-ditalia`,
    `DTSTAMP:${stamp}`,
    `DTSTART;TZID=Europe/Vienna:${start}`,
    `DTEND;TZID=Europe/Vienna:${end}`,
    `SUMMARY:🍕 Reservierung: ${r.name} (${r.guests} Pers.)`,
    `DESCRIPTION:Gast: ${r.name}\\nE-Mail: ${r.email}\\nPersonen: ${r.guests}${notesLine(r, "\\n")}\\n\\nAngefragt über die Website — bitte per E-Mail bestätigen.`,
    `LOCATION:Fratelli d'Italia\\, ${SITE.address}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

/** Bestätigungs-E-Mail an den Gast (schön gestaltet, mit allen Infos). */
function guestConfirmationHtml(r: Reservation): string {
  const row = (label: string, value: string) =>
    `<tr>
       <td style="padding:8px 0;color:#8a8074;font-size:14px;">${label}</td>
       <td style="padding:8px 0;color:#2a2620;font-weight:bold;text-align:right;">${value}</td>
     </tr>`;
  return `
  <div style="font-family:Georgia,'Times New Roman',serif;max-width:520px;margin:0 auto;background:#fffdf8;border:1px solid #ecd9a8;border-radius:14px;overflow:hidden;">
    <div style="background:linear-gradient(120deg,#9a7b3f,#c9a961);padding:26px 28px;">
      <p style="margin:0;color:#0b0a08;font-size:12px;letter-spacing:3px;text-transform:uppercase;">Fratelli d'Italia · Caffè ~ Pizza</p>
      <h1 style="margin:6px 0 0;color:#0b0a08;font-size:26px;">Grazie, ${r.name}!</h1>
    </div>
    <div style="padding:28px;">
      <p style="color:#2a2620;font-size:16px;line-height:1.6;margin:0 0 18px;">
        Ihre Reservierung ist bei uns eingegangen — wir freuen uns sehr auf Ihren Besuch.
      </p>
      <table style="width:100%;border-collapse:collapse;border-top:1px solid #ecd9a8;border-bottom:1px solid #ecd9a8;margin:8px 0 20px;">
        ${row("Datum", r.dateNice)}
        ${row("Uhrzeit", r.time + " Uhr")}
        ${row("Personen", guestsNice(r.guests))}
        ${r.notes ? row("Anmerkungen", r.notes) : ""}
      </table>
      <div style="background:#faf4e6;border-radius:10px;padding:16px 18px;color:#2a2620;font-size:14px;line-height:1.6;">
        📍 <strong>Fratelli d'Italia</strong><br/>
        ${SITE.address}<br/>
        ☎ ${SITE.phone}
      </div>
      <p style="color:#8a8074;font-size:13px;line-height:1.6;margin:20px 0 0;">
        Müssen Sie etwas ändern oder absagen? Antworten Sie einfach auf diese
        E-Mail oder rufen Sie uns kurz an — wir kümmern uns darum.
      </p>
      <p style="color:#b8ad95;font-size:12px;margin:14px 0 0;">
        A presto! Ihr Team vom Fratelli d'Italia
      </p>
    </div>
  </div>`;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<Reservation>;
    const { name, email, date, dateNice, time, guests, notes } = body;

    if (!name || !email || !dateNice || !time || !guests) {
      return Response.json({ error: "Fehlende Felder" }, { status: 400 });
    }

    // Kalenderdaten (Reservierung wird mit 2 Stunden geblockt)
    const r: Reservation = {
      name,
      email,
      date: date ?? "",
      dateNice,
      time,
      guests,
      notes: notes?.trim() || undefined,
    };
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
            email: r.email,
            date: r.date,
            time: r.time,
            guests: r.guests,
            notes: r.notes ?? "",
            durationHours: 2,
          }),
        });
        // Apps Script antwortet auch bei internen Fehlern mit HTTP 200 —
        // daher den Body prüfen (erwartet { ok: true }).
        if (res.ok) {
          const text = await res.text();
          try {
            calendarSynced = JSON.parse(text)?.ok === true;
          } catch {
            // Kein JSON-Body → als Fehlschlag werten (Button als Fallback)
            calendarSynced = false;
          }
        }
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

    const from =
      process.env.RESERVATION_FROM || "Fratelli d'Italia <onboarding@resend.dev>";
    const inbox = process.env.RESERVATION_EMAIL || "jinmarco17@gmail.com";
    const icsAttachment = hasDate
      ? [
          {
            filename: "reservierung.ics",
            content: Buffer.from(buildIcs(r, start, end)).toString("base64"),
          },
        ]
      : undefined;

    // 1) Benachrichtigung an das Restaurant (kritisch). reply-to = Gast,
    //    damit das Team direkt aus dem Postfach antworten/bestätigen kann.
    const result = await getResend().emails.send({
      from,
      to: inbox,
      replyTo: r.email,
      subject: `🍕 Reservierung: ${dateNice}, ${time} Uhr — ${name}`,
      html: `
        <h2>Neue Reservierungsanfrage</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>E-Mail:</strong> ${email}</p>
        <p><strong>Datum:</strong> ${dateNice}</p>
        <p><strong>Uhrzeit:</strong> ${time} Uhr</p>
        <p><strong>Personen:</strong> ${guestsNice(guests)}</p>
        ${r.notes ? `<p><strong>Anmerkungen:</strong> ${r.notes}</p>` : ""}
        ${syncedNote}
        ${calButton}
        <hr />
        <p>👉 <strong>Nächster Schritt:</strong> Antworten Sie einfach auf diese E-Mail (geht direkt an <strong>${email}</strong>), um dem Gast zu bestätigen.</p>
      `,
      attachments: icsAttachment,
    });

    if (result.error) {
      return Response.json({ error: result.error.message }, { status: 500 });
    }

    // 2) Bestätigung an den Gast (best-effort). Scheitert im Resend-Testmodus
    //    ohne verifizierte Domain — soll die Reservierung aber nicht abbrechen.
    let customerNotified = false;
    try {
      const guestMail = await getResend().emails.send({
        from,
        to: r.email,
        replyTo: inbox,
        subject: `Ihre Reservierung bei Fratelli d'Italia — ${dateNice}, ${time} Uhr`,
        html: guestConfirmationHtml(r),
        attachments: icsAttachment,
      });
      customerNotified = !guestMail.error;
    } catch {
      customerNotified = false;
    }

    return Response.json({
      success: true,
      id: result.data?.id,
      calendarSynced,
      customerNotified,
    });
  } catch {
    return Response.json({ error: "Fehler beim Versand" }, { status: 500 });
  }
}
