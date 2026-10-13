"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { motion } from "framer-motion";
import Link from "next/link";
import SceneArt from "@/components/visuals/SceneArt";

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !imageRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(imageRef.current, {
        scale: 1.25,
        yPercent: 10,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex h-screen items-center justify-center overflow-hidden"
    >
      <div ref={imageRef} className="absolute inset-0 scale-110">
        <SceneArt token="skyline-hero" className="absolute inset-0" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-charcoal/40 to-charcoal" />

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-xs uppercase tracking-[0.35em] text-gold"
        >
          Downtown Harbor District
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="font-display mt-6 max-w-3xl text-5xl leading-tight text-cream md:text-7xl"
        >
          Step inside a stay <em className="italic text-gold">worth</em>{" "}
          remembering
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-6 max-w-xl text-base text-cream/70 md:text-lg"
        >
          Scroll to wander through Aurelia&apos;s lobby, rooms, and rooftop —
          then reserve the one that feels like yours.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.05 }}
        >
          <Link
            href="/rooms"
            className="mt-10 inline-block rounded-full bg-gold px-8 py-3 text-sm uppercase tracking-[0.15em] text-charcoal transition-transform hover:scale-105"
          >
            Explore Rooms
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="flex h-10 w-6 items-start justify-center rounded-full border border-cream/40 p-1">
          <motion.div
            animate={{ y: [0, 14, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="h-1.5 w-1.5 rounded-full bg-gold"
          />
        </div>
      </motion.div>
    </section>
  );
}
