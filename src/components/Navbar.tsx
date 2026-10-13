"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const links = [
  { href: "/", label: "Home" },
  { href: "/rooms", label: "Rooms" },
  { href: "/booking", label: "Book" },
  { href: "/admin/login", label: "Admin" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
        scrolled
          ? "bg-charcoal/90 backdrop-blur-md border-b border-gold/15"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
        <Link
          href="/"
          className="font-display text-xl tracking-wide text-cream"
        >
          AURELIA
        </Link>
        <ul className="hidden items-center gap-10 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm uppercase tracking-[0.15em] text-cream/80 transition-colors hover:text-gold"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/booking"
          className="hidden rounded-full border border-gold/60 px-5 py-2 text-sm uppercase tracking-[0.1em] text-gold transition-colors hover:bg-gold hover:text-charcoal md:inline-block"
        >
          Reserve
        </Link>
      </nav>
    </motion.header>
  );
}
