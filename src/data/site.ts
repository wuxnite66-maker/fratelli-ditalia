export const SITE = {
  name: "Fratelli d'Italia",
  tagline: "Caffè ~ Pizza",
  address: "Friedrichsgasse 8, 2700 Wiener Neustadt",
  phone: "02622 42220",
  phoneIntl: "+43262242220",
  facebook: "https://www.facebook.com/",
  mapsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=Fratelli+d'Italia+Friedrichsgasse+8+2700+Wiener+Neustadt",
  // OpenStreetMap-Embed (rendert zuverlässig ohne Consent-Banner);
  // Koordinaten: Friedrichsgasse 8, Wiener Neustadt (Plus-Code R67R+GV)
  mapsEmbed:
    "https://www.openstreetmap.org/export/embed.html?bbox=16.2321%2C47.8078%2C16.2521%2C47.8198&layer=mapnik&marker=47.8138%2C16.2421",
  rating: 4.8,
  reviewCount: 512,
  priceRange: "€ 10–20",
};

// Öffnungszeiten (0 = Sonntag ... 6 = Samstag)
export type DayHours = { open: string; close: string }[] | null;

export const HOURS: { label: string; day: number; slots: DayHours }[] = [
  { label: "Montag", day: 1, slots: null },
  { label: "Dienstag", day: 2, slots: null },
  {
    label: "Mittwoch",
    day: 3,
    slots: [
      { open: "11:15", close: "14:15" },
      { open: "17:45", close: "22:30" },
    ],
  },
  {
    label: "Donnerstag",
    day: 4,
    slots: [
      { open: "11:15", close: "14:15" },
      { open: "17:45", close: "22:30" },
    ],
  },
  {
    label: "Freitag",
    day: 5,
    slots: [
      { open: "11:15", close: "14:15" },
      { open: "17:45", close: "22:30" },
    ],
  },
  {
    label: "Samstag",
    day: 6,
    slots: [
      { open: "11:15", close: "14:15" },
      { open: "17:45", close: "22:30" },
    ],
  },
  { label: "Sonntag", day: 0, slots: null },
];

export const REVIEWS = [
  {
    author: "Dani M.",
    badge: "Local Guide · 100 Rezensionen",
    time: "vor 8 Monaten",
    stars: 5,
    text: "Wirklich tolle Pizza! Super schnell serviert, schön dünn mit viel Belag. Der Chef hat uns super unterhalten — witzig, zuvorkommend, ein echter Italiener, dem seine Gäste wichtig sind. Dazu ein perfekt passender Rotwein.",
  },
  {
    author: "Stefan P.",
    badge: "Local Guide · 85 Rezensionen",
    time: "vor 3 Monaten",
    stars: 5,
    text: "Sehr nette Pizzeria mit italienischem Flair. Der Chef lässt den italienischen Schmäh laufen und das kommt recht gut an. Die Pizza hatte alles, was ich von einer italienischen Pizza erwarte. Birra Moretti steht für sich selbst.",
  },
  {
    author: "Cornelius C.",
    badge: "Local Guide · 466 Rezensionen",
    time: "vor einem Jahr",
    stars: 4,
    text: "Pizza sehr gut mit traumhaft aufgegangenem Teig. Ein Besuch, der nach Italien schmeckt.",
  },
];
