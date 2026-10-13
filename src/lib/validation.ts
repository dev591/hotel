import { z } from "zod";
import { BOOKING_STATUSES, ROOM_TYPES } from "./types";

export const roomInputSchema = z.object({
  name: z.string().min(2),
  type: z.enum(ROOM_TYPES),
  description: z.string().min(10),
  pricePerNight: z.number().positive(),
  capacity: z.number().int().positive(),
  images: z.array(z.string().min(1)).min(1),
  amenities: z.array(z.string().min(1)).min(1),
  totalUnits: z.number().int().positive(),
});

export const bookingInputSchema = z
  .object({
    roomId: z.string().min(1),
    guestName: z.string().min(2),
    guestEmail: z.string().email(),
    guestPhone: z.string().min(6),
    checkIn: z.string().datetime().or(z.string().min(10)),
    checkOut: z.string().datetime().or(z.string().min(10)),
    guests: z.number().int().positive(),
  })
  .refine((data) => new Date(data.checkOut) > new Date(data.checkIn), {
    message: "checkOut must be after checkIn",
    path: ["checkOut"],
  });

export const bookingStatusUpdateSchema = z.object({
  status: z.enum(BOOKING_STATUSES),
});

export const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
