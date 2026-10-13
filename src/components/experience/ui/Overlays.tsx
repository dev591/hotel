"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useExperience, type Phase } from "../store";
import BookingFlow from "@/components/booking/BookingFlow";
import type { RoomType } from "@/lib/types";

const FLOORS: { type: RoomType; label: string; number: string }[] = [
  { type: "STANDARD", label: "Classic Rooms", number: "1" },
  { type: "DELUXE", label: "Deluxe Rooms", number: "2" },
  { type: "SUITE", label: "Suites", number: "3" },
  { type: "PRESIDENTIAL", label: "The Penthouse", number: "9" },
];

const CAPTIONS: Partial<Record<Phase, string>> = {
  lobby: "The Grand Lobby",
  reception: "Reception",
  about: "The Lounge",
  floors: "The Lifts",
  corridor: "Guest Floor",
  room: "Your Room",
  booking: "Reservation",
  confirmed: "Welcome to Aurelia",
};

function Panel({ children, wide = false }: { children: React.ReactNode; wide?: boolean }) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 60 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`pointer-events-auto absolute right-4 top-24 bottom-6 z-30 flex flex-col overflow-y-auto rounded-3xl border border-gold/25 bg-charcoal/70 p-8 shadow-2xl backdrop-blur-xl md:right-10 ${
        wide ? "w-[min(560px,calc(100vw-2rem))]" : "w-[min(400px,calc(100vw-2rem))]"
      }`}
    >
      {children}
    </motion.aside>
  );
}

const eyebrow = "text-[11px] uppercase tracking-[0.35em] text-gold";
const option =
  "group flex w-full items-center justify-between rounded-2xl border border-gold/15 bg-charcoal-soft/60 px-5 py-4 text-left transition-colors hover:border-gold/60 hover:bg-emerald/40";

function ReceptionMenu() {
  const goto = useExperience((s) => s.goto);
  return (
    <Panel>
      <p className={eyebrow}>Good evening</p>
      <h2 className="font-display mt-3 text-3xl text-cream">How may we help?</h2>
      <p className="mt-3 text-sm text-cream/60">
        Our concierge can show you to the guest floors, or tell you a little
        about the house.
      </p>
      <div className="mt-8 space-y-3">
        <button className={option} onClick={() => goto("floors")}>
          <span>
            <span className="block text-cream">Explore Rooms</span>
            <span className="text-xs text-cream/50">Take the lift to a guest floor</span>
          </span>
          <span className="text-gold transition-transform group-hover:translate-x-1">→</span>
        </button>
        <button className={option} onClick={() => goto("about")}>
          <span>
            <span className="block text-cream">About the Hotel</span>
            <span className="text-xs text-cream/50">A century on the harbor</span>
          </span>
          <span className="text-gold transition-transform group-hover:translate-x-1">→</span>
        </button>
        <Link className={option} href="/admin/login">
          <span>
            <span className="block text-cream">Staff Login</span>
            <span className="text-xs text-cream/50">Manage rooms &amp; bookings</span>
          </span>
          <span className="text-gold">→</span>
        </Link>
      </div>
    </Panel>
  );
}

function AboutPanel() {
  const goto = useExperience((s) => s.goto);
  return (
    <Panel>
      <p className={eyebrow}>Our Story</p>
      <h2 className="font-display mt-3 text-3xl text-cream">Since 1924</h2>
      <p className="mt-4 text-sm leading-relaxed text-cream/70">
        Aurelia began as a harbor merchant&apos;s palace. Today its marble
        lobby, hand-gilded lifts and forty-two rooms keep the same promise:
        quiet luxury, generous service, and a view worth waking up for.
      </p>
      <div className="mt-6 grid grid-cols-3 gap-3 text-center">
        {[
          ["4.9", "Guest rating"],
          ["42", "Rooms"],
          ["96%", "Return guests"],
        ].map(([v, l]) => (
          <div key={l} className="rounded-xl border border-gold/15 p-3">
            <p className="font-display text-2xl text-gold">{v}</p>
            <p className="text-[10px] uppercase tracking-wider text-cream/50">{l}</p>
          </div>
        ))}
      </div>
      <button className={`${option} mt-8`} onClick={() => goto("floors")}>
        <span className="text-cream">See the rooms</span>
        <span className="text-gold">→</span>
      </button>
      <p className="mt-auto pt-8 text-[10px] text-cream/30">
        3D models, textures &amp; skies: Poly Haven (CC0).
      </p>
    </Panel>
  );
}

function FloorPicker() {
  const rooms = useExperience((s) => s.rooms);
  const chooseFloor = useExperience((s) => s.chooseFloor);

  const floors = useMemo(
    () =>
      FLOORS.map((f) => {
        const list = rooms.filter((r) => r.type === f.type);
        const from = list.length ? Math.min(...list.map((r) => r.pricePerNight)) : null;
        return { ...f, count: list.length, from };
      }).filter((f) => f.count > 0),
    [rooms],
  );

  return (
    <Panel>
      <p className={eyebrow}>Select a floor</p>
      <h2 className="font-display mt-3 text-3xl text-cream">Going up</h2>
      <div className="mt-8 space-y-3">
        {floors.map((f) => (
          <button key={f.type} className={option} onClick={() => chooseFloor(f.type)}>
            <span className="flex items-center gap-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/60 font-display text-lg text-gold group-hover:bg-gold group-hover:text-charcoal">
                {f.number}
              </span>
              <span>
                <span className="block text-cream">{f.label}</span>
                <span className="text-xs text-cream/50">
                  {f.count} room{f.count > 1 ? "s" : ""} · from ${f.from}/night
                </span>
              </span>
            </span>
            <span className="text-gold">▲</span>
          </button>
        ))}
      </div>
    </Panel>
  );
}

function RoomPanel() {
  const rooms = useExperience((s) => s.rooms);
  const roomId = useExperience((s) => s.roomId);
  const startBooking = useExperience((s) => s.startBooking);
  const room = rooms.find((r) => r.id === roomId);
  if (!room) return null;

  return (
    <Panel>
      <p className={eyebrow}>{room.type} · Sleeps {room.capacity}</p>
      <h2 className="font-display mt-3 text-3xl leading-tight text-cream">{room.name}</h2>
      <p className="mt-4 text-sm leading-relaxed text-cream/70">{room.description}</p>
      <ul className="mt-6 flex flex-wrap gap-2">
        {room.amenities.map((a) => (
          <li key={a} className="rounded-full border border-gold/25 px-3 py-1 text-xs text-cream/80">
            {a}
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-8">
        <p className="text-sm text-cream/50">From</p>
        <p className="font-display text-4xl text-cream">
          ${room.pricePerNight}
          <span className="text-base text-cream/50"> / night</span>
        </p>
        <button
          onClick={startBooking}
          className="mt-6 w-full rounded-full bg-gold px-6 py-4 text-sm uppercase tracking-[0.2em] text-charcoal transition-transform hover:scale-[1.02]"
        >
          Book this room
        </button>
      </div>
    </Panel>
  );
}

function BookingPanel() {
  const roomId = useExperience((s) => s.roomId);
  const rooms = useExperience((s) => s.rooms);
  const completeBooking = useExperience((s) => s.completeBooking);
  const room = rooms.find((r) => r.id === roomId);
  if (!roomId || !room) return null;

  return (
    <Panel wide>
      <p className={eyebrow}>Reserve</p>
      <h2 className="font-display mt-2 mb-6 text-2xl text-cream">{room.name}</h2>
      <BookingFlow lockedRoomId={roomId} onComplete={completeBooking} />
    </Panel>
  );
}

function ConfirmedPanel() {
  const booking = useExperience((s) => s.booking);
  const home = useExperience((s) => s.home);

  return (
    <Panel>
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
        className="flex h-16 w-16 items-center justify-center rounded-full border border-gold text-3xl text-gold"
      >
        ✓
      </motion.div>
      <p className={`${eyebrow} mt-6`}>Reservation confirmed</p>
      <h2 className="font-display mt-3 text-3xl text-cream">
        See you soon{booking ? `, ${booking.guestName.split(" ")[0]}` : ""}
      </h2>
      {booking && (
        <div className="mt-6 space-y-2 rounded-2xl border border-gold/15 p-5 text-sm text-cream/70">
          <div className="flex justify-between"><span>Reference</span><span className="text-gold">{booking.id.slice(-8).toUpperCase()}</span></div>
          <div className="flex justify-between"><span>Room</span><span>{booking.room?.name}</span></div>
          <div className="flex justify-between"><span>Check-in</span><span>{new Date(booking.checkIn).toLocaleDateString()}</span></div>
          <div className="flex justify-between"><span>Check-out</span><span>{new Date(booking.checkOut).toLocaleDateString()}</span></div>
          <div className="flex justify-between border-t border-gold/10 pt-2 text-cream"><span>Total</span><span>${booking.totalPrice}</span></div>
        </div>
      )}
      <button onClick={home} className={`${option} mt-auto`}>
        <span className="text-cream">Return to the lobby</span>
        <span className="text-gold">→</span>
      </button>
    </Panel>
  );
}

function FadeAndLetterbox() {
  const fading = useExperience((s) => s.fading);
  const phase = useExperience((s) => s.phase);
  const floor = useExperience((s) => s.floor);
  const cinematic = phase === "riding" || phase === "door" || phase === "roomEntry" || fading;
  const floorNo = FLOORS.find((f) => f.type === floor)?.number ?? "1";
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (phase !== "riding") return;
    const target = Number(floorNo);
    let n = 0;
    const id = setInterval(() => {
      n = Math.min(n + 1, target);
      setCount(n);
      if (n >= target) clearInterval(id);
    }, Math.max(120, 900 / target));
    return () => {
      clearInterval(id);
      setCount(0);
    };
  }, [phase, floorNo]);

  return (
    <>
      {["top-0", "bottom-0"].map((pos) => (
        <motion.div
          key={pos}
          className={`pointer-events-none absolute left-0 right-0 z-40 bg-black ${pos}`}
          animate={{ height: cinematic ? "11vh" : "0vh" }}
          transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
        />
      ))}
      <motion.div
        className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center bg-black"
        animate={{ opacity: fading ? 1 : 0 }}
        transition={{ duration: 0.65, ease: "easeInOut" }}
      >
        {phase === "riding" && (
          <div className="text-center">
            <p className={eyebrow}>Ascending</p>
            <p className="font-display mt-4 text-8xl text-gold">{count}</p>
          </div>
        )}
      </motion.div>
    </>
  );
}

function TopBar() {
  const phase = useExperience((s) => s.phase);
  const back = useExperience((s) => s.back);
  const home = useExperience((s) => s.home);
  const showNav = !["intro", "lobby", "riding", "door", "roomEntry"].includes(phase);

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-6 md:px-10">
      <button onClick={home} className="pointer-events-auto font-display text-xl tracking-[0.3em] text-cream drop-shadow">
        AURELIA
      </button>
      <div className="pointer-events-auto flex items-center gap-3">
        {showNav && (
          <>
            <button onClick={back} className="rounded-full border border-cream/30 bg-charcoal/50 px-4 py-2 text-xs uppercase tracking-[0.2em] text-cream backdrop-blur hover:border-gold hover:text-gold">
              ← Back
            </button>
            <button onClick={home} className="rounded-full border border-cream/30 bg-charcoal/50 px-4 py-2 text-xs uppercase tracking-[0.2em] text-cream backdrop-blur hover:border-gold hover:text-gold">
              Lobby
            </button>
          </>
        )}
        <Link href="/classic" className="rounded-full border border-gold/50 bg-charcoal/50 px-4 py-2 text-xs uppercase tracking-[0.2em] text-gold backdrop-blur hover:bg-gold hover:text-charcoal">
          Skip 3D
        </Link>
      </div>
    </div>
  );
}

function Caption() {
  const phase = useExperience((s) => s.phase);
  const caption = CAPTIONS[phase];
  return (
    <div className="pointer-events-none absolute bottom-10 left-6 z-20 md:left-10">
      <AnimatePresence mode="wait">
        {caption && (
          <motion.div
            key={caption}
            initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
            transition={{ duration: 0.9 }}
          >
            <div className="gold-rule mb-3 w-16" />
            <p className="font-display text-3xl italic text-cream drop-shadow-lg md:text-4xl">{caption}</p>
          </motion.div>
        )}
      </AnimatePresence>
      {phase === "lobby" && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="mt-3 text-xs uppercase tracking-[0.25em] text-cream/60">
          Tap a glowing marker to explore
        </motion.p>
      )}
    </div>
  );
}

export default function Overlays() {
  const phase = useExperience((s) => s.phase);
  return (
    <div className="pointer-events-none fixed inset-0 z-10">
      <TopBar />
      <Caption />
      <AnimatePresence mode="wait">
        {phase === "reception" && <ReceptionMenu key="reception" />}
        {phase === "about" && <AboutPanel key="about" />}
        {phase === "floors" && <FloorPicker key="floors" />}
        {phase === "room" && <RoomPanel key="room" />}
        {phase === "booking" && <BookingPanel key="booking" />}
        {phase === "confirmed" && <ConfirmedPanel key="confirmed" />}
      </AnimatePresence>
      <FadeAndLetterbox />
    </div>
  );
}
