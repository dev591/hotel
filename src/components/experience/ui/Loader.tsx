"use client";

import { useState } from "react";
import { useProgress } from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";

export default function Loader() {
  const { progress, active } = useProgress();
  const [entered, setEntered] = useState(false);
  const ready = progress >= 100 && !active;

  return (
    <AnimatePresence>
      {!entered && (
        <motion.div
          key="loader"
          exit={{ opacity: 0 }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0b0907]"
        >
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.2em" }}
            animate={{ opacity: 1, letterSpacing: "0.55em" }}
            transition={{ duration: 2.4, ease: "easeOut" }}
            className="font-display pl-[0.55em] text-5xl text-gold md:text-7xl"
          >
            AURELIA
          </motion.p>
          <p className="mt-4 text-[11px] uppercase tracking-[0.5em] text-cream/50">
            Harbor District · Est. 1924
          </p>

          <div className="mt-14 h-px w-64 overflow-hidden bg-cream/10">
            <motion.div
              className="h-full bg-gold"
              animate={{ width: `${progress}%` }}
              transition={{ ease: "easeOut" }}
            />
          </div>

          <div className="mt-8 h-14">
            <AnimatePresence mode="wait">
              {ready ? (
                <motion.button
                  key="enter"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => setEntered(true)}
                  className="rounded-full border border-gold px-10 py-4 text-xs uppercase tracking-[0.4em] text-gold transition-colors hover:bg-gold hover:text-charcoal"
                >
                  Enter
                </motion.button>
              ) : (
                <motion.p
                  key="pct"
                  exit={{ opacity: 0 }}
                  className="font-mono text-xs tracking-widest text-cream/40"
                >
                  Preparing your arrival · {Math.round(progress)}%
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
