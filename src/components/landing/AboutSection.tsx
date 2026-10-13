"use client";

import { motion } from "framer-motion";
import SceneArt from "@/components/visuals/SceneArt";

export default function AboutSection() {
  return (
    <section className="px-6 py-28 md:px-10">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2 md:items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-xs uppercase tracking-[0.35em] text-gold">
            Our Story
          </p>
          <h2 className="font-display mt-4 text-4xl leading-tight text-cream md:text-5xl">
            Built from a converted 1920s harbor warehouse
          </h2>
          <p className="mt-6 text-cream/70">
            Aurelia keeps the original timber beams, the iron windows, the
            weight of the building&apos;s history — and pairs it with
            everything a modern stay should feel like: considered interiors,
            quiet technology, and a team that remembers your name by the
            second morning.
          </p>
          <div className="gold-rule mt-8 w-24" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative h-80 overflow-hidden rounded-2xl md:h-[26rem]"
        >
          <SceneArt token="lobby-about" className="absolute inset-0" />
        </motion.div>
      </div>
    </section>
  );
}
