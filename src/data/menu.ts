// ============================================================
// SPEISEKARTE — Fratelli d'Italia
// ⚠️ WICHTIG: Die Preise sind PLATZHALTER (Foto der Karte war
// nicht lesbar). Bitte hier korrigieren — eine Stelle, gilt
// für Website UND generiertes PDF.
// ============================================================

export type MenuItem = {
  name: string;
  description: string;
  price: number;
  popular?: boolean; // "Beliebt" laut Google-Profil
  chef?: boolean; // Empfehlung des Chefs
  vegetarian?: boolean;
};

export type MenuCategory = {
  id: string;
  label: string;
  subtitle: string;
  note?: string;
  items: MenuItem[];
};

export const MENU: MenuCategory[] = [
  {
    id: "antipasti",
    label: "Antipasti",
    subtitle: "Der Anfang von etwas Schönem",
    items: [
      {
        name: "Antipasti Misti",
        description: "Gegrilltes Gemüse, Oliven, italienische Feinkost & Pizzabrot",
        price: 12.9,
        popular: true,
        vegetarian: true,
      },
      {
        name: "Pizzabrot",
        description: "Aus dem Ofen, mit Knoblauch & Olivenöl",
        price: 4.5,
        vegetarian: true,
      },
      {
        name: "Bruschetta",
        description: "Geröstetes Brot, marinierte Tomaten, Basilikum",
        price: 6.9,
        vegetarian: true,
      },
      {
        name: "Insalata Caprese",
        description: "Tomaten, Mozzarella, frisches Basilikum, Olivenöl",
        price: 9.9,
        vegetarian: true,
      },
    ],
  },
  {
    id: "pizze",
    label: "Pizze",
    subtitle: "Mit Pizzasauce (Tomaten), Mozzarella und Oregano",
    note: "Dünner Teig, großzügig belegt — im Ofen gebacken, mit Liebe serviert.",
    items: [
      {
        name: "Margherita",
        description: "Tomaten, Mozzarella, Basilikum — die Königin",
        price: 9.5,
        popular: true,
        vegetarian: true,
      },
      {
        name: "Cardinale",
        description: "Schinken",
        price: 11.5,
      },
      {
        name: "Salamino",
        description: "Pikante Salami",
        price: 11.9,
        popular: true,
      },
      {
        name: "Funghi",
        description: "Frische Champignons",
        price: 11.5,
        vegetarian: true,
      },
      {
        name: "Prosciutto e Funghi",
        description: "Schinken & Champignons",
        price: 12.5,
      },
      {
        name: "Quattro Stagioni",
        description: "Schinken, Champignons, Artischocken, Oliven",
        price: 12.9,
        popular: true,
      },
      {
        name: "Diavolo",
        description: "Scharfe Salami, Peperoni, Chili",
        price: 12.9,
      },
      {
        name: "Quattro Formaggi",
        description: "Vier italienische Käsesorten",
        price: 13.5,
        vegetarian: true,
      },
      {
        name: "Tonno e Cipolla",
        description: "Thunfisch & rote Zwiebeln",
        price: 12.9,
      },
      {
        name: "Vegetariana",
        description: "Zucchini, Melanzani, Paprika",
        price: 12.5,
        popular: true,
        vegetarian: true,
      },
      {
        name: "Frutti di Mare",
        description: "Meeresfrüchte, Knoblauch, Petersilie",
        price: 13.9,
      },
      {
        name: "Fratelli",
        description: "Die Spezialität des Hauses — fragen Sie nicht, vertrauen Sie",
        price: 14.5,
        popular: true,
        chef: true,
      },
      {
        name: "Ricardo",
        description: "Nach Belieben des Chefs — jeden Tag anders, jeden Tag gut",
        price: 14.9,
        chef: true,
      },
    ],
  },
  {
    id: "pasta",
    label: "Pasta & Gnocchi",
    subtitle: "Hausgemachte Saucen, al dente",
    items: [
      {
        name: "Spaghetti Napoli",
        description: "Fruchtige Tomatensauce, Basilikum",
        price: 9.9,
        vegetarian: true,
      },
      {
        name: "Spaghetti Bolognese",
        description: "Klassisches Ragù, lange geschmort",
        price: 11.5,
      },
      {
        name: "Spaghetti Carbonara",
        description: "Guanciale, Ei, Pecorino — ohne Sahne, wie in Rom",
        price: 11.9,
      },
      {
        name: "Penne Arrabbiata",
        description: "Tomaten, Knoblauch, Chili — zornig gut",
        price: 10.9,
        vegetarian: true,
      },
      {
        name: "Penne al Salmone",
        description: "Lachs, Rahmsauce, Dill",
        price: 13.5,
      },
      {
        name: "Lasagne al Forno",
        description: "Aus dem Ofen, mit Ragù & Béchamel",
        price: 12.5,
      },
      {
        name: "Gnocchi Quattro Formaggi",
        description: "In cremiger Vier-Käse-Sauce",
        price: 12.5,
        vegetarian: true,
      },
      {
        name: "Gnocchi al Pomodoro",
        description: "Tomaten, Basilikum, Parmesan",
        price: 11.5,
        vegetarian: true,
      },
    ],
  },
  {
    id: "insalate",
    label: "Insalate",
    subtitle: "Frisch & knackig",
    items: [
      {
        name: "Insalata Mista",
        description: "Bunter Beilagensalat",
        price: 5.9,
        vegetarian: true,
      },
      {
        name: "Insalata della Casa",
        description: "Großer Salat des Hauses mit Schinken, Käse & Ei",
        price: 9.9,
      },
    ],
  },
  {
    id: "dolci",
    label: "Dolci & Caffè",
    subtitle: "Das süße Finale",
    items: [
      {
        name: "Tiramisu della Casa",
        description: "Hausgemacht — Mascarpone, Espresso, Amore",
        price: 6.5,
        popular: true,
        vegetarian: true,
      },
      {
        name: "Panna Cotta",
        description: "Mit Beerenspiegel",
        price: 5.9,
        popular: true,
        vegetarian: true,
      },
      {
        name: "Espresso",
        description: "Kurz, stark, italienisch",
        price: 2.8,
        popular: true,
        vegetarian: true,
      },
      {
        name: "Cappuccino",
        description: "Samtiger Milchschaum",
        price: 3.8,
        vegetarian: true,
      },
    ],
  },
  {
    id: "bar",
    label: "Dalla Bar",
    subtitle: "Vino, Birra & Aperitivo",
    items: [
      {
        name: "Birra Moretti 0,3 l",
        description: "Steht für sich selbst",
        price: 3.9,
        popular: true,
      },
      {
        name: "Vino della Casa 1/8 l",
        description: "Rot oder weiß — vom Chef ausgesucht",
        price: 3.5,
      },
      {
        name: "Aperol Spritz",
        description: "Der Klang des Sommers",
        price: 5.9,
      },
      {
        name: "Acqua Frizzante 0,5 l",
        description: "Prickelndes Mineralwasser",
        price: 2.9,
      },
    ],
  },
];

export const formatPrice = (p: number) =>
  p.toFixed(2).replace(".", ",");
