"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { RoomDTO } from "@/lib/types";
import SceneArt from "@/components/visuals/SceneArt";

export default function FeaturedRooms({ rooms }: { rooms: RoomDTO[] }) {
  return (
    <section className="px-6 py-28 md:px-10">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="mb-14 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-gold">
              Rooms &amp; Suites
            </p>
            <h2 className="font-display mt-3 text-4xl text-cream md:text-5xl">
              Find your room
            </h2>
          </div>
          <Link
            href="/rooms"
            className="text-sm uppercase tracking-[0.15em] text-gold underline-offset-4 hover:underline"
          >
            View all rooms →
          </Link>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {rooms.map((room, i) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
            >
              <Link
                href={`/rooms/${room.id}`}
                className="group block overflow-hidden rounded-2xl border border-gold/10 bg-charcoal-soft"
              >
                <div className="relative h-56 overflow-hidden">
                  <SceneArt
                    token={room.images[0]}
                    className="absolute inset-0 scale-100 transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-gold">
                    {room.type.replace("_", " ")}
                  </p>
                  <h3 className="font-display mt-2 text-xl text-cream">
                    {room.name}
                  </h3>
                  <p className="mt-3 text-sm text-cream/60">
                    From{" "}
                    <span className="text-cream">${room.pricePerNight}</span>
                    /night
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
