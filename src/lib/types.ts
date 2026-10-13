export const ROOM_TYPES = ["STANDARD", "DELUXE", "SUITE", "PRESIDENTIAL"] as const;
export type RoomType = (typeof ROOM_TYPES)[number];

export const BOOKING_STATUSES = ["PENDING", "CONFIRMED", "CANCELLED"] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export type RoomDTO = {
  id: string;
  name: string;
  type: RoomType;
  description: string;
  pricePerNight: number;
  capacity: number;
  images: string[];
  amenities: string[];
  totalUnits: number;
  createdAt: string;
};

export type BookingDTO = {
  id: string;
  roomId: string;
  room?: RoomDTO;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: BookingStatus;
  createdAt: string;
};
