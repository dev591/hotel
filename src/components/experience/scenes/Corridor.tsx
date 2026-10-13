"use client";

import { Text } from "@react-three/drei";
import { DISPLAY_FONT, Model, usePBR } from "./assets";
import { CORRIDOR, CORRIDOR_ORIGIN, doorPosition } from "../shots";
import { useExperience } from "../store";
import Hotspot from "../ui/Hotspot";

const { length, halfWidth, height } = CORRIDOR;
const zMid = -length / 2 + 2;

const FLOOR_NUMBER: Record<string, number> = {
  STANDARD: 1,
  DELUXE: 2,
  SUITE: 3,
  PRESIDENTIAL: 9,
};

function Door({ index, number }: { index: number; number: string }) {
  const { side, z } = doorPosition(index);
  return (
    <group position={[side * (halfWidth - 0.02), 0, z]} rotation-y={-side * (Math.PI / 2)}>
      <mesh position={[0, 1.2, 0.02]} castShadow>
        <boxGeometry args={[1.25, 2.45, 0.06]} />
        <meshStandardMaterial color="#3b2416" roughness={0.45} />
      </mesh>
      {[-0.28, 0.28].map((x) => (
        <mesh key={x} position={[x, 1.25, 0.06]}>
          <boxGeometry args={[0.42, 1.9, 0.02]} />
          <meshStandardMaterial color="#4a2e1c" roughness={0.4} />
        </mesh>
      ))}
      <mesh position={[0.45, 1.1, 0.1]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#c8a96a" metalness={1} roughness={0.2} />
      </mesh>
      <mesh position={[0, 2.5, 0.03]}>
        <boxGeometry args={[1.45, 0.12, 0.08]} />
        <meshStandardMaterial color="#c8a96a" metalness={1} roughness={0.25} />
      </mesh>
      <mesh position={[0, 2.12, 0.07]}>
        <boxGeometry args={[0.42, 0.2, 0.02]} />
        <meshStandardMaterial color="#c8a96a" metalness={1} roughness={0.25} />
      </mesh>
      <Text font={DISPLAY_FONT} position={[0, 2.12, 0.085]} fontSize={0.13} anchorX="center" anchorY="middle" color="#161412">
        {number}
      </Text>
      <pointLight position={[0, 2.6, 0.6]} color="#ffcf8a" intensity={2.5} distance={3.5} />
    </group>
  );
}

export default function Corridor() {
  const phase = useExperience((s) => s.phase);
  const floor = useExperience((s) => s.floor);
  const rooms = useExperience((s) => s.rooms);
  const chooseRoom = useExperience((s) => s.chooseRoom);

  const parquet = usePBR("herringbone_parquet", 2, 14);
  const wall = usePBR("white_plaster_02", length / 3, 1);

  const floorRooms = rooms.filter((r) => r.type === floor);
  const floorNo = floor ? FLOOR_NUMBER[floor] : 1;

  return (
    <group position={CORRIDOR_ORIGIN}>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, zMid]} receiveShadow>
        <planeGeometry args={[halfWidth * 2, length]} />
        <meshStandardMaterial {...parquet} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.01, zMid]} receiveShadow>
        <planeGeometry args={[1.5, length - 1]} />
        <meshStandardMaterial color="#0e3b2e" roughness={1} />
      </mesh>
      {[-0.78, 0.78].map((x) => (
        <mesh key={x} rotation-x={-Math.PI / 2} position={[x, 0.012, zMid]}>
          <planeGeometry args={[0.05, length - 1]} />
          <meshStandardMaterial color="#c8a96a" metalness={0.8} roughness={0.4} />
        </mesh>
      ))}

      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh position={[s * (halfWidth + 0.1), height / 2, zMid]} receiveShadow>
            <boxGeometry args={[0.2, height, length]} />
            <meshStandardMaterial {...wall} color="#efe6d6" />
          </mesh>
          <mesh position={[s * (halfWidth - 0.01), 0.55, zMid]}>
            <boxGeometry args={[0.04, 1.1, length]} />
            <meshStandardMaterial color="#0e3b2e" roughness={0.6} />
          </mesh>
          <mesh position={[s * (halfWidth - 0.02), 1.12, zMid]}>
            <boxGeometry args={[0.06, 0.05, length]} />
            <meshStandardMaterial color="#c8a96a" metalness={1} roughness={0.3} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, height + 0.1, zMid]}>
        <boxGeometry args={[halfWidth * 2 + 0.4, 0.2, length]} />
        <meshStandardMaterial color="#f1e9dc" />
      </mesh>
      <mesh position={[0, height / 2, -length + 2 - 0.1]}>
        <boxGeometry args={[halfWidth * 2, height, 0.2]} />
        <meshStandardMaterial {...wall} color="#efe6d6" />
      </mesh>
      <mesh position={[0, 1.8, -length + 2]}>
        <planeGeometry args={[1.6, 2]} />
        <meshStandardMaterial color="#ffd9a3" emissive="#ffb066" emissiveIntensity={0.9} />
      </mesh>
      <mesh position={[0, height / 2, 2.1]}>
        <boxGeometry args={[halfWidth * 2, height, 0.2]} />
        <meshStandardMaterial color="#b8925a" metalness={1} roughness={0.35} />
      </mesh>

      {[0, -6, -12, -18].map((z) => (
        <group key={z} position={[0, height - 0.05, z]}>
          <mesh>
            <cylinderGeometry args={[0.25, 0.25, 0.04, 24]} />
            <meshBasicMaterial color="#fff1d0" toneMapped={false} />
          </mesh>
          <pointLight position={[0, -0.3, 0]} color="#ffd9a3" intensity={5} distance={7} />
        </group>
      ))}

      <Model id="potted_plant_04" height={1.3} position={[halfWidth - 0.35, 0, -length + 2.6]} />
      <Model id="potted_plant_04" height={1.3} position={[-halfWidth + 0.35, 0, -length + 2.6]} />
      <Model id="fancy_picture_frame_02" height={0.9} position={[-halfWidth + 0.05, 1.7, -1.5]} rotation-y={Math.PI / 2} />

      <Text
        font={DISPLAY_FONT}
        position={[0, 2.95, -length + 2.02]}
        fontSize={0.22}
        letterSpacing={0.4}
        anchorX="center"
        anchorY="middle"
        color="#c8a96a"
      >
        {floor === "PRESIDENTIAL" ? "THE PENTHOUSE" : `FLOOR ${floorNo}`}
      </Text>

      {floorRooms.map((room, i) => {
        const { side, z } = doorPosition(i);
        return (
          <group key={room.id}>
            <Door index={i} number={`${floorNo}0${i + 1}`} />
            <Hotspot
              visible={phase === "corridor"}
              position={[side * (halfWidth - 0.5), 1.4, z]}
              label={`${room.name} · $${room.pricePerNight}`}
              onClick={() => chooseRoom(room.id, i)}
            />
          </group>
        );
      })}
    </group>
  );
}
