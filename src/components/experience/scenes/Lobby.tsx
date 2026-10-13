"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshReflectorMaterial, Text } from "@react-three/drei";
import { easing } from "maath";
import { Group } from "three";
import { DISPLAY_FONT, Model, usePBR } from "./assets";
import { ELEVATOR, LOBBY } from "../shots";
import { useExperience } from "../store";
import Hotspot from "../ui/Hotspot";

const { zFront, zBack, halfWidth, height } = LOBBY;
const depth = zFront - zBack;
const zMid = (zFront + zBack) / 2;

const WALL = "#efe4d2";
const GOLD = { color: "#c8a96a", metalness: 1, roughness: 0.28 } as const;

function Wainscot({ length, position, rotationY = 0 }: { length: number; position: [number, number, number]; rotationY?: number }) {
  return (
    <group position={position} rotation-y={rotationY}>
      <mesh position={[0, 0.7, 0]} receiveShadow>
        <boxGeometry args={[length, 1.4, 0.06]} />
        <meshStandardMaterial color="#0e3b2e" roughness={0.45} />
      </mesh>
      <mesh position={[0, 1.42, 0.03]}>
        <boxGeometry args={[length, 0.06, 0.08]} />
        <meshStandardMaterial {...GOLD} />
      </mesh>
      <mesh position={[0, 0.06, 0.03]}>
        <boxGeometry args={[length, 0.12, 0.08]} />
        <meshStandardMaterial {...GOLD} />
      </mesh>
    </group>
  );
}

function Ceiling() {
  const beams: [number, number, number, number, number][] = [];
  for (let x = -halfWidth + 3.25; x < halfWidth; x += 3.25) beams.push([x, zMid, 0.35, depth, 0]);
  for (let z = zFront - 4; z > zBack; z -= 4) beams.push([0, z, halfWidth * 2, 0.35, 1]);
  return (
    <group>
      <mesh position={[0, height + 0.3, zMid]}>
        <boxGeometry args={[halfWidth * 2 + 1.6, 0.6, depth]} />
        <meshStandardMaterial color="#f3ebdf" roughness={0.85} />
      </mesh>
      {beams.map(([x, z, w, d], i) => (
        <mesh key={i} position={[x, height - 0.18, z]}>
          <boxGeometry args={[w, 0.36, d]} />
          <meshStandardMaterial color="#f6efe4" roughness={0.7} />
        </mesh>
      ))}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * (halfWidth - 0.1), height - 0.45, zMid]}>
          <boxGeometry args={[0.25, 0.22, depth]} />
          <meshStandardMaterial {...GOLD} />
        </mesh>
      ))}
    </group>
  );
}

function Shell() {
  const high = useExperience((s) => s.highQuality);
  const marble = usePBR("marble_tiles", 3, 3.7);
  const { normalMap } = usePBR("white_plaster_02", 4, 2);

  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.02, zMid]} receiveShadow>
        <planeGeometry args={[halfWidth * 2, depth]} />
        {high ? (
          <MeshReflectorMaterial
            {...marble}
            blur={[300, 80]}
            resolution={512}
            mixBlur={1}
            mixStrength={1.1}
            mirror={0.3}
            depthScale={0.5}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.2}
            metalness={0.05}
          />
        ) : (
          <meshStandardMaterial {...marble} roughness={0.25} />
        )}
      </mesh>
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh position={[s * (halfWidth + 0.4), height / 2, zMid]} receiveShadow castShadow>
            <boxGeometry args={[0.8, height, depth]} />
            <meshStandardMaterial color={WALL} normalMap={normalMap} normalScale={[0.25, 0.25]} roughness={0.9} />
          </mesh>
          <Wainscot length={depth} position={[s * (halfWidth - 0.03), 0, zMid]} rotationY={-s * (Math.PI / 2)} />
        </group>
      ))}
      <mesh position={[0, height / 2, zBack - 0.4]} receiveShadow>
        <boxGeometry args={[halfWidth * 2 + 1.6, height, 0.8]} />
        <meshStandardMaterial color={WALL} normalMap={normalMap} normalScale={[0.25, 0.25]} roughness={0.9} />
      </mesh>
      <Wainscot length={halfWidth * 2} position={[0, 0, zBack + 0.03]} />
      <Ceiling />
    </group>
  );
}

function Columns() {
  const zs = [-36, -44, -52];
  return (
    <group>
      {zs.map((z) =>
        [-7.5, 7.5].map((x) => (
          <group key={`${x}${z}`} position={[x, 0, z]}>
            <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.55, 0.55, height, 48]} />
              <meshStandardMaterial color="#ece3d3" roughness={0.22} />
            </mesh>
            {[0.2, height - 0.25].map((y) => (
              <mesh key={y} position={[0, y, 0]}>
                <cylinderGeometry args={[0.72, 0.72, 0.4, 32]} />
                <meshStandardMaterial color="#c8a96a" metalness={1} roughness={0.28} />
              </mesh>
            ))}
          </group>
        )),
      )}
    </group>
  );
}

function Chandeliers() {
  return (
    <group>
      {[-38, -48].map((z) => (
        <group key={z} position={[0, height - 0.1, z]}>
          <Model id="Chandelier_01" height={2.2} position={[0, -2.2, 0]} />
          <pointLight position={[0, -1.6, 0]} color="#ffcf8a" intensity={40} distance={22} castShadow={false} />
          <mesh position={[0, -1.5, 0]}>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshBasicMaterial color="#fff1d0" toneMapped={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Lounge() {
  return (
    <group position={[-8.6, 0, -43]}>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.03, 0]} receiveShadow>
        <planeGeometry args={[6, 7]} />
        <meshStandardMaterial color="#0e3b2e" roughness={1} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.032, 0]}>
        <ringGeometry args={[2.9, 3.05, 4, 1, Math.PI / 4]} />
        <meshStandardMaterial color="#c8a96a" metalness={0.8} roughness={0.4} />
      </mesh>
      <Model id="Sofa_01" width={2.6} position={[-2, 0, 0]} rotation-y={Math.PI / 2} />
      <Model id="ArmChair_01" width={1} position={[1.6, 0, 1.4]} rotation-y={-Math.PI / 1.6} />
      <Model id="ArmChair_01" width={1} position={[1.6, 0, -1.4]} rotation-y={-Math.PI / 2.6} />
      <Model id="coffee_table_round_01" width={1.3} position={[0, 0, 0]} />
      <Model id="brass_vase_01" height={0.45} position={[0, 0.48, 0]} />
      <Model id="ornate_mirror_01" height={2.2} position={[-4.2, 1.3, 0]} rotation-y={Math.PI / 2} />
      <Model id="potted_plant_02" height={1.8} position={[-3.4, 0, 3.2]} />
    </group>
  );
}

function Reception() {
  return (
    <group position={[0, 0, zBack + 4.2]}>
      <mesh position={[0, 3.2, -3.35]} receiveShadow>
        <boxGeometry args={[9, 6.4, 0.2]} />
        <meshStandardMaterial color="#0e3b2e" roughness={0.7} />
      </mesh>
      <mesh position={[0, 3.2, -3.5]}>
        <boxGeometry args={[9.3, 6.7, 0.1]} />
        <meshStandardMaterial color="#c8a96a" metalness={1} roughness={0.3} />
      </mesh>
      <Text
        font={DISPLAY_FONT}
        position={[0, 4.7, -3.22]}
        fontSize={0.95}
        letterSpacing={0.3}
        anchorX="center"
        anchorY="middle"
      >
        AURELIA
        <meshStandardMaterial color="#e2c27e" metalness={1} roughness={0.22} emissive="#6b4f1c" emissiveIntensity={0.4} />
      </Text>
      <Text
        font={DISPLAY_FONT}
        position={[0, 3.85, -3.22]}
        fontSize={0.22}
        letterSpacing={0.6}
        anchorX="center"
        color="#efe6d6"
      >
        EST. 1924
      </Text>
      <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
        <boxGeometry args={[5, 1.1, 1]} />
        <meshStandardMaterial color="#1f1c19" roughness={0.35} metalness={0.2} />
      </mesh>
      <mesh position={[0, 1.13, 0]} castShadow>
        <boxGeometry args={[5.2, 0.06, 1.15]} />
        <meshStandardMaterial color="#c8a96a" metalness={1} roughness={0.25} />
      </mesh>
      <Model id="ClassicConsole_01" width={2.4} position={[0, 0, -2.6]} />
      <Model id="brass_vase_01" height={0.5} position={[1.6, 1.16, 0]} />
      <Model id="fancy_picture_frame_01" height={1.4} position={[-3.6, 1.6, -3.15]} />
      <Model id="potted_plant_04" height={1.6} position={[3.6, 0, -2.4]} />
      <Model id="potted_plant_04" height={1.6} position={[-3.6, 0, -2.4]} />
      <pointLight position={[0, 3, 1.5]} color="#ffd9a3" intensity={18} distance={10} />
    </group>
  );
}

function ElevatorDoor() {
  return (
    <mesh position={[0, 1.5, 0]} castShadow>
      <boxGeometry args={[1.1, 3, 0.05]} />
      <meshStandardMaterial color="#b8925a" metalness={1} roughness={0.32} />
    </mesh>
  );
}

function Elevator() {
  const left = useRef<Group>(null);
  const right = useRef<Group>(null);

  useFrame((_, delta) => {
    const phase = useExperience.getState().phase;
    const open = phase === "floors" ? 1.05 : 0;
    if (left.current) easing.damp(left.current.position, "x", -0.55 - open, 0.45, delta);
    if (right.current) easing.damp(right.current.position, "x", 0.55 + open, 0.45, delta);
  });

  // Local +z faces into the lobby; local x runs along the wall.
  return (
    <group position={[ELEVATOR.x, 0, ELEVATOR.z]} rotation-y={-Math.PI / 2}>
      <mesh position={[0, 1.5, 0.01]}>
        <planeGeometry args={[2.2, 3]} />
        <meshStandardMaterial color="#d9b77a" emissive="#ffcf8a" emissiveIntensity={0.28} metalness={0.6} roughness={0.35} />
      </mesh>
      {[
        { p: [-1.25, 1.6, 0.05], s: [0.3, 3.2, 0.12] },
        { p: [1.25, 1.6, 0.05], s: [0.3, 3.2, 0.12] },
        { p: [0, 3.15, 0.05], s: [2.8, 0.3, 0.12] },
      ].map((b, i) => (
        <mesh key={i} position={b.p as [number, number, number]}>
          <boxGeometry args={b.s as [number, number, number]} />
          <meshStandardMaterial color="#c8a96a" metalness={1} roughness={0.25} />
        </mesh>
      ))}
      <group ref={left} position={[-0.55, 0, 0.04]}>
        <ElevatorDoor />
      </group>
      <group ref={right} position={[0.55, 0, 0.04]}>
        <ElevatorDoor />
      </group>
      <mesh position={[0, 3.62, 0.06]}>
        <boxGeometry args={[1.4, 0.36, 0.04]} />
        <meshStandardMaterial color="#161412" roughness={0.4} />
      </mesh>
      <Text font={DISPLAY_FONT} position={[0, 3.62, 0.09]} fontSize={0.17} letterSpacing={0.4} anchorX="center" anchorY="middle" color="#e2c27e">
        LIFTS
      </Text>
    </group>
  );
}

export default function Lobby() {
  const phase = useExperience((s) => s.phase);
  const goto = useExperience((s) => s.goto);
  const showHotspots = phase === "lobby";

  return (
    <group>
      <Shell />
      <Columns />
      <Chandeliers />
      <Lounge />
      <Reception />
      <Elevator />
      <Model id="potted_plant_02" height={2} position={[11.5, 0, -32]} />
      <Model id="potted_plant_02" height={2} position={[-11.5, 0, -32]} />
      <Model id="fancy_picture_frame_01" height={2} position={[halfWidth - 0.05, 2.4, -38]} rotation-y={-Math.PI / 2} />

      <Hotspot
        visible={showHotspots}
        position={[0, 1.7, zBack + 4.2]}
        label="Reception"
        onClick={() => goto("reception")}
      />
      <Hotspot
        visible={showHotspots}
        position={[ELEVATOR.x - 0.4, 2, ELEVATOR.z]}
        label="Elevators · Rooms"
        onClick={() => goto("floors")}
      />
      <Hotspot
        visible={showHotspots}
        position={[-8.6, 1.4, -43]}
        label="Our Story"
        onClick={() => goto("about")}
      />
    </group>
  );
}
