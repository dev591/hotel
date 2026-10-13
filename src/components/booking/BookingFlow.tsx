"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { DayPicker, type DateRange } from "react-day-picker";
import "react-day-picker/style.css";
import type { BookingDTO, RoomDTO } from "@/lib/types";
import SceneArt from "@/components/visuals/SceneArt";

const STEP_LABELS = ["Dates & Room", "Your Details", "Review & Confirm"];

function nightsBetween(range: DateRange | undefined) {
  if (!range?.from || !range?.to) return 0;
  const ms = range.to.getTime() - range.from.getTime();
  return Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)));
}

export default function BookingFlow({
  initialRoomId,
  lockedRoomId,
  onComplete,
}: {
  initialRoomId?: string;
  lockedRoomId?: string;
  onComplete?: (booking: BookingDTO) => void;
}) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [rooms, setRooms] = useState<RoomDTO[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [roomId, setRoomId] = useState(lockedRoomId ?? initialRoomId ?? "");
  const compact = !!lockedRoomId;
  const [range, setRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState(2);

  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/rooms")
      .then((res) => res.json())
      .then((data: RoomDTO[]) => {
        setRooms(data);
        setLoadingRooms(false);
      })
      .catch(() => setLoadingRooms(false));
  }, []);

  const selectedRoom = useMemo(
    () => rooms.find((r) => r.id === roomId),
    [rooms, roomId],
  );

  const nights = nightsBetween(range);
  const totalPrice = selectedRoom ? nights * selectedRoom.pricePerNight : 0;

  const canGoNextFromStep0 =
    !!roomId && !!range?.from && !!range?.to && nights > 0;
  const canGoNextFromStep1 =
    guestName.trim().length > 1 &&
    /\S+@\S+\.\S+/.test(guestEmail) &&
    guestPhone.trim().length > 5;

  async function handleConfirm() {
    if (!selectedRoom || !range?.from || !range?.to) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: selectedRoom.id,
          guestName,
          guestEmail,
          guestPhone,
          checkIn: range.from.toISOString(),
          checkOut: range.to.toISOString(),
          guests,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      if (onComplete) {
        onComplete(data as BookingDTO);
        return;
      }
      router.push(`/booking/confirmation/${data.id}`);
    } catch {
      setError("Network error — please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className={`${compact ? "mb-6" : "mb-12"} flex items-center justify-center gap-4`}>
        {STEP_LABELS.map((label, i) => (
          <div key={label} className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm ${
                  i <= step
                    ? "border-gold bg-gold text-charcoal"
                    : "border-cream/30 text-cream/50"
                }`}
              >
                {i + 1}
              </span>
              <span
                className={`hidden text-sm sm:inline ${
                  i <= step ? "text-cream" : "text-cream/40"
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div className="h-px w-8 bg-cream/20 sm:w-16" />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="step0"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.35 }}
            className={compact ? "grid gap-6" : "grid gap-10 md:grid-cols-[1fr_1.2fr]"}
          >
            <div>
              {!compact && (
              <p className="text-xs uppercase tracking-[0.2em] text-gold">
                Choose a room
              </p>
              )}
              {compact ? null : loadingRooms ? (
                <p className="mt-4 text-sm text-cream/50">Loading rooms…</p>
              ) : (
                <div className="mt-4 max-h-96 space-y-3 overflow-y-auto pr-2">
                  {rooms.map((room) => (
                    <button
                      key={room.id}
                      onClick={() => setRoomId(room.id)}
                      className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors ${
                        roomId === room.id
                          ? "border-gold bg-charcoal-soft"
                          : "border-gold/10 bg-charcoal-soft/50 hover:border-gold/40"
                      }`}
                    >
                      <SceneArt
                        token={room.images[0]}
                        className="h-14 w-20 flex-shrink-0 rounded-lg"
                      />
                      <div>
                        <p className="text-sm text-cream">{room.name}</p>
                        <p className="text-xs text-cream/50">
                          ${room.pricePerNight}/night · Sleeps{" "}
                          {room.capacity}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              <div className={compact ? "" : "mt-8"}>
                <p className="text-xs uppercase tracking-[0.2em] text-gold">
                  Guests
                </p>
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="mt-3 w-full rounded-lg border border-gold/20 bg-charcoal px-3 py-2 text-cream"
                >
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>
                      {n} guest{n > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
                {selectedRoom && guests > selectedRoom.capacity && (
                  <p className="mt-2 text-xs text-red-400">
                    This room sleeps up to {selectedRoom.capacity} guests.
                  </p>
                )}
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gold">
                Select your dates
              </p>
              <div className="day-picker-wrap mt-4 rounded-xl border border-gold/10 bg-charcoal-soft p-4">
                <DayPicker
                  mode="range"
                  selected={range}
                  onSelect={setRange}
                  disabled={{ before: new Date() }}
                  numberOfMonths={1}
                />
              </div>
              {nights > 0 && (
                <p className="mt-3 text-sm text-cream/60">
                  {nights} night{nights > 1 ? "s" : ""} selected
                </p>
              )}
            </div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.35 }}
            className="mx-auto max-w-md space-y-5"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-gold">
              Your details
            </p>
            <input
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Full name"
              className="w-full rounded-lg border border-gold/20 bg-charcoal px-4 py-3 text-cream placeholder:text-cream/40"
            />
            <input
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              placeholder="Email address"
              type="email"
              className="w-full rounded-lg border border-gold/20 bg-charcoal px-4 py-3 text-cream placeholder:text-cream/40"
            />
            <input
              value={guestPhone}
              onChange={(e) => setGuestPhone(e.target.value)}
              placeholder="Phone number"
              type="tel"
              className="w-full rounded-lg border border-gold/20 bg-charcoal px-4 py-3 text-cream placeholder:text-cream/40"
            />
          </motion.div>
        )}

        {step === 2 && selectedRoom && range?.from && range?.to && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.35 }}
            className="mx-auto max-w-md space-y-6"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-gold">
              Review your reservation
            </p>
            <div className="rounded-xl border border-gold/15 bg-charcoal-soft p-6">
              <div className="flex gap-4">
                <SceneArt
                  token={selectedRoom.images[0]}
                  className="h-16 w-24 flex-shrink-0 rounded-lg"
                />
                <div>
                  <p className="text-cream">{selectedRoom.name}</p>
                  <p className="text-sm text-cream/50">
                    {range.from.toLocaleDateString()} –{" "}
                    {range.to.toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="mt-5 space-y-2 border-t border-gold/10 pt-4 text-sm text-cream/70">
                <div className="flex justify-between">
                  <span>Guests</span>
                  <span>{guests}</span>
                </div>
                <div className="flex justify-between">
                  <span>
                    ${selectedRoom.pricePerNight} × {nights} night
                    {nights > 1 ? "s" : ""}
                  </span>
                  <span>${totalPrice}</span>
                </div>
                <div className="flex justify-between border-t border-gold/10 pt-2 text-cream">
                  <span>Total</span>
                  <span>${totalPrice}</span>
                </div>
              </div>
              <div className="mt-5 border-t border-gold/10 pt-4 text-sm text-cream/60">
                <p>{guestName}</p>
                <p>{guestEmail}</p>
                <p>{guestPhone}</p>
              </div>
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`${compact ? "mt-6" : "mt-12"} flex items-center justify-between`}>
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="text-sm uppercase tracking-[0.1em] text-cream/60 disabled:opacity-0"
        >
          ← Back
        </button>

        {step < 2 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            disabled={
              (step === 0 && !canGoNextFromStep0) ||
              (step === 1 && !canGoNextFromStep1)
            }
            className="rounded-full bg-gold px-8 py-3 text-sm uppercase tracking-[0.15em] text-charcoal transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
          >
            Continue
          </button>
        ) : (
          <button
            onClick={handleConfirm}
            disabled={submitting}
            className="rounded-full bg-gold px-8 py-3 text-sm uppercase tracking-[0.15em] text-charcoal transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Confirming…" : "Confirm Reservation"}
          </button>
        )}
      </div>
    </div>
  );
}
