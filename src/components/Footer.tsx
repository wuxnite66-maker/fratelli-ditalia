import Logo from "./Logo";
import { SITE } from "@/data/site";

export default function Footer() {
  return (
    <footer className="relative border-t border-gold/10 bg-ink py-16">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-6 text-center md:px-8">
        <Logo size="sm" />
        <p className="max-w-md font-serif text-xl italic text-cream-dim">
          „La vita è una combinazione di pasta e magia."
        </p>
        <div className="divider-gold w-40" />
        <div className="flex flex-col items-center gap-2 text-sm text-cream-dim/70">
          <p>{SITE.address}</p>
          <a
            href={`tel:${SITE.phoneIntl}`}
            className="transition-colors hover:text-gold-light"
          >
            {SITE.phone}
          </a>
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap justify-center gap-6 text-xs uppercase tracking-widest text-cream-dim/60">
            <li>
              <a href="#geschichte" className="hover:text-gold-light">
                Geschichte
              </a>
            </li>
            <li>
              <a href="#speisekarte" className="hover:text-gold-light">
                Speisekarte
              </a>
            </li>
            <li>
              <a href="#standort" className="hover:text-gold-light">
                Standort
              </a>
            </li>
            <li>
              <a
                href={SITE.facebook}
                target="_blank"
                rel="noopener"
                className="hover:text-gold-light"
              >
                Facebook
              </a>
            </li>
          </ul>
        </nav>
        <p className="text-[11px] text-cream-dim/40">
          © {new Date().getFullYear()} {SITE.name} · Wiener Neustadt
        </p>
      </div>
    </footer>
  );
}
