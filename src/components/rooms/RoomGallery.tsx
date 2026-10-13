"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SceneArt from "@/components/visuals/SceneArt";

export default function RoomGallery({ images }: { images: string[] }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="relative h-[28rem] overflow-hidden rounded-2xl md:h-[34rem]">
        <AnimatePresence mode="wait">
          <motion.div
            key={images[active]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0"
          >
            <SceneArt token={images[active]} className="absolute inset-0" />
          </motion.div>
        </AnimatePresence>
      </div>
      {images.length > 1 && (
        <div className="mt-4 flex gap-3">
          {images.map((image, i) => (
            <button
              key={image}
              onClick={() => setActive(i)}
              className={`h-20 w-28 overflow-hidden rounded-lg border-2 transition-colors ${
                active === i ? "border-gold" : "border-transparent"
              }`}
            >
              <SceneArt token={image} className="h-full w-full" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
