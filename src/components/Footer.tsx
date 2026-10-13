import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gold/15 bg-charcoal-soft px-6 py-16 md:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 md:flex-row md:justify-between">
        <div>
          <p className="font-display text-2xl text-cream">AURELIA</p>
          <p className="mt-3 max-w-xs text-sm text-cream/60">
            A quiet luxury hotel in the heart of the city — considered
            interiors, generous service, and a view worth waking up for.
          </p>
        </div>
        <div className="flex gap-16">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gold">
              Explore
            </p>
            <ul className="mt-4 space-y-2 text-sm text-cream/70">
              <li>
                <Link href="/rooms" className="hover:text-gold">
                  Rooms &amp; Suites
                </Link>
              </li>
              <li>
                <Link href="/booking" className="hover:text-gold">
                  Reservations
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-gold">
                  Staff Login
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gold">
              Contact
            </p>
            <ul className="mt-4 space-y-2 text-sm text-cream/70">
              <li>12 Harbor Row</li>
              <li>stay@aurelia-hotel.com</li>
              <li>+1 (555) 014-2200</li>
            </ul>
          </div>
        </div>
      </div>
      <p className="mx-auto mt-14 max-w-7xl text-xs text-cream/40">
        © {new Date().getFullYear()} Aurelia Hotel. All rights reserved.
      </p>
    </footer>
  );
}
