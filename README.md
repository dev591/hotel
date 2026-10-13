# Aurelia — 3D Hotel Booking & Management System

An immersive hotel booking system: visitors walk through a real-time 3D hotel (gate → gardens → lobby → lifts → guest floor → room) and book a room inside the scene. Staff manage rooms and bookings from an admin dashboard.

## Features
- **3D walk-through** (React Three Fiber): scroll-driven camera through a royal gate and gardens into the lobby; click-driven navigation to reception, lifts, corridors and rooms.
- **In-scene booking**: date picker, guest details, review and confirmation without leaving the 3D world.
- **Concurrency-safe bookings**: availability is checked and the booking inserted atomically in one database transaction, with retry and backoff on lock contention, so simultaneous requests can never overbook a room.
- **Admin dashboard** (`/admin`): bookings (change status), rooms (create/edit/delete), revenue and occupancy stats. Signed httpOnly session cookie.
- **Classic 2D site** at `/classic`, used automatically on devices without WebGL2.
- Adaptive quality: drops resolution and ambient occlusion if the frame rate falls.

## Tech stack
Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Three.js / React Three Fiber / drei / postprocessing · Framer Motion · GSAP + Lenis · Prisma + SQLite · Zod · jose · bcrypt

## Run locally
```bash
npm install
cp .env.example .env          # then set AUTH_SECRET
npx prisma db push            # create the SQLite database
npm run db:seed               # 8 rooms + admin account
npm run build && npm start    # production mode (smoothest)
# or: npm run dev
```
Open http://localhost:3000.

Admin login: `admin@aurelia-hotel.com` / `admin123`.

## Architecture
```
Browser (3D client, React Three Fiber)
   │  REST/JSON
   ▼
Next.js route handlers  /api/rooms  /api/bookings  /api/admin/*
   │  Prisma (transactions)
   ▼
SQLite
```
- `src/components/experience/`: 3D scenes, camera rig, zustand state machine, in-scene UI.
- `src/app/api/`: REST API. Booking creation lives in `src/lib/availability.ts` (`createBookingAtomically`).
- `scripts/fetch-assets.mjs` + `scripts/optimize-assets.mjs`: download CC0 assets and compress them (meshopt geometry, WebP textures; 305 MB → 16 MB).

## Credits
3D models, PBR textures and HDRI sky: [Poly Haven](https://polyhaven.com) (CC0).
