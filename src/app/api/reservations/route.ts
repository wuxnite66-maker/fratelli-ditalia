import { Resend } from "resend";
import { SITE } from "@/data/site";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, dateNice, time, guests } = body;

    if (!name || !phone || !dateNice || !time || !guests) {
      return Response.json(
        { error: "Fehlende Felder" },
        { status: 400 }
      );
    }

    const result = await resend.emails.send({
      from: "Fratelli d'Italia <onboarding@resend.dev>",
      to: process.env.RESERVATION_EMAIL || "wuxnite66@gmail.com",
      subject: `🍕 Reservierung: ${dateNice}, ${time} Uhr — ${name}`,
      html: `
        <h2>Neue Reservierungsanfrage</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Telefon:</strong> ${phone}</p>
        <p><strong>Datum:</strong> ${dateNice}</p>
        <p><strong>Uhrzeit:</strong> ${time} Uhr</p>
        <p><strong>Personen:</strong> ${guests === "9+" ? "Gruppe (mehr als 8)" : guests}</p>
        <hr />
        <p>👉 <strong>Nächster Schritt:</strong> Rufen Sie den Gast unter <strong>${phone}</strong> an und bestätigen Sie den Tisch.</p>
      `,
    });

    if (result.error) {
      return Response.json({ error: result.error.message }, { status: 500 });
    }

    return Response.json({ success: true, id: result.data?.id });
  } catch (error) {
    return Response.json(
      { error: "Fehler beim Versand" },
      { status: 500 }
    );
  }
}
