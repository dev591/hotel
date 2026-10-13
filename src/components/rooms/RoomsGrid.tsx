"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import type { RoomDTO, RoomType } from "@/lib/types";
import SceneArt from "@/components/visuals/SceneArt";

const typeFilters: { label: string; value: RoomType | "ALL" }[] = [
  { label: "All Rooms", value: "ALL" },
  { label: "Standard", value: "STANDARD" },
  { label: "Deluxe", value: "DELUXE" },
  { label: "Suite", value: "SUITE" },
  { label: "Presidential", value: "PRESIDENTIAL" },
];

export default function RoomsGrid({ rooms }: { rooms: RoomDTO[] }) {
  const [activeType, setActiveType] = useState<RoomType | "ALL">("ALL");
  const [minGuests, setMinGuests] = useState(1);

  const filtered = useMemo(() => {
    return rooms.filter((room) => {
      const typeMatch = activeType === "ALL" || room.type === activeType;
      const guestsMatch = room.capacity >= minGuests;
      return typeMatch && guestsMatch;
    });
  }, [rooms, activeType, minGuests]);

  return (
    <div>
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {typeFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveType(filter.value)}
              className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.1em] transition-colors ${
                activeType === filter.value
                  ? "border-gold bg-gold text-charcoal"
                  : "border-gold/30 text-cream/70 hover:border-gold/60"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-3 text-xs uppercase tracking-[0.1em] text-cream/60">
          Min. Guests
          <select
            value={minGuests}
            onChange={(e) => setMinGuests(Number(e.target.value))}
            className="rounded-full border border-gold/30 bg-charcoal px-3 py-2 text-cream"
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                {n}+
              </option>
            ))}
          </select>
        </label>
      </div>

      {filtered.length === 0 ? (
        <p className="py-20 text-center text-cream/50">
          No rooms match those filters right now.
        </p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((room, i) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <Link
                href={`/rooms/${room.id}`}
                className="group block overflow-hidden rounded-2xl border border-gold/10 bg-charcoal-soft"
              >
                <div className="relative h-60 overflow-hidden">
                  <SceneArt
                    token={room.images[0]}
                    className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <p className="text-xs uppercase tracking-[0.2em] text-gold">
                    {room.type.replace("_", " ")} · Sleeps {room.capacity}
                  </p>
                  <h3 className="font-display mt-2 text-xl text-cream">
                    {room.name}
                  </h3>
                  <p className="mt-3 line-clamp-2 text-sm text-cream/60">
                    {room.description}
                  </p>
                  <p className="mt-4 text-sm text-cream">
                    ${room.pricePerNight}{" "}
                    <span className="text-cream/50">/ night</span>
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
