"use client";

import { useState } from "react";
import type { RoomDTO, RoomType } from "@/lib/types";
import { ROOM_TYPES } from "@/lib/types";
import SceneArt from "@/components/visuals/SceneArt";

type FormState = {
  name: string;
  type: RoomType;
  description: string;
  pricePerNight: string;
  capacity: string;
  totalUnits: string;
  images: string;
  amenities: string;
};

const emptyForm: FormState = {
  name: "",
  type: "STANDARD",
  description: "",
  pricePerNight: "",
  capacity: "2",
  totalUnits: "3",
  images: "",
  amenities: "",
};

export default function RoomsManager({
  initialRooms,
}: {
  initialRooms: RoomDTO[];
}) {
  const [rooms, setRooms] = useState(initialRooms);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function startCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
    setError(null);
  }

  function startEdit(room: RoomDTO) {
    setEditingId(room.id);
    setForm({
      name: room.name,
      type: room.type,
      description: room.description,
      pricePerNight: String(room.pricePerNight),
      capacity: String(room.capacity),
      totalUnits: String(room.totalUnits),
      images: room.images.join(", "),
      amenities: room.amenities.join(", "),
    });
    setShowForm(true);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const payload = {
      name: form.name,
      type: form.type,
      description: form.description,
      pricePerNight: Number(form.pricePerNight),
      capacity: Number(form.capacity),
      totalUnits: Number(form.totalUnits),
      images: form.images
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      amenities: form.amenities
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    const res = await fetch(
      editingId ? `/api/rooms/${editingId}` : "/api/rooms",
      {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    const data = await res.json();
    if (!res.ok) {
      setError(JSON.stringify(data.error ?? "Could not save room"));
      setSubmitting(false);
      return;
    }

    setRooms((prev) => {
      if (editingId) {
        return prev.map((r) => (r.id === editingId ? data : r));
      }
      return [...prev, data];
    });

    setSubmitting(false);
    setShowForm(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this room and all its bookings?")) return;
    const res = await fetch(`/api/rooms/${id}`, { method: "DELETE" });
    if (res.ok) {
      setRooms((prev) => prev.filter((r) => r.id !== id));
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-cream">Rooms</h1>
        <button
          onClick={startCreate}
          className="rounded-full bg-gold px-5 py-2 text-sm uppercase tracking-[0.1em] text-charcoal"
        >
          + Add Room
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4 rounded-xl border border-gold/15 bg-charcoal-soft p-6"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Room name"
              className="rounded-lg border border-gold/20 bg-charcoal px-3 py-2 text-cream"
            />
            <select
              value={form.type}
              onChange={(e) =>
                setForm({ ...form, type: e.target.value as RoomType })
              }
              className="rounded-lg border border-gold/20 bg-charcoal px-3 py-2 text-cream"
            >
              {ROOM_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <input
              required
              type="number"
              min={1}
              value={form.pricePerNight}
              onChange={(e) =>
                setForm({ ...form, pricePerNight: e.target.value })
              }
              placeholder="Price per night"
              className="rounded-lg border border-gold/20 bg-charcoal px-3 py-2 text-cream"
            />
            <input
              required
              type="number"
              min={1}
              value={form.capacity}
              onChange={(e) => setForm({ ...form, capacity: e.target.value })}
              placeholder="Capacity"
              className="rounded-lg border border-gold/20 bg-charcoal px-3 py-2 text-cream"
            />
            <input
              required
              type="number"
              min={1}
              value={form.totalUnits}
              onChange={(e) =>
                setForm({ ...form, totalUnits: e.target.value })
              }
              placeholder="Total units"
              className="rounded-lg border border-gold/20 bg-charcoal px-3 py-2 text-cream"
            />
          </div>
          <textarea
            required
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            placeholder="Description"
            rows={3}
            className="w-full rounded-lg border border-gold/20 bg-charcoal px-3 py-2 text-cream"
          />
          <input
            required
            value={form.images}
            onChange={(e) => setForm({ ...form, images: e.target.value })}
            placeholder="Scene art tokens, comma-separated (e.g. room-1, suite-2, pool-1, lobby-1, twin-1, dining-1, garden-1, presidential-1)"
            className="w-full rounded-lg border border-gold/20 bg-charcoal px-3 py-2 text-cream"
          />
          <input
            required
            value={form.amenities}
            onChange={(e) => setForm({ ...form, amenities: e.target.value })}
            placeholder="Amenities, comma-separated"
            className="w-full rounded-lg border border-gold/20 bg-charcoal px-3 py-2 text-cream"
          />

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-gold px-6 py-2 text-sm uppercase tracking-[0.1em] text-charcoal disabled:opacity-60"
            >
              {submitting ? "Saving…" : editingId ? "Save Changes" : "Create Room"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-full border border-cream/20 px-6 py-2 text-sm uppercase tracking-[0.1em] text-cream/70"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="rounded-xl border border-gold/15 bg-charcoal-soft p-5"
          >
            <SceneArt token={room.images[0]} className="h-32 rounded-lg" />
            <p className="mt-3 text-xs uppercase tracking-[0.15em] text-gold">
              {room.type}
            </p>
            <p className="text-cream">{room.name}</p>
            <p className="text-sm text-cream/50">
              ${room.pricePerNight}/night · {room.totalUnits} units
            </p>
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => startEdit(room)}
                className="text-xs uppercase tracking-[0.1em] text-gold hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(room.id)}
                className="text-xs uppercase tracking-[0.1em] text-red-400 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
