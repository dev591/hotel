"use client";

import { motion } from "framer-motion";

const cards = [
  { top: 165, align: "items-start text-left", eyebrow: "Chapter I", title: "The Gates Open", copy: "Wrought iron, older than the city around it, swings wide to let you in." },
  { top: 300, align: "items-end text-right", eyebrow: "Chapter II", title: "Through the Gardens", copy: "Cypress avenues, lamplight, and a fountain that has run since 1924." },
  { top: 465, align: "items-center text-center", eyebrow: "Chapter III", title: "Enter the Grand Lobby", copy: "Marble underfoot. Crystal overhead. Welcome home." },
];

export default function IntroTitles() {
  return (
    <div className="pointer-events-none relative w-screen text-cream">
      <section className="flex h-screen flex-col items-center justify-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1.4 }}
          className="text-[11px] uppercase tracking-[0.5em] text-gold drop-shadow"
        >
          A Royal Welcome Awaits
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.9, duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
          className="font-display mt-6 text-6xl leading-none drop-shadow-[0_4px_30px_rgba(0,0,0,0.6)] md:text-[8.5rem]"
        >
          Aurelia
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1.4 }}
          className="mt-6 max-w-md text-cream/80 drop-shadow"
        >
          Scroll to step through the gates.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
          className="absolute bottom-12 flex h-12 w-7 justify-center rounded-full border border-cream/50 p-1.5"
        >
          <motion.span
            animate={{ y: [0, 18, 0], opacity: [1, 0.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="h-2 w-1 rounded-full bg-gold"
          />
        </motion.div>
      </section>

      {cards.map((c) => (
        <section
          key={c.title}
          className={`absolute left-0 right-0 flex flex-col px-8 md:px-24 ${c.align}`}
          style={{ top: `${c.top}vh` }}
        >
          <motion.div
            initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ amount: 0.6 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-lg"
          >
            <p className="text-[11px] uppercase tracking-[0.45em] text-gold drop-shadow">{c.eyebrow}</p>
            <h2 className="font-display mt-4 text-5xl leading-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.7)] md:text-7xl">
              {c.title}
            </h2>
            <p className="mt-4 text-lg text-cream/85 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">{c.copy}</p>
          </motion.div>
        </section>
      ))}
    </div>
  );
}
