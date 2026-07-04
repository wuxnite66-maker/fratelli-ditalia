/**
 * Fratelli d'Italia — Google-Kalender-Webhook
 *
 * Trägt Reservierungen von der Website automatisch in deinen
 * Google Kalender ein. Läuft als Google Apps Script unter DEINEM
 * Google-Konto — keine API-Keys, kein Google Cloud nötig.
 *
 * EINRICHTUNG (einmalig, ~3 Minuten):
 *  1. https://script.google.com öffnen (mit dem Google-Konto,
 *     dessen Kalender die Reservierungen bekommen soll)
 *  2. "Neues Projekt" → diesen gesamten Code einfügen (alles ersetzen)
 *  3. Oben rechts "Bereitstellen" → "Neue Bereitstellung"
 *     → Zahnrad: Typ "Web-App"
 *     → "Ausführen als": Ich
 *     → "Zugriff": Jeder
 *     → "Bereitstellen" und die Berechtigungen bestätigen
 *  4. Die angezeigte Web-App-URL kopieren (endet auf /exec)
 *  5. Diese URL in Vercel als Umgebungsvariable eintragen:
 *     GOOGLE_CALENDAR_WEBHOOK = https://script.google.com/macros/s/…/exec
 *     (und lokal in .env.local, wenn du lokal testen willst)
 *
 * Ab dann landet jede Reservierung automatisch im Kalender. ✅
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    // Start-/Endzeit bauen (Reservierung blockt standardmäßig 2 Stunden)
    var parts = data.date.split("-"); // "2026-07-05"
    var tparts = data.time.split(":"); // "19:00"
    var start = new Date(
      Number(parts[0]),
      Number(parts[1]) - 1,
      Number(parts[2]),
      Number(tparts[0]),
      Number(tparts[1])
    );
    var hours = data.durationHours || 2;
    var end = new Date(start.getTime() + hours * 60 * 60 * 1000);

    var title =
      "🍕 Reservierung: " + data.name + " (" + data.guests + " Pers.)";
    var description =
      "Gast: " + data.name +
      "\nE-Mail: " + (data.email || data.phone || "") +
      "\nPersonen: " + data.guests +
      (data.notes ? "\nAnmerkungen: " + data.notes : "") +
      "\n\nAngefragt über die Website — bitte per E-Mail bestätigen.";

    CalendarApp.getDefaultCalendar().createEvent(title, start, end, {
      description: description,
      location: "Fratelli d'Italia, Friedrichsgasse 8, 2700 Wiener Neustadt",
    });

    return ContentService.createTextOutput(
      JSON.stringify({ ok: true })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: String(err) })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
