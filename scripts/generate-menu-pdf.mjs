// Generates the redesigned luxury menu PDF from the menu data.
// Run: node scripts/generate-menu-pdf.mjs
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { writeFileSync } from "node:fs";

// --- palette (mirrors the site design system) ---
const CREAM = rgb(0.96, 0.92, 0.85);
const INK = rgb(0.09, 0.08, 0.06);
const GOLD = rgb(0.62, 0.51, 0.3);
const TEAL = rgb(0.18, 0.49, 0.45);
const RED = rgb(0.77, 0.22, 0.18);
const DIM = rgb(0.35, 0.31, 0.25);

// --- menu data (keep in sync with src/data/menu.ts) ---
const MENU = [
  {
    label: "Antipasti",
    subtitle: "Der Anfang von etwas Schönem",
    items: [
      ["Antipasti Misti", "Gegrilltes Gemüse, Oliven, Feinkost & Pizzabrot", "12,90", "★"],
      ["Pizzabrot", "Aus dem Ofen, mit Knoblauch & Olivenöl", "4,50", ""],
      ["Bruschetta", "Geröstetes Brot, marinierte Tomaten, Basilikum", "6,90", ""],
      ["Insalata Caprese", "Tomaten, Mozzarella, Basilikum, Olivenöl", "9,90", ""],
    ],
  },
  {
    label: "Pizze",
    subtitle: "Mit Pizzasauce (Tomaten), Mozzarella und Oregano",
    items: [
      ["Margherita", "Tomaten, Mozzarella, Basilikum — die Königin", "9,50", "★"],
      ["Cardinale", "Schinken", "11,50", ""],
      ["Salamino", "Pikante Salami", "11,90", "★"],
      ["Funghi", "Frische Champignons", "11,50", ""],
      ["Prosciutto e Funghi", "Schinken & Champignons", "12,50", ""],
      ["Quattro Stagioni", "Schinken, Champignons, Artischocken, Oliven", "12,90", "★"],
      ["Diavolo", "Scharfe Salami, Peperoni, Chili", "12,90", ""],
      ["Quattro Formaggi", "Vier italienische Käsesorten", "13,50", ""],
      ["Tonno e Cipolla", "Thunfisch & rote Zwiebeln", "12,90", ""],
      ["Vegetariana", "Zucchini, Melanzani, Paprika", "12,50", "★"],
      ["Frutti di Mare", "Meeresfrüchte, Knoblauch, Petersilie", "13,90", ""],
      ["Fratelli", "Die Spezialität des Hauses", "14,50", "★C"],
      ["Ricardo", "Nach Belieben des Chefs", "14,90", "C"],
    ],
  },
  {
    label: "Pasta & Gnocchi",
    subtitle: "Hausgemachte Saucen, al dente",
    items: [
      ["Spaghetti Napoli", "Fruchtige Tomatensauce, Basilikum", "9,90", ""],
      ["Spaghetti Bolognese", "Klassisches Ragù, lange geschmort", "11,50", ""],
      ["Spaghetti Carbonara", "Guanciale, Ei, Pecorino — wie in Rom", "11,90", ""],
      ["Penne Arrabbiata", "Tomaten, Knoblauch, Chili", "10,90", ""],
      ["Penne al Salmone", "Lachs, Rahmsauce, Dill", "13,50", ""],
      ["Lasagne al Forno", "Aus dem Ofen, mit Ragù & Béchamel", "12,50", ""],
      ["Gnocchi Quattro Formaggi", "In cremiger Vier-Käse-Sauce", "12,50", ""],
      ["Gnocchi al Pomodoro", "Tomaten, Basilikum, Parmesan", "11,50", ""],
    ],
  },
  {
    label: "Insalate",
    subtitle: "Frisch & knackig",
    items: [
      ["Insalata Mista", "Bunter Beilagensalat", "5,90", ""],
      ["Insalata della Casa", "Mit Schinken, Käse & Ei", "9,90", ""],
    ],
  },
  {
    label: "Dolci & Caffè",
    subtitle: "Das süße Finale",
    items: [
      ["Tiramisu della Casa", "Mascarpone, Espresso, Amore", "6,50", "★"],
      ["Panna Cotta", "Mit Beerenspiegel", "5,90", "★"],
      ["Espresso", "Kurz, stark, italienisch", "2,80", "★"],
      ["Cappuccino", "Samtiger Milchschaum", "3,80", ""],
    ],
  },
  {
    label: "Dalla Bar",
    subtitle: "Vino, Birra & Aperitivo",
    items: [
      ["Birra Moretti 0,3 l", "Steht für sich selbst", "3,90", "★"],
      ["Vino della Casa 1/8 l", "Rot oder weiß", "3,50", ""],
      ["Aperol Spritz", "Der Klang des Sommers", "5,90", ""],
      ["Acqua Frizzante 0,5 l", "Prickelndes Mineralwasser", "2,90", ""],
    ],
  },
];

const A4 = [595.28, 841.89];
const M = 56; // margin

const doc = await PDFDocument.create();
const times = await doc.embedFont(StandardFonts.TimesRoman);
const timesIt = await doc.embedFont(StandardFonts.TimesRomanItalic);
const timesBold = await doc.embedFont(StandardFonts.TimesRomanBold);
const helv = await doc.embedFont(StandardFonts.Helvetica);
const helvBold = await doc.embedFont(StandardFonts.HelveticaBold);

let page = doc.addPage(A4);
let y = 0;

function bg() {
  page.drawRectangle({ x: 0, y: 0, width: A4[0], height: A4[1], color: CREAM });
  // double border frame
  page.drawRectangle({
    x: 18, y: 18, width: A4[0] - 36, height: A4[1] - 36,
    borderColor: GOLD, borderWidth: 1.5,
  });
  page.drawRectangle({
    x: 24, y: 24, width: A4[0] - 48, height: A4[1] - 48,
    borderColor: GOLD, borderWidth: 0.5,
  });
}

function ornament(cy) {
  const cx = A4[0] / 2;
  page.drawLine({ start: { x: cx - 70, y: cy }, end: { x: cx - 12, y: cy }, color: GOLD, thickness: 0.7 });
  page.drawLine({ start: { x: cx + 12, y: cy }, end: { x: cx + 70, y: cy }, color: GOLD, thickness: 0.7 });
  // small diamond ornament (WinAnsi-safe)
  page.drawSquare({
    x: cx - 3, y: cy - 3, size: 6,
    color: GOLD, rotate: { type: "degrees", angle: 45 },
  });
}

function newPage() {
  page = doc.addPage(A4);
  bg();
  y = A4[1] - 64;
}

function centered(text, size, font, color, dy) {
  const w = font.widthOfTextAtSize(text, size);
  page.drawText(text, { x: (A4[0] - w) / 2, y: dy, size, font, color });
}

// ---------- cover header (page 1) ----------
bg();
y = A4[1] - 110;

// vintage badge
const bw = 300, bh = 110;
page.drawRectangle({
  x: (A4[0] - bw) / 2, y: y - bh + 40, width: bw, height: bh,
  color: rgb(0.95, 0.82, 0.42), borderColor: TEAL, borderWidth: 2,
});
centered("Fratelli d'Italia", 34, timesIt, TEAL, y - 10);
centered("C A F F È  ~  P I Z Z A", 11, helvBold, RED, y - 40);
y -= bh + 26;

centered("SPEISEKARTE  ·  IL MENÙ", 12, helv, DIM, y);
y -= 16;
centered("Friedrichsgasse 8 · 2700 Wiener Neustadt · 02622 42220", 9, helv, DIM, y);
y -= 24;
ornament(y);
y -= 30;

// ---------- categories ----------
for (const cat of MENU) {
  const needed = 64 + cat.items.length * 34;
  if (y - Math.min(needed, 140) < 70) newPage();

  centered(cat.label, 24, timesIt, INK, y);
  y -= 16;
  centered(cat.subtitle, 9.5, timesIt, GOLD, y);
  y -= 8;
  ornament(y - 4);
  y -= 26;

  for (const [name, desc, price, tags] of cat.items) {
    if (y < 80) {
      newPage();
      centered(`${cat.label} (Fortsetzung)`, 14, timesIt, GOLD, y);
      y -= 28;
    }
    const nameSize = 12.5;
    let x = M + 8;
    page.drawText(name, { x, y, size: nameSize, font: timesBold, color: INK });
    x += timesBold.widthOfTextAtSize(name, nameSize) + 6;

    if (tags.includes("★")) {
      page.drawText("Beliebt", { x, y: y + 1.5, size: 7, font: helvBold, color: GOLD });
      x += helvBold.widthOfTextAtSize("Beliebt", 7) + 6;
    }
    if (tags.includes("C")) {
      page.drawText("Chef", { x, y: y + 1.5, size: 7, font: helvBold, color: RED });
      x += helvBold.widthOfTextAtSize("Chef", 7) + 6;
    }

    const priceStr = `€ ${price}`;
    const pw = timesBold.widthOfTextAtSize(priceStr, 12);
    page.drawText(priceStr, {
      x: A4[0] - M - 8 - pw, y, size: 12, font: timesBold, color: GOLD,
    });

    // dotted leader
    const dotsStart = x + 4;
    const dotsEnd = A4[0] - M - 20 - pw;
    for (let dx = dotsStart; dx < dotsEnd; dx += 7) {
      page.drawCircle({ x: dx, y: y + 2.5, size: 0.6, color: GOLD });
    }

    y -= 13;
    page.drawText(desc, { x: M + 8, y, size: 9, font: timesIt, color: DIM });
    y -= 21;
  }
  y -= 14;
}

// footer on last page
if (y < 110) newPage();
y = Math.max(y, 70);
ornament(y + 16);
centered("Alle Preise in Euro, inkl. MwSt. · Änderungen vorbehalten", 8, helv, DIM, y - 2);
centered("Grazie e arrivederci!", 12, timesIt, TEAL, y - 20);

const bytes = await doc.save();
writeFileSync("public/speisekarte-fratelli-ditalia.pdf", bytes);
console.log(`OK: public/speisekarte-fratelli-ditalia.pdf (${(bytes.length / 1024).toFixed(0)} KB, ${doc.getPageCount()} Seiten)`);
