import { CatmullRomCurve3, Vector3 } from "three";

// Separate interior "sets" live far from the exterior so they never overlap; travel between them is a fade cut.
export const CORRIDOR_ORIGIN = new Vector3(0, 200, 0);
export const ROOM_ORIGIN = new Vector3(0, 400, 0);

export const LOBBY = { zFront: -30, zBack: -62, halfWidth: 13, height: 8 };
export const ELEVATOR = { x: 12.9, z: -46 };
export const CORRIDOR = { length: 26, halfWidth: 1.7, height: 3.3 };
export const ROOM = { halfWidth: 4.2, depth: 7.5, height: 3.3 };

const v = (x: number, y: number, z: number) => new Vector3(x, y, z);

export const scrollPositions = new CatmullRomCurve3([
  v(0, 2.4, 36),
  v(0, 2.0, 26),
  v(0, 1.8, 16),
  v(-4.5, 1.8, 5),
  v(-4, 1.8, -8),
  v(0, 1.8, -21),
  v(0, 1.75, -28.5),
  v(0, 1.7, -36),
]);

export const scrollTargets = new CatmullRomCurve3([
  v(0, 3.2, 18),
  v(0, 2.6, 10),
  v(0, 2.2, 0),
  v(1, 2, -6),
  v(0, 3.2, -30),
  v(0, 2.8, -31),
  v(0, 2.4, -45),
  v(0, 2.1, -56),
]);

export type Shot = { position: Vector3; target: Vector3 };

const shot = (p: Vector3, t: Vector3): Shot => ({ position: p, target: t });
const at = (origin: Vector3, x: number, y: number, z: number) =>
  origin.clone().add(v(x, y, z));

export const SHOTS = {
  lobby: shot(v(0, 1.7, -36), v(0, 2.1, -56)),
  reception: shot(v(1.2, 1.7, -49), v(2.4, 1.6, -57)),
  floors: shot(v(5.6, 1.75, ELEVATOR.z + 1.4), v(ELEVATOR.x, 1.7, ELEVATOR.z + 1.9)),
  about: shot(v(-6, 2.2, -40), v(-11, 2.4, -50)),
  corridor: shot(at(CORRIDOR_ORIGIN, 0, 1.65, 1.2), at(CORRIDOR_ORIGIN, 0, 1.5, -12)),
  roomEntry: shot(at(ROOM_ORIGIN, 0, 1.65, 1.6), at(ROOM_ORIGIN, 0, 1.2, -5)),
  room: shot(at(ROOM_ORIGIN, 2.6, 1.6, -0.8), at(ROOM_ORIGIN, 0.9, 0.95, -6.4)),
  booking: shot(at(ROOM_ORIGIN, 3.2, 1.5, -1.4), at(ROOM_ORIGIN, 1.8, 0.95, -6.2)),
};

export function doorPosition(index: number) {
  const side = index % 2 === 0 ? -1 : 1;
  const z = -4.5 - Math.floor(index / 2) * 6 - (side > 0 ? 3 : 0);
  return { side, z };
}

export function doorShot(index: number): Shot {
  const { side, z } = doorPosition(index);
  return shot(
    at(CORRIDOR_ORIGIN, -side * 0.4, 1.65, z + 0.2),
    at(CORRIDOR_ORIGIN, side * CORRIDOR.halfWidth, 1.3, z),
  );
}
