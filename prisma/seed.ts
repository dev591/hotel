import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const rooms = [
  {
    name: "Harbor View Standard",
    type: "STANDARD",
    description:
      "A warm, light-filled room with harbor glimpses, a plush queen bed, and a reading nook — ideal for a quiet city escape.",
    pricePerNight: 149,
    capacity: 2,
    totalUnits: 6,
    images: ["room-harbor-1", "room-harbor-2"],
    amenities: ["Free Wi-Fi", "City View", "Smart TV", "Rain Shower"],
  },
  {
    name: "Garden Deluxe King",
    type: "DELUXE",
    description:
      "Overlooking our restored courtyard gardens, this deluxe king room pairs tactile linens with a private balcony for morning coffee.",
    pricePerNight: 229,
    capacity: 2,
    totalUnits: 5,
    images: ["garden-king-1", "room-king-2"],
    amenities: ["Garden View", "Private Balcony", "Minibar", "Espresso Machine"],
  },
  {
    name: "Emerald Suite",
    type: "SUITE",
    description:
      "A sweeping one-bedroom suite finished in deep emerald and brushed brass, with a separate living area and soaking tub.",
    pricePerNight: 389,
    capacity: 3,
    totalUnits: 4,
    images: ["suite-emerald-1", "suite-emerald-2"],
    amenities: ["Living Room", "Soaking Tub", "Butler Service", "Skyline View"],
  },
  {
    name: "Twin Loft Deluxe",
    type: "DELUXE",
    description:
      "Two long, low beds under exposed timber beams — a favorite with friends traveling together or families with older kids.",
    pricePerNight: 209,
    capacity: 4,
    totalUnits: 5,
    images: ["twin-loft-1", "twin-loft-2"],
    amenities: ["Two Queen Beds", "Workspace", "Free Wi-Fi", "Blackout Curtains"],
  },
  {
    name: "Rooftop Pool Suite",
    type: "SUITE",
    description:
      "Direct access to the rooftop pool deck, with a sunken lounge, outdoor shower, and uninterrupted views at golden hour.",
    pricePerNight: 459,
    capacity: 3,
    totalUnits: 3,
    images: ["pool-suite-1", "pool-suite-2"],
    amenities: ["Pool Access", "Outdoor Shower", "Sunset View", "Lounge Area"],
  },
  {
    name: "The Presidential Residence",
    type: "PRESIDENTIAL",
    description:
      "Our signature two-bedroom residence: a private dining room, a grand piano lounge, and panoramic views across the entire skyline.",
    pricePerNight: 1250,
    capacity: 6,
    totalUnits: 1,
    images: ["presidential-1", "presidential-2"],
    amenities: ["Private Dining", "Grand Piano", "Panoramic View", "24h Butler"],
  },
  {
    name: "Courtyard Standard Twin",
    type: "STANDARD",
    description:
      "A calm, courtyard-facing twin room with handwoven textiles and a dedicated work corner — well suited to business travel.",
    pricePerNight: 139,
    capacity: 2,
    totalUnits: 6,
    images: [
      "twin-courtyard-1",
      "room-courtyard-2",
    ],
    amenities: ["Courtyard View", "Workspace", "Free Wi-Fi", "Twin Beds"],
  },
  {
    name: "Skyline Deluxe Corner",
    type: "DELUXE",
    description:
      "Wraparound windows on two sides frame the skyline from every angle, with a deep soaking tub positioned to take it all in.",
    pricePerNight: 259,
    capacity: 2,
    totalUnits: 4,
    images: ["suite-skyline-1", "room-skyline-2"],
    amenities: ["Corner Views", "Soaking Tub", "Smart TV", "Nespresso Bar"],
  },
];

async function main() {
  await prisma.booking.deleteMany();
  await prisma.room.deleteMany();
  await prisma.adminUser.deleteMany();

  for (const room of rooms) {
    await prisma.room.create({
      data: {
        ...room,
        images: JSON.stringify(room.images),
        amenities: JSON.stringify(room.amenities),
      },
    });
  }

  const passwordHash = await bcrypt.hash("admin123", 10);
  await prisma.adminUser.create({
    data: {
      email: "admin@aurelia-hotel.com",
      passwordHash,
    },
  });

  console.log(`Seeded ${rooms.length} rooms and 1 admin user.`);
  console.log("Admin login -> admin@aurelia-hotel.com / admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
