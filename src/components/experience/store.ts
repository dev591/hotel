import { create } from "zustand";
import type { BookingDTO, RoomDTO, RoomType } from "@/lib/types";
import { SHOTS, doorShot, type Shot } from "./shots";

export type Phase =
  | "intro"
  | "lobby"
  | "reception"
  | "about"
  | "floors"
  | "riding"
  | "corridor"
  | "door"
  | "roomEntry"
  | "room"
  | "booking"
  | "confirmed";

type Location = "exterior" | "corridor" | "room";

const FADE_MS = 650;

type State = {
  rooms: RoomDTO[];
  phase: Phase;
  floor: RoomType | null;
  roomId: string | null;
  doorIndex: number;
  booking: BookingDTO | null;
  shot: Shot | null;
  snap: boolean;
  fading: boolean;
  location: Location;
  highQuality: boolean;
  setHighQuality: (v: boolean) => void;
  setRooms: (rooms: RoomDTO[]) => void;
  enterLobby: () => void;
  goto: (phase: "lobby" | "reception" | "about" | "floors") => void;
  chooseFloor: (floor: RoomType) => void;
  chooseRoom: (roomId: string, doorIndex: number) => void;
  startBooking: () => void;
  completeBooking: (booking: BookingDTO) => void;
  back: () => void;
  home: () => void;
  consumeSnap: () => void;
};

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const useExperience = create<State>((set, get) => {
  async function cut(next: Partial<State>, hold = 0) {
    set({ fading: true });
    await wait(FADE_MS);
    set({ ...next, snap: true });
    if (hold) await wait(hold);
    set({ fading: false });
  }

  return {
    rooms: [],
    phase: "intro",
    floor: null,
    roomId: null,
    doorIndex: 0,
    booking: null,
    shot: null,
    snap: false,
    fading: false,
    location: "exterior",
    highQuality: true,

    setHighQuality: (highQuality) => set({ highQuality }),
    setRooms: (rooms) => set({ rooms }),

    enterLobby: () => {
      if (get().phase === "intro") set({ phase: "lobby", shot: SHOTS.lobby });
    },

    goto: (phase) => set({ phase, shot: SHOTS[phase] }),

    chooseFloor: async (floor) => {
      set({ phase: "riding", floor });
      await cut({ location: "corridor", phase: "corridor", shot: SHOTS.corridor }, 1400);
    },

    chooseRoom: async (roomId, doorIndex) => {
      set({ phase: "door", roomId, doorIndex, shot: doorShot(doorIndex) });
      await wait(1300);
      await cut({ location: "room", phase: "roomEntry", shot: SHOTS.roomEntry });
      await wait(250);
      set({ phase: "room", shot: SHOTS.room });
    },

    startBooking: () => set({ phase: "booking", shot: SHOTS.booking }),

    completeBooking: (booking) => set({ phase: "confirmed", booking }),

    back: () => {
      const { phase, doorIndex } = get();
      switch (phase) {
        case "reception":
        case "floors":
        case "about":
          set({ phase: "lobby", shot: SHOTS.lobby });
          break;
        case "corridor":
          cut({ location: "exterior", phase: "floors", shot: SHOTS.floors, floor: null });
          break;
        case "room":
        case "roomEntry":
          cut({ location: "corridor", phase: "corridor", shot: doorShot(doorIndex), roomId: null });
          break;
        case "booking":
        case "confirmed":
          set({ phase: "room", shot: SHOTS.room, booking: null });
          break;
      }
    },

    home: () => {
      if (get().location === "exterior") {
        set({ phase: "lobby", shot: SHOTS.lobby });
        return;
      }
      cut({
        location: "exterior",
        phase: "lobby",
        shot: SHOTS.lobby,
        floor: null,
        roomId: null,
        booking: null,
      });
    },

    consumeSnap: () => set({ snap: false }),
  };
});
