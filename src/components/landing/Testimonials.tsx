"use client";

import { motion } from "framer-motion";

const quotes = [
  {
    quote:
      "The kind of hotel you think about for weeks after you leave. The rooftop at sunset alone is worth the trip.",
    name: "Priya N.",
    role: "Stayed in the Emerald Suite",
  },
  {
    quote:
      "Quiet, considered, and genuinely warm service. Best city hotel we've stayed at in years.",
    name: "Daniel R.",
    role: "Stayed in the Garden Deluxe King",
  },
  {
    quote:
      "Booked for one night, stayed for three. The Presidential Residence is absurd in the best way.",
    name: "Mei L.",
    role: "Stayed in the Presidential Residence",
  },
];

export default function Testimonials() {
  return (
    <section className="px-6 py-28 md:px-10">
      <div className="mx-auto max-w-6xl">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-xs uppercase tracking-[0.35em] text-gold"
        >
          Guest Stories
        </motion.p>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {quotes.map((q, i) => (
            <motion.figure
              key={q.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="rounded-2xl border border-gold/10 bg-charcoal-soft p-8"
            >
              <blockquote className="font-display text-lg leading-relaxed text-cream/90 italic">
                “{q.quote}”
              </blockquote>
              <figcaption className="mt-6 text-sm">
                <p className="text-cream">{q.name}</p>
                <p className="text-cream/50">{q.role}</p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
