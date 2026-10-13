"use client";

import { useMemo } from "react";
import { Object3D } from "three";
import { Model, usePBR } from "./assets";
import { ROOM, ROOM_ORIGIN } from "../shots";
import { useExperience } from "../store";
import type { RoomType } from "@/lib/types";

const { halfWidth, depth, height } = ROOM;
const back = -depth;
const zMid = back / 2 + 0.25;

const ACCENT: Record<RoomType, string> = {
  STANDARD: "#d9cbb3",
  DELUXE: "#0e3b2e",
  SUITE: "#123f33",
  PRESIDENTIAL: "#3a1f1a",
};

function Walls({ accent }: { accent: string }) {
  const { normalMap: wallNormal } = usePBR("white_plaster_02", 3, 1.2);
  const parquet = usePBR("herringbone_parquet", 4, 4);
  const win = { w: 2.8, h: 2.1, y: 1.65, z: -3.6 };
  const wallLen = depth + 0.5;

  const rightSegments = useMemo(() => {
    const front = 0.5;
    const winFront = win.z + win.w / 2;
    const winBack = win.z - win.w / 2;
    return [
      { z: (front + winFront) / 2, len: front - winFront, y: height / 2, h: height },
      { z: (winBack + back) / 2, len: winBack - back, y: height / 2, h: height },
      { z: win.z, len: win.w, y: (win.y - win.h / 2) / 2, h: win.y - win.h / 2 },
      {
        z: win.z,
        len: win.w,
        y: (height + win.y + win.h / 2) / 2,
        h: height - (win.y + win.h / 2),
      },
    ];
  }, [win.h, win.w, win.y, win.z]);

  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, zMid]} receiveShadow>
        <planeGeometry args={[halfWidth * 2, wallLen]} />
        <meshStandardMaterial {...parquet} />
      </mesh>
      <mesh position={[0, height + 0.1, zMid]}>
        <boxGeometry args={[halfWidth * 2 + 0.4, 0.2, wallLen]} />
        <meshStandardMaterial color="#f4ede1" />
      </mesh>
      <mesh position={[-halfWidth - 0.1, height / 2, zMid]} receiveShadow>
        <boxGeometry args={[0.2, height, wallLen]} />
        <meshStandardMaterial color="#efe4d2" normalMap={wallNormal} normalScale={[0.25, 0.25]} roughness={0.9} />
      </mesh>
      {rightSegments.map((s, i) => (
        <mesh key={i} position={[halfWidth + 0.1, s.y, s.z]} receiveShadow castShadow>
          <boxGeometry args={[0.2, s.h, s.len]} />
          <meshStandardMaterial color="#efe4d2" normalMap={wallNormal} normalScale={[0.25, 0.25]} roughness={0.9} />
        </mesh>
      ))}
      <mesh position={[halfWidth + 0.02, win.y - win.h / 2 - 0.04, win.z]}>
        <boxGeometry args={[0.35, 0.08, win.w + 0.2]} />
        <meshStandardMaterial color="#e8dcc4" />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[halfWidth - 0.15, height / 2 - 0.1, win.z + s * (win.w / 2 + 0.35)]} castShadow>
          <boxGeometry args={[0.12, height - 0.3, 0.6]} />
          <meshStandardMaterial color={accent} roughness={0.95} />
        </mesh>
      ))}

      <mesh position={[0, height / 2, back - 0.1]} receiveShadow>
        <boxGeometry args={[halfWidth * 2, height, 0.2]} />
        <meshStandardMaterial color="#efe4d2" normalMap={wallNormal} normalScale={[0.25, 0.25]} roughness={0.9} />
      </mesh>
      <mesh position={[-0.6, 1.5, back + 0.02]}>
        <boxGeometry args={[3.4, 2.4, 0.04]} />
        <meshStandardMaterial color={accent} roughness={0.8} />
      </mesh>
      <mesh position={[-0.6, 2.72, back + 0.03]}>
        <boxGeometry args={[3.5, 0.05, 0.05]} />
        <meshStandardMaterial color="#c8a96a" metalness={1} roughness={0.3} />
      </mesh>

      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * (0.65 + (halfWidth - 0.65) / 2), height / 2, 0.5]}>
          <boxGeometry args={[halfWidth - 0.65, height, 0.2]} />
          <meshStandardMaterial color="#efe4d2" normalMap={wallNormal} normalScale={[0.25, 0.25]} roughness={0.9} />
        </mesh>
      ))}
      <mesh position={[0, 2.45 + (height - 2.45) / 2, 0.5]}>
        <boxGeometry args={[1.3, height - 2.45, 0.2]} />
        <meshStandardMaterial color="#efe4d2" normalMap={wallNormal} normalScale={[0.25, 0.25]} roughness={0.9} />
      </mesh>
    </group>
  );
}

function BedsideLamp({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.05, 0.08, 0.36, 16]} />
        <meshStandardMaterial color="#c8a96a" metalness={1} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.48, 0]}>
        <cylinderGeometry args={[0.13, 0.2, 0.26, 24, 1, true]} />
        <meshStandardMaterial color="#fff3dc" emissive="#ffcf8a" emissiveIntensity={1.4} side={2} />
      </mesh>
      <pointLight position={[0, 0.5, 0]} color="#ffc777" intensity={3} distance={4} />
    </group>
  );
}

function Furniture({ type }: { type: RoomType }) {
  const lux = type !== "STANDARD";
  const grand = type === "SUITE" || type === "PRESIDENTIAL";

  const rug = grand ? "#4a1c22" : "#b9a585";

  return (
    <group>
      <group position={[-0.6, 0.012, -4.4]} rotation-x={-Math.PI / 2}>
        <mesh receiveShadow>
          <planeGeometry args={[3.4, 2.6]} />
          <meshStandardMaterial color="#c8a96a" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0, 0.002]} receiveShadow>
          <planeGeometry args={[3.2, 2.4]} />
          <meshStandardMaterial color={rug} roughness={1} />
        </mesh>
      </group>
      <Model id="GothicBed_01" width={2.3} position={[-0.6, 0, back + 1.2]} />
      {[-1, 1].map((s) => (
        <group key={s} position={[-0.6 + s * 1.65, 0, back + 0.35]}>
          <Model id="ClassicNightstand_01" height={0.6} />
          <BedsideLamp position={[0, 0.6, 0]} />
        </group>
      ))}
      <Model id="fancy_picture_frame_02" height={0.8} position={[-halfWidth + 0.02, 1.25, -3.3]} rotation-y={Math.PI / 2} />
      <Model id="potted_plant_04" height={1.2} position={[halfWidth - 0.45, 0, back + 0.5]} />

      {!grand && (
        <Model id="modern_arm_chair_01" width={0.85} position={[2.9, 0, -2.2]} rotation-y={-Math.PI / 1.4} />
      )}
      {lux && (
        <Model id="Ottoman_01" width={0.7} position={[-0.6, 0, -4.4]} />
      )}
      {type === "DELUXE" && (
        <Model id="sofa_02" width={2} position={[-halfWidth + 0.6, 0, -1.6]} rotation-y={Math.PI / 2} />
      )}
      {grand && (
        <>
          <group position={[-0.6, height, -4.2]}>
            <Model id="Chandelier_03" height={1.1} position={[0, -1.1, 0]} />
            <pointLight position={[0, -0.9, 0]} color="#ffd29a" intensity={8} distance={8} />
          </group>
          {/* lounge by the window */}
          <Model id="sofa_02" width={2} position={[-halfWidth + 0.6, 0, -1.5]} rotation-y={Math.PI / 2} />
          <Model id="coffee_table_round_01" width={0.9} position={[-2.3, 0, -1.5]} />
          <Model id="brass_vase_01" height={0.35} position={[-2.3, 0.45, -1.5]} />
          <Model id="ArmChair_01" width={0.9} position={[-1.1, 0, -0.9]} rotation-y={-Math.PI / 1.5} />
          <Model id="modern_arm_chair_01" width={0.85} position={[2.8, 0, -1.9]} rotation-y={-Math.PI / 1.4} />
        </>
      )}
      {type === "PRESIDENTIAL" && (
        <>
          <Model id="dining_table" width={1.8} position={[2.6, 0, -5.9]} rotation-y={Math.PI / 2} />
          <Model id="brass_vase_01" height={0.4} position={[2.6, 0.78, -5.9]} />
          <group position={[2.6, height, -5.9]}>
            <Model id="Chandelier_01" height={1} position={[0, -1, 0]} />
            <pointLight position={[0, -0.8, 0]} color="#ffd29a" intensity={6} distance={6} />
          </group>
          <Model id="ornate_mirror_01" height={1.5} position={[-halfWidth + 0.03, 0.85, -6.1]} rotation-y={Math.PI / 2} />
          <Model id="potted_plant_02" height={1.6} position={[-halfWidth + 0.5, 0, -0.1]} />
        </>
      )}
    </group>
  );
}

const lightTarget = new Object3D();
lightTarget.position.set(-1, 0, -4);

export default function RoomInterior() {
  const rooms = useExperience((s) => s.rooms);
  const roomId = useExperience((s) => s.roomId);
  const room = rooms.find((r) => r.id === roomId);
  const type = room?.type ?? "STANDARD";

  return (
    <group position={ROOM_ORIGIN}>
      <Walls accent={ACCENT[type]} />
      <Furniture type={type} />
      <primitive object={lightTarget} />
      <spotLight
        position={[halfWidth + 3, 3.6, -3.6]}
        target={lightTarget}
        color="#ffb877"
        intensity={120}
        angle={0.55}
        penumbra={0.8}
        distance={18}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
      />
      <pointLight position={[0, height - 0.4, -2]} color="#ffe2b8" intensity={6} distance={9} />
    </group>
  );
}
