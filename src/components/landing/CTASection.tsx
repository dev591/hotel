"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import SceneArt from "@/components/visuals/SceneArt";

export default function CTASection() {
  return (
    <section className="relative overflow-hidden px-6 py-32 md:px-10">
      <SceneArt token="pool-cta" className="absolute inset-0" />
      <div className="absolute inset-0 bg-emerald/80" />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center"
      >
        <p className="text-xs uppercase tracking-[0.35em] text-gold">
          Ready when you are
        </p>
        <h2 className="font-display mt-5 text-4xl text-cream md:text-5xl">
          Your room is waiting
        </h2>
        <p className="mt-4 max-w-md text-cream/80">
          Choose your dates, pick a room that feels right, and we&apos;ll
          handle the rest.
        </p>
        <Link
          href="/booking"
          className="mt-8 inline-block rounded-full bg-gold px-10 py-4 text-sm uppercase tracking-[0.15em] text-charcoal transition-transform hover:scale-105"
        >
          Book Your Stay
        </Link>
      </motion.div>
    </section>
  );
}
